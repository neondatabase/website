import Hero from 'components/pages/tools/hero';
import MigrationMethods from 'components/pages/tools/migration-methods';
import UpgradeAssessment from 'components/pages/tools/upgrade-assessment';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.tools);

const ToolsPage = () => (
  <Layout>
    <Hero />
    <UpgradeAssessment />
    <MigrationMethods />
    <CTANew
      className="mt-40 xl:mt-32 lg:mt-26 md:mt-20"
      copyWrapperClassName="max-w-208"
      label="Get started"
      title="Ready to move your database forward?"
      description="Assess your next Postgres upgrade or find the migration path that best fits your database and workload."
      buttonText="Explore Neon tools"
      buttonUrl="#neon-tools"
    />
  </Layout>
);

export default ToolsPage;
