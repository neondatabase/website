import AI from 'components/pages/home/ai';
import Auth from 'components/pages/home/auth';
import Autoscaling from 'components/pages/home/autoscaling';
import BackedBy from 'components/pages/home/backed-by';
import Branching from 'components/pages/home/branching';
import CTA from 'components/pages/home/cta';
import Features from 'components/pages/home/features';
import Hero from 'components/pages/home/hero';
import SpeedScale from 'components/pages/home/speed-scale';
import TocWrapper from 'components/pages/home/toc-wrapper/toc-wrapper';
import JsonLd from 'components/shared/json-ld';
import SEO_DATA from 'constants/seo-data';
import { generateOrganizationSchema } from 'lib/schema';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  ...SEO_DATA.index,
  robotsNoindex: 'noindex',
});

const StackOverflowPage = () => {
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

export default StackOverflowPage;

export const revalidate = false;
