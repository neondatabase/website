import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const FunctionTemplatesLayout = ({ children }) => (
  <Layout className="bg-black-pure" isHeaderSticky>
    {children}
  </Layout>
);

export default FunctionTemplatesLayout;
