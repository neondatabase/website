import Hero from 'components/pages/report/hero';
import KeyInsights from 'components/pages/report/key-insights';
import RecoverySolution from 'components/pages/report/recovery-solution';
import RecoveryStories from 'components/pages/report/recovery-stories';
import RecoveryTime from 'components/pages/report/recovery-time';
import CTA from 'components/shared/cta';
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
    <CTA
      className="pb-[328px] pt-[380px] xl:pb-[242px] xl:pt-[278px] lg:pb-[200px] lg:pt-[260px] sm:pb-[100px] sm:pt-40"
      title="Wanna meet us?"
      titleClassName="font-title !text-[72px] max-w-[745px] lg:max-w-[600px] md:max-w-[400px] md:leading-none"
      buttonText="Book a meeting with our team"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default ReportPage;
