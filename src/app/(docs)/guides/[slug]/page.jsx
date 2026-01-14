/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import VERCEL_URL from 'constants/base';
import { GUIDES_DIR_PATH } from 'constants/content';
import { GUIDES_BASE_PATH } from 'constants/guides';
import LINKS from 'constants/links';
import { getPostBySlug } from 'utils/api-content';
import { getAuthor, getAllGuides, getNavigationLinks } from 'utils/api-guides';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export async function generateStaticParams() {
  const posts = await getAllGuides();
  if (!posts) return notFound();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug, GUIDES_DIR_PATH);

  if (!post) return notFound();

  const {
    data: { title, subtitle },
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
  });
}

const GuidePost = async ({ params }) => {
  const { slug } = params;
  const posts = await getAllGuides();
  const navigationLinks = getNavigationLinks(slug, posts);
  const gitHubPath = `${GUIDES_DIR_PATH}/${slug}.md`;
  const postBySlug = getPostBySlug(slug, GUIDES_DIR_PATH);
  if (!postBySlug) return notFound();
  const { data, content } = postBySlug;
  const authorID = data.author;
  const author = getAuthor(authorID);
  const tableOfContents = getTableOfContents(content);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    author: {
      '@type': 'Organization',
      name: 'Neon',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
