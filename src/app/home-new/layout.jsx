import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const HomeLayout = ({ children }) => (
  <Layout isHeaderSticky isHeaderStickyOverlay>
    {children}
  </Layout>
);

export default HomeLayout;
