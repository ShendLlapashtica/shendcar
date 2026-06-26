const path = require('path');
const fs   = require('fs');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Referer': 'https://www.encar.com/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Origin': 'https://www.encar.com',
};

// Build Encar DSL query
function orClause(field, values) {
  if (!values || values.length === 0) return '';
  if (values.length === 1) return `_.${field}.${values[0]}.`;
  return `(Or.${values.map(v => `_.${field}.${v}.`).join('')})`;
}

function buildQuery(p) {
  let q = 'And.Hidden.N.';
  const mfrs  = p.manufacturers ? p.manufacturers.split(',').filter(Boolean) : [];
  const fuels  = p.fuels         ? p.fuels.split(',').filter(Boolean)         : [];
  const trans  = p.transmissions ? p.transmissions.split(',').filter(Boolean)  : [];

  if (mfrs.length)  q += orClause('Manufacturer', mfrs);
  if (fuels.length) q += orClause('FuelType', fuels);
  if (trans.length) q += orClause('Transmission', trans);
  if (p.yearFrom)   q += `_.FormYear.${p.yearFrom}..`;
  if (p.yearTo)     q += `_..FormYear.${p.yearTo}.`;
  if (p.mileageMax) q += `_..Mileage.${p.mileageMax}.`;
  return `(${q})`;
}

function isUnfiltered(p) {
  return !p.manufacturers && !p.fuels && !p.transmissions
      && !p.yearFrom && !p.yearTo && !p.mileageMax;
}

async function tryFetch(url, timeoutMs) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs || 10000);
  try {
    const r = await fetch(url, { headers: HEADERS, signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) throw new Error(`HTTP ${r.status} from ${url}`);
    return await r.json();
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
}

async function tryProxy(targetUrl) {
  const enc = encodeURIComponent(targetUrl);
  const attempts = [
    { name: 'direct',     fn: () => tryFetch(targetUrl, 8000) },
    { name: 'allorigins', fn: () => tryFetch(`https://api.allorigins.win/get?url=${enc}`, 12000).then(j => JSON.parse(j.contents)) },
    { name: 'corsproxy',  fn: () => tryFetch(`https://corsproxy.io/?${enc}`, 12000) },
    { name: 'codetabs',   fn: () => tryFetch(`https://api.codetabs.com/v1/proxy?quest=${enc}`, 12000) },
    { name: 'thingproxy', fn: () => tryFetch(`https://thingproxy.freeboard.io/fetch/${targetUrl}`, 12000) },
  ];

  let lastErr = null;
  for (const { name, fn } of attempts) {
    try {
      const result = await fn();
      console.log(`[cars] success via ${name}`);
      return result;
    } catch (e) {
      console.warn(`[cars] ${name} failed:`, e.message);
      lastErr = e;
    }
  }
  throw lastErr || new Error('All sources failed');
}

// KV helpers — optional, fail gracefully if not configured
let _kv = null;
async function getKv() {
  if (_kv !== undefined) return _kv;
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      _kv = null;
      return null;
    }
    const mod = await import('@vercel/kv');
    _kv = mod.kv;
    return _kv;
  } catch {
    _kv = null;
    return null;
  }
}

async function kvGet(key) {
  try {
    const kv = await getKv();
    if (!kv) return null;
    const val = await kv.get(key);
    if (!val) return null;
    return typeof val === 'string' ? JSON.parse(val) : val;
  } catch (e) {
    console.warn('[cars] KV get failed:', e.message);
    return null;
  }
}

async function kvSet(key, data, ttl) {
  try {
    const kv = await getKv();
    if (!kv) return;
    await kv.set(key, JSON.stringify(data), { ex: ttl });
  } catch (e) {
    console.warn('[cars] KV set failed:', e.message);
  }
}

// Static JSON fallback — 2 000 cars committed in api/fallback-cars.json
let _staticCache = null;
function loadStatic() {
  if (_staticCache !== null) return _staticCache;
  try {
    // Try require() first (bundled by ncc at deploy time)
    _staticCache = require('./fallback-cars.json');
    return _staticCache;
  } catch {
    // Fallback: read from filesystem (local dev)
    try {
      const file = path.join(__dirname, 'fallback-cars.json');
      _staticCache = JSON.parse(fs.readFileSync(file, 'utf8'));
      return _staticCache;
    } catch {
      _staticCache = { Count: 0, SearchResults: [] };
      return _staticCache;
    }
  }
}

function getStaticFallback(pageNum, pageSize) {
  const data = loadStatic();
  const all = data.SearchResults || [];
  const start = pageNum * pageSize;
  const slice = all.slice(start, start + pageSize);
  if (slice.length === 0) return null;
  return {
    Count: data.Count || all.length,
    SearchResults: slice,
    _source: 'static-fallback',
  };
}

function normaliseEncarResponse(data) {
  if (Array.isArray(data?.SearchResults)) return data;
  if (Array.isArray(data?.Result)) return { Count: data.TotalCount ?? data.Result.length, SearchResults: data.Result };
  return null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const {
    manufacturers = '', fuels = '', transmissions = '',
    yearFrom = '', yearTo = '', mileageMax = '',
    page = '0', count = '20',
  } = req.query;

  const pageNum  = parseInt(page, 10)  || 0;
  const pageSize = parseInt(count, 10) || 20;
  const params   = { manufacturers, fuels, transmissions, yearFrom, yearTo, mileageMax };
  const unfiltered = isUnfiltered(params);
  const kvKey = `cars:page:${pageNum}`;

  // ── 1. KV cache (unfiltered only) ─────────────────────────────────────────
  if (unfiltered) {
    const cached = await kvGet(kvKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }
  }

  // ── 2. Live Encar ──────────────────────────────────────────────────────────
  const query    = buildQuery(params);
  const offset   = pageNum * pageSize;
  const encarUrl =
    `https://api.encar.com/search/car/list/general` +
    `?q=${encodeURIComponent(query)}` +
    `&sr=%7CModifiedDate%7C${offset}%7C${pageSize}` +
    `&count=true&inav=%7CMetadata%7CSort`;

  console.log('[/api/cars] url:', encarUrl);

  try {
    const raw  = await tryProxy(encarUrl);
    const data = normaliseEncarResponse(raw);
    if (data) {
      if (unfiltered && data.SearchResults.length > 0) {
        kvSet(kvKey, data, 7 * 3600);
      }
      res.setHeader('X-Cache', 'MISS');
      return res.status(200).json(data);
    }
  } catch (liveErr) {
    console.warn('[/api/cars] live fetch failed:', liveErr.message);
  }

  // ── 3. Degraded KV fallback for filtered queries ───────────────────────────
  if (!unfiltered) {
    const cached = await kvGet(kvKey);
    if (cached) {
      res.setHeader('X-Cache', 'DEGRADED');
      return res.status(200).json({ ...cached, _filtered_fallback: true });
    }
  }

  // ── 4. Static JSON fallback (always available) ─────────────────────────────
  const staticData = getStaticFallback(pageNum, pageSize);
  if (staticData) {
    res.setHeader('X-Cache', 'STATIC');
    return res.status(200).json(staticData);
  }

  // ── 5. All sources exhausted ───────────────────────────────────────────────
  return res.status(502).json({ error: 'Could not reach Encar', detail: 'All sources exhausted' });
};
