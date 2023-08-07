'use client';

import useScrollPosition from '@react-hook/window-scroll';
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import useWindowSize from 'hooks/use-window-size';

const items = [
  {
    image: '/images/pages/pricing/metrics-1-mobile.jpg',
    name: 'Compute time',
    priceFrom: 'From $0.0255 /hour',
    details: 'Compute time is the amount of computing capacity used per hour.',
    prices: [
      {
        name: 'US East (N. Virginia)',
        price: '0.0255',
        unit: 'Compute-hour',
      },
      {
        name: 'US East (Ohio)',
        price: '0.0255',
        unit: 'Compute-hour',
      },
      {
        name: 'US West (Oregon)',
        price: '0.0255',
        unit: 'Compute-hour',
      },
      {
        name: 'Europe (Frankfurt)',
        price: '0.0295',
        unit: 'Compute-hour',
      },
      {
        name: 'Asia Pacific (Singapore)',
        price: '0.03025',
        unit: 'Compute-hour',
      },
    ],
  },
  {
    image: '/images/pages/pricing/metrics-4-mobile.jpg',
    name: 'Data transfer',
    priceFrom: 'From $0.09 /GiB',
    details: 'Data transfer is the volume of data transferred out of Neon.',
    prices: [
      {
        name: 'US East (N. Virginia)',
        price: '0.09',
        unit: 'GiB',
      },
      {
        name: 'US East (Ohio)',
        price: '0.09',
        unit: 'GiB',
      },
      {
        name: 'US West (Oregon)',
        price: '0.09',
        unit: 'GiB',
      },
      {
        name: 'Europe (Frankfurt)',
        price: '0.09',
        unit: 'GiB',
      },
      {
        name: 'Asia Pacific (Singapore)',
        price: '0.09',
        unit: 'GiB',
      },
    ],
  },
  {
    image: '/images/pages/pricing/metrics-2-mobile.jpg',
    name: 'Project storage',
    priceFrom: 'From $0.000164 /GiB-hour',
    details: 'Project storage is the volume of data and history in your Neon projects.',
    prices: [
      {
        name: 'US East (N. Virginia)',
        price: '0.000164',
        unit: 'GiB-hour',
      },
      {
        name: 'US East (Ohio)',
        price: '0.000164',
        unit: 'GiB-hour',
      },
      {
        name: 'US West (Oregon)',
        price: '0.000164',
        unit: 'GiB-hour',
      },
      {
        name: 'Europe (Frankfurt)',
        price: '0.00018',
        unit: 'GiB-hour',
      },
      {
        name: 'Asia Pacific (Singapore)',
        price: '0.00018',
        unit: 'GiB-hour',
      },
    ],
  },
  {
    image: '/images/pages/pricing/metrics-3-mobile.jpg',
    name: 'Written data',
    priceFrom: 'From $0.096 /GiB',
    details: 'Written data is the volume of data written from Neon compute to storage.',
    prices: [
      {
        name: 'US East (N. Virginia)',
        price: '0.096',
        unit: 'GiB',
      },
      {
        name: 'US East (Ohio)',
        price: '0.096',
        unit: 'GiB',
      },
      {
        name: 'US West (Oregon)',
        price: '0.096',
        unit: 'GiB',
      },
      {
        name: 'Europe (Frankfurt)',
        price: '0.096',
        unit: 'GiB',
      },
      {
        name: 'Asia Pacific (Singapore)',
        price: '0.096',
        unit: 'GiB',
      },
    ],
  },
];

