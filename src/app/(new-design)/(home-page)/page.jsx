import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.index);

const Home = () => null;

export default Home;

export const revalidate = 60;
