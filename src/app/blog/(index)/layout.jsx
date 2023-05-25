import Communities from 'components/pages/blog/communities';
import Sidebar from 'components/pages/blog/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const BlogPageLayout = ({ children }) => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="gray-8"
    footerTheme="black-new"
    headerWithBottomBorder
    footerWithTopBorder
  >
    <h1 className="sr-only">Blog</h1>
    <div className="bg-gray-new-8 pb-40 pt-32 xl:pb-32 lt:pt-[68px] lg:pb-28 lg:pt-0 md:pb-20">
      <Container className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lt:gap-x-4" size="lg">
        <Sidebar />
        <div className="relative col-span-10 col-start-3 -mx-8 grid max-w-[1220px] gap-y-20 before:absolute before:-top-px before:left-1/2 before:hidden before:h-px before:w-screen before:-translate-x-1/2 before:bg-gray-new-20 2xl:mx-0 xl:gap-y-12 lt:col-span-full lt:pt-10 lt:before:block lg:gap-y-10">
          {children}
        </div>
      </Container>
    </div>
    <Communities />
  </Layout>
);

export default BlogPageLayout;
