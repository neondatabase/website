/* eslint-disable react/prop-types */
import Content from 'components/shared/content';
import { POSTGRES_DIR_PATH, getAllPosts, getPostBySlug } from 'utils/api-postgres';
import serializeMdx from 'utils/serialize-mdx';

const PostgresPage = async ({ params }) => {
  const { slug } = params;
  const currentSlug = slug.join('/');
  const { content } = await getPostBySlug(`/${currentSlug}`, POSTGRES_DIR_PATH);
  const mdxSource = await serializeMdx(content);

  return (
    <div className="col-span-6 -mx-10 flex flex-col 2xl:col-span-7 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:ml-0 lg:max-w-none lg:pt-0 md:mx-auto md:pb-[70px] sm:pb-8">
      <article>
        <Content className="mt-5" content={mdxSource} />
      </article>
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
