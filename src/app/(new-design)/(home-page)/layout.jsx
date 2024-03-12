import Bento from 'components/pages/home/bento';
import Lightning from 'components/pages/home/lightning';
import Logos from 'components/pages/home/logos';
import Layout from 'components/shared/layout';

const HomeLayout = () => (
  <Layout className="bg-black-full" headerTheme="black" footerWithTopBorder withOverflowHidden>
    <Logos />
    <Lightning />
    <Bento />
  </Layout>
);

export default HomeLayout;

export const revalidate = 60;
