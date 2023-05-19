import FeaturedPostsList from 'components/pages/blog/featured-posts-list';
import PostsList from 'components/pages/blog/posts-list';
import { getAllWpPosts } from 'utils/api-posts';

export default async function BlogPage() {
  const nodes = await getAllWpPosts();
  const featuredPosts = nodes.slice(0, 5);

  return (
    <div className="col-span-8 col-start-3 -mx-[30px] grid gap-y-20">
      <FeaturedPostsList posts={featuredPosts} />
      <PostsList title="Community" posts={nodes} alignment="right" />
      <PostsList title="Company" posts={nodes} alignment="left" />
    </div>
  );
}

export const revalidate = 60;
