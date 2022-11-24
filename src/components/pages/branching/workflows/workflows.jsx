import React, { useEffect, useMemo } from 'react';
import { InView, useInView } from 'react-intersection-observer';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from 'rive-react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const items = [
  {
    title: 'Environment',
    description:
      'Integrate your developer environment by branching from your production and staging databases.',
  },
  {
    title: 'Developer',
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
    title: 'Tests',
    description:
      'Confidently test your migrations on real data. Forget about looking for the right database dumps, downloading and restoring them.',
    linkText: 'See examples',
    linkUrl: '/', // TODO: add link
  },
];

const STATE_MACHINE_NAME = 'State Machine';

const Workflows = () => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, rootMargin: '500px' });
  const [containerRef, isContainerInView] = useInView({ triggerOnce: true, rootMargin: '500px' });
  const [headingRef, isHeadingInView] = useInView({
    triggerOnce: true,
    rootMargin: '100px',
  });
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
      rive.play(STATE_MACHINE_NAME);
    }
  }, [isWrapperInView, rive]);

  // create inputs for the state machine
  const routeInput0 = useStateMachineInput(rive, STATE_MACHINE_NAME, 'T0');
  const routeInput1 = useStateMachineInput(rive, STATE_MACHINE_NAME, 'T1');
  const routeInput2 = useStateMachineInput(rive, STATE_MACHINE_NAME, 'T2');
  const routeInput3 = useStateMachineInput(rive, STATE_MACHINE_NAME, 'T3');
  const routeInput4 = useStateMachineInput(rive, STATE_MACHINE_NAME, 'T4');
  const routeInput5 = useStateMachineInput(rive, STATE_MACHINE_NAME, 'T5');

  const routeInputs = useMemo(
    () => [routeInput0, routeInput1, routeInput2, routeInput3, routeInput4, routeInput5],
    [routeInput0, routeInput1, routeInput2, routeInput3, routeInput4, routeInput5]
  );

  useEffect(() => {
    if (isHeadingInView && routeInputs[0]) {
      routeInputs[0].fire();
    }
  }, [isHeadingInView, routeInputs]);

  return (
    <section className="workflows safe-paddings bg-black pt-20 text-white" ref={wrapperRef}>
      <Container
        className="grid-gap-x grid grid-cols-12 border-y border-dashed border-gray-2"
        size="md"
        ref={containerRef}
      >
        <div className="relative col-start-2 col-end-5 flex justify-between 3xl:col-start-1">
          {isContainerInView && (
            <div className="absolute left-0 -top-16 h-[calc(100%+64px)] w-[609px]">
              <RiveComponent width={609} height={3561} />
            </div>
          )}
        </div>
        <div className="relative z-10 col-start-6 col-end-12 max-w-[698px] pt-32 pb-[278px]">
          <Heading className="t-5xl font-bold leading-tight" tag="h2" ref={headingRef}>
            Optimize your <span className="text-primary-1">development workflows</span> with
            branching
          </Heading>
          <div className="mt-[220px] space-y-[440px]">
            {items.map(({ title, description, linkText, linkUrl }, index) => (
              <InView
                className="mt-20 flex max-w-[600px] flex-col items-start"
                as="div"
                key={index}
                delay={index * 100}
                triggerOnce
                onChange={(inView) => {
                  if (inView && routeInputs[index + 1]) {
                    routeInputs[index + 1].fire();
                  }
                }}
              >
                <Heading
                  className="text-[72px] font-bold leading-dense 2xl:text-6xl xl:text-5xl lg:text-4xl"
                  tag="h3"
                >
                  {title}
                </Heading>
                <p className="mt-3.5 text-[26px] leading-tight">{description}</p>
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
