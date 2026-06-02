import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const FlowPage = ({ children }) => (
  <Layout isHeaderSticky withOverflowHidden>
    {children}
  </Layout>
);

export default FlowPage;
