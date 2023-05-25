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
    <div className="bg-gray-new-8 pt-32 xl:pt-[108px] lt:pt-[68px] lg:pt-0">
      <Container className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lt:gap-x-4" size="lg">
        <Sidebar />
        <div className="relative col-span-10 col-start-3 -mx-8 grid max-w-[1220px] gap-y-20 pb-40 before:absolute before:-top-px before:left-1/2 before:hidden before:h-px before:w-screen before:-translate-x-1/2 before:bg-gray-new-20 2xl:mx-0 2xl:pl-16 xl:gap-y-16 xl:pb-32 lt:col-span-full lt:pl-0 lt:pt-10 lt:before:block lg:gap-y-10 lg:pb-28 md:pb-20">
          {children}
        </div>
      </Container>
    </div>
    <Communities />
  </Layout>
);

export default BlogPageLayout;
