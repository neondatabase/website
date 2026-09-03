import BackendPlatformHero from 'components/pages/backend-platform/hero';
import { lakebasePageContent } from 'constants/backend-platform-page-content';

import Illustration from './illustration';

const LOGOS = ['replit', 'outfront', 'doordash', 'bcg', 'pepsi', 'retool', 'meta'];
const { hero } = lakebasePageContent;

const Hero = () => (
  <BackendPlatformHero
    className="hero relative pt-[186px] safe-paddings pb-16 xl:pt-36 lg:pt-32"
    content={hero}
    headingClassName="max-w-[826px] text-[4rem] leading-dense tracking-tighter 2xl:max-w-[760px] 2xl:text-[4rem] xl:max-w-[720px] xl:text-[3.75rem] lg:max-w-[640px] lg:text-[3rem] md:max-w-[544px] md:text-[2.5rem] sm:text-[2.25rem]"
    headingId="lakebase-hero-heading"
    headingRowClassName="mt-5 flex items-end justify-between gap-x-16 xl:flex-col xl:items-start xl:gap-y-8"
    illustration={<Illustration />}
    illustrationClassName="mt-12 md:mt-10"
    logos={LOGOS}
    logosClassName="relative mt-14 lg:mt-12 md:mt-10"
    logosStaticDesktop
    testIdPrefix="lakebase"
  />
);

export default Hero;
