import Branching from 'components/pages/multi-tb/branching';
import Hero from 'components/pages/multi-tb/hero';
import HighAvailability from 'components/pages/multi-tb/high-availability';
import PeakDemand from 'components/pages/multi-tb/peak-demand';
import SubHero from 'components/pages/multi-tb/sub-hero';
import TestReliably from 'components/pages/multi-tb/test-reliably';
import CTA from 'components/shared/cta';
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
    <CTA
      className="pb-[302px] pt-[392px] xl:pb-[252px] xl:pt-[349px] lg:pb-[183px] lg:pt-[257px] md:pb-[150px] md:pt-[142px]"
      title="The Postgres of tomorrow, available today"
      titleClassName="max-w-[760px] leading-none xl:max-w-[640px] lg:max-w-[550px] md:max-w-[320px] xl:text-[56px] xl:!tracking-[-0.03em] lg:text-[48px] md:text-pretty md:text-[40px]"
      buttonText="Book a meeting with our team"
      buttonUrl={LINKS.contactSales}
      buttonClassName="mt-8 h-12 px-6 min-w-[144px] text-[16px] xl:mt-8 xl:px-[26px] lg:mt-[26px] md:mt-6 md:h-11 md:px-6"
    />
  </Layout>
);

export default MultiTBPage;
