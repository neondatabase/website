import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const BlogLayout = async ({ children }) => (
  <Layout
    headerTheme="dark"
    searchIndexName={process.env.NEXT_PUBLIC_ALGOLIA_BLOG_INDEX_NAME}
    showSearchInput
    isHeaderSticky
    headerWithBorder
  >
    {children}
  </Layout>
);

export default BlogLayout;
