import React, { useEffect, useRef, useState } from 'react';
import { InView, useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const items = [
  {
    title: 'Integrate',
    description:
      'Integrate database branching into your developer workflows by branching from staging and production databases.',
  },
  {
    title: 'Develop',
    description: 'Give each developer their own branch.',
  },
  {
    title: 'Feature',
    description:
      'Create new database branches as easily as checking out a new branch in git. Your branch is one api call away.',
    linkText: 'Read more',
    linkUrl: '/docs/branching',
  },
  {
    title: 'PR preview',
    description: 'Deploy cost-efficient production preview for each pull request.',
    linkText: 'See integrations',
    linkUrl: '/', // TODO: add link
  },
  {
    title: 'Test',
    description:
      'Confidently test migrations with real data without the hassle of creating and restoring database dumps. Create and hydrate test databases instantly.',
    linkText: 'See examples',
    linkUrl: '/', // TODO: add link
  },
];

const STATE_MACHINE_NAME = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5'];

const Workflows = () => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true });
  const [containerRef, isContainerInView] = useInView({ triggerOnce: true, rootMargin: '500px' });

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
    if (isWrapperInView && rive) {
      rive.play(STATE_MACHINE_NAME[0]);
    }
  }, [isWrapperInView, rive]);

  const [currentIndex, setCurrentIndex] = useState(null);
  const [lastPlayedStateIndex, setLastPlayedIndex] = useState(1); //  set first state as default last played state

  const initPlay = useRef(false);

  useEffect(() => {
    if (rive) {
      if (currentIndex > lastPlayedStateIndex && !initPlay.current) {
        const statesToPlay = STATE_MACHINE_NAME.slice(lastPlayedStateIndex, currentIndex + 1);
        statesToPlay.forEach((state) => {
          rive.play(state);
        });
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
        <div className="relative col-start-2 col-end-5 flex justify-between xl:col-start-1 lg:hidden">
          {isContainerInView && (
            <div className="absolute left-0 -top-20 h-[calc(100%+80px)] w-[609px]">
              <RiveComponent width={609} height={3561} />
            </div>
          )}
        </div>
        <div className="relative z-10 col-start-6 col-end-12 max-w-[698px] pt-32 pb-[253px] 2xl:col-start-7 2xl:col-end-13 lg:col-span-full lg:max-w-none lg:pt-28 lg:pb-0 md:pt-20">
          <Heading className="t-5xl font-bold leading-tight" tag="h2">
            Optimize your <span className="text-primary-1">development workflows</span> with
            branching
          </Heading>
          <div className="mt-[220px] space-y-[431px] lg:mt-4 lg:space-y-0 lg:divide-y lg:divide-dashed lg:divide-gray-2">
            {items.map(({ title, description, linkText, linkUrl }, index) => (
              <InView
                className="mt-20 flex max-w-[600px] flex-col items-start lg:mt-0 lg:max-w-none lg:py-12 md:py-8"
                as="div"
                data-workflow-id={index}
                key={index}
                triggerOnce
                onChange={(inView) => {
                  if (inView && lastPlayedStateIndex <= index + 1) {
                    setCurrentIndex(index + 1);
                  }
                }}
              >
                <Heading
                  className="text-[72px] font-bold leading-dense 2xl:text-6xl xl:text-5xl lg:text-3xl"
                  tag="h3"
                >
                  {title}
                </Heading>
                <p className="mt-3.5 text-[26px] leading-tight lg:text-xl">{description}</p>
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
