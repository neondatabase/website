import Branching from 'components/pages/multi-tb/branching';
import Hero from 'components/pages/multi-tb/hero';
import HighAvailability from 'components/pages/multi-tb/high-availability';
import PeakDemand from 'components/pages/multi-tb/peak-demand';
import SubHero from 'components/pages/multi-tb/sub-hero';
import TestReliably from 'components/pages/multi-tb/test-reliably';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
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
      label="ASK AI"
      title="Still have questions? Ask our AI. <br class='xs:hidden' />"
      description="It knows Neon inside and out."
      buttonText="Get Answers"
      buttonType="aiHelper"
    />
  </Layout>
);

export default MultiTBPage;
