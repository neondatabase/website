import BackendHero from 'components/pages/backend-platform/hero';
import { objectStoragePageContent } from 'constants/object-storage-page-content';

import HeroAnimation from './hero-animation';

const LOGOS = ['replit', 'outfront', 'doordash', 'bcg', 'pepsi', 'retool', 'meta'];

const { hero } = objectStoragePageContent;

const Hero = () => (
  <BackendHero
    className="relative pt-46.5 safe-paddings text-white xl:pt-36 lg:pt-32 md:pt-24"
    content={hero}
    dataFigmaNodeId="2070:4694"
    headingClassName="max-w-209.5 text-[4.5rem] leading-none tracking-tighter xl:max-w-196 xl:text-[3.75rem] lg:max-w-172 lg:text-5xl md:max-w-136 md:text-4xl sm:text-[2.25rem]"
    headingId="object-storage-hero-heading"
    headingRowClassName="mt-5 flex items-end justify-between gap-x-12 xl:flex-col xl:items-start xl:gap-y-8"
    illustration={<HeroAnimation />}
    illustrationClassName="mt-12 overflow-hidden md:mt-10"
    logos={LOGOS}
    logosClassName="mt-14 lg:mt-12 md:mt-10"
    logosDataFigmaNodeId="2070:4889"
    testIdPrefix="object-storage"
  />
);

export default Hero;
