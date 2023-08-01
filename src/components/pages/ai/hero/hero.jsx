'use client';

import Spline from '@splinetool/react-spline';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import useWindowSize from 'react-use/lib/useWindowSize';

import Button from 'components/shared/button/button';
import Container from 'components/shared/container/container';

const MOBILE_WIDTH = 768;

const Hero = () => {
  const { width } = useWindowSize();
  const [spline, setSpline] = useState(null);
  const [animationVisibilityRef, isInView] = useInView();

  useEffect(() => {
    if (!spline) return;

    if (isInView) {
      spline.play();
    } else {
      spline.stop();
    }
  }, [isInView, spline]);

  return (
    <section className="hero safe-paddings relative pb-[390px] pt-36 xl:pt-[120px] lg:pt-11 md:pb-0 md:pt-8">
      <Container
        className="container relative z-10 flex flex-col items-center text-center"
        size="medium"
      >
        <h1 className="xs:flat-breaks text-6xl font-medium leading-none tracking-extra-tight xl:text-[56px] lg:text-5xl md:text-4xl">
          Powering next gen
          <br /> AI apps with Postgres
        </h1>
        <p className="mt-5 max-w-[550px] text-xl font-light leading-snug tracking-extra-tight xl:max-w-[500px] xl:text-lg lg:mt-4 md:mt-2.5 sm:max-w-[450px]">
          Build and scale transformative LLM application with Postgres using pgvector and
          pg_embedding
        </p>
        <Button
          className="relative mt-9 px-[34px] py-[17px] text-lg font-semibold tracking-extra-tight lg:mt-8 md:mt-6"
          theme="primary"
          // TODO: add link to "Get Started" button
          to="#"
        >
          Get Started
        </Button>
      </Container>
      <div className="md:relative">
        <img
          className="mx-auto hidden md:-mt-6 md:block"
          src={`data:image/svg+xml;charset=utf-8,%3Csvg width='340' height='357' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
          alt=""
          width={340}
          height={357}
          aria-hidden
        />
        {width < MOBILE_WIDTH ? (
          <Image
            className="absolute left-1/2 top-0 hidden -translate-x-1/2 md:block"
            src="/images/pages/ai/hero-sphere-mobile.png"
            width={340}
            height={357}
            alt=""
            aria-hidden
            priority
          />
        ) : (
          <div className="absolute left-0 top-0 h-[1207px] w-full" ref={animationVisibilityRef}>
            <Spline
              className="absolute bottom-9 left-0 h-full w-full xl:bottom-[9.5%] lg:bottom-[19%]"
              scene="/animations/pages/ai/scene.splinecode"
              onLoad={(spline) => setSpline(spline)}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
