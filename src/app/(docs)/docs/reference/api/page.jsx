import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import VERCEL_URL from 'constants/base';
import { DOCS_DIR_PATH } from 'constants/content';
import LINKS from 'constants/links';
import { getPostBySlug } from 'utils/api-content';
import { getNavigation, getNavigationLinks } from 'utils/api-docs';
import { getBreadcrumbs } from 'utils/get-breadcrumbs';
import { getFlatSidebar } from 'utils/get-flat-sidebar';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

const CURRENT_SLUG = 'reference/api';

export async function generateMetadata() {
  const post = getPostBySlug(CURRENT_SLUG, DOCS_DIR_PATH);
  if (!post) return { title: 'Not Found' };

  const sidebar = getNavigation();
  const flatSidebar = await getFlatSidebar(sidebar);
  const breadcrumbs = getBreadcrumbs(CURRENT_SLUG, flatSidebar);
  const category = breadcrumbs[0]?.title ?? 'API Reference';
  const encodedTitle = Buffer.from(post.data.title).toString('base64');
  const encodedCategory = Buffer.from(category).toString('base64');

  return getMetadata({
    title: `${post.data.title} - Neon Docs`,
    description: post.data.summary ?? post.excerpt,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}&category=${encodedCategory}`,
    pathname: `${LINKS.docs}/${CURRENT_SLUG}`,
    type: 'article',
    markdownPath: `/docs/${CURRENT_SLUG}.md`,
  });
}

const ApiOverviewRoute = async () => {
  const post = getPostBySlug(CURRENT_SLUG, DOCS_DIR_PATH);
  if (!post) return notFound();

  const sidebar = getNavigation();
  const flatSidebar = await getFlatSidebar(sidebar);
  const breadcrumbs = getBreadcrumbs(CURRENT_SLUG, flatSidebar);
  const navigationLinks = getNavigationLinks(CURRENT_SLUG, flatSidebar);
  const { data, content } = post;
  const tableOfContents = getTableOfContents(content);

  return (
    <Post
      content={content}
      data={data}
      breadcrumbs={breadcrumbs}
      navigationLinks={navigationLinks}
      currentSlug={CURRENT_SLUG}
      gitHubPath={`${DOCS_DIR_PATH}/${CURRENT_SLUG}.md`}
      tableOfContents={tableOfContents}
    />
  );
};

export default ApiOverviewRoute;
