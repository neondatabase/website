import ClaimableNeon from 'components/pages/claimable-neon/claimable-neon';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.claimableNeon);

const ClaimableNeonPage = () => (
  <Layout>
    <ClaimableNeon />
  </Layout>
);

export default ClaimableNeonPage;
