#!/usr/bin/env node

require('dotenv').config({ path: '.env' });

const fs = require('fs/promises');
const path = require('path');

const API_URL = 'https://api.github.com/repos/neondatabase/neon';
const SNAPSHOT_PATH = path.join(process.cwd(), 'src/utils/data/github-stars.generated.json');
const SNAPSHOT_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const FAILED_FETCH_RETRY_DELAY_MS = 60 * 60 * 1000;
const DEFAULT_STARS_COUNT = 21500;
const FETCH_TIMEOUT_MS = 10000;

function getHeaders() {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'neon-next-github-stars-updater',
  };

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return headers;
}

async function readSnapshot() {
  try {
    const rawSnapshot = await fs.readFile(SNAPSHOT_PATH, 'utf8');
    const snapshot = JSON.parse(rawSnapshot);

    if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
      throw new Error('Generated snapshot did not contain a snapshot object');
    }

    return snapshot;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    console.warn(`GitHub stars: failed to read snapshot ${SNAPSHOT_PATH}: ${error.message}`);
    return null;
  }
}

function normalizeSnapshot(snapshot) {
  return {
    checked_at: snapshot?.checked_at ?? null,
    stargazers_count: Number.isFinite(snapshot?.stargazers_count)
      ? snapshot.stargazers_count
      : DEFAULT_STARS_COUNT,
  };
}

function isFresh(snapshot) {
  if (!snapshot?.checked_at) {
    return false;
  }

  const checkedAt = Date.parse(snapshot.checked_at);

  if (Number.isNaN(checkedAt)) {
    return false;
  }

  return Date.now() - checkedAt < SNAPSHOT_MAX_AGE_MS;
}

async function writeSnapshot(snapshot) {
  await fs.mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
  await fs.writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
}

async function fetchStarsCount() {
  let response;

  try {
    response = await fetch(API_URL, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      throw new Error(`GitHub API request timed out after ${FETCH_TIMEOUT_MS}ms`);
    }

    throw error;
  }

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${text.slice(0, 200)}`);
  }

  const payload = JSON.parse(text);
  const starsCount = payload?.stargazers_count;

  if (!Number.isFinite(starsCount)) {
    throw new Error('GitHub API response did not include a numeric stargazers_count');
  }

  return starsCount;
}

async function main() {
  const snapshot = normalizeSnapshot(await readSnapshot());

  if (isFresh(snapshot)) {
    console.log(`GitHub stars: using cached snapshot from ${snapshot.checked_at}`);
    return;
  }

  const now = new Date().toISOString();
  const currentStarsCount = snapshot.stargazers_count;

  try {
    const starsCount = await fetchStarsCount();
    const nextSnapshot = {
      stargazers_count: starsCount,
      checked_at: now,
    };

    await writeSnapshot(nextSnapshot);

    if (starsCount !== currentStarsCount) {
      console.log(
        `GitHub stars: updated tracked fallback from ${currentStarsCount} to ${starsCount}`
      );
    } else {
      console.log(`GitHub stars: count unchanged at ${starsCount}`);
    }
  } catch (error) {
    await writeSnapshot({
      checked_at: new Date(
        Date.now() - (SNAPSHOT_MAX_AGE_MS - FAILED_FETCH_RETRY_DELAY_MS)
      ).toISOString(),
      stargazers_count: currentStarsCount,
    });
    console.warn(`GitHub stars: ${error.message}`);
    console.warn(`GitHub stars: keeping tracked fallback at ${currentStarsCount} stars`);
  }
}

main().catch((error) => {
  console.error(`GitHub stars: unexpected failure: ${error.message}`);
  process.exit(1);
});
