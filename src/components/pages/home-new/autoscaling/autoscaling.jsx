'use client';

import clsx from 'clsx';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import CountingNumber from 'components/shared/animation/counting-number';
import Container from 'components/shared/container';
import autoscalingLegendIcon from 'icons/home-new/autoscaling/legend/autoscaling.svg';
import dbLoadLegendIcon from 'icons/home-new/autoscaling/legend/db-load.svg';
import resourceLegendIcon from 'icons/home-new/autoscaling/legend/resource.svg';
import avoidImageMd from 'images/pages/home-new/autoscaling/avoid-illustration-md.png';
import saveCostsImageMd from 'images/pages/home-new/autoscaling/save-costs-md.png';

import Heading from '../heading';

import Animation from './animation';

const TABS = ['Avoid outages', 'Save costs'];

const STATS = [
  {
    number: 13024,
    text: 'outages prevented by Autoscaling this year',
  },
  {
    prefix: '$',
    number: 4764912,
    text: 'dollars saved by Autoscaling this year',
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

  return (
    <section
      className="autoscaling safe-paddings relative scroll-mt-16 overflow-hidden bg-[#E4F1EB] pb-[105px] pt-[88px] xl:pb-20 xl:pt-16 lg:scroll-mt-0 lg:py-14 md:pt-9"
      id="autoscaling"
    >
      <Container
        className="relative grid h-full grid-cols-[224px_1fr] items-center gap-x-32 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:!px-16 md:!px-5"
        size="1600"
      >
        <div className="min-w-0">
          <Heading
            icon="autoscaling"
            theme="light"
            title="<strong>Advanced autoscaling.</strong> Scale further without worrying about the database. Never overpay for resources you don’t use."
          />

          <div className="group relative z-20 mt-16 w-fit xl:mt-14 lg:mt-12 md:mt-11">
            {TABS.map((item, index) => (
              <button
                className={clsx(
                  'relative h-11 min-w-[134px] whitespace-nowrap px-4 py-3 transition-colors duration-200',
                  'font-medium leading-none tracking-extra-tight',
                  'border border-gray-new-10 even:border-l-0',
                  'focus-visible:z-10',
                  'xl:h-10 xl:min-w-[130px] lg:h-9 lg:min-w-[124px] lg:px-3 lg:py-2.5 md:text-[14px]',
                  index === activeItem
                    ? 'bg-white text-gray-new-10'
                    : 'bg-[#E4F1EB] text-gray-new-10/80 hover:bg-white/70 hover:text-gray-new-10'
                )}
                key={index}
                type="button"
                onClick={() => setActiveItem(index)}
              >
                {item}
              </button>
            ))}
          </div>

          <div
            className={clsx(
              'relative z-10 mt-6 w-max max-w-none overflow-hidden',
              '3xl:max-w-[calc(50vw+408px)] 2xl:max-w-[calc(100%+32px)]',
              'xl:left-1/2 xl:w-screen xl:max-w-none xl:-translate-x-1/2 lg:mt-5'
            )}
            ref={animationWrapperRef}
          >
            <div className="aspect-[1378/480] w-[1378px] 3xl:max-w-full md:hidden">
              {isAnimationIntersecting && (
                <Animation
                  className="aspect-[1378/480] w-[1378px] 3xl:max-w-full md:hidden"
                  state={activeItem}
                />
              )}
            </div>
            <div className="hidden justify-center md:flex">
              <Image
                className={clsx('h-0 w-[768px] max-w-none', activeItem === 0 && '!h-auto')}
                src={avoidImageMd}
                width={768}
                height={560}
                alt=""
              />
              <Image
                className={clsx(
                  'h-0 w-[768px] max-w-none border-t border-gray-new-10',
                  activeItem === 1 && '!h-auto'
                )}
                src={saveCostsImageMd}
                width={768}
                height={280}
                alt=""
              />
            </div>

            <div className="relative z-20 -mt-8 border-b border-gray-new-10 bg-[#CAE6D9] px-3 py-2.5 2xl:-mt-7 xl:-mt-6">
              <LazyMotion features={domAnimation}>
                {STATS.map(({ prefix, number, text }, index) => {
                  if (index !== activeItem) {
                    return null;
                  }

                  return (
                    <m.p
                      className="text-pretty font-mono-new uppercase text-[#285D49] xl:text-sm lg:text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      key={index}
                    >
                      <span className="font-semibold">
                        {prefix}
                        <CountingNumber number={number} started />
                      </span>
                      <span className="ml-2 font-medium">{text}</span>
                    </m.p>
                  );
                })}
              </LazyMotion>
            </div>
          </div>

          <div className="relative z-20 mt-6 flex items-start justify-between gap-10 text-black-pure xl:mt-6 lg:mt-5 lg:flex-col lg:gap-10 md:gap-8">
            <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-2.5 xl:mt-0 lg:gap-x-7 xs:flex-col">
              {LEGEND.map((item, index) => (
                <li
                  className="flex items-center gap-x-2.5 whitespace-nowrap text-[15px] leading-snug tracking-extra-tight xl:gap-x-2 md:text-[14px]"
                  key={index}
                >
                  <Image src={item.icon} width={16} height={16} loading="lazy" alt="" />
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
            <p className="relative max-w-[480px] shrink-0 text-[18px] leading-normal tracking-extra-tight xl:-right-8 xl:max-w-[352px] lg:right-0 lg:max-w-[480px] md:text-[15px]">
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
