import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import BlogGridItem from 'components/pages/blog/blog-grid-item';
import BlogHeader from 'components/pages/blog/blog-header';
import BlogSearch from 'components/shared/blog-search';
import ScrollLoader from 'components/shared/scroll-loader';
import { BLOG_BASE_PATH, BLOG_CATEGORY_BASE_PATH } from 'constants/blog';
import { getBlogCategoryDescription } from 'constants/seo-data';
import { getAllCategories, getCategoryBySlug, getPostsByCategorySlug } from 'utils/api-wp';
import getMetadata from 'utils/get-metadata';

// eslint-disable-next-line react/prop-types
const BlogCategoryPage = async ({ params: { slug } }) => {
  const category = await getCategoryBySlug(slug);
  const posts = await getPostsByCategorySlug(slug);
  const validPosts = Array.isArray(posts) ? posts.filter(Boolean) : [];

  if (!category) return notFound();

  return (
    <>
      <BlogHeader
        className="border-b border-gray-new-20 pb-12 lg:-top-[68px] md:top-0 md:border-b-0 md:pb-0"
        title="What we’re shipping. What you’re building."
        category={category.name}
        basePath={BLOG_BASE_PATH}
        withLabel
      />
      <Suspense fallback={null}>
        <BlogSearch
          searchInputClassName="right-full mr-16 top-[208px] lt:top-[192px] xl:mr-3.5 lg:right-0 lg:mr-0 lg:top-[12px] md:!static md:!right-auto md:!top-auto md:mt-4"
          posts={validPosts}
        >
          <div className="grid grid-cols-2 gap-x-16 xl:gap-x-5 md:grid-cols-1 md:pt-[80px]">
            {validPosts.slice(0, 10).map((post, index) => (
              <BlogGridItem
                key={post.slug}
                className={index < 2 ? 'lg:!pt-0 lg:!border-t-0 md:!pt-0 md:!border-t-0' : ''}
                post={post}
                category={category}
                isFeatured={post.isFeatured}
                isPriority={index < 5}
              />
            ))}
            {validPosts.length > 10 && (
              <ScrollLoader itemsCount={10}>
                {validPosts.slice(10).map((post) => (
                  <BlogGridItem key={post.slug} post={post} category={category} />
                ))}
              </ScrollLoader>
            )}
          </div>
        </BlogSearch>
      </Suspense>
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
