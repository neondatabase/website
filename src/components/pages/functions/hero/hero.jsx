import BackendPlatformHero from 'components/pages/backend-platform/hero';
import { functionsPageContent } from 'constants/backend-platform-page-content';

import Illustration from './illustration';

const { hero: heroContent } = functionsPageContent;

const Hero = () => (
  <BackendPlatformHero
    className="bg-black-pure pt-[146px] safe-paddings pb-20 text-white xl:pt-[122px] lg:pt-[98px] md:pt-24 md:pb-16"
    content={heroContent}
    dataFigmaNodeId="3122:1263"
    headingClassName="max-w-[878px] text-[72px] leading-[1.125] tracking-tighter xl:text-6xl lg:text-5xl md:text-[2.5rem]"
    headingId="functions-hero-heading"
    headingRowClassName="mt-5 flex items-end justify-between gap-12 lg:flex-col lg:items-start"
    illustration={<Illustration />}
    illustrationClassName="mt-12 overflow-hidden md:mt-10"
    logosClassName="mt-[59px] md:mt-10"
    logosDataFigmaNodeId="3122:1938"
  />
);

export default Hero;
