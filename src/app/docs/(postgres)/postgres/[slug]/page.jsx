/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { notFound } from 'next/navigation';

import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import Admonition from 'components/shared/admonition';
import Content from 'components/shared/content';
import Link from 'components/shared/link';
import NavigationLinks from 'components/shared/navigation-links';
import { MAX_TITLE_LENGTH, POSTGRES_DOCS_BASE_PATH, VERCEL_URL } from 'constants/docs';
import { DEFAULT_IMAGE_PATH } from 'constants/seo-data';
import {
  POSTGRES_DIR_PATH,
  getAllPosts,
  getNavigationLinks,
  getPostBySlug,
  getSidebar,
} from 'utils/api-postgres';
import { getBreadcrumbs, getFlatSidebar } from 'utils/get-breadcrumbs';
import getMetadata from 'utils/get-metadata';

export async function generateMetadata({ params }) {
  const { slug: currentSlug } = params;

  const post = await getPostBySlug(`/${currentSlug}`, POSTGRES_DIR_PATH);

  if (!post) return notFound();

  const { title, excerpt } = post;
  const encodedTitle = Buffer.from(title || 'PostgreSQL').toString('base64');

  return getMetadata({
    title: `${title || 'PostgreSQL'} - PostgreSQL Docs`,
    description: excerpt,
    pathname: `${POSTGRES_DOCS_BASE_PATH}${currentSlug}`,
    imagePath:
      title.length < MAX_TITLE_LENGTH
        ? `${VERCEL_URL}/docs/og?title=${encodedTitle}`
        : DEFAULT_IMAGE_PATH,
    isPostgres: true,
    currentSlug,
    robotsNoindex: 'noindex',
  });
}

function findH1(content) {
  const lines = content.split('\n');

  return lines.some((line) => line.trim().startsWith('# ') && line.trim().length > 2);
}

const PostgresPage = async ({ params }) => {
  const { slug: currentSlug } = params;

  const sidebar = getSidebar()['0'].items;
  const flatSidebar = getFlatSidebar(sidebar);
  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar, sidebar);

  const post = await getPostBySlug(`/${currentSlug}`, POSTGRES_DIR_PATH);

  if (!post) return notFound();

  const { title, content } = post;
  const hasH1 = findH1(content);

  const { previousLink, nextLink } = getNavigationLinks(currentSlug);

  return (
    <div className="col-span-7 col-start-3 -ml-6 max-w-[832px] 3xl:col-span-8 3xl:col-start-2 3xl:ml-0 lg:max-w-none">
      {breadcrumbs.length > 0 && (
        <Breadcrumbs breadcrumbs={breadcrumbs} currentSlug={currentSlug} isPostgresPost />
      )}
      <article className={clsx('lg:mt-0', { '-mt-5': breadcrumbs.length === 0 })}>
        {!hasH1 && <h1 className="sr-only">{title}</h1>}
        <Admonition type="note">
          This mirror of{' '}
          <Link
            to={`https://www.postgresql.org/docs/16/${currentSlug}.html`}
            target="_blank"
            rel="noopener noreferrer"
          >
            official PostgreSQL documentation
          </Link>{' '}
          is brought to you by Neon with ❤️
          <br className="flat-none sm:flat-break" /> Not all information is applicable to Neon. See{' '}
          <Link to="/docs/reference/compatibility#postgresql-documentation">
            Postgres compatibility
          </Link>{' '}
          for details.
        </Admonition>
        <Content className="mt-10" content={content} isPostgres />
      </article>
      <NavigationLinks
        previousLink={previousLink}
        nextLink={nextLink}
        basePath={POSTGRES_DOCS_BASE_PATH}
      />
    </div>
  );
};

export default PostgresPage;

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map(({ slug }) => ({
    slug,
  }));
}
