import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const NewHomeLayout = ({ children }) => (
  <Layout isHeaderSticky isHeaderStickyOverlay headerWithBorder>
    {children}
  </Layout>
);

export default NewHomeLayout;
