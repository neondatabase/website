import Hero from 'components/pages/cost-fleets/hero';
import Cta from 'components/shared/get-started';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.costFleets);

const CostFleetsPage = async () => (
  <Layout headerWithBorder burgerWithoutBorder isHeaderSticky>
    <Hero />
    <Cta
      title="Try it yourself"
      description="You can experiment with autoscaling for free during 14 days"
      button={{
        title: 'Request a Scale trial',
        url: LINKS.scaleTrial,
      }}
      size="sm"
    />
  </Layout>
);

export default CostFleetsPage;

export const revalidate = 60;
