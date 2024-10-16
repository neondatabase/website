import GithubRegistrationStep from 'components/pages/deploy/github-registration-step';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.generateTicket);

const GenerateTicketPage = () => (
  <Layout>
    <link rel="preload" crossOrigin="anonymous" href="/images/deploy/deploy-0.jpg" as="image" />
    <link
      rel="preload"
      crossOrigin="anonymous"
      href="/fonts/kallisto/kallisto-light.woff2"
      as="font"
      type="font/woff2"
    />
    <section className="overflow-hidden">
      <Container
        className="relative mx-auto grid flex-grow grid-cols-12 gap-10 pb-[176px] pt-40 xl:h-[-webkit-fill-available] xl:grid-cols-1 xl:pb-11 xl:pt-28 lg:gap-y-8 lg:pb-9 lg:pt-10 md:gap-y-7 md:pb-20 md:pt-6"
        size="1344"
      >
        <GithubRegistrationStep />
      </Container>
    </section>
  </Layout>
);

export default GenerateTicketPage;
