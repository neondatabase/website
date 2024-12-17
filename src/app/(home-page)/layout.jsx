import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const HomeLayout = ({ children }) => (
  <Layout isHeaderSticky isHeaderStickyOverlay withOverflowHidden headerWithBorder>
    {children}
  </Layout>
);

export default HomeLayout;
