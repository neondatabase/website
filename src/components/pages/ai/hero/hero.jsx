'use client';

import Spline from '@splinetool/react-spline';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container/container';

const Hero = () => {
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);
  const [isAnimatedButton, setIsAnimatedButton] = useState(false);

  useEffect(() => {
    if (!isAnimationLoaded) return;

    setTimeout(() => {
      setIsAnimatedButton(true);
    }, 4500);
  }, [isAnimationLoaded]);

  return (
    <section className="hero safe-paddings relative pb-[390px] pt-36 xl:pt-[120px] lg:pt-11 md:pt-8">
      <Container
        className="container relative z-10 flex flex-col items-center text-center"
        size="medium"
      >
        <h1 className="md:flat-breaks max-w-[967px] text-6xl font-medium leading-none tracking-extra-tight xl:text-[56px] lg:text-5xl md:max-w-[550px] md:text-4xl">
          Powering next gen <br /> AI apps with Postgres
        </h1>
        <p className="md:flat-breaks mt-5 max-w-[716px] text-[21px] font-light leading-snug tracking-extra-tight xl:text-lg lg:mt-4 md:mt-2.5 md:max-w-[500px]">
          Build and scale transformative LLM application with Postgres
          <br /> using pgvector and pg_embedding
        </p>
        <AnimatedButton
          className="relative mt-9 px-[34px] py-[17px] text-lg font-semibold tracking-extra-tight lg:mt-8 md:mt-6"
          theme="primary"
          spread={5}
          // TODO: add link to "Get Started" button
          to="#"
          isAnimated={isAnimatedButton}
        >
          Get Started
        </AnimatedButton>
      </Container>

      <div
        className={clsx(
          'absolute left-0 top-0 h-[1207px] w-full opacity-0 transition-opacity duration-500 xl:h-[1100px] lg:h-[900px] md:h-[810px] xs:h-[940px]',
          {
            'opacity-100': isAnimationLoaded,
          }
        )}
      >
        <Spline
          className="absolute bottom-0 left-0 h-full w-full md:pointer-events-none"
          scene="/animations/pages/ai/scene.splinecode"
          onLoad={() => setIsAnimationLoaded(true)}
        />
      </div>
    </section>
  );
};

Hero.propTypes = {};

export default Hero;
