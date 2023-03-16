import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import Hero from 'components/pages/release-notes/hero';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import { RELEASE_NOTES_BASE_PATH, RELEASE_NOTES_DATE_SLUG_REGEX } from 'constants/docs';
import { getAllReleaseNotes, getPostBySlug, RELEASE_NOTES_DIR_PATH } from 'utils/api-docs';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';
import serializeMdx from 'utils/serialize-mdx';

export async function generateStaticParams() {
  const releaseNotes = await getAllReleaseNotes();

  return releaseNotes.map(({ slug }) => {
    const slugsArray = slug.split('/');

    return {
      slug: slugsArray,
    };
  });
}

const ReleaseNotePage = async ({ currentSlug }) => {
  const { datetime, label } = getReleaseNotesDateFromSlug(currentSlug);
  const { data, content } = getPostBySlug(currentSlug, RELEASE_NOTES_DIR_PATH);
  const mdxSource = await serializeMdx(content);

  return (
    <>
      <Hero
        className="flex justify-center pt-40 dark:bg-black dark:text-white lg:pt-16 md:mb-10 md:py-10 sm:mb-7 sm:py-7"
        withContainer
      />
      <div className="pb-28 dark:bg-black lg:pb-20 md:pb-16">
        <Container size="xs" className="relative flex pb-10">
          <article className="relative flex flex-col items-start">
            <time
              className="mt-3 whitespace-nowrap text-gray-2 dark:text-gray-5"
              dateTime={datetime}
            >
              {label}
            </time>
            <Heading
              className="!text-[36px] !leading-normal md:!text-3xl"
              tag="h3"
              size="sm"
              theme="black"
            >
              {data.label} release
            </Heading>
            <Content className="mt-8 prose-h3:text-xl" content={mdxSource} />
            <Link
              className="mt-10 font-semibold lg:mt-8"
              to={RELEASE_NOTES_BASE_PATH}
              size="sm"
              theme="black-primary-1"
            >
              Back to all notes
            </Link>
          </article>
        </Container>
      </div>
    </>
  );
};

const ReleaseNoteCategoryPage = async ({ currentSlug }) => {
  const allReleaseNotes = await getAllReleaseNotes();
  const fileOriginPath = process.env.NEXT_PUBLIC_RELEASE_NOTES_GITHUB_PATH;

  const currentReleaseNotes = await Promise.all(
    allReleaseNotes
      .filter((item) => item.label.charAt(0).toLowerCase() + item.label.slice(1) === currentSlug)
      .map(async (item) => ({
        ...item,
        content: await serializeMdx(item.content),
      }))
  );

  if (!currentReleaseNotes.length) return notFound();

  return (
    <Post
      content={{}}
      data={{}}
      breadcrumbs={[]}
      navigationLinks={{}}
      currentSlug={currentSlug}
      fileOriginPath={fileOriginPath}
      releaseNotes={currentReleaseNotes}
      releaseNotesActiveLabel={currentSlug}
      isReleaseNotes
    />
  );
};

export default async function ReleaseNotesPost({ params: { slug } }) {
  const currentSlug = slug.join('/');
  const isReleaseNotePage = RELEASE_NOTES_DATE_SLUG_REGEX.test(currentSlug);

  return isReleaseNotePage ? (
    <ReleaseNotePage currentSlug={currentSlug} />
  ) : (
    <ReleaseNoteCategoryPage currentSlug={currentSlug} />
  );
}
