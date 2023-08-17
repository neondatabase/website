import Cli from 'components/pages/aws/cli';
import Features from 'components/pages/aws/features';
import Hero from 'components/pages/aws/hero';
import Regions from 'components/pages/aws/regions';
import Layout from 'components/shared/layout';
import Testimonial from 'components/shared/testimonial';

const AWSPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <Features />
    <Cli />
    <Regions />
    <Testimonial
      className="mt-40"
      quote="The combination of flexible resource limits and nearly instant database provisioning made Neon a no-brainer."
      name="Lincoln Bergeson"
      position="Infrastructure Engineer at Replit"
    />
  </Layout>
);

export default AWSPage;
