import AgendaTable from 'components/pages/deploy/agenda-table';
import EmailRegistrationStep from 'components/pages/deploy/email-registration-step';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.deploy);

const DeployPage = () => (
  <Layout>
    <div className="relative mx-auto w-full max-w-[1760px] 2xl:px-14 xl:px-11 xl:py-11 lg:px-8 lg:py-9 md:px-4 md:py-4">
      <EmailRegistrationStep />
    </div>
    <AgendaTable />
  </Layout>
);

export default DeployPage;
