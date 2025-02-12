import Sidebar from 'components/pages/blog/sidebar';
import Container from 'components/shared/container';
import { getAllCategories } from 'utils/api-wp';

// eslint-disable-next-line react/prop-types
const BlogPageLayout = async ({ children }) => {
  const categories = await getAllCategories();

  return (
    <div className="safe-paddings pb-24 pt-16 lg:pb-20 lg:pt-12 sm:pb-16 sm:pt-10">
      <Container className="flex flex-col" size="1344">
        <div className="flex gap-8 pl-16 xl:gap-6 xl:pl-0 lg:flex-col lg:gap-0">
          <Sidebar
            className="mt-[88px] w-[192px] shrink-0 lg:top-[72px] lg:mb-10 lg:mt-0 lg:min-h-fit lg:w-full md:top-[60px] md:mb-8"
            categories={categories}
          />
          <div className="w-full max-w-3xl lg:max-w-full">{children}</div>
        </div>
      </Container>
    </div>
  );
};

export default BlogPageLayout;
