import Compliance from 'components/pages/security/compliance';
import Features from 'components/pages/security/features';
import Hero from 'components/pages/security/hero';
import Privacy from 'components/pages/security/privacy';
import SubProcessors from 'components/pages/security/sub-processors';
import TrustCenter from 'components/pages/security/trust-center';
import CTA from 'components/shared/cta';
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
    <CTA
      className="pb-[290px] pt-[348px] xl:pb-[242px] xl:pt-[278px] lg:pb-[200px] lg:pt-[260px] sm:pb-[100px] sm:pt-40"
      title="The Postgres of tomorrow, available today"
      titleClassName="max-w-[745px] lg:max-w-[600px] md:max-w-[400px]"
      buttonText="Book a meeting with our team"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default SecurityPage;
