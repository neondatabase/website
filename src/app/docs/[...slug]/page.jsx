/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import {
  DOCS_DIR_PATH,
  getAllPosts,
  getAllReleaseNotes,
  getBreadcrumbs,
  getDocPreviousAndNextLinks,
  getFlatSidebar,
  getPostBySlug,
  getSidebar,
} from 'utils/api-docs';
import serializeMdx from 'utils/serialize-mdx';

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map(({ slug }) => {
    const slugsArray = slug.split('/');

    return {
      slug: slugsArray,
    };
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

  return (
    <Post
      content={mdxSource}
      data={data}
      breadcrumbs={breadcrumbs}
      navigationLinks={navigationLinks}
      isReleaseNotes={isReleaseNotesIndex}
      currentSlug={currentSlug}
      fileOriginPath={fileOriginPath}
      releaseNotes={releaseNotesWithMdxSource}
    />
  );
}
