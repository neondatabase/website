import Hero from 'components/pages/startups/hero';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.startups);

const ContactSales = () => (
  <Layout>
    <Hero />
  </Layout>
);

export default ContactSales;
