import { notFound } from 'next/navigation';

import BlogPostCard from 'components/pages/blog/blog-post-card';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import { BLOG_CATEGORY_BASE_PATH } from 'constants/blog';
import { getBlogCategoryDescription } from 'constants/seo-data';
import { getAllWpBlogCategories, getWpPostsByCategorySlug } from 'utils/api-posts';
import getMetadata from 'utils/get-metadata';

export default async function BlogCategoryPage({ params: { slug } }) {
  const categories = await getAllWpBlogCategories();
  const posts = await getWpPostsByCategorySlug(slug);
  const category = categories.find((cat) => cat.slug === slug);

  if (!posts || !category) return notFound();

  return (
    <>
      <h1 className="sr-only">{`${category.name} Blog`}</h1>
      <div className="grid grid-cols-3 gap-x-10 gap-y-16 2xl:gap-y-12 xl:gap-x-6 xl:gap-y-10 md:grid-cols-2 md:gap-y-5 sm:grid-cols-1">
        {posts.map((post, index) => (
          <BlogPostCard
            className={index === 0 ? 'col-span-full' : ''}
            {...post}
            size={index === 0 ? 'xl' : 'md'}
            key={post.slug}
            withAuthorPhoto={index !== 0}
            isPriority={index === 0}
            imageWidth={index === 0 ? 716 : 380}
            imageHeight={index === 0 ? 403 : 196}
          />
        ))}
      </div>
      <SubscribeForm size="md" />
    </>
  );
}

export async function generateMetadata({ params }) {
  const categories = await getAllWpBlogCategories();
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
  const categories = await getAllWpBlogCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export const revalidate = 300;