const Metrics = () => {
  const sectionRef = useRef();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const { width: windowWidth, height: pageHeight } = useWindowSize();
  const scrollY = useScrollPosition();
  const [contentRef, isContentInView] = useInView({ triggerOnce: true });
  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/pricing/pricing.riv',
    autoplay: false,
    stateMachines: 'SM',
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });
  const animationStageInput = useStateMachineInput(rive, 'SM', 'Stage (0-6)', 0);

  useEffect(() => {
    if (rive && isContentInView) {
      rive.play();
    }
  }, [rive, isContentInView]);

  useEffect(() => {
    if (!animationStageInput) return;

    // change animation input on scroll UP
    if (
      (currentSectionIndex === 0 && animationStageInput.value === 1) ||
      (currentSectionIndex === 0 && animationStageInput.value === 5)
    ) {
      animationStageInput.value = 6;
    } else if (
      (currentSectionIndex === 1 && animationStageInput.value === 2) ||
      (currentSectionIndex === 1 && animationStageInput.value === 4)
    ) {
      animationStageInput.value = 5;
    } else if (
      (currentSectionIndex === 2 && animationStageInput.value === 3) ||
      (currentSectionIndex === 2 && animationStageInput.value === 3)
    ) {
      animationStageInput.value = 4;
    }
    // ... and on scroll DOWN
    else {
      animationStageInput.value = currentSectionIndex;
    }
  }, [currentSectionIndex, animationStageInput]);

  useEffect(() => {
    const currentScrollTop = scrollY;
    // 816 = 760 + 56
    const switchPointMultiplier = pageHeight < 975 ? 760 * 1 : pageHeight * 0.78;
    const switchPoints = [...Array(items.length + 1)].map(
      (_, index) => sectionRef.current.offsetTop + 130 + index * switchPointMultiplier - 200
    );

    switchPoints.forEach((_, index) => {
      if (currentScrollTop > switchPoints[index] && currentScrollTop < switchPoints[index + 1]) {
        setCurrentSectionIndex(index);
      }
    });
  }, [pageHeight, scrollY]);

  return (
    <section className="safe-paddings mt-[152px] xl:mt-40 lg:mt-28 md:mt-20" ref={sectionRef}>
      <div className="relative flex flex-col">
        <Container className="flex flex-col items-center" size="medium">
          <Heading className="text-center" badge="Metrics" tag="h2" size="2sm">
            Neon charges on <span className="text-pricing-primary-1">4 metrics</span>
          </Heading>
          <p className="mt-4 text-lg font-light leading-snug xl:text-base lg:mt-2 lg:text-center">
            Refer to our{' '}
            <Link
              className="!border-b !border-pricing-primary-3 font-normal duration-500 hover:!border-pricing-primary-1"
              theme="underline-primary-1"
              to={`${LINKS.docs}/introduction/billing`}
            >
              billing documentation
            </Link>{' '}
            for rates per region.
          </p>
        </Container>
        <Container
          className="grid h-full w-full grid-cols-12 items-start lg:px-6 md:grid-cols-1"
          size="sm"
        >
          <div className="relative col-span-7 col-start-1 h-full xl:col-span-6 lg:-ml-8 md:col-span-full md:hidden">
            <div className="sticky top-0 h-screen min-h-[1020px]">
              <div className="absolute flex h-full w-full items-center justify-center pl-20 pr-24 xl:pl-0 xl:pr-10">
                <RiveComponent width={590} height={830} aria-hidden />
              </div>
            </div>
          </div>
          <div className="col-span-5 col-start-8 text-left xl:col-span-6 md:col-span-full">
            <div className="lg:space-y-0" ref={contentRef}>
              {items.map(({ image, name, priceFrom, details, prices }, index) => (
                <motion.div
                  initial={{ opacity: windowWidth < 768 ? 1 : 0.3 }}
                  className="flex h-[78vh] min-h-[760px] flex-col justify-center px-6 xl:pl-3 xl:pr-0 lg:px-0 md:h-auto md:min-h-0 md:px-0"
                  key={index}
                  animate={{
                    opacity: currentSectionIndex === index || windowWidth < 768 ? 1 : 0.3,
                  }}
                >
                  <Image
                    className="md:my-13 my-14 hidden max-w-full md:mx-auto md:block md:max-w-[80%] sm:max-w-full"
                    width={590}
                    height={830}
                    src={image}
                    alt={`${name} illustration`}
                  />
                  <h2 className="text-4xl font-medium leading-tight tracking-tighter text-white xl:text-[28px]">
                    {name}
                    <span
                      className={clsx(
                        'block font-light',
                        index === 2 || index === 3 ? 'text-secondary-2' : 'text-pricing-primary-1'
                      )}
                    >
                      {priceFrom}
                    </span>
                  </h2>
                  <p className="mt-2 text-lg leading-tight tracking-tight xl:text-base">
                    {details}
                  </p>
                  <div className="mt-8 max-w-[464px] xl:mt-5">
                    <div className="grid grid-cols-2 gap-x-20 border-b border-[rgba(255,255,255,0.06)] py-2.5 text-[12px] uppercase leading-none text-gray-new-40 xl:gap-x-[20%] lg:gap-x-1">
                      <span>Region</span>
                      <span>Price</span>
                    </div>
                    {prices.map(({ name, price, unit }, index) => (
                      <div
                        className="text-gray-94 grid grid-cols-2 gap-x-20 border-b border-[rgba(255,255,255,0.06)] py-[15px] text-[15px] leading-none xl:gap-x-[20%] xl:py-3.5 lg:gap-x-1"
                        key={index}
                      >
                        <span>{name}</span>
                        <span>
                          ${price} /{' '}
                          <span className="font-light tracking-tight text-gray-new-70">{unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Metrics;
