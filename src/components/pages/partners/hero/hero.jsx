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
      quality={85}
      priority
      aria-hidden
    />
    <Container className="relative z-10 flex flex-col items-center text-center" size="lg">
      <div className="absolute left-1/2 top-0 -z-10 h-[270px] w-3/4 -translate-x-1/2 rounded-[1000px] bg-black-new blur-[30px] lg:w-full" />
      <h1 className="md:flat-breaks mx-auto max-w-[968px] text-6xl font-medium leading-none tracking-[-0.02em] xl:text-[56px] lg:max-w-[700px] lg:text-5xl md:text-4xl">
        Unlock <mark className="bg-transparent text-green-45">new revenue</mark> streams <br />
        by partnering with Neon
      </h1>
      <p className="mt-5 text-xl font-light leading-snug xl:text-lg lg:mt-4 md:mt-2.5 md:text-base">
        Bring a familiar, reliable, and scalable Postgres experience to your customers.
      </p>
      <AnimatedButton
        className="relative mt-9 px-[34px] py-[17px] text-lg font-semibold tracking-[-0.02em] lg:mt-7 md:mt-6"
        theme="primary"
        spread={5}
        to="#partners-apply"
        isAnimated
      >
        Become a partner
      </AnimatedButton>
    </Container>
  </section>
);

export default Hero;
