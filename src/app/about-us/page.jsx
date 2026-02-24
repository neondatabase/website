import Connections from 'components/pages/about/connections';
import Developers from 'components/pages/about/developers';
import Hero from 'components/pages/about/hero';
import Timeline from 'components/pages/about/timeline';
import Vision from 'components/pages/about/vision';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.aboutUs);

const AboutUsPage = () => (
  <Layout>
    <Hero />
    <Timeline />
    <Vision />
    <Developers />
    <Connections />
    <CTANew
      className="mt-0 max-h-[558px] overflow-hidden 3xl:max-w-none"
      imageClassName="-translate-y-12 3xl:-translate-y-0"
      title="Become a part of our&nbsp;team."
      description="We're looking for people who care deeply about quality to build with us."
      label="Join Databricks"
      buttonText="View open roles at Databricks"
      buttonUrl={LINKS.careers}
      labelIcon="databricks"
    />
  </Layout>
);

export default AboutUsPage;
