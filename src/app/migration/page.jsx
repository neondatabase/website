import CardsSupport from 'components/pages/migration/cards-support';
import GridFeatures from 'components/pages/migration/grid-features';
import Hero from 'components/pages/migration/hero';
import TaskStepSimple from 'components/pages/migration/task-step-simple';
import TaskStep from 'components/pages/migration/tasks-steps';
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
    <TaskStepSimple />
    <TaskStep />
    <CardsSupport />
    <GridFeatures />
    <TestimonialNew
      className="mt-[182px] xl:mt-[176px] lg:mt-[152px] md:mt-[104px]"
      quote="Neon worked out of the box, handling hundreds of Lambdas without any of the connection issues we saw in Aurora Serverless v2. On top of that, Neon costs us 1/6 of what we were paying with AWS."
      quoteClassName="max-w-[720px] lg:max-w-[620px] md:max-w-[520px]"
      author={{
        name: 'Cody Jenkins',
        position: 'Head of Engineering at Invenco',
        avatar: authorCodyJenkins,
      }}
    />
    <CTA
      className="pb-[290px] pt-[296px] xl:pb-[242px] xl:pt-[278px] lg:pb-[200px] lg:pt-[260px] sm:pb-[100px] sm:pt-40"
      title="18K+ databases created daily"
      titleClassName="max-w-[560px] leading-none lg:max-w-[400px] md:max-w-[320px]"
      buttonText="Get Started"
      buttonUrl={LINKS.getStarted}
      buttonClassName="mt-[32px] h-12 px-12 min-w-[144px] text-[16px] xl:mt-8 lg:mt-7 sm:mt-5 sm:h-10"
    />
  </Layout>
);

export default MigrationPage;
