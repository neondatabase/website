const path = require('path');

const { CONTENT_ROUTES, EXCLUDED_DIRS } = require('../constants/content');

const config = require('./llms-index-config');

const BASE_URL = 'https://neon.com';
const EXCLUDED_FILES = ['README.md', 'index.md', '_index.md'];
const COLLAPSED_ROUTES = config.collapsedRoutes || {};
const EXCLUDE_PATHS = config.excludePaths || [];
const ADDITIONAL_RESOURCE_PATHS = new Set(
  (config.additionalResources || []).filter((r) => r.sourcePath).map((r) => r.sourcePath)
);

const CATALOG_SYNC_PATHS = new Set([
  'src/scripts/llms-index-config.js',
  'src/scripts/generate-llms-index.js',
  'scripts/generate-api-ref.mjs',
  'scripts/lib/api-ref-output.mjs',
  'scripts/lib/openapi-spec-source.mjs',
]);

const INDEXED_ROUTES = Object.entries(CONTENT_ROUTES)
  .filter(([route]) => !(route in COLLAPSED_ROUTES))
  .sort((a, b) => b[1].length - a[1].length);

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

function matchIndexedRoute(file) {
  const normalized = posix(file);
  for (const [route, srcPath] of INDEXED_ROUTES) {
    const prefix = `${srcPath}/`;
    if (normalized === srcPath || normalized.startsWith(prefix)) {
      return { route, srcPath, relPath: path.posix.relative(srcPath, normalized) };
    }
  }
  return undefined;
}

function isExcludedRelPath(relPath) {
  if (ADDITIONAL_RESOURCE_PATHS.has(relPath)) {
    return false;
  }
  return EXCLUDE_PATHS.some((prefix) => relPath === prefix || relPath.startsWith(prefix));
}

function catalogUrl(file) {
  const normalized = posix(file);
  if (!normalized.startsWith('content/')) {
    return undefined;
  }
  return `${BASE_URL}/${normalized.slice('content/'.length)}`;
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
  const matched = matchIndexedRoute(normalized);
  if (!matched) {
    const underContent = Object.values(CONTENT_ROUTES).some(
      (srcPath) => normalized === srcPath || normalized.startsWith(`${srcPath}/`)
    );
    return { kind: underContent ? 'collapsed' : 'notContent' };
  }
  if (isExcludedRelPath(matched.relPath)) {
    return { kind: 'excluded' };
  }
  const url = catalogUrl(normalized);
  if (!url) {
    return { kind: 'notContent' };
  }
  return { kind: 'catalog', url };
}

function catalogShapingChanged(files) {
  return files.some((file) => {
    if (CATALOG_SYNC_PATHS.has(posix(file.filename))) {
      return true;
    }
    return Boolean(
      file.previous_filename && CATALOG_SYNC_PATHS.has(posix(file.previous_filename))
    );
  });
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
    collapsed: 0,
    excluded: 0,
    notContent: 0,
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
    sync: catalogShapingChanged(files),
  };
}

function skippedSummary(skipped) {
  const parts = [];
  if (skipped.sharedContent) {
    parts.push(`${skipped.sharedContent} shared-content`);
  }
  if (skipped.collapsed) {
    parts.push(`${skipped.collapsed} collapsed`);
  }
  if (skipped.excluded) {
    parts.push(`${skipped.excluded} excluded`);
  }
  if (skipped.notContent) {
    parts.push(`${skipped.notContent} not content`);
  }
  if (skipped.notMarkdown) {
    parts.push(`${skipped.notMarkdown} not markdown`);
  }
  return parts.join(', ');
}

function toWebhookPayload(result) {
  if (result.sync) {
    if (result.pages.length === 0) {
      return { sync: 'docs' };
    }
    return { pages: result.pages, sync: 'docs' };
  }
  if (result.pages.length === 0) {
    return undefined;
  }
  return { pages: result.pages };
}

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  const files = raw === '' ? [] : JSON.parse(raw);
  if (!Array.isArray(files)) {
    throw new Error('docs-reindex-map expected a JSON array of GitHub compare files');
  }
  const result = mapCompareFiles(files);
  const summary = skippedSummary(result.skipped);
  if (summary) {
    process.stderr.write(`skipped: ${summary}\n`);
  }
  const payload = toWebhookPayload(result);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFile } = require('fs').promises;
    const lines = ['## Docs reindex map', '', `Mapped **${result.pages.length}** catalog page(s).`];
    if (result.sync) {
      lines.push('Catalog sync: index pages added or removed from llms.txt.');
    }
    if (summary) {
      lines.push(`Skipped: ${summary}.`);
    }
    if (result.skipped.sharedContent) {
      lines.push(
        'shared-content changes do not reindex includer pages; full ingest is the backstop.'
      );
    }
    lines.push('');
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `${lines.join('\n')}\n`);
  }
  if (!payload) {
    process.exit(0);
  }
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

module.exports = {
  mapCompareFiles,
  classify,
  skippedSummary,
  toWebhookPayload,
  CATALOG_SYNC_PATHS,
};

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
