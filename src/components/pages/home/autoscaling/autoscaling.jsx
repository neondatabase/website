'use client';

import { m, LazyMotion, domAnimation } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import CountingNumber from 'components/shared/animation/counting-number';
import Container from 'components/shared/container';
import autoscalingLegendIcon from 'icons/home/autoscaling/legend/autoscaling.svg';
import dbLoadLegendIcon from 'icons/home/autoscaling/legend/db-load.svg';
import resourceLegendIcon from 'icons/home/autoscaling/legend/resource.svg';
import autoscalingMobileImage from 'images/pages/home/autoscaling/autoscaling-mobile.png';
import saveCostsMobileImage from 'images/pages/home/autoscaling/save-costs-mobile.png';
import { cn } from 'utils/cn';

import Animation from './animation';

const TABS = ['Avoid outages', 'Save costs'];

const STATS = [
  {
    number: 13024,
    text: 'outages prevented by Autoscaling this year',
  },
  {
    prefix: '$',
    number: 345966,
    text: 'saved by Autoscaling every day',
  },
];

const LEGEND = [
  {
    icon: autoscalingLegendIcon,
    text: 'Neon autoscaling',
  },
  {
    icon: dbLoadLegendIcon,
    text: 'Database load',
  },
  {
    icon: resourceLegendIcon,
    text: 'Fixed-resource provisioned',
  },
];

const Autoscaling = () => {
  const [animationWrapperRef, isAnimationIntersecting] = useInView({
    triggerOnce: true,
    rootMargin: '500px 0px',
  });
  const [activeItem, setActiveItem] = useState(0);
  const { ref: statsRef, inView: isStatsInView } = useInView();

  return (
    <section
      className="autoscaling relative scroll-mt-16 overflow-hidden bg-gray-new-10 pt-40 safe-paddings pb-40 text-white xl:py-32 lg:scroll-mt-0 lg:py-20 md:py-14"
      id="autoscaling"
    >
      <Container
        className="relative grid h-full grid-cols-[14rem_1fr] gap-x-32 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:px-8! md:px-5!"
        size="1600"
      >
        <div className="min-w-0">
          <h2
            className={cn(
              'max-w-272 indent-24 text-4xl leading-dense tracking-tighter text-pretty text-gray-new-50',
              'xl:max-w-200 xl:text-[2.25rem] lg:indent-16 lg:text-[1.75rem] md:indent-0 md:text-[1.375rem] md:tracking-tighter'
            )}
          >
            <strong className="font-normal text-white">
              Automatic scaling adapts to your application,
            </strong>{' '}
            removing capacity planning and delivering the right infrastructure at every stage of
            growth.
          </h2>

          <div
            className={cn(
              'relative z-10 mt-17 w-max max-w-none pt-14 lg:pt-0',
              '3xl:max-w-[calc(50vw+25.5rem)] 2xl:max-w-[calc(100%+2rem)]',
              'xl:left-1/2 xl:w-full xl:max-w-none xl:-translate-x-1/2 lg:mt-10 md:mt-11 md:w-full'
            )}
            ref={animationWrapperRef}
          >
            <div className="group absolute top-0 left-0 z-20 flex lg:static lg:mb-6 md:mt-8 md:mb-4">
              {TABS.map((item, index) => (
                <button
                  className={cn(
                    'relative flex h-11 min-w-33.5 items-center justify-center border border-gray-new-30 px-4 whitespace-nowrap transition-colors duration-200',
                    'leading-none font-medium tracking-extra-tight',
                    'even:border-l-0 focus-visible:z-10',
                    'xl:h-10 xl:min-w-32.5 lg:h-9 lg:min-w-31 lg:px-3 md:text-sm',
                    index === activeItem
                      ? 'bg-gray-new-20 text-white'
                      : 'bg-gray-new-10 text-white/60 hover:bg-gray-new-20 hover:text-white'
                  )}
                  key={item}
                  type="button"
                  aria-pressed={index === activeItem}
                  onClick={() => setActiveItem(index)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="relative aspect-1378/300 w-344.5 overflow-hidden 3xl:max-w-full xl:left-1/2 xl:w-screen xl:max-w-none xl:-translate-x-1/2 md:hidden">
              {isAnimationIntersecting && (
                <Animation className="absolute inset-0 h-full w-full" state={activeItem} />
              )}
            </div>
            <div className="hidden md:-mx-5 md:block md:w-[calc(100%+2.5rem)]">
              {activeItem === 0 && (
                <Image
                  className="h-auto w-full"
                  src={autoscalingMobileImage}
                  sizes="200vw"
                  quality={100}
                  alt=""
                />
              )}
              {activeItem === 1 && (
                <Image
                  className="h-auto w-full"
                  src={saveCostsMobileImage}
                  sizes="200vw"
                  quality={100}
                  alt=""
                />
              )}
            </div>

            <div className="relative z-20 flex min-h-9 items-center border-b border-gray-new-30 bg-gray-new-15 px-3 xl:left-1/2 xl:w-screen xl:-translate-x-1/2 xl:px-16 lg:px-8 md:px-5 md:py-2">
              <LazyMotion features={domAnimation}>
                {STATS.map(({ prefix, number, text }, index) => {
                  if (index !== activeItem) {
                    return null;
                  }

                  return (
                    <m.p
                      className="font-mono text-base leading-none font-medium text-balance text-[#ACACAC] uppercase xl:text-sm lg:text-xs/snug"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      key={index}
                      ref={statsRef}
                    >
                      <span className="font-semibold">
                        {prefix}
                        <CountingNumber
                          number={number}
                          transition={{ stiffness: 560, damping: 50 }}
                          started={isStatsInView}
                        />
                      </span>
                      <span className="ml-2 font-medium">{text}</span>
                    </m.p>
                  );
                })}
              </LazyMotion>
            </div>
          </div>

          <div className="relative z-20 mt-7 flex items-start justify-between gap-10 text-gray-new-80 3xl:grid 3xl:w-[calc(100%+(100vw-100%)/2-12rem)] 3xl:grid-cols-2 xl:mt-6 xl:w-full lg:mt-5 lg:gap-8 md:flex md:flex-col">
            <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-2.5 xl:mt-0 lg:gap-x-7 xs:flex-col xs:gap-y-3">
              {LEGEND.map(({ text, icon }) => (
                <li
                  className="flex items-center gap-x-2.5 text-[0.9375rem] leading-snug tracking-extra-tight whitespace-nowrap xl:gap-x-2 md:text-sm/snug"
                  key={text}
                >
                  <Image
                    className="sm:size-3.5"
                    src={icon}
                    width={16}
                    height={16}
                    loading="lazy"
                    alt=""
                  />
                  <p>{text}</p>
                </li>
              ))}
            </ul>
            <p className="max-w-120 shrink-0 text-lg leading-normal tracking-extra-tight md:text-[0.9375rem]/snug">
              Neon monitors your database load ten times a second and autoscales CPU and memory to
              exactly fit your workload.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Autoscaling;
