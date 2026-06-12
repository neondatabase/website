#!/usr/bin/env node

// Sync the Neon project bootstrap manifest served at
// https://neon.com/bootstrap/templates.yaml from its source of truth in
// neondatabase/examples (bootstrap.yaml). neonctl and neon-init fetch this
// CDN-backed URL first so `neon bootstrap` / `neon init` template discovery
// never depends on GitHub's rate-limited hosts.
//
// The source of truth lives in the examples repo; this script keeps the
// committed public copy fresh on each build. It is intentionally resilient:
// a fetch failure keeps the committed copy and never fails the build (mirrors
// update-github-stars.js).

require('dotenv').config({ path: '.env' });

const fs = require('fs/promises');
const path = require('path');

const SOURCE_URL = 'https://raw.githubusercontent.com/neondatabase/examples/main/bootstrap.yaml';
const OUTPUT_PATH = path.join(process.cwd(), 'public/bootstrap/templates.yaml');
const FETCH_TIMEOUT_MS = 10000;

function getHeaders() {
  const token = process.env.GITHUB_TOKEN;
  const headers = { 'User-Agent': 'neon-next-bootstrap-templates-sync' };
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  return headers;
}

// Cheap structural guard so we never overwrite the committed copy with an error
// page or truncated body that happens to return HTTP 200.
function looksLikeManifest(text) {
  return typeof text === 'string' && /(^|\n)templates\s*:/.test(text);
}

async function fetchManifest() {
  let response;
  try {
    response = await fetch(SOURCE_URL, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      throw new Error(`request timed out after ${FETCH_TIMEOUT_MS}ms`);
    }
    throw error;
  }

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
  }
  if (!looksLikeManifest(text)) {
    throw new Error('response did not look like a bootstrap manifest');
  }

  return text;
}

async function main() {
  try {
    const manifest = await fetchManifest();
    await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });

    let current = null;
    try {
      current = await fs.readFile(OUTPUT_PATH, 'utf8');
    } catch {
      current = null;
    }

    if (current === manifest) {
      console.log('Bootstrap templates: manifest unchanged');
      return;
    }

    await fs.writeFile(OUTPUT_PATH, manifest, 'utf8');
    console.log('Bootstrap templates: updated public/bootstrap/templates.yaml');
  } catch (error) {
    console.warn(`Bootstrap templates: ${error.message}`);
    console.warn('Bootstrap templates: keeping the committed manifest copy');
  }
}

main().catch((error) => {
  // Never fail the build over the manifest sync — the committed copy stands in.
  console.warn(`Bootstrap templates: unexpected failure: ${error.message}`);
});
