import Cli from 'components/pages/aws-israel/cli';
import Features from 'components/pages/aws-israel/features';
import Hero from 'components/pages/aws-israel/hero';
import Partners from 'components/pages/aws-israel/partners';
import Regions from 'components/pages/aws-israel/regions';
import CTAWithElephant from 'components/shared/cta-with-elephant';
import Layout from 'components/shared/layout';
import Testimonial from 'components/shared/testimonial';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.awsIsrael);

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
      className="mt-40 xl:mt-[120px] lg:mt-28 md:mt-20"
      quote="The combination of flexible resource limits and nearly instant database provisioning made Neon a no-brainer."
      name="Lincoln Bergeson"
      position="Infrastructure Engineer at Replit"
    />
    <Partners />
    <CTAWithElephant
      className="mt-[136px] xl:mt-[104px] lg:mt-20 md:mt-16"
      buttonClassName="px-[78px] xl:px-14"
      title="Try Neon<br/> in the Israel region"
      description="We are delighted to announce that Neon is now available in the new Israel (Tel Aviv) AWS region."
      buttonText="Sign up"
      buttonUrl={LINKS.signup}
      linkText="Learn more about AWS"
      linkUrl="https://aws.amazon.com/local/israel/"
      linkTarget="_blank"
    />
  </Layout>
);

export default AWSPage;
