import clsx from 'clsx';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import BlinkingText from 'components/shared/blinking-text';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import useLottie from 'hooks/use-lottie';

import autoBackupAnimationData from './data/auto-backup-lottie-data.json';
import autoScalingAnimationData from './data/auto-scaling-lottie-data.json';
import edgeDeploymentAnimationData from './data/edge-deployment-lottie-data.json';
import highAvailabilityAnimationData from './data/high-availability-lottie-data.json';
import openSourceAnimationData from './data/open-source-lottie-data.json';
import payAsYouGoAnimationData from './data/pay-as-you-go-lottie-data.json';

const Features = () => {
  const [titleRef, isTitleInView, titleEntry] = useInView({ triggerOnce: true, threshold: 0.5 });

  const {
    isAnimationPlaying: payAsYouGoIsAnimationPlaying,
    animationRef: payAsYouGoAnimationRef,
    animationVisibilityRef: payAsYouGoAnimationVisibilityRef,
    animationEntry: payAsYouGoAnimationEntry,
  } = useLottie({
    lottieOptions: {
      animationData: payAsYouGoAnimationData,
    },
    useInViewOptions: { threshold: 0.5 },
  });

  const {
    isAnimationPlaying: highAvailabiIsAnimationPlaying,
    animationRef: highAvailabilityAnimationRef,
    animationVisibilityRef: highAvailabilityAnimationVisibilityRef,
    animationEntry: highAvailabilityAnimationEntry,
  } = useLottie({
    lottieOptions: {
      animationData: highAvailabilityAnimationData,
    },
    useInViewOptions: { threshold: 0.5 },
  });

  const {
    isAnimationPlaying: autoBackupIsAnimationPlaying,
    animationRef: autoBackupAnimationRef,
    animationVisibilityRef: autoBackupAnimationVisibilityRef,
    animationEntry: autoBackupAnimationEntry,
  } = useLottie({
    lottieOptions: {
      animationData: autoBackupAnimationData,
    },
    useInViewOptions: { threshold: 0.5 },
  });

  const {
    isAnimationPlaying: autoScalingIsAnimationPlaying,
    animationRef: autoScalingAnimationRef,
    animationVisibilityRef: autoScalingAnimationVisibilityRef,
    animationEntry: autoScalingAnimationEntry,
  } = useLottie({
    lottieOptions: {
      animationData: autoScalingAnimationData,
    },
    useInViewOptions: { threshold: 0.5 },
  });

  const {
    isAnimationPlaying: edgeDeploymeIsAnimationPlaying,
    animationRef: edgeDeploymentAnimationRef,
    animationVisibilityRef: edgeDeploymentAnimationVisibilityRef,
    animationEntry: edgeDeploymentAnimationEntry,
  } = useLottie({
    lottieOptions: {
      animationData: edgeDeploymentAnimationData,
    },
    useInViewOptions: { threshold: 0.5 },
  });

  const {
    isAnimationPlaying: openSourceIsAnimationPlaying,
    animationRef: openSourceAnimationRef,
    animationVisibilityRef: openSourceAnimationVisibilityRef,
    animationEntry: openSourceAnimationEntry,
  } = useLottie({
    lottieOptions: {
      animationData: openSourceAnimationData,
    },
    useInViewOptions: { threshold: 0.5 },
  });

  const items = [
    {
      isAnimationPlaying: payAsYouGoIsAnimationPlaying,
      animationVisibilityRef: payAsYouGoAnimationVisibilityRef,
      animationRef: payAsYouGoAnimationRef,
      animationEntry: payAsYouGoAnimationEntry,
      title: 'Pay as You Go',
      description:
        'Being serverless allows using of resources on-demand, which significantly cuts the costs and brings pay as you go solution.',
    },
    {
      isAnimationPlaying: highAvailabiIsAnimationPlaying,
      animationVisibilityRef: highAvailabilityAnimationVisibilityRef,
      animationRef: highAvailabilityAnimationRef,
      animationEntry: highAvailabilityAnimationEntry,
      title: 'High Availability',
      description: `Zenith's architecture guarantees high availability even under peak load and 99.9999% uptime for Cloud users.`,
    },
    {
      isAnimationPlaying: autoBackupIsAnimationPlaying,
      animationVisibilityRef: autoBackupAnimationVisibilityRef,
      animationRef: autoBackupAnimationRef,
      animationEntry: autoBackupAnimationEntry,
      title: 'Auto-Backup',
      description:
        'Cost efficient incremental auto backup functionality keeps your database save 24/7.',
    },
    {
      isAnimationPlaying: autoScalingIsAnimationPlaying,
      animationVisibilityRef: autoScalingAnimationVisibilityRef,
      animationRef: autoScalingAnimationRef,
      animationEntry: autoScalingAnimationEntry,
      title: 'Auto Scaling',
      description:
        'Handle peak time requests, with a flexible auto scale deployment solution, and pay for the actual usage.',
      tag: {
        className: 'text-secondary-4 border-secondary-4',
        text: 'Coming Soon',
      },
    },
    {
      isAnimationPlaying: edgeDeploymeIsAnimationPlaying,
      animationVisibilityRef: edgeDeploymentAnimationVisibilityRef,
      animationRef: edgeDeploymentAnimationRef,
      animationEntry: edgeDeploymentAnimationEntry,
      title: 'Edge Deployment',
      description:
        'Have a database close to your users. Zenith is a perfect for serverless functions.',
      tag: {
        className: 'text-secondary-2 border-secondary-2',
        text: 'Coming Soon',
      },
    },
    {
      isAnimationPlaying: openSourceIsAnimationPlaying,
      animationVisibilityRef: openSourceAnimationVisibilityRef,
      animationRef: openSourceAnimationRef,
      animationEntry: openSourceAnimationEntry,
      title: 'Open Source',
      description: (
        <>
          Check{' '}
          <Link to="/" theme="underline-primary-1">
            our repository
          </Link>{' '}
          to learn more about technologies which make Zenith great.
        </>
      ),
    },
  ];

  return (
    <section
      id="features"
      className="pt-40 bg-black safe-paddings 3xl:pt-36 2xl:pt-32 xl:pt-28 lg:pt-20 md:pt-16"
    >
      <Container className="z-20">
        <Heading
          id="features-title"
          className="text-center lg:max-w-[460px] lg:mx-auto"
          tag="h2"
          size="md"
          theme="white"
          ref={titleRef}
        >
          <BlinkingText
            text="Not an ordinary PostgreSQL as a service"
            parentElement={titleEntry?.target}
            shouldAnimationStart={isTitleInView}
          />
        </Heading>
        <p className="mt-5 text-center text-white t-3xl max-w-[940px] mx-auto 2xl:max-w-[800px] 2xl:mt-4 xl:max-w-[610px] xl:mt-3.5 lg:max-w-[580px]">
          The way Zenith extends PostgreSQL brings many essential features needed for modern
          projects development.
        </p>
        <ul className="grid grid-cols-12 mt-[92px] grid-gap gap-y-[92px] 2xl:mt-[76px] 2xl:gap-y-[76px] xl:mt-16 xl:gap-y-16 md:grid-cols-1">
          {items.map(
            (
              {
                isAnimationPlaying,
                animationVisibilityRef,
                animationRef,
                animationEntry,
                title,
                description,
                tag,
              },
              index
            ) => (
              <li
                className="col-span-4 max-w-[410px] 3xl:max-w-[340px] 2xl:max-w-[312px] xl:max-w-[261px] lg:col-span-6 lg:max-w-[300px] md:max-w-none"
                key={index}
                ref={animationVisibilityRef}
              >
                <div className="flex items-end space-x-4 xl:space-x-3.5">
                  <div
                    id={`features-item-${index + 1}-icon`}
                    className="w-24 h-24 2xl:w-20 2xl:h-20 xl:w-[72px] xl:h-[72px] lg:w-16 lg:h-16"
                    ref={animationRef}
                    aria-hidden
                  />
                  {tag?.text && (
                    <span
                      className={clsx(
                        'inline-block font-mono t-sm px-2.5 border-2 rounded-full mr-3 py-1',
                        tag.className
                      )}
                    >
                      {tag.text}
                    </span>
                  )}
                </div>
                <Heading
                  id={`features-item-${index + 1}-title`}
                  className="mt-6 xl:mt-5"
                  tag="h3"
                  size="sm"
                  theme="white"
                >
                  <BlinkingText
                    text={title}
                    parentElement={animationEntry?.target}
                    shouldAnimationStart={isAnimationPlaying}
                  />
                </Heading>
                <p
                  id={`features-item-${index + 1}-description`}
                  className="mt-4 text-white t-xl xl:mt-3.5"
                >
                  {description}
                </p>
              </li>
            )
          )}
        </ul>
      </Container>
    </section>
  );
};

export default Features;
