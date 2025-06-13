import Features from 'components/pages/startups/features';
import Hero from 'components/pages/startups/hero';
import Info from 'components/pages/startups/info';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.startups);

const ContactSales = () => (
  <Layout>
    <Hero />
    <Info />
    <Features />
    <CTA
      className="pb-[290px] pt-[348px] xl:pb-[242px] xl:pt-[278px] lg:pb-[200px] lg:pt-[260px] sm:pb-[100px] sm:pt-40"
      title="Need help deciding?"
      buttonText="Let’s Talk"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default ContactSales;
