import React, { useEffect, useRef, useState } from 'react';
import { InView, useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const items = [
  {
    title: 'Deploy',
    description:
      'Instantly deploy development, test, and staging environments with an up-to-date copy of your production data.',
    linkText: 'Read docs',
  },
  {
    title: 'Develop',
    description:
      'Create a branch of your production database that developers are free to play with and modify better yet, create a branch for each developer.',
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
const initialStates = STATE_MACHINE_NAME.slice(0, 2);

const Workflows = () => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true });
  const [containerRef, isContainerInView] = useInView({ triggerOnce: true, rootMargin: '500px' });
  const [currentIndex, setCurrentIndex] = useState(null);
  const [lastPlayedStateIndex, setLastPlayedIndex] = useState(2); //  set second state S2 as default last played state
  const initPlay = useRef(false);

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/branching/branching-route.riv',
    autoplay: false,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
  });

  useEffect(() => {
    if (rive) {
      if (isWrapperInView) {
        // play initial state S0, S1 of route animation
        setTimeout(rive.play(initialStates), 3000);
      }
    }
  }, [isWrapperInView, rive]);

  useEffect(() => {
    if (rive) {
      if (currentIndex > lastPlayedStateIndex && !initPlay.current) {
        const statesToPlay = STATE_MACHINE_NAME.slice(lastPlayedStateIndex, currentIndex + 1);
        rive.play(statesToPlay);
        setLastPlayedIndex(currentIndex);
      }
      initPlay.current = true;
      if (currentIndex) {
        rive.play(STATE_MACHINE_NAME[currentIndex]);
      }
    }
  }, [rive, currentIndex, lastPlayedStateIndex]);

  return (
    <section className="workflows safe-paddings bg-black pt-20 text-white lg:pt-0" ref={wrapperRef}>
      <Container
        className="grid-gap-x grid grid-cols-12 border-y border-dashed border-gray-2"
        size="md"
        ref={containerRef}
      >
        <div className="relative col-start-2 col-end-5 flex justify-between xl:col-start-1 md:hidden">
          {isContainerInView && (
            <div className="absolute left-0 -top-20 h-[calc(100%+80px)] w-[609px] 2xl:w-[592px] xl:-top-[60px] xl:w-[456px] lg:-top-[47px] lg:w-[358px]">
              <RiveComponent width={609} height={3561} />
            </div>
          )}
        </div>
        <div className="relative z-10 col-start-6 col-end-12 flex min-h-[3482px] flex-col pt-32 pb-[245px] 3xl:pt-28 2xl:col-start-7 2xl:col-end-13 2xl:min-h-[3383px] xl:col-start-6 xl:min-h-[2608px] xl:pt-20 xl:pb-[195px] lg:min-h-[2046px] lg:pt-10 lg:pb-[88px] md:col-span-full md:min-h-0 md:max-w-none md:pt-28 md:pb-0">
          <Heading className="t-5xl font-bold leading-tight" tag="h2">
            Supercharge your <span className="text-primary-1">development workflows</span> with
            branching
          </Heading>
          <div className="mt-[220px] flex grow flex-col justify-between 3xl:mt-48 lg:mt-28 md:mt-4 md:space-y-0 md:divide-y md:divide-dashed md:divide-gray-2">
            {items.map(({ title, description, linkText, linkUrl }, index) => (
              <InView
                className="flex max-w-[600px] flex-col items-start md:mt-0 md:max-w-none md:py-12"
                as="div"
                key={index}
                threshold={1}
                delay={500}
                triggerOnce
                onChange={(inView) => {
                  if (inView && lastPlayedStateIndex <= index + 2) {
                    setCurrentIndex(index + 2); // starting with S2 after initial states S0, S1
                  }
                }}
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
                {linkText && linkUrl && (
                  <Link
                    className="mt-5 text-lg font-semibold before:-bottom-1 before:h-[3px]"
                    theme="black-primary-1"
                    to={linkUrl}
                  >
                    {linkText}
                  </Link>
                )}
              </InView>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Workflows;
