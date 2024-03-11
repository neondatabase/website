import Logos from 'components/pages/home/logos';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.index);

const Home = () => (
  <Layout className="bg-black" headerTheme="black" footerWithTopBorder withOverflowHidden>
    <Logos />
  </Layout>
);

export default Home;

export const revalidate = 60;
