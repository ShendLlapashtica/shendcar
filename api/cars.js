const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://www.encar.com/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
};

function buildQuery(params) {
  const parts = ['And.Hidden.N.'];
  if (params.manufacturer) parts.push(`_.Manufacturer.${params.manufacturer}.`);
  if (params.fuel) parts.push(`_.FuelType.${params.fuel}.`);
  if (params.transmission) parts.push(`_.Transmission.${params.transmission}.`);
  if (params.yearFrom) parts.push(`_.Year.${params.yearFrom}..`);
  if (params.yearTo) parts.push(`_..Year.${params.yearTo}.`);
  if (params.mileageMax) parts.push(`_..Mileage.${params.mileageMax}.`);
  if (params.priceMin) parts.push(`_.Price.${params.priceMin}..`);
  if (params.priceMax) parts.push(`_..Price.${params.priceMax}.`);
  return `(${parts.join('')})`;
}

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

  const {
    manufacturer = '',
    fuel = '',
    transmission = '',
    yearFrom = '',
    yearTo = '',
    mileageMax = '',
    priceMin = '',
    priceMax = '',
    page = '0',
    count = '20',
  } = req.query;

  const pageNum = parseInt(page, 10) || 0;
  const countNum = parseInt(count, 10) || 20;
  const offset = pageNum * countNum;

  const query = buildQuery({ manufacturer, fuel, transmission, yearFrom, yearTo, mileageMax, priceMin, priceMax });
  const targetUrl = `https://api.encar.com/search/car/list/general?q=${encodeURIComponent(query)}&sr=|ModifiedDate|${offset}|${countNum}&count=true&inav=|Metadata|Sort`;

  try {
    const data = await fetchEncar(targetUrl);
    return res.status(200).json(data);
  } catch (err) {
    console.error('Encar search error:', err);
    return res.status(502).json({ error: 'Failed to fetch from Encar', detail: String(err) });
  }
}
