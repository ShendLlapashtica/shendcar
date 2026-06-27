const ENCAR_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Referer': 'https://www.encar.com/',
  'Accept': 'application/json',
  'Accept-Language': 'ko-KR,ko;q=0.9',
};

const PAGE_SIZE = 20;
const MAX_PAGES = 10; // 200 cars per run on Hobby plan (10s limit)
const KV_TTL = 8 * 3600; // 8 hours

async function kvSet(key, value) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return;
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['SET', key, JSON.stringify(value), 'EX', String(KV_TTL)]),
    signal: AbortSignal.timeout(5000),
  });
}

async function fetchPage(pageNum) {
  const offset = pageNum * PAGE_SIZE;
  const url =
    `https://api.encar.com/search/car/list/general` +
    `?q=${encodeURIComponent('(And.Hidden.N.)')}` +
    `&sr=%7CModifiedDate%7C${offset}%7C${PAGE_SIZE}` +
    `&count=true&inav=%7CMetadata%7CSort`;
  const r = await fetch(url, {
    headers: ENCAR_HEADERS,
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`Encar HTTP ${r.status}`);
  return r.json();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).end();
  }

  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization || '';
  if (secret && authHeader !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(200).json({ ok: false, message: 'KV env vars not set — skip' });
  }

  const errors = [];
  let pagesStored = 0;
  let totalCount = 0;

  for (let p = 0; p < MAX_PAGES; p++) {
    try {
      const data = await fetchPage(p);
      const cars = data.SearchResults || [];
      if (p === 0) totalCount = data.Count || 0;
      if (cars.length === 0) break;
      await kvSet(`cars:page:${p}`, { Count: totalCount, SearchResults: cars });
      pagesStored++;
    } catch (e) {
      errors.push(`page ${p}: ${e.message}`);
    }
  }

  if (pagesStored > 0) {
    await kvSet('cars:meta', {
      cachedAt: new Date().toISOString(),
      totalCount,
      pagesStored,
    });
  }

  return res.status(200).json({ ok: true, pagesStored, totalCount, errors });
};
