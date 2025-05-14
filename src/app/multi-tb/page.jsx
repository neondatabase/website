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
      className="pb-[298px] pt-[398px] xl:pb-[259px] xl:pt-[250px] lg:pb-[186px] lg:pt-[182px] md:pb-[171px] md:pt-[157px]"
      title="The Postgres of tomorrow, available today"
      titleClassName="max-w-[760px] leading-none xl:max-w-[640px] lg:max-w-[550px] md:max-w-[320px] xl:text-[56px] xl:leading-[90%] xl:tracking-[-0.03em] lg:text-[48px] lg:leading-[90%] md:text-balance md:text-[40px]"
      buttonText="Book a meeting with our team"
      buttonUrl={LINKS.contactSales}
      buttonClassName="mt-[32px] h-12 px-6 min-w-[144px] text-[16px] xl:mt-8 xl:px-11 lg:mt-7 md:mt-6 md:h-12 md:px-10 md:min-w-auto"
    />
  </Layout>
);

export default MultiTBPage;
