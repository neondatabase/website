#!/usr/bin/env node

// Load env vars from .env then .env.local (later file wins), so this works
// in local dev as well as CI/Vercel where the var is set in the environment.
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const { execSync } = require('child_process');
const fs = require('fs');

const BRANCH = process.env.BLOG_CONTENT_BRANCH || 'main';
const BLOG_DIR = 'content/blog';
const TOKEN = process.env.BLOG_GITHUB_TOKEN;

if (fs.existsSync(BLOG_DIR)) {
  console.log(`Blog content already present at ${BLOG_DIR}, skipping clone`);
  process.exit(0);
}

if (!TOKEN) {
  console.log('BLOG_GITHUB_TOKEN not set — skipping blog content fetch');
  process.exit(0);
}

console.log(`Fetching blog content (branch: ${BRANCH})...`);
execSync(
  `git clone --depth 1 --branch ${BRANCH} https://x-token:${TOKEN}@github.com/neondatabase/blog.git ${BLOG_DIR}`,
  { stdio: 'inherit' }
);

const postCount = fs.readdirSync(`${BLOG_DIR}/posts`).length;
console.log(`Blog content fetched: ${postCount} posts`);
