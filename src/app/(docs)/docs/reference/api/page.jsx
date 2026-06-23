import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import ApiOverviewPage from 'components/pages/doc/api-overview';
import VERCEL_URL from 'constants/base';
import { DOCS_BASE_PATH } from 'constants/docs';
import LINKS from 'constants/links';
import { getNavigation, getNavigationLinks } from 'utils/api-docs';
import { getBreadcrumbs } from 'utils/get-breadcrumbs';
import { getFlatSidebar } from 'utils/get-flat-sidebar';
import getMetadata from 'utils/get-metadata';

const API_DATA_DIR = resolve(process.cwd(), 'src/data/api-ref');
const CLI_COVERAGE = resolve(process.cwd(), 'scripts/data/cli-coverage.json');
const MCP_TOOLS = resolve(process.cwd(), 'scripts/data/mcp-tool-definitions.json');

const CURRENT_SLUG = 'reference/api';

// Tag display order + descriptions come from scripts/data/tag-config.json.
// Tags without a description (e.g. auth-legacy) are filtered out of the grid.
import tagConfig from '../../../../../../scripts/data/tag-config.json';

const TAG_ORDER = tagConfig.tags.map((t) => t.slug);
const TAG_DESCRIPTIONS = Object.fromEntries(
  tagConfig.tags.filter((t) => t.description).map((t) => [t.slug, t.description])
);

function computeCounts() {
  let restTotal = 0;
  if (existsSync(API_DATA_DIR)) {
    for (const entry of readdirSync(API_DATA_DIR, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      restTotal += readdirSync(join(API_DATA_DIR, entry.name)).filter((f) =>
        f.endsWith('.json')
      ).length;
    }
  }

  let cliCount = 0;
  if (existsSync(CLI_COVERAGE)) {
    const cliData = JSON.parse(readFileSync(CLI_COVERAGE, 'utf8'));
    cliCount = new Set(Object.values(cliData).filter(Boolean)).size;
  }

  let mcpCount = 0;
  if (existsSync(MCP_TOOLS)) {
    const mcpData = JSON.parse(readFileSync(MCP_TOOLS, 'utf8'));
    mcpCount = Object.keys(mcpData).length;
  }

  return { rest: restTotal, sdk: restTotal, cli: cliCount, mcp: mcpCount };
}

function computeResources() {
  if (!existsSync(API_DATA_DIR)) return [];

  const tagCounts = {};
  const tagDisplays = {};

  for (const entry of readdirSync(API_DATA_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const tag = entry.name;
    const files = readdirSync(join(API_DATA_DIR, tag)).filter((f) => f.endsWith('.json'));
    tagCounts[tag] = files.length;
    // Get display name from first operation file
    if (files.length > 0) {
      const op = JSON.parse(readFileSync(join(API_DATA_DIR, tag, files[0]), 'utf8'));
      tagDisplays[tag] = op.tagDisplay ?? tag;
    }
  }

  return TAG_ORDER.filter((tag) => TAG_DESCRIPTIONS[tag] && tagCounts[tag] != null).map((tag) => ({
    tag,
    display: tagDisplays[tag] ?? tag,
    count: tagCounts[tag],
    description: TAG_DESCRIPTIONS[tag],
    href: `${DOCS_BASE_PATH}reference/api/${tag}`,
  }));
}

export async function generateMetadata() {
  const sidebar = getNavigation();
  const flatSidebar = await getFlatSidebar(sidebar);
  const breadcrumbs = getBreadcrumbs(CURRENT_SLUG, flatSidebar);
  const category = breadcrumbs[0]?.title ?? 'API Reference';
  const encodedTitle = Buffer.from('API, CLI & SDKs').toString('base64');
  const encodedCategory = Buffer.from(category).toString('base64');

  return getMetadata({
    title: 'API, CLI & SDKs - Neon Docs',
    description:
      'Manage Neon programmatically using the REST API, TypeScript SDK, CLI, or MCP server.',
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}&category=${encodedCategory}`,
    pathname: `${LINKS.docs}/${CURRENT_SLUG}`,
    type: 'article',
  });
}

const ApiOverviewRoute = async () => {
  const sidebar = getNavigation();
  const flatSidebar = await getFlatSidebar(sidebar);
  const breadcrumbs = getBreadcrumbs(CURRENT_SLUG, flatSidebar);
  const navigationLinks = getNavigationLinks(CURRENT_SLUG, flatSidebar);

  const counts = computeCounts();
  const resources = computeResources();

  return (
    <ApiOverviewPage
      counts={counts}
      resources={resources}
      breadcrumbs={breadcrumbs}
      navigationLinks={navigationLinks}
      currentSlug={CURRENT_SLUG}
    />
  );
};

export default ApiOverviewRoute;
