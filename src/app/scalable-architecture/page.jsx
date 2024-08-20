import Hero from 'components/pages/scalable-architecture/hero';
import Cta from 'components/shared/cta';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.pricing);

const ScalableArchitecturePage = () => (
  <Layout>
    <Hero />
    <Cta
      className="pb-[234px] pt-[350px] xl:py-[230px] lg:pb-[156px] lg:pt-[179px] sm:pb-[110px] sm:pt-[116px]"
      title="Get started with Neon"
      description="Tell us more about your use case — we're happy to assist you."
      buttonClassName="mt-9 h-12 w-[188px] lg:mt-7 lg:h-11 lg:w-[186px] lg:text-sm md:mt-4.5 md:h-10 md:w-[183px]"
      buttonText="Request a free trial"
      buttonUrl={LINKS.scaleTrial}
    />
  </Layout>
);

export default ScalableArchitecturePage;
