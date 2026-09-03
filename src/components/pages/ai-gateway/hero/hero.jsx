import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Logos from 'components/shared/logos';
import SectionLabel from 'components/shared/section-label';
import { aiGatewayPageContent } from 'constants/backend-platform-page-content';
import LINKS from 'constants/links';

import HeroDiagram from './hero-diagram';

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

const { hero } = aiGatewayPageContent;

const Hero = () => (
  <section className="hero relative pt-40 safe-paddings xl:pt-36 lg:pt-32">
    <Container size="1344">
      <SectionLabel theme="white">{hero.label}</SectionLabel>

      <div className="mt-5.5 flex items-end justify-between gap-x-16 xl:flex-col xl:items-start xl:gap-y-8 md:mt-5">
        <h1 className="max-w-240 text-[4.5rem] leading-dense tracking-tighter 2xl:text-[4rem] xl:max-w-196 xl:text-[3.75rem] lg:max-w-172 lg:text-[3rem] md:max-w-136 md:text-[2.5rem] sm:text-[2.25rem]">
          {hero.titleLines[0]}
          <br className="md:hidden" /> {hero.titleLines[1]}
        </h1>

        <div className="flex shrink-0 gap-x-5 sm:gap-x-3">
          <Button
            data-test="ai-gateway-start-building"
            theme="white-filled"
            size="new"
            to={LINKS[hero.primaryAction.linkKey]}
          >
            {hero.primaryAction.label}
          </Button>
          <Button
            data-test="ai-gateway-read-docs"
            theme="outlined"
            size="new"
            to={LINKS[hero.secondaryAction.linkKey]}
          >
            {hero.secondaryAction.label}
          </Button>
        </div>
      </div>

      <HeroDiagram className="mt-13 md:mt-10" />

      <div className="relative mt-14 select-none lg:mt-12 md:mt-10">
        <Logos className="max-w-full p-0!" logos={LOGOS} size="md" />
      </div>
    </Container>
  </section>
);

export default Hero;
