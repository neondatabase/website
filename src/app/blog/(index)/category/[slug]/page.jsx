import BlogPostCard from 'components/pages/blog/blog-post-card';
import { getAllWpBlogCategories, getWpPostsByCategorySlug } from 'utils/api-posts';

export default async function BlogCategoryPage({ params: { slug } }) {
  const posts = await getWpPostsByCategorySlug(slug);

  return (
    <>
      <h1 className="sr-only">{slug}</h1>
      <div className="grid grid-cols-3 gap-x-10 gap-y-16">
        {posts.map((post, index) => (
          <BlogPostCard {...post} size="md" key={index} />
        ))}
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const categories = await getAllWpBlogCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}
