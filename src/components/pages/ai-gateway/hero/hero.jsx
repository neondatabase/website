import BackendPlatformHero from 'components/pages/backend-platform/hero';
import { aiGatewayPageContent } from 'constants/backend-platform-page-content';

import HeroDiagram from './hero-diagram';

const { hero } = aiGatewayPageContent;

const Hero = () => (
  <BackendPlatformHero
    className="hero relative pt-40 safe-paddings xl:pt-36 lg:pt-32"
    content={hero}
    headingClassName="max-w-240 text-[4.5rem] leading-dense tracking-tighter 2xl:text-[4rem] xl:max-w-196 xl:text-[3.75rem] lg:max-w-172 lg:text-[3rem] md:max-w-136 md:text-[2.5rem] sm:text-[2.25rem]"
    headingId="ai-gateway-hero-heading"
    headingRowClassName="mt-5.5 flex items-end justify-between gap-x-16 xl:flex-col xl:items-start xl:gap-y-8 md:mt-5"
    illustration={<HeroDiagram />}
    illustrationClassName="mt-13 md:mt-10"
    logosClassName="relative mt-14 lg:mt-12 md:mt-10"
    testIdPrefix="ai-gateway"
  />
);

export default Hero;
