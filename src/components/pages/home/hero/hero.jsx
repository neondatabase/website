'use client';

import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';
import bg from 'images/pages/home/hero/bg.jpg';

const Hero = () => (
  <section className="hero safe-paddings relative pt-[136px] xl:pt-[120px] lg:pt-24">
    <Image
      className="pointer-events-none absolute left-1/2 top-0 min-w-[1760px] -translate-x-1/2 xl:min-w-[1588px] lg:top-[-22px] lg:min-w-[1420px] md:top-[46px] md:min-w-[1058px]"
      src={bg}
      sizes="(max-width: 639px) 1058px"
      width={1760}
      height={980}
      quality={100}
      alt=""
      priority
    />

    <Container className="xl:px-8" size="1100">
      <div className="mx-auto max-w-[640px] text-center xl:max-w-xl lg:max-w-lg sm:max-w-xs">
        <span className="mx-auto mb-3.5 text-sm font-light uppercase leading-snug tracking-tighter text-[#66FFDB]/80 lg:mt-2.5 lg:text-balance lg:text-base">
          Customer Spotlight
        </span>
        <h1 className="font-title text-[72px] font-medium leading-none -tracking-[0.03em] text-white xl:text-[64px] lg:text-[48px] md:text-[40px] sm:text-[32px]">
          Create.xyz ships faster with Postgres
        </h1>
        <p className="mt-2.5 text-lg font-light leading-snug tracking-tighter text-gray-new-80 lg:mt-2.5 lg:text-balance lg:text-base">
          Text to app platform Create.xyz uses the latest Al models to turn your prompts
          into&nbsp;deployable apps, Neon database included!
        </p>
        <Button
          className="pointer-events-auto relative mt-7 font-semibold xl:mt-6"
          theme="primary"
          size="md-new"
          to={LINKS.signup}
          target="_blank"
          tag_name="Hero"
          analyticsEvent="home_hero_get_started_clicked"
        >
          Try Create.xyz
        </Button>
      </div>

      <div className="mt-[84px]" />
    </Container>
  </section>
);

export default Hero;
