import Image from 'next/image';

import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container/container';

import logoPattern from './images/logo-pattern.png';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden pb-52 pt-[349px] xl:pb-[166px] xl:pt-[328px]">
    <Image
      className="absolute left-1/2 top-0 h-auto w-[1920px] max-w-none -translate-x-1/2 object-cover xl:top-[-18px]"
      src={logoPattern}
      alt=""
      quality={85}
      priority
      aria-hidden
    />
    <Container className="relative z-10 flex flex-col items-center text-center" size="lg">
      <h1 className="mx-auto max-w-[968px] text-[72px] font-medium leading-none tracking-tighter xl:text-[56px]">
        Unlock <mark className="bg-transparent text-green-45">additional revenue</mark> stream by
        partnering with Neon
      </h1>
      <p className="mt-5 text-xl font-light">
        Bring familiar, reliable and scalable Postgres experience to your customers.
      </p>
      {/* TODO: add link become a partner */}
      <AnimatedButton
        className="relative mt-8 px-[34px] py-[17px] text-lg font-semibold tracking-[-0.02em]"
        theme="primary"
        spread={5}
        //  to="/"
        isAnimated
      >
        Become a partner
      </AnimatedButton>
    </Container>
  </section>
);

export default Hero;
