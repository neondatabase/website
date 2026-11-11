// Mock download data for prototyping. The registry doesn't track downloads yet, so every
// template gets a deterministic, seeded history that stays stable across server and client renders.

const DAY_MS = 24 * 60 * 60 * 1000;

export const DOWNLOADS_AS_OF = Date.UTC(2026, 10, 11);
export const DOWNLOAD_HISTORY_DAYS = 365;

const hashString = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const sumCounts = (items) => items.reduce((total, item) => total + item.count, 0);

const generateDaily = (id) => {
  const random = createRandom(hashString(id));
  const popularity = Math.exp(1.4 + random() * 4.4);
  const ageDays = Math.round(21 + random() * (DOWNLOAD_HISTORY_DAYS - 22));
  const curve = 0.4 + random() * 2.2;
  const momentum = random() * 1.3 - 0.45;
  const spikeAt = Math.floor(random() * ageDays);
  const spikeSize = random() < 0.6 ? 2 + random() * 6 : 0;

  return Array.from({ length: DOWNLOAD_HISTORY_DAYS }, (_, index) => {
    const daysAgo = DOWNLOAD_HISTORY_DAYS - 1 - index;
    const date = DOWNLOADS_AS_OF - daysAgo * DAY_MS;
    if (daysAgo > ageDays) return { date, count: 0 };

    const sinceLaunch = ageDays - daysAgo;
    const ramp = (0.1 + 0.9 * (sinceLaunch / ageDays)) ** curve;
    const recent = daysAgo < 90 ? 1 + momentum * (1 - daysAgo / 90) : 1;
    const launchBump = sinceLaunch < 10 ? 1 + 2.5 * (1 - sinceLaunch / 10) : 1;
    const weekday = new Date(date).getUTCDay();
    const weekend = weekday === 0 || weekday === 6 ? 0.55 : 1;
    const distance = Math.abs(sinceLaunch - spikeAt);
    const spike = spikeSize && distance < 5 ? 1 + spikeSize * Math.exp(-distance) : 1;
    const noise = 0.75 + random() * 0.5;

    return {
      date,
      count: Math.round(popularity * ramp * recent * launchBump * weekend * spike * noise),
    };
  });
};

const toWeekly = (daily) => {
  const weeks = [];
  for (let end = daily.length; end - 7 >= 0; end -= 7) {
    const days = daily.slice(end - 7, end);
    weeks.unshift({ date: days[0].date, endDate: days[6].date, count: sumCounts(days) });
  }
  return weeks;
};

const cache = new Map();

export const getTemplateDownloads = (id) => {
  if (cache.has(id)) return cache.get(id);

  const daily = generateDaily(id);
  const downloads = { total: sumCounts(daily), weekly: toWeekly(daily) };
  cache.set(id, downloads);
  return downloads;
};

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const fullFormatter = new Intl.NumberFormat('en-US');

export const formatDownloadsCompact = (value) => compactFormatter.format(value);
export const formatDownloadsFull = (value) => fullFormatter.format(value);

export const formatDownloadDate = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
