const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Referer': 'https://www.encar.com/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Origin': 'https://www.encar.com',
};

async function tryFetch(url, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { headers: HEADERS, signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

async function tryProxy(url) {
  const enc = encodeURIComponent(url);
  const proxies = [
    () => tryFetch(url),
    () => tryFetch(`https://api.allorigins.win/get?url=${enc}`, 12000)
          .then(j => JSON.parse(j.contents)),
    () => tryFetch(`https://corsproxy.io/?${enc}`, 12000),
    () => tryFetch(`https://api.codetabs.com/v1/proxy?quest=${enc}`, 12000),
    () => tryFetch(`https://thingproxy.freeboard.io/fetch/${url}`, 12000),
  ];

  const errors = [];
  for (const fn of proxies) {
    try {
      return await fn();
    } catch (e) {
      errors.push(String(e));
    }
  }
  throw new Error('All sources failed: ' + errors.join(' | '));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  let detail, inspection = null;

  try {
    detail = await tryProxy(`https://api.encar.com/cars/${id}`);
  } catch (err) {
    console.error('[/api/car-detail] detail failed:', err.message);
    return res.status(502).json({ error: 'Car detail fetch failed', detail: err.message });
  }

  try {
    inspection = await tryProxy(`https://api.encar.com/inspection/car/${id}/inspect`);
  } catch (err) {
    console.warn('[/api/car-detail] inspection unavailable:', err.message);
  }

  return res.status(200).json({ detail, inspection });
};
