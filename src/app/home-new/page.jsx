import AutoScaling from 'components/pages/home-new/auto-scaling';
import BackedByGiants from 'components/pages/home-new/backed-by-giants';
import Cta from 'components/pages/home-new/cta';
import GetPostgres from 'components/pages/home-new/get-postgres';
import Hero from 'components/pages/home-new/hero';
import InstantBranching from 'components/pages/home-new/instant-branching';
import ProductionGradeFeatures from 'components/pages/home-new/production-grade-features';
import RealWordPerfomance from 'components/pages/home-new/real-word-perfomance';
import SpeedAndScale from 'components/pages/home-new/speed-and-scale';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.homeNew);

getMetadata({
  ...SEO_DATA.homeNew,
  robotsNoindex: 'noindex',
});

const NewHomepage = () => (
  <>
    <Hero />
    <GetPostgres />
    <AutoScaling />
    <InstantBranching />
    <RealWordPerfomance />
    <ProductionGradeFeatures />
    <SpeedAndScale />
    <BackedByGiants />
    <Cta />
  </>
);

export default NewHomepage;

export const revalidate = false;
