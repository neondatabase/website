import clsx from 'clsx';
import { notFound } from 'next/navigation';

import BlogPostCard from 'components/pages/blog/blog-post-card';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import LoadMorePosts from 'components/shared/load-more-posts';
import { BLOG_CATEGORY_BASE_PATH } from 'constants/blog';
import { getBlogCategoryDescription } from 'constants/seo-data';
import { getAllWpBlogCategories, getWpPostsByCategorySlug } from 'utils/api-posts';
import getMetadata from 'utils/get-metadata';

const generateBlogTitle = (category) => {
  if (category.slug === 'all-posts') return 'All Blog Posts';
  return `${category.name} Blog`;
};

// eslint-disable-next-line react/prop-types
const BlogCategoryPage = async ({ params: { slug } }) => {
  const categories = await getAllWpBlogCategories();
  const posts = await getWpPostsByCategorySlug(slug);
  const category = categories.find((cat) => cat.slug === slug);

  if (!posts || !category) return notFound();

  return (
    <>
      <h2 className="sr-only">{generateBlogTitle(category)}</h2>
      <div className="dark grid grid-cols-3 gap-x-7 gap-y-16 2xl:gap-y-12 xl:gap-x-6 xl:gap-y-10 md:grid-cols-2 md:gap-y-5 sm:grid-cols-1">
        {category.slug === 'all-posts' ? (
          <LoadMorePosts defaultCountPosts={13} countToAdd={12}>
            {posts.map((post, index) => (
              <BlogPostCard
                className={clsx({ 'col-span-full': index === 0 })}
                {...post}
                size={index === 0 ? 'xl' : 'md'}
                key={post.slug}
                withAuthorPhoto={index !== 0}
                isPriority={index === 0}
                imageWidth={index === 0 ? 716 : 380}
                imageHeight={index === 0 ? 403 : 214}
              />
            ))}
          </LoadMorePosts>
        ) : (
          posts.map((post, index) => (
            <BlogPostCard
              className={clsx({ 'col-span-full': index === 0 })}
              {...post}
              size={index === 0 ? 'xl' : 'md'}
              key={post.slug}
              withAuthorPhoto={index !== 0}
              isPriority={index === 0}
              imageWidth={index === 0 ? 716 : 380}
              imageHeight={index === 0 ? 403 : 214}
            />
          ))
        )}
      </div>
      <SubscribeForm size="md" />
    </>
  );
};

export async function generateMetadata({ params }) {
  const categories = await getAllWpBlogCategories();
  const category = categories.find((cat) => cat.slug === params.slug);

  if (!category) return notFound();

  return getMetadata({
    title: `${generateBlogTitle(category)} - Neon`,
    description: getBlogCategoryDescription(params.slug),
    pathname: `${BLOG_CATEGORY_BASE_PATH}${params.slug}`,
    imagePath: '/images/social-previews/blog.jpg',
  });
}

export async function generateStaticParams() {
  const categories = await getAllWpBlogCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export const revalidate = 300;

export default BlogCategoryPage;
