import ContactUs from 'components/pages/scalable-architecture/contact-us';
import Hero from 'components/pages/scalable-architecture/hero';
import Cta from 'components/shared/cta';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({ ...SEO_DATA.scalableArchitecture, robotsNoindex: 'noindex' });

const ScalableArchitecturePage = () => (
  <Layout>
    <Hero />
    <ContactUs />
    <Cta
      className="pb-[245px] pt-[350px] xl:pb-[164px] xl:pt-[254px] lg:pb-[129px] lg:pt-[200px] sm:pb-[110px] sm:pt-[116px]"
      title="Get started with Neon"
      titleClassName="!text-[56px] !tracking-tighter xl:!text-5xl lg:!text-4xl xs:!text-[32px]"
      buttonClassName="mt-11 h-12 w-[188px] xl:mt-9 lg:mt-7 lg:h-11 lg:w-[186px] lg:text-base lg:mt-[18px] md:mt-4.5 md:h-10 md:w-[183px] xs:text-sm xs:tracking-tighter"
      buttonText="Create an account"
      buttonUrl={LINKS.scaleTrial}
    />
  </Layout>
);

export default ScalableArchitecturePage;
