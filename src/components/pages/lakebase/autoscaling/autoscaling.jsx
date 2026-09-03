'use client';

import { m, LazyMotion, domAnimation } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import CountingNumber from 'components/shared/animation/counting-number';
import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import { lakebasePageContent } from 'constants/backend-platform-page-content';
import autoscalingLegendIcon from 'icons/lakebase/autoscaling/legend/autoscaling.svg';
import dbLoadLegendIcon from 'icons/lakebase/autoscaling/legend/db-load.svg';
import resourceLegendIcon from 'icons/lakebase/autoscaling/legend/resource.svg';
import autoscalingMobileImage from 'images/pages/home/autoscaling/autoscaling-mobile.png';
import saveCostsMobileImage from 'images/pages/home/autoscaling/save-costs-mobile.png';
import { cn } from 'utils/cn';

import Animation from './animation';

const { autoscaling } = lakebasePageContent;
const LEGEND_ICONS = [autoscalingLegendIcon, dbLoadLegendIcon, resourceLegendIcon];

const Autoscaling = () => {
  const [animationWrapperRef, isAnimationIntersecting] = useInView({
    triggerOnce: true,
    rootMargin: '500px 0px',
  });
  const [activeItem, setActiveItem] = useState(0);
  const { ref: statsRef, inView: isStatsInView } = useInView();

  return (
    <section
      className="autoscaling relative scroll-mt-16 overflow-hidden bg-gray-new-10 pt-[92px] safe-paddings pb-[124px] text-white lg:scroll-mt-0 lg:py-[80px] md:py-[56px]"
      id="autoscaling"
      aria-labelledby="lakebase-autoscaling-heading"
      data-figma-node-id="37601:20363"
    >
      <Container size="1344">
        <div>
          <SectionLabel className="mb-[14px] md:mb-[16px]" theme="white">
            {autoscaling.label}
          </SectionLabel>
          <h2
            className="max-w-[1024px] text-[56px] leading-dense tracking-tighter text-white xl:text-5xl lg:text-[36px] md:text-[32px] sm:text-[26px]"
            id="lakebase-autoscaling-heading"
          >
            {autoscaling.title}
          </h2>
          <p className="mt-6 max-w-[589px] text-lg leading-normal tracking-extra-tight text-gray-new-60 md:text-base">
            {autoscaling.description}
          </p>
        </div>

        <div className="mt-[89px] xl:mt-[64px] lg:mt-[48px] md:mt-[32px]">
          <div className="relative pt-[55px] md:pt-0" ref={animationWrapperRef}>
            <div className="absolute top-0 left-0 z-20 flex md:static md:mb-[24px]">
              {autoscaling.tabs.map(({ label }, index) => (
                <button
                  className={cn(
                    'relative flex h-11 min-w-33.5 items-center justify-center border border-gray-new-30 px-4 whitespace-nowrap transition-colors duration-200',
                    'leading-none font-medium tracking-extra-tight',
                    'even:border-l-0 focus-visible:z-10',
                    'xl:h-10 xl:min-w-32.5 lg:h-9 lg:min-w-31 lg:px-3 md:text-sm',
                    index === activeItem
                      ? 'bg-gray-new-20 text-white'
                      : 'bg-transparent text-white/60 hover:bg-gray-new-20 hover:text-white'
                  )}
                  key={label}
                  type="button"
                  aria-pressed={index === activeItem}
                  onClick={() => setActiveItem(index)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="relative aspect-1344/293 w-full overflow-hidden md:hidden">
              {isAnimationIntersecting && (
                <Animation className="absolute inset-0 h-full w-full" state={activeItem} />
              )}
            </div>
            <div className="-mx-5 hidden md:block">
              {activeItem === 0 && (
                <Image
                  className="h-auto w-full"
                  src={autoscalingMobileImage}
                  sizes="(max-width: 767px) 100%, 1344px"
                  quality={100}
                  alt=""
                />
              )}
              {activeItem === 1 && (
                <Image
                  className="h-auto w-full"
                  src={saveCostsMobileImage}
                  sizes="(max-width: 767px) 100%, 1344px"
                  quality={100}
                  alt=""
                />
              )}
            </div>

            <div className="relative z-20 flex min-h-[36px] items-center border-b border-gray-new-30 bg-gray-new-15 px-[12px] md:-mx-5 md:py-[8px]">
              <LazyMotion features={domAnimation}>
                {autoscaling.tabs.map(({ prefix, number, text }, index) => {
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

          <div className="mt-[29px] flex items-start justify-between gap-[40px] text-gray-new-80 xl:gap-[32px] lg:gap-[24px] md:mt-[24px] md:flex-col">
            <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-2.5 xl:mt-0 lg:gap-x-7 xs:flex-col xs:gap-y-3">
              {autoscaling.legend.map((text, index) => (
                <li
                  className="flex items-center gap-x-2.5 text-[0.9375rem] leading-snug tracking-extra-tight whitespace-nowrap xl:gap-x-2 md:text-sm/snug"
                  key={text}
                >
                  <Image
                    className="sm:size-3.5"
                    src={LEGEND_ICONS[index]}
                    width={16}
                    height={16}
                    loading="lazy"
                    alt=""
                  />
                  <p>{text}</p>
                </li>
              ))}
            </ul>
            <p className="w-[480px] max-w-full shrink-0 text-[18px] leading-normal tracking-extra-tight xl:w-[40%] md:w-full md:text-[15px]/snug">
              {autoscaling.caption}
            </p>
          </div>
        </div>

        <ol className="mt-31 grid grid-cols-3 gap-16 xl:mt-20 xl:gap-20 lg:mt-16 lg:gap-8 md:mt-12 md:grid-cols-1 md:gap-10">
          {autoscaling.features.map(({ title, description }, index) => (
            <li
              className="flex min-w-0 flex-col gap-40 border-l border-gray-new-20 pl-6 tracking-extra-tight xl:gap-30 lg:gap-20 lg:pl-5 md:gap-8 md:border-none md:pl-0"
              key={title}
            >
              <span className="font-mono text-[18px] leading-normal md:text-[16px]" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[28px] leading-tight tracking-extra-tight xl:text-[24px] lg:text-[22px]">
                  {title}
                </h3>
                <p className="mt-3 text-[18px] leading-normal text-gray-new-70 md:mt-[8px] md:text-[16px]">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
};

export default Autoscaling;
