/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import LINKS from 'constants/links';
import { DEFAULT_IMAGE_PATH } from 'constants/seo-data';
import {
  DOCS_DIR_PATH,
  getAllPosts,
  getAllReleaseNotes,
  getBreadcrumbs,
  getDocPreviousAndNextLinks,
  getFlatSidebar,
  getPostBySlug,
  getSidebar,
  getTableOfContents,
} from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';
import serializeMdx from 'utils/serialize-mdx';

// @NOTE: the maximum length of the title to look fine on the og image
const MAX_TITLE_LENGTH = 52;

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map(({ slug }) => {
    const slugsArray = slug.split('/');

    return {
      slug: slugsArray,
    };
  });
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const currentSlug = slug.join('/');

  const post = getPostBySlug(currentSlug, DOCS_DIR_PATH);

  const isReleaseNotes = currentSlug === 'release-notes';

  if (!post) return notFound();

  const {
    data: { title },
    excerpt,
  } = post;

  const vercelUrl =
    process.env.VERCEL_ENV === 'preview'
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

  const encodedTitle = Buffer.from(title).toString('base64');

  return getMetadata({
    title: `${title} - Neon Docs`,
    description: isReleaseNotes ? 'The latest product updates from Neon' : excerpt,
    imagePath:
      title.length < MAX_TITLE_LENGTH
        ? `${vercelUrl}/docs/og?title=${encodedTitle}`
        : DEFAULT_IMAGE_PATH,
    pathname: `${LINKS.docs}/${currentSlug}`,
    rssPathname: isReleaseNotes ? `${LINKS.releaseNotes}/rss.xml` : null,
    type: 'article',
  });
}

export default async function DocPost({ params }) {
  const { slug } = params;
  const currentSlug = slug.join('/');

  const flatSidebar = await getFlatSidebar(getSidebar());

  const isReleaseNotesIndex = !!currentSlug.match('release-notes')?.length;
  const releaseNotes = await getAllReleaseNotes();

  const releaseNotesWithMdxSource = await Promise.all(
    releaseNotes.map(async (item) => ({
      ...item,
      content: await serializeMdx(item.content),
    }))
  );

  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
  const navigationLinks = getDocPreviousAndNextLinks(currentSlug, flatSidebar);
  const fileOriginPath = isReleaseNotesIndex
    ? process.env.NEXT_PUBLIC_RELEASE_NOTES_GITHUB_PATH
    : `${process.env.NEXT_PUBLIC_DOCS_GITHUB_PATH + currentSlug}.md`;

  if (!getPostBySlug(currentSlug, DOCS_DIR_PATH)) return notFound();

  const { data, content } = getPostBySlug(currentSlug, DOCS_DIR_PATH);
  const mdxSource = await serializeMdx(content);
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
        content={mdxSource}
        data={data}
        breadcrumbs={breadcrumbs}
        navigationLinks={navigationLinks}
        isReleaseNotes={isReleaseNotesIndex}
        releaseNotesActiveLabel="all"
        currentSlug={currentSlug}
        fileOriginPath={fileOriginPath}
        releaseNotes={releaseNotesWithMdxSource}
        tableOfContents={tableOfContents}
      />
    </>
  );
}
