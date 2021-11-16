import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import useLottie from 'hooks/use-lottie';

import costEfficientAnimationData from './data/cost-efficient-lottie-data.json';
import easyToUseAnimationData from './data/easy-to-use-lottie-data.json';
import scalableAnimationData from './data/scalable-lottie-data.json';
import PlayIcon from './images/play.inline.svg';

const Advantages = () => {
  const [animationVisibilityRef, isInView] = useInView({
    threshold: [0.6, 0],
  });

  const { animationRef: scalableAnimationRef } = useLottie({
    lottieOptions: {
      animationData: scalableAnimationData,
    },
    isInView,
  });

  const { animationRef: costEfficientAnimationRef } = useLottie({
    lottieOptions: {
      animationData: costEfficientAnimationData,
    },
    isInView,
  });

  const { animationRef: easyToUseAnimationRef } = useLottie({
    lottieOptions: {
      animationData: easyToUseAnimationData,
    },
    isInView,
  });

  const items = [
    {
      animationRef: scalableAnimationRef,
      title: 'Scalable',
      description:
        'Separation of storage and compute. allows Zenith reconfigure amount of the compute power on the fly.',
    },
    {
      animationRef: costEfficientAnimationRef,
      title: 'Cost Efficient',
      description:
        'Being serverless allows using of resources on-demand, which significantly cuts the costs.',
    },
    {
      animationRef: easyToUseAnimationRef,
      title: 'Easy to Use',
      description:
        'No complex onboarding needed. Use a single CLI command to create a new Zenith database.',
    },
  ];

  return (
    <section
      id="advantages"
      className="bg-black py-80 safe-paddings 3xl:py-72 2xl:py-64 xl:py-52 lg:py-40 md:py-36"
    >
      <Container className="z-20">
        <div className="flex items-center space-x-[100px] 3xl:space-x-[76px] 2xl:space-x-[64px] xl:space-x-[50px] lg:flex-col lg:items-start lg:space-x-0">
          <div
            id="advantages-video-wrapper"
            className="relative max-w-[800px] 3xl:max-w-[680px] 2xl:max-w-[560px] xl:max-w-[510px] lg:max-w-full lg:mt-10"
          >
            <StaticImage
              className="rounded"
              src="../advantages/images/cover.jpg"
              alt=""
              aria-hidden
            />
            <button
              className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 group"
              type="button"
            >
              <PlayIcon
                className="relative h-24 rounded-full transition-transform duration-200 group-hover:scale-[1.1] 3xl:h-[82px] 2xl:h-[68px] xl:h-[62px] lg:h-[86px] md:h-12"
                style={{ boxShadow: '0px 10px 20px rgba(26, 26, 26, 0.4)' }}
              />
            </button>
          </div>
          <div className="lg:order-first">
            <Heading
              id="advantages-title"
              className="max-w-[490px] 2xl:max-w-[385px] xl:max-w-[300px] lg:max-w-[500px]"
              tag="h2"
              size="lg"
              theme="white"
            >
              Distributed Database, Made Simple
            </Heading>
            <p
              id="advantages-description"
              className="max-w-[600px] t-xl mt-5 text-white 2xl:max-w-[520px] 2xl:mt-4 lg:max-w-full"
            >
              Go through our 5 minutes tutorials video and start using scalable, cost efficient
              database architecture for your project.
            </p>
          </div>
        </div>
        <ul
          className="grid grid-cols-12 mt-40 grid-gap 3xl:mt-36 2xl:mt-32 xl:mt-24 lg:gap-y-16 lg:mt-20 md:grid-cols-1"
          ref={animationVisibilityRef}
        >
          {items.map(({ animationRef, title, description }, index) => (
            <li
              className="col-span-4 max-w-[410px] 3xl:max-w-[340px] 2xl:max-w-[312px] xl:max-w-[260px] lg:col-span-6 lg:max-w-[300px] md:max-w-none"
              key={index}
            >
              <div
                id={`advantages-item-${index + 1}-icon`}
                className="w-24 h-24 2xl:w-20 2xl:h-20 xl:w-[72px] xl:h-[72px] lg:w-16 lg:h-16"
                ref={animationRef}
                aria-hidden
              />
              <Heading
                id={`advantages-item-${index + 1}-title`}
                className="mt-6 xl:mt-5"
                tag="h3"
                size="sm"
                theme="white"
              >
                {title}
              </Heading>
              <p
                id={`advantages-item-${index + 1}-description`}
                className="mt-4 text-white t-xl xl:mt-3.5"
              >
                {description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default Advantages;
