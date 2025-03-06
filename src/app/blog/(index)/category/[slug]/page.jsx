import { notFound } from 'next/navigation';

import BlogGridItem from 'components/pages/blog/blog-grid-item';
import BlogHeader from 'components/pages/blog/blog-header';
import AlgoliaSearch from 'components/shared/algolia-search';
import ScrollLoader from 'components/shared/scroll-loader';
import { BLOG_BASE_PATH, BLOG_CATEGORY_BASE_PATH } from 'constants/blog';
import { getBlogCategoryDescription } from 'constants/seo-data';
import {
  getAllCategories,
  getAllPosts,
  getCategoryBySlug,
  getPostsByCategorySlug,
} from 'utils/api-wp';
import getMetadata from 'utils/get-metadata';

// eslint-disable-next-line react/prop-types
const BlogCategoryPage = async ({ params: { slug } }) => {
  const category = await getCategoryBySlug(slug);
  const posts = await getPostsByCategorySlug(slug);
  const allPosts = await getAllPosts();

  if (!posts || !category) return notFound();

  return (
    <>
      <BlogHeader
        className="lg:-top-[68px] md:-top-[62px] md:pb-16"
        title="Blog"
        category={category.name}
        basePath={BLOG_BASE_PATH}
      />
      <AlgoliaSearch
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_BLOG_INDEX_NAME}
        posts={allPosts}
        searchInputClassName="lg:-top-[68px] md:top-0"
      >
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
      </AlgoliaSearch>
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
