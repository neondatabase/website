import FeaturedPosts from 'components/pages/blog/featured-posts';
import Container from 'components/shared/container/container';
import Layout from 'components/shared/layout';
import { getAllWpPosts } from 'utils/api-posts';

export default async function BlogPage() {
  const nodes = await getAllWpPosts();
  const featuredPosts = nodes.slice(0, 5);

  return (
    <Layout
      className="bg-gray-new-8 text-white"
      headerTheme="gray-8"
      footerTheme="black-new"
      headerWithBottomBorder
    >
      <h1 className="sr-only">Blog</h1>
      <div className="mt-32">
        <Container className="grid grid-cols-12 gap-x-10 xl:gap-x-6" size="lg">
          <div className="col-span-10 col-start-2">
            <FeaturedPosts posts={featuredPosts} />
          </div>
        </Container>
      </div>
    </Layout>
  );
}

export const revalidate = 60;
