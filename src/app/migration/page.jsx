import Hero from 'components/pages/migration/hero';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import TestimonialNew from 'components/shared/testimonial-new';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import authorCodyJenkins from 'images/authors/cody-jenkins.jpg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.migration);

const MigrationPage = () => (
  <Layout>
    <Hero />
    <TestimonialNew
      className="mt-[200px] xl:mt-[176px] lg:mt-[152px] md:mt-[104px]"
      quote="Neon worked out of the box, handling hundreds of Lambdas without any of the connection issues we saw in Aurora Serverless v2. On top of that, Neon costs us 1/6 of what we were paying with AWS."
      author={{
        name: 'Cody Jenkins',
        position: 'Head of Engineering at Invenco',
        avatar: authorCodyJenkins,
      }}
    />
    <CTA
      className="pb-[290px] pt-[348px] xl:pb-[242px] xl:pt-[278px] lg:pb-[200px] lg:pt-[260px] sm:pb-[100px] sm:pt-40"
      title="18K+ databases created daily"
      titleClassName="max-w-[670px] lg:max-w-[600px] md:max-w-[400px] md:leading-none"
      buttonText="Get Started"
      buttonUrl={LINKS.getStarted}
    />
  </Layout>
);

export default MigrationPage;
