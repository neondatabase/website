const path = require('path');

const { EXCLUDED_DIRS } = require('../constants/content');

const BASE_URL = 'https://neon.com';
const EXCLUDED_FILES = ['README.md', 'index.md', '_index.md', 'GUIDE_TEMPLATE.md'];

const SITE_ROUTES = [
  { srcPath: 'content/guides', urlPrefix: 'guides' },
  { srcPath: 'content/changelog', urlPrefix: 'docs/changelog' },
].sort((a, b) => b.srcPath.length - a.srcPath.length);

function posix(file) {
  return file.split(path.sep).join('/');
}

function isMarkdown(file) {
  return file.endsWith('.md');
}

function hasExcludedDir(file) {
  return posix(file)
    .split('/')
    .some((segment) => EXCLUDED_DIRS.includes(segment));
}

function matchSiteRoute(file) {
  const normalized = posix(file);
  for (const route of SITE_ROUTES) {
    const prefix = `${route.srcPath}/`;
    if (normalized === route.srcPath || normalized.startsWith(prefix)) {
      return {
        ...route,
        relPath: path.posix.relative(route.srcPath, normalized),
      };
    }
  }
  return undefined;
}

function catalogUrl(file) {
  const matched = matchSiteRoute(file);
  if (!matched) {
    return undefined;
  }
  return `${BASE_URL}/${matched.urlPrefix}/${matched.relPath}`;
}

function classify(file) {
  const normalized = posix(file);
  if (!isMarkdown(normalized)) {
    return { kind: 'notMarkdown' };
  }
  if (hasExcludedDir(normalized)) {
    return { kind: 'sharedContent' };
  }
  const basename = path.posix.basename(normalized);
  if (EXCLUDED_FILES.includes(basename)) {
    return { kind: 'excluded' };
  }
  const url = catalogUrl(normalized);
  if (!url) {
    return { kind: 'notSite' };
  }
  return { kind: 'catalog', url };
}

function addPage(pages, url, deleted) {
  pages.set(url, { url, deleted });
}

function bump(skipped, kind) {
  skipped[kind] += 1;
}

/**
 * @param {Array<{ filename: string, status: string, previous_filename?: string }>} files
 */
function mapCompareFiles(files) {
  const pages = new Map();
  const skipped = {
    sharedContent: 0,
    excluded: 0,
    notSite: 0,
    notMarkdown: 0,
  };

  for (const file of files) {
    const status = file.status;
    if (status === 'renamed' && file.previous_filename) {
      const previous = classify(file.previous_filename);
      if (previous.kind === 'catalog') {
        addPage(pages, previous.url, true);
      } else {
        bump(skipped, previous.kind);
      }
    }

    const current = classify(file.filename);
    if (current.kind !== 'catalog') {
      bump(skipped, current.kind);
      continue;
    }
    if (status === 'removed') {
      addPage(pages, current.url, true);
      continue;
    }
    if (
      status === 'added' ||
      status === 'modified' ||
      status === 'changed' ||
      status === 'copied' ||
      status === 'renamed'
    ) {
      addPage(pages, current.url, false);
    }
  }

  return {
    pages: [...pages.values()],
    skipped,
  };
}

function skippedSummary(skipped) {
  const parts = [];
  if (skipped.sharedContent) {
    parts.push(`${skipped.sharedContent} shared-content`);
  }
  if (skipped.excluded) {
    parts.push(`${skipped.excluded} excluded`);
  }
  if (skipped.notSite) {
    parts.push(`${skipped.notSite} not site`);
  }
  if (skipped.notMarkdown) {
    parts.push(`${skipped.notMarkdown} not markdown`);
  }
  return parts.join(', ');
}

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  const files = raw === '' ? [] : JSON.parse(raw);
  if (!Array.isArray(files)) {
    throw new Error('site-reindex-map expected a JSON array of GitHub compare files');
  }
  const result = mapCompareFiles(files);
  const summary = skippedSummary(result.skipped);
  if (summary) {
    process.stderr.write(`skipped: ${summary}\n`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFile } = require('fs').promises;
    const lines = ['## Site reindex map', '', `Mapped **${result.pages.length}** site page(s).`];
    if (summary) {
      lines.push(`Skipped: ${summary}.`);
    }
    lines.push('');
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `${lines.join('\n')}\n`);
  }
  if (result.pages.length === 0) {
    process.exit(0);
  }
  process.stdout.write(`${JSON.stringify({ pages: result.pages })}\n`);
}

module.exports = {
  mapCompareFiles,
  classify,
  skippedSummary,
};

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
