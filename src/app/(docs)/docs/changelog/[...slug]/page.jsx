/* eslint-disable react/prop-types */
import { notFound, redirect } from 'next/navigation';

import Content from 'components/shared/content';
import Link from 'components/shared/link';
import SectionLabel from 'components/shared/section-label';
import VERCEL_URL from 'constants/base';
import { CHANGELOG_DIR_PATH } from 'constants/content';
import { CHANGELOG_BASE_PATH, CHANGELOG_SLUG_REGEX } from 'constants/docs';
import ArrowLeftThinIcon from 'icons/arrow-left-thin.inline.svg';
import { getPostBySlug } from 'utils/api-content';
import { getAllChangelogs } from 'utils/api-docs';
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
    category: 'Changelog',
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

  const { data, content } = getPostBySlug(currentSlug, CHANGELOG_DIR_PATH);
  const title = data.title || getExcerpt(content, 160);

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
      <div className="mx-auto w-full max-w-[704px] pb-40 pt-9 xl:pb-32 lg:pb-28 lg:pt-0 md:pb-20">
        <Link
          className="group sticky top-40 -ml-64 inline-flex items-center gap-1.5 text-sm leading-none tracking-tight xl:static xl:ml-0"
          to={CHANGELOG_BASE_PATH}
          theme="gray-50"
        >
          <ArrowLeftThinIcon className="size-[14px] shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to Changelog</span>
        </Link>

        <SectionLabel className="-mt-5 text-gray-new-20 dark:text-gray-new-80 xl:mt-4" theme="dark">
          {date}
        </SectionLabel>

        <article className="relative flex w-full max-w-full flex-col items-start">
          {/* Special title for Algolia */}
          <h2 className="post-title">
            <time className="sr-only" dateTime={currentSlug}>
              {date}
            </time>
            <span className="sr-only">– {title}</span>
          </h2>
          <Content
            className="w-full max-w-full prose-h3:text-xl [&>*:first-child]:pt-4"
            content={content}
          />
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
