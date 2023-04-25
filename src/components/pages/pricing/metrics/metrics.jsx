'use client';

import { Transition } from '@headlessui/react';
import useScrollPosition from '@react-hook/window-scroll';
import clsx from 'clsx';
import React, { useState, useRef, useLayoutEffect, useMemo, createRef } from 'react';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import useWindowSize from 'hooks/use-window-size';

const buttons = ['Cloud Journey', 'Training', 'Engineering', 'Training v2'];

const items = [
  {
    image: '/images/pricing/1.png',
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
    image: '/images/pricing/2.png',
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
    image: '/images/pricing/3.png',
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
    image: '/images/pricing/4.png',
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
  const slideRefs = useMemo(() => [...Array(buttons.length)].map(() => createRef()), []);
  const { height: pageHeight } = useWindowSize();
  const scrollY = useScrollPosition();

  useLayoutEffect(() => {
    const currentScrollTop = scrollY;
    const switchPoints = [...Array(buttons.length + 1)].map(
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
          <span className="rounded-full bg-[rgba(19,236,182,0.1)] py-[7px] px-[14px] text-[12px] font-semibold uppercase leading-none tracking-[0.02em] text-primary-1">
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
              {items.map(({ image, name }, index) => (
                <Transition
                  className="h-full w-full"
                  show={currentSlide === index}
                  enter="transition-opacity duration-1000"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-1000"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  unmount={false}
                  key={index}
                >
                  <div
                    className={clsx(
                      'absolute my-20 flex h-full w-full items-center justify-center',
                      {
                        hidden: currentSlide !== index,
                      }
                    )}
                  >
                    <img
                      className="h-auto w-full max-w-[710px]"
                      width={590}
                      height={830}
                      src={image}
                      // inView={itemsInView[index]}
                      loading="lazy"
                      alt={`${name  } illustration`}
                    />
                  </div>
                </Transition>
              ))}
            </div>
          </div>
          <div className="col-span-5 col-start-8 text-left">
            <div className="space-y-14 lg:space-y-0">
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
