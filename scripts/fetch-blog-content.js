#!/usr/bin/env node

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');

const BLOG_DIR = 'content/blog';
const CDN_BASE = process.env.BLOG_CDN_URL || 'https://blog.neonapi.io/blog';
const BATCH_SIZE = 50;

async function main() {
  if (fs.existsSync(BLOG_DIR)) {
    console.log(`Blog content already present at ${BLOG_DIR}, skipping`);
    return;
  }

  console.log(`Fetching blog content from ${CDN_BASE}...`);

  const manifestRes = await fetch(`${CDN_BASE}/manifest.json`);
  if (!manifestRes.ok) throw new Error(`Failed to fetch manifest: ${manifestRes.status}`);
  const { posts: slugs } = await manifestRes.json();

  fs.mkdirSync(path.join(BLOG_DIR, 'posts'), { recursive: true });
  fs.mkdirSync(path.join(BLOG_DIR, 'authors'), { recursive: true });
  fs.mkdirSync(path.join(BLOG_DIR, 'categories'), { recursive: true });

  // Download posts in batches to avoid connection limits
  let downloaded = 0;
  for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
    const batch = slugs.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (slug) => {
        const res = await fetch(`${CDN_BASE}/posts/${slug}.md`);
        if (!res.ok) throw new Error(`Failed to fetch post "${slug}": ${res.status}`);
        fs.writeFileSync(path.join(BLOG_DIR, 'posts', `${slug}.md`), await res.text());
      })
    );
    downloaded += batch.length;
    process.stdout.write(`\r  ${downloaded}/${slugs.length} posts`);
  }
  console.log();

  const [authorsRes, categoriesRes] = await Promise.all([
    fetch(`${CDN_BASE}/authors/data.json`),
    fetch(`${CDN_BASE}/categories/data.json`),
  ]);
  if (!authorsRes.ok) throw new Error(`Failed to fetch authors: ${authorsRes.status}`);
  if (!categoriesRes.ok) throw new Error(`Failed to fetch categories: ${categoriesRes.status}`);

  fs.writeFileSync(path.join(BLOG_DIR, 'authors', 'data.json'), await authorsRes.text());
  fs.writeFileSync(path.join(BLOG_DIR, 'categories', 'data.json'), await categoriesRes.text());

  console.log(`Done: ${slugs.length} posts fetched`);
}

main().catch((err) => {
  console.error('Error fetching blog content:', err.message);
  process.exit(1);
});
