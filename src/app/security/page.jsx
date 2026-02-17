import Compliance from 'components/pages/security/compliance';
import Features from 'components/pages/security/features';
import Hero from 'components/pages/security/hero';
import Privacy from 'components/pages/security/privacy';
import SubProcessors from 'components/pages/security/sub-processors';
import TrustCenter from 'components/pages/security/trust-center';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.security);

const SecurityPage = () => (
  <Layout>
    <Hero />
    <Compliance />
    <Privacy />
    <TrustCenter />
    <SubProcessors />
    <Features />
    <CTANew
      label="ASK AI"
      title="Still have questions? Ask our AI. <br class='xs:hidden' />"
      description="It knows Neon inside and out."
      buttonText="Get Answers"
      buttonType="aiHelper"
    />
  </Layout>
);

export default SecurityPage;
