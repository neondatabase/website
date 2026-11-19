// Reports content/docs pages whose subtitle places the reader on Neon while
// the title names bare "Lakebase Postgres". Docs search hits, including the
// Neon MCP Server's search_docs results, carry the title but not the subtitle,
// so without "on Neon" in the title a reader can't tell the page is about Neon.
//
// Output: { pages, errors }, one error per offending page.

const fs = require('fs');
const path = require('path');

const { globSync } = require('glob');
const matter = require('gray-matter');

const DEFAULT_ROOT = path.join(__dirname, '..', '..', '..', 'content', 'docs');

const ON_NEON_RE = /\bon Neon\b/;

function checkPage(file, source) {
  const { data } = matter(source);
  const title = String(data.title ?? '');
  const subtitle = String(data.subtitle ?? '');
  if (!title.includes('Lakebase Postgres') || /\b(Neon|Databricks)\b/.test(title)) return null;
  if (!ON_NEON_RE.test(subtitle)) return null;

  const lines = source.split('\n');
  const index = lines.findIndex((line) => line.startsWith('title:'));
  return {
    kind: 'title-drops-neon',
    file,
    line: index + 1,
    raw: lines[index],
    message: `Title "${title}" names bare Lakebase Postgres, but the subtitle puts the page on Neon. Write "Lakebase Postgres on Neon" in the title.`,
  };
}

function validate({ root = DEFAULT_ROOT } = {}) {
  const pages = globSync('**/*.md', { cwd: root, absolute: true }).sort();
  const errors = pages
    .map((file) => checkPage(file, fs.readFileSync(file, 'utf8')))
    .filter((error) => error !== null);
  return { pages, errors };
}

module.exports = { validate };
