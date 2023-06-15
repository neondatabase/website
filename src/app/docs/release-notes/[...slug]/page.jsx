/* eslint-disable react/prop-types */
import Post from 'components/pages/doc/post';
import Hero from 'components/pages/release-notes/hero';
import { RELEASE_NOTES_CATEGORIES } from 'components/pages/release-notes/release-notes-filter';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import { RELEASE_NOTES_BASE_PATH, RELEASE_NOTES_SLUG_REGEX } from 'constants/docs';
import { getAllReleaseNotes, getPostBySlug, RELEASE_NOTES_DIR_PATH } from 'utils/api-docs';
import getExcerpt from 'utils/get-excerpt';
import getMetadata from 'utils/get-metadata';
import getReleaseNotesCategoryFromSlug from 'utils/get-release-notes-category-from-slug';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';
import serializeMdx from 'utils/serialize-mdx';

export async function generateStaticParams() {
  const releaseNotes = await getAllReleaseNotes();

  return [...RELEASE_NOTES_CATEGORIES, ...releaseNotes].map(({ slug }) => {
    const slugsArray = slug.split('/');

    return {
      slug: slugsArray,
    };
  });
}

export async function generateMetadata({ params }) {
  const { slug } = params;

  let label = '';
  let description = '';
  const currentSlug = slug.join('/');
  const isReleaseNotePage = RELEASE_NOTES_SLUG_REGEX.test(currentSlug);

  const { capitalisedCategory } = getReleaseNotesCategoryFromSlug(currentSlug);
  label = `${capitalisedCategory} release`;
  description = `The latest ${capitalisedCategory} updates from Neon`;

  if (isReleaseNotePage) {
    const { label: date } = getReleaseNotesDateFromSlug(currentSlug);
    const { content } = getPostBySlug(currentSlug, RELEASE_NOTES_DIR_PATH);
    label = `${capitalisedCategory} release ${date}`;
    description = getExcerpt(content, 160);
  }

  return getMetadata({
    title: `${label} - Neon`,
    description,
    pathname: `${RELEASE_NOTES_BASE_PATH}${currentSlug}`,
    type: 'article',
  });
}

const ReleaseNotePage = async ({ currentSlug }) => {
  const { datetime, label } = getReleaseNotesDateFromSlug(currentSlug);
  const { capitalisedCategory } = getReleaseNotesCategoryFromSlug(currentSlug);
  const { content } = getPostBySlug(currentSlug, RELEASE_NOTES_DIR_PATH);
  const mdxSource = await serializeMdx(content);

  const isReleaseNotePage = RELEASE_NOTES_SLUG_REGEX.test(currentSlug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${capitalisedCategory} release ${label}`,
    datePublished: datetime,
    author: {
      '@type': 'Organization',
      name: 'Neon',
    },
  };

  return (
    <>
      {isReleaseNotePage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Hero
        className="flex justify-center pt-40 dark:bg-gray-new-8 dark:text-white lg:pt-16 md:mb-10 md:py-10 sm:mb-7 sm:py-7"
        date={label}
        withContainer
        isReleaseNotePost
      />
      <div className="pb-28 dark:bg-gray-new-8 lg:pb-20 md:pb-16">
        <Container size="xs" className="relative flex pb-10">
          <article className="relative flex flex-col items-start">
            <time
              className="mt-3 whitespace-nowrap text-gray-new-20 dark:text-gray-new-70"
              dateTime={datetime}
            >
              {label}
            </time>
            <Heading
              className="!text-[36px] !leading-normal md:!text-3xl"
              tag="h1"
              size="sm"
              theme="black"
            >
              {capitalisedCategory} release
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

const ReleaseNoteCategoryPage = ({ currentSlug, currentReleaseNotes }) => {
  const fileOriginPath = process.env.NEXT_PUBLIC_RELEASE_NOTES_GITHUB_PATH;

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

export default async function ReleaseNotesPost({ params }) {
  const currentSlug = params?.slug.join('/');
  const isReleaseNotePage = RELEASE_NOTES_SLUG_REGEX.test(currentSlug);
  const allReleaseNotes = await getAllReleaseNotes();
  const currentReleaseNotes = await Promise.all(
    allReleaseNotes
      .filter((item) => {
        const { slug } = item;
        const { category } = getReleaseNotesCategoryFromSlug(slug);

        return category === currentSlug;
      })
      .map(async (item) => ({
        ...item,
        content: await serializeMdx(item.content),
      }))
  );

  return isReleaseNotePage ? (
    <ReleaseNotePage currentSlug={currentSlug} />
  ) : (
    <ReleaseNoteCategoryPage currentSlug={currentSlug} currentReleaseNotes={currentReleaseNotes} />
  );
}
