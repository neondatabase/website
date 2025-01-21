import Sidebar from 'components/pages/blog/sidebar';
import Container from 'components/shared/container';
import { getAllWpBlogCategories } from 'utils/api-posts';

// eslint-disable-next-line react/prop-types
const BlogPageLayout = async ({ children }) => {
  const categories = await getAllWpBlogCategories();

  return (
    <div className="safe-paddings pt-16 lg:pt-12 sm:pt-10">
      <Container className="flex flex-col" size="1344">
        <div className="juctify-center mb-16 flex flex-col text-center lg:mb-12 md:mb-8">
          <h1 className="font-title text-[68px] font-medium leading-none tracking-extra-tight xl:text-[56px] lg:text-5xl md:text-4xl">
            What's new?
          </h1>
          <p className="mt-3 text-xl tracking-extra-tight text-gray-new-80">
            Discover our newest features, product updates, and technical improvements.
          </p>
        </div>
        <div className="flex gap-24 xl:gap-6 lg:flex-col lg:gap-0">
          <Sidebar categories={categories} />
          <div className="grow-1 relative grid gap-y-20 pb-40 xl:gap-y-16 xl:pb-32 lg:gap-y-20 lg:pb-28 lg:pt-8 md:pb-20">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BlogPageLayout;
