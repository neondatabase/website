import { notFound } from 'next/navigation';

import BlogGridItem from 'components/pages/blog/blog-grid-item';
import ScrollLoader from 'components/shared/scroll-loader';
import { BLOG_CATEGORY_BASE_PATH } from 'constants/blog';
import { getBlogCategoryDescription } from 'constants/seo-data';
import { getAllCategories, getCategoryBySlug, getPostsByCategorySlug } from 'utils/api-wp';
import getMetadata from 'utils/get-metadata';

// eslint-disable-next-line react/prop-types
const BlogCategoryPage = async ({ params: { slug } }) => {
  const category = await getCategoryBySlug(slug);
  const posts = await getPostsByCategorySlug(slug);

  if (!posts || !category) return notFound();

  return (
    <>
      <h2 className="sr-only">{category.name}</h2>
      <ScrollLoader className="grid grid-cols-2 gap-x-6 xl:gap-x-5 md:grid-cols-1" itemsCount={8}>
        {posts.map((post, index) => (
          <BlogGridItem key={post.slug} index={index} category={category} post={post} />
        ))}
      </ScrollLoader>
    </>
  );
};

export async function generateMetadata({ params }) {
  const categories = await getAllCategories();
  const category = categories.find((cat) => cat.slug === params.slug);

  if (!category) return notFound();

  return getMetadata({
    title: `${category.name} Blog - Neon`,
    description: getBlogCategoryDescription(params.slug),
    pathname: `${BLOG_CATEGORY_BASE_PATH}${params.slug}`,
    imagePath: '/images/social-previews/blog.jpg',
  });
}

export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export const revalidate = 300;

export default BlogCategoryPage;
