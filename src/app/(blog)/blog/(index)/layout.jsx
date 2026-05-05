import BlogLayout from 'components/pages/blog/blog-layout';
import { DEFAULT_BLOG_ROUTE_CONFIG } from 'constants/blog';
import { getAllCategories } from 'utils/api-blog';

// eslint-disable-next-line react/prop-types
const BlogPageLayout = async ({ children }) => {
  const categories = await getAllCategories();

  return (
    <BlogLayout categories={categories} routeConfig={DEFAULT_BLOG_ROUTE_CONFIG}>
      {children}
    </BlogLayout>
  );
};

export default BlogPageLayout;
