import FeaturedPosts from 'components/pages/blog/featured-posts';
import { getAllWpPosts } from 'utils/api-posts';

export default async function BlogPage() {
  const nodes = await getAllWpPosts();
  const featuredPosts = nodes.slice(0, 5);

  return (
    <div className="col-span-8 col-start-3 -mx-[30px]">
      <FeaturedPosts posts={featuredPosts} />
    </div>
  );
}

export const revalidate = 60;
