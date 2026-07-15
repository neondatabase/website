#!/usr/bin/env node
/**
 * Guard for CI: npm ci on the protected runners can exit 0 with
 * "Exit handler never called!" while leaving @neon/sdk uninstalled.
 * The docs-api-consistency check imports it, so recover with an explicit
 * install before failing.
 */

import { execSync } from 'node:child_process';

async function canImportSdk() {
  try {
    await import('@neon/sdk');
    await import('@neon/sdk/raw');
    return true;
  } catch {
    return false;
  }
}

if (await canImportSdk()) {
  process.exit(0);
}

console.warn('@neon/sdk is not importable after npm ci; installing explicitly...');
execSync('npm install @neon/sdk@^1.1.0 --no-save', { stdio: 'inherit' });

if (await canImportSdk()) {
  process.exit(0);
}

console.error('@neon/sdk is still not importable after explicit install');
process.exit(2);
