/* eslint-disable react/prop-types */
import Admonition from 'components/pages/doc/admonition';
import PreviousAndNextLinks from 'components/pages/doc/previous-and-next-links';
import Content from 'components/shared/content';
import Link from 'components/shared/link';
import { MAX_TITLE_LENGTH, POSTGRES_DOCS_BASE_PATH, VERCEL_URL } from 'constants/docs';
import { DEFAULT_IMAGE_PATH } from 'constants/seo-data';
import {
  POSTGRES_DIR_PATH,
  getAllPosts,
  getDocPreviousAndNextLinks,
  getPostBySlug,
} from 'utils/api-postgres';
import getMetadata from 'utils/get-metadata';
import serializeMdx from 'utils/serialize-mdx';

export async function generateMetadata({ params }) {
  const { slug: currentSlug } = params;

  const { title, excerpt } = await getPostBySlug(`/${currentSlug}`, POSTGRES_DIR_PATH);

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

  const { title, content } = await getPostBySlug(`/${currentSlug}`, POSTGRES_DIR_PATH);
  const hasH1 = findH1(content);

  const mdxSource = await serializeMdx(content);

  const { previousLink, nextLink } = getDocPreviousAndNextLinks(currentSlug);

  return (
    <div className="col-span-6 -mx-10 flex flex-col 2xl:col-span-7 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:ml-0 lg:max-w-none lg:pt-0 md:mx-auto md:pb-[70px] sm:pb-8">
      <article>
        {!hasH1 && <h1 className="sr-only">{title}</h1>}
        <Admonition type="note">
          This mirror of official PostgreSQL documentation is brought to you by Neon with ❤️.
          <br className="flat-none sm:flat-break" /> Not all features and functions are supported.
          See <Link to="/docs/reference/compatibility">Postgres compatibility</Link> for details.
        </Admonition>
        <Content className="mt-10" content={mdxSource} isPostgres />
      </article>
      <PreviousAndNextLinks
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
