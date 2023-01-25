import Hero from 'components/pages/contact-sales/hero';
import Layout from 'components/shared/layout';

const ContactSales = () => (
  <Layout headerTheme="black" footerTheme="black" footerWithTopBorder>
    <Hero />
  </Layout>
);

export default ContactSales;

export const revalidate = 60;
