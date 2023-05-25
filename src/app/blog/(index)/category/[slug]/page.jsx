import BlogPostCard from 'components/pages/blog/blog-post-card';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import { getAllWpBlogCategories, getWpPostsByCategorySlug } from 'utils/api-posts';

export default async function BlogCategoryPage({ params: { slug } }) {
  const posts = await getWpPostsByCategorySlug(slug);

  return (
    <>
      <h1 className="sr-only">{slug}</h1>
      <div className="grid grid-cols-3 gap-x-10 gap-y-16 2xl:gap-y-12 xl:gap-x-6 xl:gap-y-9 lg:gap-x-4 md:grid-cols-2 md:gap-y-5 sm:grid-cols-1">
        {posts.map((post, index) => (
          <BlogPostCard
            className={index === 0 && 'col-span-full'}
            {...post}
            size={index === 0 ? 'xl' : 'md'}
            key={index}
          />
        ))}
      </div>
      <SubscribeForm
        className="-mx-10 rounded-xl bg-black-new p-[70px] pr-28 2xl:mx-0 2xl:px-10 2xl:pb-16 2xl:pt-10 lt:px-11 lt:py-[70px] lt:pt-10 lg:pb-16 md:px-8 md:pb-12 md:pt-7"
        size="md"
      />
    </>
  );
}

export async function generateStaticParams() {
  const categories = await getAllWpBlogCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}
