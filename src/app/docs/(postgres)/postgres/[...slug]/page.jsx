/* eslint-disable react/prop-types */
import PreviousAndNextLinks from 'components/pages/doc/previous-and-next-links';
import Content from 'components/shared/content';
import { POSTGRES_DOCS_BASE_PATH, VERCEL_URL, MAX_TITLE_LENGTH } from 'constants/docs';
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
  const { slug } = params;
  const currentSlug = slug.join('/');

  const { title, excerpt } = await getPostBySlug(`/${currentSlug}`, POSTGRES_DIR_PATH);

  const encodedTitle = Buffer.from(title).toString('base64');

  return getMetadata({
    title: `${title || 'PostgreSQL'} - PostgreSQL Docs`,
    description: excerpt,
    pathname: `${POSTGRES_DOCS_BASE_PATH}/${currentSlug}`,
    imagePath:
      title.length < MAX_TITLE_LENGTH
        ? `${VERCEL_URL}/docs/og?title=${encodedTitle}`
        : DEFAULT_IMAGE_PATH,
  });
}

const PostgresPage = async ({ params }) => {
  const { slug } = params;
  const currentSlug = slug.join('/');
  const { title, content } = await getPostBySlug(`/${currentSlug}`, POSTGRES_DIR_PATH);
  const mdxSource = await serializeMdx(content);
  const { previousLink, nextLink } = getDocPreviousAndNextLinks(currentSlug);

  return (
    <div className="col-span-6 -mx-10 flex flex-col 2xl:col-span-7 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:ml-0 lg:max-w-none lg:pt-0 md:mx-auto md:pb-[70px] sm:pb-8">
      <article>
        <h1 className="sr-only" aria-hidden>
          {title}
        </h1>
        <Content content={mdxSource} isPostgres />
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

  return posts.map(({ slug }) => {
    const slugsArray = slug.split('/');

    return {
      slug: slugsArray,
    };
  });
}
