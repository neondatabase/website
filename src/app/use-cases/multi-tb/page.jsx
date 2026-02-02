import Branching from 'components/pages/multi-tb/branching';
import Hero from 'components/pages/multi-tb/hero';
import HighAvailability from 'components/pages/multi-tb/high-availability';
import PeakDemand from 'components/pages/multi-tb/peak-demand';
import SubHero from 'components/pages/multi-tb/sub-hero';
import TestReliably from 'components/pages/multi-tb/test-reliably';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.multiTB);

const MultiTBPage = () => (
  <Layout>
    <Hero />
    <SubHero />
    <Branching />
    <PeakDemand />
    <TestReliably />
    <HighAvailability />
    <CTANew
      title="The Postgres of tomorrow, <br class='xs:hidden' /> available today"
      buttonText="Book a meeting with our team"
      buttonUrl={LINKS.contactSales}
      buttonType="aiHelper"
    />
  </Layout>
);

export default MultiTBPage;
