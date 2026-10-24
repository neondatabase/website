/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import JsonLd from 'components/shared/json-ld';
import VERCEL_URL from 'constants/base';
import { GUIDES_DIR_PATH } from 'constants/content';
import { GUIDES_BASE_PATH } from 'constants/guides';
import LINKS from 'constants/links';
import { getPostBySlug } from 'utils/api-content';
import {
  getAuthor,
  getAllGuides,
  getGuideNavigationItems,
  getNavigationLinks,
} from 'utils/api-guides';
import getArticleSchema from 'utils/get-article-schema';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export async function generateStaticParams() {
  const posts = await getAllGuides();
  if (!posts) return notFound();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { slug } = params;
  const post = getPostBySlug(slug, GUIDES_DIR_PATH);

  if (!post) return notFound();

  const {
    data: { title, subtitle, canonical },
  } = post;

  const authorID = post.data.author;
  const author = getAuthor(authorID);

  const encodedTitle = Buffer.from(title).toString('base64');

  return getMetadata({
    title: `${title} - Neon Guides`,
    description: subtitle,
    imagePath: `${VERCEL_URL}/api/og?title=${encodedTitle}`,
    pathname: `${LINKS.guides}/${slug}`,
    rssPathname: null,
    type: 'article',
    category: 'Guides',
    authors: [author.name],
    canonical,
  });
}

const GuidePost = async (props) => {
  const params = await props.params;
  const { slug } = params;
  const posts = await getGuideNavigationItems();
  const navigationLinks = getNavigationLinks(slug, posts);
  const gitHubPath = `${GUIDES_DIR_PATH}/${slug}.md`;
  const postBySlug = getPostBySlug(slug, GUIDES_DIR_PATH);
  if (!postBySlug) return notFound();
  const { data, content } = postBySlug;
  const authorID = data.author;
  const author = getAuthor(authorID);
  const tableOfContents = getTableOfContents(content);
  const jsonLd = getArticleSchema({
    title: data.title,
    description: data.summary || data.subtitle || postBySlug.excerpt,
    datePublished: data.createdAt,
    dateModified: data.updatedOn,
    url: data.canonical || `${VERCEL_URL}${LINKS.guides}/${slug}`,
    image: `${VERCEL_URL}/api/og?title=${Buffer.from(data.title).toString('base64')}`,
    authors: [{ '@type': 'Person', name: author.name }],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <Post
        content={content}
        data={data}
        breadcrumbs={[
          {
            title: 'Community',
            slug: 'community/community-intro',
          },
          {
            title: 'Guides',
            slug: 'guides',
          },
        ]}
        navigationLinks={navigationLinks}
        navigationLinksBasePath={GUIDES_BASE_PATH}
        currentSlug={slug}
        gitHubPath={gitHubPath}
        tableOfContents={tableOfContents}
        author={author}
      />
    </>
  );
};

export default GuidePost;
