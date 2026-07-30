import { getAllBlogPosts, getAllBlogCategories } from 'utils/api-blog';

export const dynamic = 'force-static';
export const revalidate = false;

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.com';

// Prefer the display name from the categories data. Unknown slugs fall back to
// title-casing (e.g. "case-study" -> "Case Study").
function categoryLabel(key, name) {
  if (name) return name;
  return key.replace(/-./g, (m) => ' ' + m[1].toUpperCase()).replace(/^./, (m) => m.toUpperCase());
}

// Normalize a frontmatter date to YYYY-MM-DD without timezone conversion.
// Dates are usually ISO strings ('2026-01-07T17:01:55'); a plain slice keeps
// the calendar date as authored. For Date objects (unquoted YAML timestamps),
// fall back to the UTC date, which matches how the value was serialized.
function formatDate(date) {
  if (typeof date === 'string') return date.slice(0, 10);
  if (date instanceof Date && !Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  return String(date).slice(0, 10);
}

export async function GET() {
  const [posts, categories] = await Promise.all([
    getAllBlogPosts({ fullList: true }),
    getAllBlogCategories(),
  ]);

  // Group posts by category. `posts` is already sorted newest-first, so each
  // category's posts stay date-descending.
  const categoryNames = new Map(categories.map((category) => [category.slug, category.name]));
  const byCategory = new Map();

  for (const post of posts) {
    for (const { slug: categorySlug } of post.categories.nodes) {
      if (!byCategory.has(categorySlug)) byCategory.set(categorySlug, []);
      byCategory.get(categorySlug).push(post);
    }
  }

  // Emit categories alphabetically by display label.
  const sortedCategories = [...byCategory.entries()]
    .map(([key, categoryPosts]) => ({
      label: categoryLabel(key, categoryNames.get(key)),
      posts: categoryPosts,
    }))
    .filter(({ posts: categoryPosts }) => categoryPosts.length)
    .sort((left, right) => left.label.localeCompare(right.label));

  const lines = [];

  lines.push('# Neon Blog');
  lines.push('');
  lines.push('Engineering, product, and community posts from the Neon team.');
  lines.push('');

  for (const { label, posts: categoryPosts } of sortedCategories) {
    lines.push(`## ${label}`);
    lines.push('');
    for (const { slug, title, date } of categoryPosts) {
      lines.push(`- [${title}](${SITE_URL}/blog/${slug}.md) — ${formatDate(date)}`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n').trimEnd() + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
