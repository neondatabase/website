import Compliance from 'components/pages/security/compliance';
import Features from 'components/pages/security/features';
import Hero from 'components/pages/security/hero';
import Privacy from 'components/pages/security/privacy';
import SubProcessors from 'components/pages/security/sub-processors';
import TrustCenter from 'components/pages/security/trust-center';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
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
      title="The Postgres of tomorrow, <br class='xs:hidden' /> available today"
      buttonText="Book a meeting with our team"
      buttonUrl={LINKS.contactSales}
      buttonType="aiHelper"
    />
  </Layout>
);

export default SecurityPage;
