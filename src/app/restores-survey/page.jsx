import Hero from 'components/pages/report/hero';
import KeyInsights from 'components/pages/report/key-insights';
import RecoverySolution from 'components/pages/report/recovery-solution';
import RecoveryStories from 'components/pages/report/recovery-stories';
import RecoveryTime from 'components/pages/report/recovery-time';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
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
      label="ASK AI"
      title="Still have questions? Ask our AI. <br class='xs:hidden' />"
      description="It knows Neon inside and out."
      buttonText="Get Answers"
      buttonType="aiHelper"
    />
  </Layout>
);

export default ReportPage;
