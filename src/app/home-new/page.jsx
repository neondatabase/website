import AI from 'components/pages/home-new/ai';
import Auth from 'components/pages/home-new/auth';
import Autoscaling from 'components/pages/home-new/autoscaling';
import BackedBy from 'components/pages/home-new/backed-by';
import Branching from 'components/pages/home-new/branching';
import CTA from 'components/pages/home-new/cta';
import Features from 'components/pages/home-new/features';
import Hero from 'components/pages/home-new/hero';
import SpeedScale from 'components/pages/home-new/speed-scale';
import TocWrapper from 'components/pages/home-new/toc-wrapper/toc-wrapper';
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
      <TocWrapper>
        <AI />
        <Autoscaling />
        <Branching />
        <Auth />
        <Features />
      </TocWrapper>
      <SpeedScale />
      <BackedBy />
      <CTA />
    </>
  );
};

export default Homepage;

export const revalidate = false;
