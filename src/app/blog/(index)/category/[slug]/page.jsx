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
      <div className="blog-posts grid grid-cols-2 gap-x-6 xl:gap-x-5 md:grid-cols-1">
        {posts.slice(0, 10).map((post, index) => (
          <BlogGridItem
            key={post.slug}
            post={post}
            category={category}
            isFeatured={post.isFeatured}
            isPriority={index < 5}
          />
        ))}
        {posts.length > 10 && (
          <ScrollLoader itemsCount={10}>
            {posts.slice(10).map((post) => (
              <BlogGridItem key={post.slug} post={post} category={category} />
            ))}
          </ScrollLoader>
        )}
      </div>
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
