import Features from 'components/pages/startups/features';
import Hero from 'components/pages/startups/hero';
import Info from 'components/pages/startups/info';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.startups);

const ContactSales = () => (
  <Layout className="overflow-hidden" headerClassName="!bg-transparent">
    <Hero />
    <Info />
    <Features />
  </Layout>
);

export default ContactSales;
