import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const BlogLayout = async ({ children }) => (
  <Layout showSearchInput isHeaderSticky headerWithBorder>
    {children}
  </Layout>
);

export default BlogLayout;
