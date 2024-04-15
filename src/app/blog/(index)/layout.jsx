import Communities from 'components/pages/blog/communities';
import Sidebar from 'components/pages/blog/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { getAllWpBlogCategories } from 'utils/api-posts';

// eslint-disable-next-line react/prop-types
const BlogPageLayout = async ({ children }) => {
  const categories = await getAllWpBlogCategories();

  return (
    <Layout
      className="bg-black-pure text-white"
      headerTheme="black-pure"
      footerTheme="black-pure"
      isBlogPage
      isHeaderSticky
    >
      <div className="safe-paddings pt-16 lt:pt-0">
        <Container className="flex lt:flex-col" size="1344">
          <Sidebar categories={categories} />
          <div className="grow-1 relative grid gap-y-20 pb-40 2xl:pl-16 xl:gap-y-16 xl:pb-32 lt:pl-0 lt:pt-8 lg:gap-y-20 lg:pb-28 md:pb-20">
            {children}
          </div>
        </Container>
      </div>
      <Communities />
    </Layout>
  );
};

export default BlogPageLayout;
