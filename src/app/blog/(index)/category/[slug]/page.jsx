import clsx from 'clsx';
import { notFound } from 'next/navigation';

import BlogPostCard from 'components/pages/blog/blog-post-card';
import LoadMorePosts from 'components/shared/load-more-posts';
import { BLOG_CATEGORY_BASE_PATH } from 'constants/blog';
import { getBlogCategoryDescription } from 'constants/seo-data';
import { getAllCategories, getCategoryBySlug, getPostsByCategorySlug } from 'utils/api-posts';
import getMetadata from 'utils/get-metadata';

// eslint-disable-next-line react/prop-types
const BlogCategoryPage = async ({ params: { slug } }) => {
  const category = await getCategoryBySlug(slug);
  const posts = await getPostsByCategorySlug(slug);

  if (!posts || !category) return notFound();

  return (
    <>
      <h2 className="sr-only">{category.name} Blog</h2>
      <div className="grid grid-cols-2 gap-x-6 md:grid-cols-1">
        <LoadMorePosts className="mt-16" defaultCountPosts={8} countToAdd={8}>
          {posts.map((post, index) => {
            const isFeatured = index < 2 && post.pageBlogPost;

            return (
              <BlogPostCard
                className={clsx(
                  'py-8 first:pt-0 last:pb-0 md:py-6',
                  isFeatured
                    ? 'pt-0 md:pt-0'
                    : 'col-span-full border-t border-gray-new-15 py-8 first:border-0 first:border-t-0 first:pt-0 last:pb-0'
                )}
                key={post.slug}
                categories={{ nodes: [category] }}
                fullSize={!isFeatured}
                isPriority={index < 5}
                imageWidth={isFeatured ? 372 : 336}
                imageHeight={isFeatured ? 212 : 189}
                withAuthorPhoto
                {...post}
              />
            );
          })}
        </LoadMorePosts>
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
