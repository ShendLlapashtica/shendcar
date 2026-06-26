const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Referer': 'https://www.encar.com/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Origin': 'https://www.encar.com',
};

// Build Encar DSL query
// Single value: _.Manufacturer.BMW.
// Multiple values: (Or._.Manufacturer.BMW._.Manufacturer.벤츠.)
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
  // Try direct first (server-side has no CORS restriction), then fall back to proxies
  const attempts = [
    { name: 'direct',       fn: () => tryFetch(targetUrl, 8000) },
    { name: 'allorigins',   fn: () => tryFetch(`https://api.allorigins.win/get?url=${enc}`, 12000).then(j => JSON.parse(j.contents)) },
    { name: 'corsproxy',    fn: () => tryFetch(`https://corsproxy.io/?${enc}`, 12000) },
    { name: 'codetabs',     fn: () => tryFetch(`https://api.codetabs.com/v1/proxy?quest=${enc}`, 12000) },
    { name: 'thingproxy',   fn: () => tryFetch(`https://thingproxy.freeboard.io/fetch/${targetUrl}`, 12000) },
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
  const countNum = parseInt(count, 10) || 20;
  const offset   = pageNum * countNum;
  const query    = buildQuery({ manufacturers, fuels, transmissions, yearFrom, yearTo, mileageMax });

  // %7C = | (pipe) — must be encoded in the sr param
  const encarUrl =
    `https://api.encar.com/search/car/list/general` +
    `?q=${encodeURIComponent(query)}` +
    `&sr=%7CModifiedDate%7C${offset}%7C${countNum}` +
    `&count=true&inav=%7CMetadata%7CSort`;

  console.log('[/api/cars] query:', query);
  console.log('[/api/cars] url:', encarUrl);

  try {
    const data = await tryProxy(encarUrl);
    return res.status(200).json(data);
  } catch (err) {
    console.error('[/api/cars] all failed:', err.message);
    return res.status(502).json({ error: 'Could not reach Encar', detail: err.message });
  }
};
