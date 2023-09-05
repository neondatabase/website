'use client';

import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import React, { useEffect, useRef, useState } from 'react';
import { InView, useInView } from 'react-intersection-observer';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

const items = [
  {
    title: 'Deploy',
    description:
      'Instantly deploy development, test, and staging environments with an up-to-date copy of your production data.',
    linkText: 'Read docs',
    linkUrl: '/docs/introduction/branching', // TODO: check if this is the correct link
  },
  {
    title: 'Develop',
    description:
      'Create a branch of your production database that developers are free to play with and modify — better yet, create a branch for each developer.',
  },
  {
    title: 'Integrate',
    description:
      "Use the Neon API to integrate branching into your development workflows. The Neon API provides full access to Neon's branching capabilities.",
  },
  {
    title: 'Preview',
    description:
      'Easily spin up a database branch for each PR preview to facilitate reviews and testing.',
    linkText: 'See integrations',
    linkUrl: '/', // TODO: add link
  },
  {
    title: 'Test',
    description:
      'Confidently test new features with real data, without the hassle of creating and restoring database dumps. Create and hydrate test databases with a single click or API call.',
    linkText: 'See examples',
    linkUrl: '/', // TODO: add link
  },
];

const STATE_MACHINE_NAME = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
const PRELIMINARY_STEPS_COUNT = 2;

const Workflows = () => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, rootMargin: '500px' });
  const [containerRef, isContainerInView] = useInView({ triggerOnce: true });
  const [animationDeadlineRef, isAnimationDeadlineInView] = useInView({ triggerOnce: true });
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);
  const lastPlayedStep = useRef(-1);
  const initialAnimationTimeout = useRef(null);

  const { RiveComponent, rive, setContainerRef } = useRive({
    src: '/animations/pages/branching/branching-route.riv',
    autoplay: false,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
  });

  // NOTE: the useEffect order is important,
  // this useEffect with last animation step
  // should be placed last
  useEffect(() => {
    if (rive) {
      if (isAnimationDeadlineInView) {
        const lastStepIndex = STATE_MACHINE_NAME.length - 1;

        if (lastPlayedStep.current !== lastStepIndex) {
          lastPlayedStep.current = lastStepIndex;
          rive.play(STATE_MACHINE_NAME[lastStepIndex]);
        }
      }
    }
  }, [rive, isAnimationDeadlineInView]);

  useEffect(() => {
    if (rive) {
      if (isContainerInView) {
        // NOTE: playing initial animation only
        // if content animation didn't played
        if (lastPlayedStep.current === -1) {
          rive.play(STATE_MACHINE_NAME[0]);
          initialAnimationTimeout.current = setTimeout(
            () => rive.play(STATE_MACHINE_NAME[1]),
            1000
          );
        }
      }
    }
  }, [rive, isContainerInView]);

  useEffect(() => {
    if (rive) {
      // NOTE: preventing items animation
      // when the Rive was loaded and ready to use
      if (currentItemIndex !== -1) {
        const currentIndex = currentItemIndex + PRELIMINARY_STEPS_COUNT;

        if (currentIndex > lastPlayedStep.current) {
          clearTimeout(initialAnimationTimeout.current);
          lastPlayedStep.current = currentIndex;
          rive.play(STATE_MACHINE_NAME[currentIndex]);
        }
      }
    }
  }, [rive, currentItemIndex]);

  return (
    <section className="workflows safe-paddings bg-black pt-20 text-white lg:pt-0" ref={wrapperRef}>
      <Container
        className="grid-gap-x grid grid-cols-12 border-y border-dashed border-gray-2"
        size="md"
        ref={containerRef}
      >
        <div className="relative col-start-2 col-end-5 flex justify-between xl:col-start-1 md:hidden">
          {isWrapperInView && (
            <div className="absolute -top-20 left-0 h-[calc(100%+80px)] w-[609px] 2xl:w-[592px] xl:-top-[60px] xl:w-[456px] lg:-top-[47px] lg:w-[358px]">
              <RiveComponent width={609} height={3561} />
            </div>
          )}
        </div>
        <div
          className="relative z-10 col-start-6 col-end-12 flex min-h-[3482px] flex-col pb-[245px] pt-32 3xl:pt-28 2xl:col-start-7 2xl:col-end-13 2xl:min-h-[3383px] xl:col-start-6 xl:min-h-[2608px] xl:pb-[195px] xl:pt-20 lg:min-h-[2046px] lg:pb-[88px] lg:pt-10 md:col-span-full md:min-h-0 md:max-w-none md:pb-0 md:pt-16"
          ref={setContainerRef}
        >
          <Heading className="t-5xl font-bold leading-tight" tag="h2">
            Supercharge your <span className="text-primary-1">development workflows</span> with
            branching
          </Heading>
          <div className="mt-[220px] flex grow flex-col justify-between 3xl:mt-48 lg:mt-28 md:mt-4 md:space-y-0 md:divide-y md:divide-dashed md:divide-gray-2">
            {items.map(({ title, description }, index) => (
              <InView
                className="flex max-w-[600px] flex-col items-start md:mt-0 md:max-w-none md:py-12"
                as="div"
                key={index}
                threshold={1}
                triggerOnce
                onChange={(inView) => inView && setCurrentItemIndex(index)}
              >
                <Heading
                  className="text-[72px] font-bold leading-dense 2xl:text-6xl xl:text-5xl lg:text-[44px] md:text-4xl"
                  tag="h3"
                >
                  {title}
                </Heading>
                <p className="mt-3.5 text-[26px] leading-tight xl:text-xl lg:text-lg md:text-base">
                  {description}
                </p>
                {/* TODO: restore links if necessary (don't forget to add linkText and linkUrl props to items mapping) */}
                {/* {linkText && linkUrl && (
                  <Link
                    className="mt-5 text-lg font-semibold before:-bottom-1 before:h-[3px]"
                    theme="black-primary-1"
                    to={linkUrl}
                  >
                    {linkText}
                  </Link>
                )} */}
              </InView>
            ))}
          </div>
        </div>
      </Container>
      <div ref={animationDeadlineRef} />
    </section>
  );
};

export default Workflows;
