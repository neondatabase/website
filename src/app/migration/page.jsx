import CardsSupport from 'components/pages/migration/cards-support';
import GridFeatures from 'components/pages/migration/grid-features';
import Hero from 'components/pages/migration/hero';
import Task from 'components/pages/migration/task';
import TaskSteps from 'components/pages/migration/tasks-steps';
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
    <Task />
    <TaskSteps />
    <CardsSupport />
    <GridFeatures />
    <TestimonialNew
      className="pt-[185px] xl:pt-[161px] lg:pt-[136px] md:pt-[97px]"
      quote="Neon worked out of the box, handling hundreds of Lambdas without any of the connection issues we saw in Aurora Serverless v2. On top of that, Neon costs us 1/6 of what we were paying with AWS."
      quoteClassName="max-w-[720px] lg:max-w-[620px] md:max-w-[520px]"
      author={{
        name: 'Cody Jenkins',
        position: 'Head of Engineering at Invenco',
        avatar: authorCodyJenkins,
      }}
    />
    <CTA
      className="pb-[298px] pt-[296px] xl:pb-[259px] xl:pt-[250px] lg:pb-[186px] lg:pt-[182px] md:pb-[171px] md:pt-[157px]"
      title="18K+ databases created daily"
      titleClassName="max-w-[560px] leading-none xl:max-w-[500px] lg:max-w-[400px] md:max-w-[320px] xl:text-[56px] xl:leading-[90%] xl:tracking-[-0.03em] lg:text-[48px] lg:leading-[90%] md:text-balance md:text-[40px]"
      buttonText="Get Started"
      buttonUrl={LINKS.getStarted}
      buttonClassName="mt-[32px] h-12 px-12 min-w-[144px] text-[16px] xl:mt-8 xl:px-11 lg:mt-7 md:mt-6 md:h-12 md:px-10 md:min-w-auto"
    />
  </Layout>
);

export default MigrationPage;
