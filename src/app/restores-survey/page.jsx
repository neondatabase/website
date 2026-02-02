import Hero from 'components/pages/report/hero';
import KeyInsights from 'components/pages/report/key-insights';
import RecoverySolution from 'components/pages/report/recovery-solution';
import RecoveryStories from 'components/pages/report/recovery-stories';
import RecoveryTime from 'components/pages/report/recovery-time';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.report);

const ReportPage = () => (
  <Layout>
    <Hero />
    <KeyInsights />
    <RecoveryStories />
    <RecoveryTime />
    <RecoverySolution />
    <CTANew
      title="Wanna meet us?"
      buttonText="Book a meeting with our team"
      buttonUrl={LINKS.contactSales}
      buttonType="aiHelper"
    />
  </Layout>
);

export default ReportPage;
