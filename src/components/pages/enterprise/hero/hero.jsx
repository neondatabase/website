import Image from 'next/image';

import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container/container';

import logoPattern from './images/logo-pattern.jpg';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden pb-32 pt-[306px] xl:pb-24 xl:pt-[239px] lg:pb-20 lg:pt-[194px] md:pb-14 md:pt-[164px]">
    <Image
      className="pointer-events-none absolute left-1/2 top-[68px] h-auto w-[1472px] max-w-none -translate-x-1/2 object-cover xl:top-[74px] xl:w-[1040px] lg:top-7 lg:w-[1024px] md:top-1 md:w-[1040px]"
      src={logoPattern}
      alt=""
      quality={99}
      priority
      aria-hidden
    />
    <Container className="relative z-10 flex flex-col items-center text-center" size="medium">
      <div className="absolute left-1/2 top-0 -z-10 h-[270px] w-3/4 -translate-x-1/2 rounded-[1000px] bg-black-pure blur-[30px] lg:w-full" />
      <h1 className="mx-auto font-title text-6xl font-medium leading-none tracking-[-0.02em] xl:text-[56px] lg:text-5xl md:text-4xl sm:text-[36px]">
        Neon for Enterprises
      </h1>
      <p className="mt-5 text-xl font-light leading-snug xl:text-lg lg:mt-4 md:mt-2.5 md:text-base">
        Enterprises use Neon to operate hundreds of thousands of Postgres databases <br />
        with full compliance and security.
      </p>
      <AnimatedButton
        className="relative mt-9 px-[34px] py-[17px] text-lg font-semibold tracking-[-0.02em] lg:mt-7 md:mt-6"
        theme="primary"
        to="#request-trial"
        linesOffsetTop={22}
        linesOffsetSide={22}
        linesOffsetBottom={40}
        isAnimated
      >
        Request an Enterprise Trial
      </AnimatedButton>
    </Container>
  </section>
);

export default Hero;
