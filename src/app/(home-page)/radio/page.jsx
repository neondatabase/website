import AiIndex from 'components/pages/home/ai-index';
import Bento from 'components/pages/home/bento';
import Hero from 'components/pages/home/hero';
import Industry from 'components/pages/home/industry';
import InstantProvisioning from 'components/pages/home/instant-provisioning';
import Lightning from 'components/pages/home/lightning';
import Logos from 'components/pages/home/logos';
import Multitenancy from 'components/pages/home/multitenancy';
import Trusted from 'components/pages/home/trusted';
import Cta from 'components/shared/cta';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  ...SEO_DATA.index,
  robotsNoindex: 'noindex',
});

const RadioPage = () => (
  <>
    <Hero />
    <Logos />
    <InstantProvisioning />
    <Lightning />
    <Bento />
    <AiIndex />
    <Multitenancy />
    <Industry />
    <Trusted />
    <Cta />
  </>
);

export default RadioPage;
