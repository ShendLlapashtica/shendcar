const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://www.encar.com/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
};

async function fetchWithTimeout(url, options, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function fetchEncar(targetUrl) {
  const encoded = encodeURIComponent(targetUrl);
  const opts = { headers: BROWSER_HEADERS };

  const attempts = [
    fetchWithTimeout(targetUrl, opts).then(async r => {
      if (!r.ok) throw new Error(`direct ${r.status}`);
      return r.json();
    }),
    fetchWithTimeout(`https://api.allorigins.win/get?url=${encoded}`, {}).then(async r => {
      const j = await r.json();
      return JSON.parse(j.contents);
    }),
    fetchWithTimeout(`https://corsproxy.io/?${encoded}`, opts).then(async r => {
      if (!r.ok) throw new Error(`corsproxy ${r.status}`);
      return r.json();
    }),
    fetchWithTimeout(`https://api.codetabs.com/v1/proxy?quest=${encoded}`, {}).then(async r => {
      if (!r.ok) throw new Error(`codetabs ${r.status}`);
      return r.json();
    }),
  ];

  return Promise.any(attempts);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id parameter' });

  const detailUrl = `https://api.encar.com/cars/${id}`;
  const inspectUrl = `https://api.encar.com/inspection/car/${id}/inspect`;

  let detail, inspection = null;

  try {
    detail = await fetchEncar(detailUrl);
  } catch (err) {
    console.error('Encar detail error:', err);
    return res.status(502).json({ error: 'Failed to fetch car detail', detail: String(err) });
  }

  try {
    inspection = await fetchEncar(inspectUrl);
  } catch (err) {
    console.warn('Encar inspection not available:', err);
    // Non-fatal — return null
  }

  return res.status(200).json({ detail, inspection });
}
