import AgentPlatform from 'components/pages/home/agent-platform';
import Architecture from 'components/pages/home/architecture';
import Autoscaling from 'components/pages/home/autoscaling';
import BuildYourBackend from 'components/pages/home/build-your-backend';
import BuiltBy from 'components/pages/home/built-by';
import CTA from 'components/pages/home/cta';
import Hero from 'components/pages/home/hero';
import OperateWithAgents from 'components/pages/home/operate-with-agents';
import ScaleYourApp from 'components/pages/home/scale-your-app';
import TocWrapper from 'components/pages/home/toc-wrapper/toc-wrapper';
import JsonLd from 'components/shared/json-ld';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import { generateOrganizationSchema } from 'lib/schema';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.index);

const Homepage = () => {
  const organizationSchema = generateOrganizationSchema();

  return (
    <Layout isHeaderSticky isHeaderStickyOverlay>
      <JsonLd data={organizationSchema} />
      <Hero />
      <BuildYourBackend />
      <OperateWithAgents />
      <ScaleYourApp />
      <TocWrapper>
        <Architecture />
        <Autoscaling />
        <BuiltBy />
      </TocWrapper>
      <AgentPlatform />
      <CTA />
    </Layout>
  );
};

export default Homepage;

export const revalidate = false;
