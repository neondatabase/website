import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container/container';

import logoPattern from './images/logo-pattern.svg';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden pb-52 pt-[300px]">
    <img
      className="absolute left-1/2 top-0 h-[478px] w-[1920px] -translate-x-1/2 object-cover"
      src={logoPattern}
      width={1920}
      height={827}
      alt=""
      loading="eager"
      aria-hidden
    />
    <Container className="relative z-10 flex flex-col items-center text-center" size="lg">
      <h1 className="mx-auto max-w-[968px] text-[72px] font-medium leading-none tracking-tighter">
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
