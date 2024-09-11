import AgendaTable from 'components/pages/deploy/agenda-table';
import EmailRegistrationStep from 'components/pages/deploy/email-registration-step';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.deploy);

const DeployPage = () => (
  <Layout>
    <link
      rel="preload"
      crossOrigin="anonymous"
      href="/videos/deploy/deploy-video.webm"
      as="video"
    />
    <link rel="preload" crossOrigin="anonymous" href="/videos/deploy/deploy-video.mp4" as="video" />
    <section className="overflow-hidden">
      <Container
        className="relative 2xl:px-14 xl:px-11 xl:py-11 lg:px-8 lg:py-9 md:px-4 md:py-4"
        size="lg"
      >
        <EmailRegistrationStep />
      </Container>
    </section>
    <AgendaTable />
  </Layout>
);

export default DeployPage;
