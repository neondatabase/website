import CardsSupport from 'components/pages/migration/cards-support';
import Hero from 'components/pages/migration/hero';
import Task from 'components/pages/migration/task';
import TaskSteps from 'components/pages/migration/tasks-steps';
import CTA from 'components/shared/cta';
import GridFeatures from 'components/shared/grid-features';
import Layout from 'components/shared/layout';
import TestimonialNew from 'components/shared/testimonial-new';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import costEffective from 'icons/migration/grid-features/cost-effective.svg';
import developerFriendly from 'icons/migration/grid-features/developer-friendly.svg';
import easy from 'icons/migration/grid-features/easy.svg';
import fullyManaged from 'icons/migration/grid-features/fully-managed.svg';
import reliability from 'icons/migration/grid-features/reliability.svg';
import serverlessAutoscaling from 'icons/migration/grid-features/serverless-autoscaling.svg';
import authorTejasSiripurapu from 'images/authors/tejas-siripurapu.jpg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.migration);

const MIGRATION_FEATURES_ITEMS = [
  {
    title: 'Easy',
    description: 'Simplify the life of developers with a serverless consumption model.',
    icon: easy,
  },
  {
    title: 'Reliability',
    description: 'S3 durability, multi-AZ redundancy, and point-in-time recovery.',
    icon: reliability,
  },
  {
    title: 'Cost-effective',
    description: 'With pay-as-you-go pricing that ties costs directly to usage.',
    icon: costEffective,
  },
  {
    title: 'Fully managed',
    description: 'Neon handles all database tasks — backups, updates, failovers.  ',
    icon: fullyManaged,
  },
  {
    title: 'Serverless & Autoscaling',
    description: 'Handles spiky workloads without intervention or overprovisioning.',
    icon: serverlessAutoscaling,
  },
  {
    title: 'Developer-friendly',
    description: 'Features like branching allows teams to automate tasks via CI/CD.',
    icon: developerFriendly,
  },
];

const MigrationPage = () => (
  <Layout>
    <Hero />
    <Task />
    <TaskSteps />
    <CardsSupport />
    <TestimonialNew
      className="pt-[185px] xl:pt-[161px] lg:pt-[136px] md:pt-[97px]"
      quote="Database migrations are always a headache, but the Neon team made it a smooth process. Their support helped us troubleshoot performance issues and get everything running fast."
      quoteClassName="max-w-[670px] lg:max-w-[620px] md:max-w-[570px] sm:max-w-[300px] sm:mx-auto"
      author={{
        name: 'Tejas Siripurapu',
        position: 'Founding Engineer at Vapi.ai',
        avatar: authorTejasSiripurapu,
      }}
    />
    <GridFeatures
      className="mt-[185px] xl:mt-[162px] lg:mt-[136px] md:mt-[96px]"
      title="Why teams migrate to Neon"
      titleClassName="md:text-balance"
      headerClassName="max-w-[640px] lg:max-w-[560px] md:max-w-[500px]"
      ulClassName="!xl:max-w-[832px] xl:grid-cols-3 lg:mx-16"
      containerSize="960"
      description="Neon provides a serverless, fully managed Postgres built for modern development — fast, reliable, and cost-effective."
      items={MIGRATION_FEATURES_ITEMS}
    />
    <CTA
      className="pb-[298px] pt-[296px] xl:pb-[259px] xl:pt-[250px] lg:pb-[186px] lg:pt-[182px] md:pb-[171px] md:pt-[157px]"
      title="18K+ databases created daily"
      titleClassName="max-w-[560px] leading-none xl:max-w-[500px] lg:max-w-[400px] md:max-w-[320px] xl:text-[56px] xl:leading-[90%] xl:tracking-[-0.03em] lg:text-[48px] lg:leading-[90%] md:text-balance md:text-[40px]"
      buttonText="Meet with our team"
      buttonUrl={LINKS.contactSales}
      buttonClassName="mt-[32px] h-12 px-6 min-w-[144px] text-[16px] xl:mt-8 xl:px-11 lg:mt-7 md:mt-6 md:h-12 md:px-10 md:min-w-auto"
    />
  </Layout>
);

export default MigrationPage;
