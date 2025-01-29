import Sidebar from 'components/pages/blog/sidebar';
import Container from 'components/shared/container';
import { getAllCategories } from 'utils/api-posts';

// eslint-disable-next-line react/prop-types
const BlogPageLayout = async ({ children }) => {
  const categories = await getAllCategories();

  return (
    <div className="safe-paddings pb-24 pt-16 lg:pb-20 lg:pt-12 sm:pb-16 sm:pt-10">
      <Container className="flex flex-col" size="1344">
        <div className="mb-16 flex flex-col justify-center text-center lg:mb-12 md:mb-8">
          <h1 className="font-title text-[68px] font-medium leading-none tracking-extra-tight xl:text-[56px] lg:text-5xl md:text-4xl">
            What's new?
          </h1>
          <p className="mt-3 text-xl tracking-extra-tight text-gray-new-80 lg:text-lg md:text-base">
            Discover our newest features, product updates, and technical improvements.
          </p>
        </div>
        <div className="flex gap-8 pl-16 xl:gap-6 xl:pl-0 lg:flex-col lg:gap-0">
          <Sidebar categories={categories} />
          <div className="relative max-w-3xl lg:max-w-full">{children}</div>
        </div>
      </Container>
    </div>
  );
};

export default BlogPageLayout;
