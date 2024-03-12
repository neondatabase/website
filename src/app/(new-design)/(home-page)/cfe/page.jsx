import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  ...SEO_DATA.index,
  robotsNoindex: 'noindex',
});

const CodingForEntrepreuneursPage = () => null;

export default CodingForEntrepreuneursPage;

export const revalidate = 60;
