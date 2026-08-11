import ClaimablePostgres from 'components/pages/claimable-postgres/claimable-postgres';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.claimablePostgres);

const ClaimablePostgresPage = () => (
  <Layout>
    <ClaimablePostgres />
  </Layout>
);

export default ClaimablePostgresPage;
