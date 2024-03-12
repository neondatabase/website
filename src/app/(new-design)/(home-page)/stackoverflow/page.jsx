import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  ...SEO_DATA.index,
  robotsNoindex: 'noindex',
});

const StackOverflowPage = () => null;

export default StackOverflowPage;

export const revalidate = 60;
