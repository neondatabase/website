'use client';

import Spline from '@splinetool/react-spline';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import useWindowSize from 'react-use/lib/useWindowSize';

import Button from 'components/shared/button/button';
import Container from 'components/shared/container/container';
import useIsTouchDevice from 'hooks/use-is-touch-device';

const MOBILE_WIDTH = 768;

const Hero = () => {
  const [isClient, setIsClient] = useState(false);
  const isTouch = useIsTouchDevice();
  const { width } = useWindowSize();

  const [spline, setSpline] = useState(null);
  const [animationVisibilityRef, isInView] = useInView();
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!spline) return;

    // launching events that start playing the intro animation
    if (!isAnimationStarted || spline.time < 10000) {
      const { keyUp } = spline.getSplineEvents();

      Object.keys(keyUp).forEach((key) => {
        spline.emitEvent('keyUp', key);
      });

      setIsAnimationStarted(true);
      return;
    }

    if (isInView) {
      spline.play();
    } else {
      spline.stop();
    }
  }, [isInView, spline, isAnimationStarted]);

  // During server-side rendering, isClient will be false, so the <Image> component will always be rendered
  // After hydration, isClient will be true, so the correct component will be rendered based on the window width
  const ImageOrSplineAnimation =
    isClient && width >= MOBILE_WIDTH ? (
      <div className="absolute left-0 top-0 h-[1207px] w-full" ref={animationVisibilityRef}>
        <Spline
          className={clsx(
            'absolute bottom-9 left-0 h-full w-full xl:bottom-[9.5%] lg:bottom-[19%]',
            {
              'pointer-events-none': isTouch,
            }
          )}
          scene="/animations/pages/ai/scene.splinecode"
          onLoad={(spline) => setSpline(spline)}
        />
      </div>
    ) : (
      <Image
        className="absolute left-1/2 top-0 hidden -translate-x-1/2 md:block"
        src="/images/pages/ai/hero-sphere-mobile.png"
        width={340}
        height={357}
        alt=""
        sizes="(max-width: 768px) 340px, 100vw"
        aria-hidden
        priority
      />
    );

  return (
    <section className="hero safe-paddings relative pb-[390px] pt-36 xl:pt-[120px] lg:pt-11 md:pb-0 md:pt-8">
      <Container
        className="container relative z-10 flex flex-col items-center text-center"
        size="medium"
      >
        <h1 className="xs:flat-breaks text-6xl font-medium leading-none tracking-extra-tight xl:text-[56px] lg:text-5xl md:text-4xl">
          Powering{' '}
          <span className="text-green-45">
            next gen
            <br /> AI apps
          </span>{' '}
          with Postgres
        </h1>
        <p className="mt-5 max-w-[550px] text-xl font-light leading-snug tracking-extra-tight xl:max-w-[500px] xl:text-lg lg:mt-4 md:mt-2.5 sm:max-w-[450px]">
          Build and scale transformative LLM applications with Postgres vector indexes and search
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
        {ImageOrSplineAnimation}
      </div>
    </section>
  );
};

export default Hero;
