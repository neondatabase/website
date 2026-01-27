import Connections from 'components/pages/about/connections';
import Developers from 'components/pages/about/developers';
import Hero from 'components/pages/about/hero';
import Leadership from 'components/pages/about/leadership';
import Timeline from 'components/pages/about/timeline';
import Vision from 'components/pages/about/vision';
import CtaNew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.aboutUs);

const AboutUsPage = () => (
  <Layout>
    <Hero />
    <Timeline />
    <Leadership />
    <div className="h-[100px]" />
    <Vision />
    <Developers />
    <Connections />
    <CtaNew
      title="Still have questions? Get in touch."
      description="Get personalized guidance from our team — we’ll help you quickly find the right solution."
      buttonText="Talk to Sales"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default AboutUsPage;
