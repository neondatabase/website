#!/usr/bin/env node
/**
 * Guard for CI: npm ci on the protected runners can exit 0 with
 * "Exit handler never called!" while leaving @neon/sdk uninstalled, and
 * follow-up registry fetches can hit ECONNRESET. Recover before failing the
 * docs-api-consistency check.
 */

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOCK_PATH = path.join(ROOT, 'package-lock.json');
const SDK_DEST = path.join(ROOT, 'node_modules', '@neon', 'sdk');

const MAX_NPM_ATTEMPTS = 2;
const RETRY_DELAY_MS = 10_000;

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

function readLockedSdk() {
  const lock = JSON.parse(fs.readFileSync(LOCK_PATH, 'utf8'));
  const entry = lock.packages?.['node_modules/@neon/sdk'];
  if (!entry?.resolved || !entry?.integrity) {
    throw new Error('package-lock.json is missing node_modules/@neon/sdk metadata');
  }
  return { resolved: entry.resolved, integrity: entry.integrity, version: entry.version };
}

function verifySha512(filePath, integrity) {
  const [, digest] = integrity.split('-');
  const hash = createHash('sha512').update(fs.readFileSync(filePath)).digest('base64');
  if (hash !== digest) {
    throw new Error(`@neon/sdk tarball integrity check failed (expected ${digest}, got ${hash})`);
  }
}

function installSdkFromLockfileTarball() {
  const { resolved, integrity } = readLockedSdk();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'neon-sdk-'));
  const archivePath = path.join(tmpDir, 'sdk.tgz');
  const extractDir = path.join(tmpDir, 'extract');

  try {
    fs.mkdirSync(extractDir, { recursive: true });
    execSync(`timeout 120 curl -fsSL "${resolved}" -o "${archivePath}"`, { stdio: 'inherit' });
    verifySha512(archivePath, integrity);
    execSync(`tar -xzf "${archivePath}" -C "${extractDir}"`, { stdio: 'inherit' });

    fs.rmSync(SDK_DEST, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(SDK_DEST), { recursive: true });
    fs.renameSync(path.join(extractDir, 'package'), SDK_DEST);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function installSdkWithNpm(attempt) {
  const offlineFirst = attempt === 1 ? '--prefer-offline ' : '';
  const retryFlags =
    attempt > 1 ? '--fetch-retries=5 --fetch-retry-mintimeout=20000 ' : '';
  execSync(`timeout 120 npm install @neon/sdk@^1.1.0 --no-save ${offlineFirst}${retryFlags}`.trim(), {
    stdio: 'inherit',
    cwd: ROOT,
  });
}

if (await canImportSdk()) {
  process.exit(0);
}

console.warn('@neon/sdk is not importable after npm ci; recovering...');

for (let attempt = 1; attempt <= MAX_NPM_ATTEMPTS; attempt += 1) {
  try {
    installSdkWithNpm(attempt);
    if (await canImportSdk()) {
      process.exit(0);
    }
    console.warn(`@neon/sdk npm install attempt ${attempt} finished but import still fails`);
  } catch (err) {
    console.warn(`@neon/sdk npm install attempt ${attempt} failed: ${err.message}`);
  }

  if (attempt < MAX_NPM_ATTEMPTS) {
    console.warn(`Retrying npm install in ${RETRY_DELAY_MS / 1000}s...`);
    await sleep(RETRY_DELAY_MS);
  }
}

try {
  console.warn('Falling back to lockfile tarball install for @neon/sdk...');
  installSdkFromLockfileTarball();
  if (await canImportSdk()) {
    process.exit(0);
  }
} catch (err) {
  console.warn(`Lockfile tarball install failed: ${err.message}`);
}

console.error('@neon/sdk is still not importable after npm retries and tarball fallback');
process.exit(2);
