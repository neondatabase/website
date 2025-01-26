/* eslint-disable react/prop-types */
import { notFound, redirect } from 'next/navigation';

import Hero from 'components/pages/changelog/hero';
import Content from 'components/shared/content';
import Link from 'components/shared/link';
import VERCEL_URL from 'constants/base';
import { CHANGELOG_BASE_PATH, CHANGELOG_DIR_PATH, CHANGELOG_SLUG_REGEX } from 'constants/docs';
import { getAllChangelogs, getPostBySlug } from 'utils/api-docs';
import getExcerpt from 'utils/get-excerpt';
import getFormattedDate from 'utils/get-formatted-date';
import getMetadata from 'utils/get-metadata';

export async function generateStaticParams() {
  const changelogPosts = await getAllChangelogs();

  return changelogPosts.map(({ slug }) => {
    const slugsArray = slug.split('/');

    return {
      slug: slugsArray,
    };
  });
}

export async function generateMetadata({ params }) {
  const { slug } = params;

  let label = 'Changelog';
  let description = 'The latest product updates from Neon';
  let socialPreviewTitle = 'Changelog';
  const currentSlug = slug.join('/');
  const isChangelogPage = CHANGELOG_SLUG_REGEX.test(currentSlug);

  if (isChangelogPage) {
    if (!getPostBySlug(currentSlug, CHANGELOG_DIR_PATH)) return notFound();
    const date = getFormattedDate(currentSlug);
    const { data, content } = getPostBySlug(currentSlug, CHANGELOG_DIR_PATH);
    label = `Changelog ${date}`;
    socialPreviewTitle = `Changelog - ${date}`;
    description = data.title || getExcerpt(content, 160);
  }

  const encodedLabel = Buffer.from(socialPreviewTitle ?? label).toString('base64');

  return getMetadata({
    title: `${label} - Neon`,
    description,
    pathname: `${CHANGELOG_BASE_PATH}${currentSlug}`,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedLabel}`,
    type: 'article',
  });
}

const ChangelogPost = async ({ currentSlug }) => {
  if (
    currentSlug === 'storage-and-compute' ||
    currentSlug === 'console' ||
    currentSlug === 'compute' ||
    currentSlug === 'drivers' ||
    currentSlug === 'plans' ||
    currentSlug === 'docs'
  )
    redirect('/docs/changelog');

  if (!getPostBySlug(currentSlug, CHANGELOG_DIR_PATH)) return notFound();
  const date = getFormattedDate(currentSlug);

  const { content } = getPostBySlug(currentSlug, CHANGELOG_DIR_PATH);

  const isChangelogPage = CHANGELOG_SLUG_REGEX.test(currentSlug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Changelog ${date}`,
    datePublished: date,
    author: {
      '@type': 'Organization',
      name: 'Neon',
    },
  };

  return (
    <>
      {isChangelogPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="col-span-9 col-start-3 -ml-6 flex max-w-[832px] flex-col 3xl:col-span-10 3xl:col-start-2 3xl:ml-0 2xl:col-span-11 2xl:col-start-1 xl:max-w-[calc(100vw-366px)] lg:ml-0 lg:max-w-full lg:pt-0 md:mx-auto md:pb-[70px] sm:pb-8">
        <Hero className="flex justify-center lg:pt-16 md:py-10 sm:py-7" date={date} withContainer />
        <article className="relative flex w-full max-w-full flex-col items-start">
          <h2>
            <time
              className="mt-3 whitespace-nowrap text-gray-new-20 dark:text-gray-new-70"
              dateTime={currentSlug}
            >
              {date}
            </time>
          </h2>
          <Content className="mt-8 w-full max-w-full prose-h3:text-xl" content={content} />
          <Link
            className="mt-10 font-semibold lg:mt-8"
            to={CHANGELOG_BASE_PATH}
            size="sm"
            theme="black-primary-1"
          >
            Back to all changelog posts
          </Link>
        </article>
      </div>
    </>
  );
};

const ChangelogPostPage = async ({ params }) => {
  const currentSlug = params?.slug.join('/');

  return <ChangelogPost currentSlug={currentSlug} />;
};

export default ChangelogPostPage;
