// Vercel cron job: fetches fresh car pages from Encar and stores them in KV.
// Schedule: every 6 hours (configured in vercel.json).
// Trigger manually: curl -H "Authorization: Bearer $CRON_SECRET" https://your-app.vercel.app/api/cron/refresh-cars

const { kv } = require('@vercel/kv');

const PAGES_TO_CACHE   = 50;   // 50 pages × 20 cars = 1 000 cars
const PAGE_SIZE        = 20;
const KV_TTL_SECONDS   = 7 * 3600;  // 7 h — cron runs every 6 h so there's always a buffer
const INTER_PAGE_DELAY = 600;        // ms between requests to avoid Encar rate-limit

const ENCAR_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Referer': 'https://www.encar.com/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Origin': 'https://www.encar.com',
};

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchPage(pageNum) {
  const offset = pageNum * PAGE_SIZE;
  const url =
    `https://api.encar.com/search/car/list/general` +
    `?q=${encodeURIComponent('(And.Hidden.N.)')}` +
    `&sr=%7CModifiedDate%7C${offset}%7C${PAGE_SIZE}` +
    `&count=true&inav=%7CMetadata%7CSort`;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url, { headers: ENCAR_HEADERS, signal: ctrl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

module.exports = async function handler(req, res) {
  // Verify the request is from Vercel's cron runner or an authorised manual trigger
  const auth = req.headers['authorization'];
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const errors = [];
  let pagesStored = 0;
  let totalCount  = 0;
  const startedAt = Date.now();

  for (let page = 0; page < PAGES_TO_CACHE; page++) {
    // Vercel Hobby functions time out at 10 s — bail out early if close
    if (Date.now() - startedAt > 250_000) {
      console.warn(`[cron] approaching timeout, stopping at page ${page}`);
      break;
    }

    try {
      const data = await fetchPage(page);
      const results = data?.SearchResults ?? data?.Result ?? [];

      if (results.length === 0) {
        console.log(`[cron] page ${page} returned 0 results — stopping`);
        break;
      }

      const normalised = {
        Count: data.Count ?? data.TotalCount ?? 0,
        SearchResults: results,
      };

      await kv.set(`cars:page:${page}`, JSON.stringify(normalised), { ex: KV_TTL_SECONDS });
      pagesStored++;

      if (page === 0) totalCount = normalised.Count;
    } catch (err) {
      console.error(`[cron] page ${page} failed:`, err.message);
      errors.push(`page ${page}: ${err.message}`);
      // Continue — partial cache is better than nothing
    }

    if (page < PAGES_TO_CACHE - 1) await delay(INTER_PAGE_DELAY);
  }

  const meta = {
    cachedAt: new Date().toISOString(),
    totalCount,
    pagesStored,
    durationMs: Date.now() - startedAt,
  };

  // Store metadata so the UI can show "last updated at …"
  await kv.set('cars:meta', JSON.stringify(meta), { ex: KV_TTL_SECONDS }).catch(() => {});

  console.log(`[cron] done: ${pagesStored}/${PAGES_TO_CACHE} pages, ${errors.length} errors`);

  return res.status(200).json({ ...meta, errors });
};
