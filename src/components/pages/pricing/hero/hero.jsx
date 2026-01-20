'use client';

import Container from 'components/shared/container';

import Plans from './plans';
import Programs from './programs';

const Hero = () => (
  <section className="hero safe-paddings overflow-hidden pt-40 xl:pt-32 lg:pt-[52px] md:pt-11">
    <Container className="flex flex-col items-center md:max-w-[564px]" size="960">
      <h1 className="text-center text-[60px] font-normal leading-dense tracking-tighter text-white xl:text-[52px] lg:text-[44px] md:text-[32px]">
        Neon pricing
      </h1>
      <p className="mx-auto mt-4 max-w-[680px] text-center text-xl font-normal leading-snug tracking-extra-tight text-gray-new-60 xl:mt-[14px] xl:max-w-[560px] xl:text-[18px] lg:mt-3 lg:text-[16px] md:mt-[10px] md:text-[14px]">
        Get started for free. Pay per usage as you grow.
      </p>
      <Plans />
      <Programs />
    </Container>
  </section>
);

export default Hero;
