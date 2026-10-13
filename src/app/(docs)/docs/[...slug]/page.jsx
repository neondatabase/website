/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import JsonLd from 'components/shared/json-ld';
import VERCEL_URL from 'constants/base';
import { DOCS_DIR_PATH, CHANGELOG_DIR_PATH, isUnusedOrSharedContent } from 'constants/content';
import LINKS from 'constants/links';
import { getPostBySlug } from 'utils/api-content';
import { getAllPosts, getAllChangelogs, getNavigationLinks, getNavigation } from 'utils/api-docs';
import getArticleSchema from 'utils/get-article-schema';
import { getBreadcrumbs } from 'utils/get-breadcrumbs';
import { getFlatSidebar } from 'utils/get-flat-sidebar';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export async function generateStaticParams() {
  const posts = await getAllPosts();

  if (!posts) return notFound();

  return posts.map(({ slug }) => {
    const slugsArray = slug.split('/');

    return {
      slug: slugsArray,
    };
  });
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { slug } = params;
  const currentSlug = slug.join('/');

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  const post = getPostBySlug(currentSlug, DOCS_DIR_PATH);

  const isChangelog = currentSlug === 'changelog';

  if (!isChangelog && !post) return notFound();

  const title = post?.data?.title || 'Changelog';
  const encodedTitle = Buffer.from(title).toString('base64');

  const sidebar = getNavigation();
  const flatSidebar = await getFlatSidebar(sidebar);
  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
  const category = breadcrumbs.length > 0 ? breadcrumbs[0].title : '';
  const encodedCategory = category && Buffer.from(category).toString('base64');

  return getMetadata({
    title: `${title} - Neon Docs`,
    description: isChangelog ? 'The latest product updates from Neon' : post.excerpt,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}&category=${encodedCategory}`,
    pathname: `${LINKS.docs}/${currentSlug}`,
    rssPathname: isChangelog ? `${LINKS.changelog}/rss.xml` : null,
    robotsNoindex: post?.data?.noindex ? 'noindex' : null,
    type: 'article',
    markdownPath: `/docs/${currentSlug}.md`,
  });
}

const DocPost = async (props) => {
  const params = await props.params;
  const { slug } = params;
  const currentSlug = slug.join('/');

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  const sidebar = getNavigation();
  const flatSidebar = await getFlatSidebar(sidebar);

  const isDocsIndex = currentSlug === 'introduction';
  const isChangelogIndex = currentSlug === 'changelog' || currentSlug.startsWith('changelog/');

  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
  const navigationLinks = getNavigationLinks(currentSlug, flatSidebar);
  const gitHubPath = isChangelogIndex ? CHANGELOG_DIR_PATH : `${DOCS_DIR_PATH}/${currentSlug}.md`;

  const post = getPostBySlug(currentSlug, DOCS_DIR_PATH);
  if (!isChangelogIndex && !post) return notFound();

  if (isChangelogIndex) {
    const allChangelogPosts = await getAllChangelogs();

    return (
      <Post
        data={{}}
        content={{}}
        breadcrumbs={breadcrumbs}
        currentSlug={currentSlug}
        gitHubPath={gitHubPath}
        changelogPosts={allChangelogPosts}
        navigationLinks={navigationLinks}
        changelogActiveLabel="all"
        isChangelog
      />
    );
  }

  const { data, content } = post;
  const tableOfContents = getTableOfContents(content);

  const jsonLd = getArticleSchema({
    title: data.title,
    description: data.summary || data.subtitle || post.excerpt,
    datePublished: data.createdAt,
    dateModified: data.updatedOn,
    url: `${VERCEL_URL}${LINKS.docs}/${currentSlug}`,
    image: `${VERCEL_URL}/docs/og?title=${Buffer.from(data.title).toString('base64')}`,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <Post
        content={content}
        data={data}
        breadcrumbs={breadcrumbs}
        navigationLinks={navigationLinks}
        currentSlug={currentSlug}
        gitHubPath={gitHubPath}
        tableOfContents={tableOfContents}
        isDocsIndex={isDocsIndex}
      />
    </>
  );
};

export default DocPost;
