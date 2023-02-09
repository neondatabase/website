import PostsList from 'components/pages/blog/posts-list';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import { getAllWpPosts } from 'utils/api-posts';

export default async function BlogPage() {
  const nodes = await getAllWpPosts();

  return (
    <Layout headerTheme="white">
      <PostsList items={nodes} />
      <SubscribeMinimalistic />
    </Layout>
  );
}

export const revalidate = 60;
