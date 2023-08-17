import Cli from 'components/pages/aws/cli';
import Features from 'components/pages/aws/features';
import Hero from 'components/pages/aws/hero';
import Partners from 'components/pages/aws/partners';
import Regions from 'components/pages/aws/regions';
import CTAWithElephant from 'components/shared/cta-with-elephant';
import Layout from 'components/shared/layout';
import Testimonial from 'components/shared/testimonial';
import LINKS from 'constants/links';

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
    <Partners />
    <CTAWithElephant
      className="mt-40"
      label="Coming soon"
      labelTheme="gray"
      title="Try out Neon in Israel region"
      description="We are delighted to include the new Tel Aviv AWS region in the list of regions where Neon is available."
      buttonText="Sign up"
      buttonLink={LINKS.signup}
      linkText="Learn more about AWS"
      // @TODO: add link
      linkUrl="/"
    />
  </Layout>
);

export default AWSPage;
