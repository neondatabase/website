import GithubRegistrationStep from 'components/pages/deploy/github-registration-step';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.generateTicket);

const GenerateTicketPage = () => (
  <Layout>
    <link
      rel="preload"
      crossOrigin="anonymous"
      href="/fonts/kallisto/kallisto-light.woff2"
      as="font"
      type="font/woff2"
    />
    <Container
      className="relative mx-auto grid flex-grow grid-cols-12 gap-10 py-20 2xl:px-14 xl:h-[-webkit-fill-available] xl:grid-cols-1 xl:px-11 xl:py-11 lg:gap-y-8 lg:px-8 lg:py-9 md:gap-y-7 md:px-4 md:pb-20 md:pt-5"
      size="1344"
    >
      <GithubRegistrationStep />
    </Container>
  </Layout>
);

export default GenerateTicketPage;
