/* eslint-disable react/prop-types */
import Post from 'components/pages/doc/post';
import Hero from 'components/pages/release-notes/hero';
import { RELEASE_NOTES_CATEGORIES } from 'components/pages/release-notes/release-notes-filter';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Link from 'components/shared/link';
import {
  RELEASE_NOTES_BASE_PATH,
  RELEASE_NOTES_SLUG_REGEX,
  VERCEL_URL,
  MAX_TITLE_LENGTH,
} from 'constants/docs';
import { DEFAULT_IMAGE_PATH } from 'constants/seo-data';
import { getAllReleaseNotes, getPostBySlug, RELEASE_NOTES_DIR_PATH } from 'utils/api-docs';
import getExcerpt from 'utils/get-excerpt';
import getMetadata from 'utils/get-metadata';
import getReleaseNotesCategoryFromSlug from 'utils/get-release-notes-category-from-slug';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

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
  let socialPreviewTitle = '';
  const currentSlug = slug.join('/');
  const isReleaseNotePage = RELEASE_NOTES_SLUG_REGEX.test(currentSlug);
  const { capitalisedCategory } = getReleaseNotesCategoryFromSlug(currentSlug);
  label = 'Release notes';
  description = `The latest product updates from Neon`;

  if (isReleaseNotePage) {
    const { label: date } = getReleaseNotesDateFromSlug(currentSlug);
    const { content } = getPostBySlug(currentSlug, RELEASE_NOTES_DIR_PATH);
    label = `${capitalisedCategory} release ${date}`;
    socialPreviewTitle = `Release notes - ${date}`;
    description = getExcerpt(content, 160);
  }

  const encodedLabel = Buffer.from(socialPreviewTitle ?? label).toString('base64');

  return getMetadata({
    title: `${label} - Neon`,
    description,
    pathname: `${RELEASE_NOTES_BASE_PATH}${currentSlug}`,
    imagePath:
      label.length < MAX_TITLE_LENGTH
        ? `${VERCEL_URL}/docs/og?title=${encodedLabel}`
        : DEFAULT_IMAGE_PATH,
    type: 'article',
  });
}

const ReleaseNotePage = async ({ currentSlug }) => {
  const { datetime, label } = getReleaseNotesDateFromSlug(currentSlug);
  const { capitalisedCategory } = getReleaseNotesCategoryFromSlug(currentSlug);

  const { content } = getPostBySlug(currentSlug, RELEASE_NOTES_DIR_PATH);

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
      <div className="col-span-6 -mx-10 flex flex-col 2xl:mx-0 xl:col-span-9 xl:ml-11 xl:max-w-[750px] lg:ml-0 lg:max-w-none lg:pt-0 md:mx-auto md:pb-[70px] sm:pb-8">
        <Hero
          className="flex justify-center dark:bg-gray-new-8 dark:text-white lg:pt-16 md:py-10 sm:py-7"
          date={label}
          withContainer
        />
        <div className="grow pb-28 dark:bg-gray-new-8 lg:pb-20 md:pb-16 flex">
          <Container size="xs" className="relative flex pb-10 w-full">
            <article className="relative flex max-w-full flex-col items-start w-full">
              <h2>
                <time
                  className="mt-3 whitespace-nowrap text-gray-new-20 dark:text-gray-new-70"
                  dateTime={datetime}
                >
                  {label}
                </time>
              </h2>
              <Content className="mt-8 max-w-full prose-h3:text-xl w-full" content={content} />
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
  const currentReleaseNotes = allReleaseNotes.filter((item) => {
    const { slug } = item;
    const { category } = getReleaseNotesCategoryFromSlug(slug);

    return category === currentSlug;
  });
  return isReleaseNotePage ? (
    <ReleaseNotePage currentSlug={currentSlug} />
  ) : (
    <ReleaseNoteCategoryPage currentSlug={currentSlug} currentReleaseNotes={currentReleaseNotes} />
  );
}
