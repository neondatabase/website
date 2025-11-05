import AI from 'components/pages/home-new/ai';
import AutoScaling from 'components/pages/home-new/auto-scaling';
import BackedByGiants from 'components/pages/home-new/backed-by-giants';
import Cta from 'components/pages/home-new/cta';
import Hero from 'components/pages/home-new/hero';
import InstantBranching from 'components/pages/home-new/instant-branching';
import ProductionGradeFeatures from 'components/pages/home-new/production-grade-features';
import RealWorldPerfomance from 'components/pages/home-new/real-world-perfomance';
import SectionsWithToc from 'components/pages/home-new/sections-with-toc/sections-with-toc';
import SpeedAndScale from 'components/pages/home-new/speed-and-scale';
import JsonLd from 'components/shared/json-ld';
import SEO_DATA from 'constants/seo-data';
import { generateOrganizationSchema } from 'lib/schema';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.index);

const Homepage = () => {
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <JsonLd data={organizationSchema} />
      <Hero />
      <SectionsWithToc>
        <AI />
        <AutoScaling />
        <InstantBranching />
        <RealWorldPerfomance />
        <ProductionGradeFeatures />
      </SectionsWithToc>
      <SpeedAndScale />
      <BackedByGiants />
      <Cta />
    </>
  );
};

export default Homepage;

export const revalidate = false;
