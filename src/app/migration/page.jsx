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
import authorTejasSiripurapu from 'images/authors/tejas-siripurapu.jpg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.migration);

const MigrationPage = () => (
  <Layout>
    <Hero />
    <Task />
    <TaskSteps />
    <CardsSupport />
    <TestimonialNew
      className="pt-[185px] xl:pt-[161px] lg:pt-[136px] md:pt-[97px]"
      quote="Database migrations are always a headache, but the Neon team made it a smooth process. Their support helped us troubleshoot performance issues and get everything running fast"
      quoteClassName="max-w-[670px] lg:max-w-[620px] md:max-w-[520px]"
      author={{
        name: 'Tejas Siripurapu',
        position: 'Founding Engineer at Vapi.ai',
        avatar: authorTejasSiripurapu,
      }}
    />
    <GridFeatures />
    <CTA
      className="pb-[298px] pt-[296px] xl:pb-[259px] xl:pt-[250px] lg:pb-[186px] lg:pt-[182px] md:pb-[171px] md:pt-[157px]"
      title="18K+ databases created daily"
      titleClassName="max-w-[560px] leading-none xl:max-w-[500px] lg:max-w-[400px] md:max-w-[320px] xl:text-[56px] xl:leading-[90%] xl:tracking-[-0.03em] lg:text-[48px] lg:leading-[90%] md:text-balance md:text-[40px]"
      buttonText="Meet with our team"
      buttonUrl={LINKS.contactSales}
      buttonClassName="mt-[32px] h-12 px-12 min-w-[144px] text-[16px] xl:mt-8 xl:px-11 lg:mt-7 md:mt-6 md:h-12 md:px-10 md:min-w-auto"
    />
  </Layout>
);

export default MigrationPage;
