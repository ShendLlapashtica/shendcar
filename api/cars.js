const ENCAR_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Referer': 'https://www.encar.com/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Origin': 'https://www.encar.com',
};

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
  if (p.yearFrom)   q += `_.Year.${p.yearFrom}..`;
  if (p.yearTo)     q += `_..Year.${p.yearTo}.`;
  if (p.mileageMax) q += `_..Mileage.${p.mileageMax}.`;
  return `(${q})`;
}

function isUnfiltered(p) {
  return !p.manufacturers && !p.fuels && !p.transmissions &&
         !p.yearFrom && !p.yearTo && !p.mileageMax;
}

async function kvGet(key) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const r = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) return null;
    const { result } = await r.json();
    return result ? JSON.parse(result) : null;
  } catch {
    return null;
  }
}

async function tryFetch(url, timeoutMs) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs || 10000);
  try {
    const r = await fetch(url, { headers: ENCAR_HEADERS, signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
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
      console.log(`[cars] live success via ${name}`);
      return result;
    } catch (e) {
      console.warn(`[cars] ${name} failed:`, e.message);
      lastErr = e;
    }
  }
  throw lastErr || new Error('All sources failed');
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

  const params = { manufacturers, fuels, transmissions, yearFrom, yearTo, mileageMax };
  const pageNum  = parseInt(page, 10)  || 0;
  const countNum = parseInt(count, 10) || 20;
  const offset   = pageNum * countNum;

  // 1. KV cache hit (only for unfiltered, page-aligned requests)
  if (isUnfiltered(params)) {
    const kvPage = Math.floor(offset / 20); // cache is stored in 20-item pages
    const cached = await kvGet(`cars:page:${kvPage}`);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json({ ...cached, _source: 'cache' });
    }
  }

  // 2. Live Encar (via proxy chain)
  const query = buildQuery(params);
  const encarUrl =
    `https://api.encar.com/search/car/list/general` +
    `?q=${encodeURIComponent(query)}` +
    `&sr=%7CModifiedDate%7C${offset}%7C${countNum}` +
    `&count=true&inav=%7CMetadata%7CSort`;

  try {
    const data = await tryProxy(encarUrl);
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(data);
  } catch (liveErr) {
    console.warn('[cars] live failed:', liveErr.message);
  }

  // 3. Degraded fallback: return cached unfiltered page 0 as a placeholder
  if (!isUnfiltered(params)) {
    const fallback = await kvGet('cars:page:0');
    if (fallback) {
      res.setHeader('X-Cache', 'DEGRADED');
      return res.status(200).json({ ...fallback, _filtered_fallback: true, _source: 'cache-degraded' });
    }
  }

  return res.status(502).json({ error: 'Could not reach Encar', _source: 'error' });
};
