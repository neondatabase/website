'use client';

import useScrollPosition from '@react-hook/window-scroll';
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas';
import clsx from 'clsx';
import React, { useState, useRef, useMemo, createRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import useWindowSize from 'hooks/use-window-size';

const items = [
  {
    name: 'Compute time',
    priceFrom: 'From $0.102 /hour',
    details: 'Compute time is the amount of computing capacity used per hour.',
    prices: [
      {
        name: 'US East (Ohio)',
        price: '0.102',
        unit: 'Compute-hour',
      },
      {
        name: 'US West (Oregon)',
        price: '0.102',
        unit: 'Compute-hour',
      },
      {
        name: 'Europe (Frankfurt)',
        price: '0.118',
        unit: 'Compute-hour',
      },
      {
        name: 'Asia Pacific (Singapore)',
        price: '0.121',
        unit: 'Compute-hour',
      },
    ],
  },
  {
    name: 'Project storage',
    priceFrom: 'From $0.000164 /Gigabyte-hour',
    details: 'Project storage is the amount of data and history in your Neon projects.',
    prices: [
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
    name: 'Written data',
    priceFrom: 'From $0.096 /Gigabyte',
    details: 'Written data is the amount of data written from Neon compute to storage.',
    prices: [
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
  {
    name: 'Data transfer',
    priceFrom: 'From $0.09 /Gigabyte',
    details: 'Data transfer is the amount of data transferred out of Neon.',
    prices: [
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
];

const Metrics = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef();
  const slideRefs = useMemo(() => [...Array(items.length)].map(() => createRef()), []);
  const { height: pageHeight } = useWindowSize();
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
  const animationStageInput = useStateMachineInput(rive, 'SM', 'Stage (0-3)', 0);
  const animationReverseInput = useStateMachineInput(rive, 'SM', 'Reverse', false);

  useEffect(() => {
    if (rive && isContentInView) {
      rive.play();
    }
  }, [rive, isContentInView]);

  useEffect(() => {
    if (!animationStageInput || !animationReverseInput) return;

    animationReverseInput.value = currentSlide < animationStageInput.value;
    animationStageInput.value = currentSlide;
  }, [currentSlide, animationStageInput, animationReverseInput]);

  useEffect(() => {
    const currentScrollTop = scrollY;
    const switchPoints = [...Array(items.length + 1)].map(
      (_, index) => sectionRef.current.offsetTop + pageHeight * index - pageHeight + 700
    );

    switchPoints.forEach((_, index) => {
      if (currentScrollTop > switchPoints[index] && currentScrollTop < switchPoints[index + 1]) {
        setCurrentSlide(index);
      }
    });
  }, [pageHeight, scrollY]);

  return (
    <section className="safe-paddings mt-40 lg:mt-24 md:mt-20" ref={sectionRef}>
      <div className="relative flex flex-col">
        <Container className="flex flex-col items-center" size="mdDoc">
          <span className="rounded-full bg-[rgba(19,236,182,0.1)] px-[14px] py-[7px] text-[12px] font-semibold uppercase leading-none tracking-[0.02em] text-primary-1">
            Metrics
          </span>
          <h2 className="mt-3 text-[56px] font-medium leading-none tracking-tighter 2xl:text-[44px] 2xl:leading-snug xl:text-4xl lg:text-center lg:text-[36px] lg:leading-tight">
            Neon charges on <span className="text-primary-1">4 metrics</span>
          </h2>
          <p className="mt-4 text-lg font-light leading-snug 2xl:mt-5 xl:text-base lg:text-center">
            Refer to our{' '}
            <Link
              className="!border-b font-normal"
              theme="underline-primary-1"
              to={`${LINKS.docs}introduction/billing`}
            >
              billing documentation
            </Link>{' '}
            for rates per region.
          </p>
        </Container>
        <Container className="grid h-full w-full grid-cols-12 items-start xs:gap-8" size="sm">
          <div className="relative col-span-7 col-start-1 h-full">
            <div className="sticky top-0 h-screen min-h-[770px] 2xl:min-h-[835px]">
              <div
                className={clsx('absolute flex h-full w-full items-center justify-center px-16')}
              >
                <RiveComponent width={590} height={830} aria-hidden />
              </div>
            </div>
          </div>
          <div className="col-span-5 col-start-8 text-left">
            <div className="space-y-14 lg:space-y-0" ref={contentRef}>
              {items.map(({ name, priceFrom, details, prices }, index) => (
                <div
                  className="flex h-screen min-h-[900px] flex-col justify-center px-6 2xl:min-h-[835px] lg:min-h-[770px]"
                  key={name}
                  ref={slideRefs[index]}
                >
                  <h2 className="text-4xl font-medium leading-tight tracking-tighter text-white">
                    {name}
                    <span className="block font-light text-primary-1">{priceFrom}</span>
                  </h2>
                  <p className="mt-2 text-lg leading-tight tracking-tight">{details}</p>
                  <div className="mt-8 max-w-[464px]">
                    <div className="grid grid-cols-2 gap-x-20 border-b border-[rgba(255,255,255,0.06)] py-3 text-[12px] uppercase leading-none text-gray-4">
                      <span className="">Region</span>
                      <span className="">Price</span>
                    </div>
                    {prices.map(({ name, price, unit }, index) => (
                      <div
                        className="grid grid-cols-2 gap-x-20 border-b border-[rgba(255,255,255,0.06)] py-3 text-[15px] leading-none text-[#EFEFF0]"
                        key={index}
                      >
                        <span className="">{name}</span>
                        <span className="">
                          ${price} /{' '}
                          <span className="font-light tracking-tight text-gray-7">${unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Metrics;
