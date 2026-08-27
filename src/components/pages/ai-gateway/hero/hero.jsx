import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Logos from 'components/shared/logos';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';
import heroImage from 'images/pages/ai-gateway/hero/ai-gateway.jpg';

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

const Hero = () => (
  <section className="hero relative pt-40 safe-paddings xl:pt-36 lg:pt-32">
    <Container size="1344">
      <SectionLabel theme="white">AI Gateway, powered by Databricks</SectionLabel>

      <div className="mt-5.5 flex items-end justify-between gap-x-16 xl:flex-col xl:items-start xl:gap-y-8 md:mt-5">
        <h1 className="max-w-240 text-[4.5rem] leading-dense tracking-tighter 2xl:text-[4rem] xl:max-w-196 xl:text-[3.75rem] lg:max-w-172 lg:text-[3rem] md:max-w-136 md:text-[2.5rem] sm:text-[2.25rem]">
          Call the latest models right
          <br className="md:hidden" /> from your Neon backend
        </h1>

        <div className="flex shrink-0 gap-x-5 sm:gap-x-3">
          <Button
            data-test="ai-gateway-start-building"
            theme="white-filled"
            size="new"
            to={LINKS.signup}
          >
            Start building
          </Button>
          <Button
            data-test="ai-gateway-read-docs"
            theme="outlined"
            size="new"
            to={LINKS.aiGatewayOverview}
          >
            Read the docs
          </Button>
        </div>
      </div>

      <Image
        className="mt-13 h-auto w-full md:mt-10"
        src={heroImage}
        width={2688}
        height={1004}
        sizes="(max-width: 47.9375rem) calc(100vw - 2.5rem), (max-width: 63.9375rem) calc(100vw - 4rem), 84rem"
        quality={100}
        alt="A Neon backend routing AI Gateway requests to models from multiple providers"
        loading="eager"
      />

      <div className="relative mt-14 select-none lg:mt-12 md:mt-10">
        <Logos className="max-w-full p-0!" logos={LOGOS} size="md" />
      </div>
    </Container>
  </section>
);

export default Hero;
