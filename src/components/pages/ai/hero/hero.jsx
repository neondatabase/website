'use client';

import Spline from '@splinetool/react-spline';

import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container/container';

const Hero = () => (
  <section className="hero safe-paddings relative pb-[390px] pt-36 xl:pt-[120px] lg:pt-11 md:pt-8">
    <Container
      className="container relative z-10 flex flex-col items-center text-center"
      size="medium"
    >
      <div className="absolute left-1/2 top-0 -z-10 h-[270px] w-3/4 -translate-x-1/2 rounded-[1000px] bg-black-new blur-[30px] lg:w-full" />
      <h1 className="max-w-[967px] text-6xl font-medium leading-none tracking-extra-tight xl:text-[56px] lg:text-5xl md:text-4xl">
        Powering next gen AI apps
        <br /> with Postgres
      </h1>
      <p className="mt-5 max-w-[716px] text-[21px] font-light leading-snug tracking-extra-tight xl:text-lg lg:mt-4">
        Build and scale transformative LLM application with Postgres
        <br /> using pgvector and pg_embedding
      </p>
      <AnimatedButton
        className="relative mt-9 px-[34px] py-[17px] text-lg font-semibold tracking-extra-tight lg:mt-8 md:mt-6"
        theme="primary"
        spread={5}
        // TODO: add link to "Get Started" button
        to="#"
        isAnimated
      >
        Get Started
      </AnimatedButton>
    </Container>

    <div className="absolute left-0 top-0 h-full min-h-[1207px] w-full">
      <div className="absolute bottom-0 left-0 h-full w-full">
        <Spline scene="/animations/pages/ai/scene.splinecode" />
      </div>
    </div>
  </section>
);

Hero.propTypes = {};

export default Hero;
