import Sidebar from 'components/pages/blog/sidebar';
import Container from 'components/shared/container';
import { getAllCategories } from 'utils/api-wp';

// eslint-disable-next-line react/prop-types
const BlogPageLayout = async ({ children }) => {
  const categories = await getAllCategories();

  return (
    <div className="safe-paddings pb-24 pt-16 lg:pb-20 lg:pt-12 sm:pb-16 sm:pt-10">
      <Container className="flex flex-col" size="1344">
        <div className="flex gap-[18px] pl-16 xl:gap-3.5 xl:pl-0 lg:flex-col lg:gap-0">
          <Sidebar categories={categories} />
          <div className="w-full max-w-3xl lg:max-w-full">{children}</div>
        </div>
      </Container>
    </div>
  );
};

export default BlogPageLayout;
