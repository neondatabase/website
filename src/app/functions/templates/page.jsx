import Catalog from 'components/pages/functions/templates/catalog';
import Hero from 'components/pages/functions/templates/hero';
import Container from 'components/shared/container';
import CTANew from 'components/shared/cta-new';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.functionsTemplates);

export const revalidate = 3600;

const FunctionTemplatesPage = () => (
  <>
    <Hero />
    <section className="mt-24 safe-paddings pb-8 xl:mt-20 lg:mt-16 md:mt-12">
      <Container size="1280">
        <Catalog />
      </Container>
    </section>
    <CTANew
      label="Get started"
      title="Deploy your first function"
      description="Create a Neon project, then add a template with the Neon CLI and deploy it to a branch when it works locally."
      buttonText="Read the Functions docs"
      buttonUrl={LINKS.functionsOverview}
      copyWrapperClassName="lg:max-w-[720px] md:max-w-none"
    />
  </>
);

export default FunctionTemplatesPage;
