import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const HomeLayout = ({ children }) => (
  <Layout
    className="bg-black-pure"
    headerClassName="!bg-transparent lg:!absolute"
    headerTheme="black-pure"
    footerTheme="black-pure"
    withOverflowHidden
  >
    {children}
  </Layout>
);

export default HomeLayout;

export const revalidate = 60;
