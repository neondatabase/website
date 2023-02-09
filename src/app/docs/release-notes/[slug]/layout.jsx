import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const ReleaseNoteLayout = ({ children }) => (
  <Layout headerTheme="white" footerWithTopBorder isDocPage>
    {children}
  </Layout>
);

export default ReleaseNoteLayout;
