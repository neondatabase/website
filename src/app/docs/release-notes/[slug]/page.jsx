import Hero from 'components/pages/release-notes/hero';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import { RELEASE_NOTES_BASE_PATH } from 'constants/docs';
import { getAllReleaseNotes, getPostBySlug, RELEASE_NOTES_DIR_PATH } from 'utils/api-docs';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';
import serializeMdx from 'utils/serialize-mdx';

export async function generateStaticParams() {
  const releaseNotes = await getAllReleaseNotes();

  return releaseNotes.map(({ slug }) => ({ slug }));
}

export default async function ReleaseNotesPost({ params }) {
  const { slug } = params;
  const { data, content } = getPostBySlug(slug, RELEASE_NOTES_DIR_PATH);
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
              dateTime={getReleaseNotesDateFromSlug(slug)}
            >
              {getReleaseNotesDateFromSlug(slug)}
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
}
