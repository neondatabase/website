import DocsHome from 'components/pages/doc/docs-home';
import VERCEL_URL from 'constants/base';
import LINKS from 'constants/links';
import getMetadata from 'utils/get-metadata';

// The docs front page. It lives at the bare `/docs` route (not in the
// `[...slug]` catch-all). The Get started nav lane declares `/docs` as its
// `Overview` item (content/docs/navigation.yaml), so the shared (docs) layout's
// Sidebar matches it and renders the Get started menu with Overview active: the
// home carries the Get started left sidebar. Agents and Accept: text/markdown
// requests to `/docs` are answered with /docs/llms.txt by src/proxy.js before
// they reach this page.
const title = 'Neon documentation';
const description =
  'Neon documentation for the backend for apps and agents: Lakebase Postgres with branching and autoscaling, Managed Better Auth, Object Storage, Functions, AI Gateway, and Realtime. Start with a quickstart, connect your framework, or set up your AI agent.';

export async function generateMetadata() {
  const encodedTitle = Buffer.from(title).toString('base64');

  return getMetadata({
    title: `${title} - Neon Docs`,
    description,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}`,
    pathname: LINKS.docsHome,
    markdownPath: '/docs/llms.txt',
  });
}

const DocsIndexPage = () => <DocsHome />;

export default DocsIndexPage;
