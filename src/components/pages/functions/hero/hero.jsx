import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Logos from 'components/shared/logos';
import SectionLabel from 'components/shared/section-label';
import { functionsPageContent } from 'constants/backend-platform-page-content';
import LINKS from 'constants/links';

import Illustration from './illustration';

const LOGOS = [
  'replit',
  'outfront',
  'doordash',
  'bcg',
  'pepsi',
  'retool',
  'meta',
  'bitso',
  'framer',
];

const { hero: heroContent } = functionsPageContent;

const Hero = () => (
  <section
    className="bg-black-pure pt-[146px] safe-paddings pb-20 text-white xl:pt-[122px] lg:pt-[98px] md:pt-24 md:pb-16"
    data-figma-node-id="3122:1263"
    aria-labelledby="functions-hero-heading"
  >
    <Container size="1344">
      <div className="flex items-end justify-between gap-12 lg:flex-col lg:items-start">
        <div className="max-w-[928px]">
          <SectionLabel theme="white">{heroContent.label}</SectionLabel>
          <h1
            className="mt-5 max-w-[878px] text-[72px] leading-[1.125] tracking-tighter xl:text-6xl lg:text-5xl md:text-[2.5rem]"
            id="functions-hero-heading"
          >
            {heroContent.title}
          </h1>
        </div>

        <div className="flex shrink-0 gap-x-5 sm:gap-x-3">
          <Button theme="white-filled" size="new" to={LINKS[heroContent.primaryAction.linkKey]}>
            {heroContent.primaryAction.label}
          </Button>
          <Button theme="outlined" size="new" to={LINKS[heroContent.secondaryAction.linkKey]}>
            {heroContent.secondaryAction.label}
          </Button>
        </div>
      </div>

      <div className="mt-12 overflow-hidden md:mt-10">
        <Illustration />
      </div>

      <div className="mt-[59px] select-none md:mt-10" data-figma-node-id="3122:1938">
        <Logos className="max-w-full p-0!" logos={LOGOS} size="md" />
      </div>
    </Container>
  </section>
);

export default Hero;
