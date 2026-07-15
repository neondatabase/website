#!/usr/bin/env node
/**
 * Guard for CI: npm ci on the protected runners can exit 0 with
 * "Exit handler never called!" while leaving @neon/sdk uninstalled, and
 * follow-up registry fetches can hit ECONNRESET. Recover before failing the
 * docs-api-consistency check.
 */

import { execSync } from 'node:child_process';

const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 15_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function canImportSdk() {
  try {
    await import('@neon/sdk');
    await import('@neon/sdk/raw');
    return true;
  } catch {
    return false;
  }
}

function installSdk(attempt) {
  const flags = attempt > 1 ? '--no-save --fetch-retries=5 --fetch-retry-mintimeout=20000' : '--no-save';
  execSync(`npm install @neon/sdk@^1.1.0 ${flags}`, { stdio: 'inherit' });
}

if (await canImportSdk()) {
  process.exit(0);
}

console.warn('@neon/sdk is not importable after npm ci; installing explicitly...');

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
  try {
    installSdk(attempt);
    if (await canImportSdk()) {
      process.exit(0);
    }
    console.warn(`@neon/sdk install attempt ${attempt} finished but import still fails`);
  } catch (err) {
    console.warn(`@neon/sdk install attempt ${attempt} failed: ${err.message}`);
  }

  if (attempt < MAX_ATTEMPTS) {
    console.warn(`Retrying @neon/sdk install in ${RETRY_DELAY_MS / 1000}s...`);
    await sleep(RETRY_DELAY_MS);
  }
}

console.error(`@neon/sdk is still not importable after ${MAX_ATTEMPTS} install attempts`);
process.exit(2);
