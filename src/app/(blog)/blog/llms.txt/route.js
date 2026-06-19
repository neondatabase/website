export const revalidate = 3600;

const CDN_BASE = process.env.BLOG_CDN_URL || 'https://blog.neonapi.io/blog';
const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.com';

// Only list categories whose labels can't be derived by title-casing the slug.
// New categories from the CDN fall back to title case automatically.
const CATEGORY_LABEL_OVERRIDES = {
  ai: 'AI',
  'case-study': 'Case Studies',
};

function categoryLabel(key) {
  if (CATEGORY_LABEL_OVERRIDES[key]) return CATEGORY_LABEL_OVERRIDES[key];
  return key.replace(/-./g, (m) => ' ' + m[1].toUpperCase()).replace(/^./, (m) => m.toUpperCase());
}

export async function GET() {
  const res = await fetch(`${CDN_BASE}/titles.json`, { next: { revalidate: 3600 } });

  if (!res.ok) {
    return new Response('Failed to load blog index', { status: 502 });
  }

  const byCategory = await res.json();
  const lines = [];

  lines.push('# Neon Blog');
  lines.push('');
  lines.push('Engineering, product, and community posts from the Neon team.');
  lines.push('');

  for (const [key, posts] of Object.entries(byCategory)) {
    if (!posts.length) continue;
    lines.push(`## ${categoryLabel(key)}`);
    lines.push('');
    for (const { slug, title, date } of posts) {
      lines.push(`- [${title}](${SITE_URL}/blog/${slug}.md) — ${date}`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n').trimEnd() + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
