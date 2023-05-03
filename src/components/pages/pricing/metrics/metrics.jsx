'use client';

import useScrollPosition from '@react-hook/window-scroll';
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash.debounce';
import { useRef, useEffect, useCallback, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

const items = [
  {
    image: '/images/pages/pricing/metrics-1-mobile.jpg',
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
    image: '/images/pages/pricing/metrics-2-mobile.jpg',
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
    image: '/images/pages/pricing/metrics-3-mobile.jpg',
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
    image: '/images/pages/pricing/metrics-4-mobile.jpg',
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
  const topRef = useRef(null);
  const anchorRef = useRef(null);
  const riveRef = useRef(null);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

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
    if (currentSectionIndex >= 2) {
      riveRef.current.style.transform = 'translateY(-20%)';
    } else {
      riveRef.current.style.transform = 'translateY(0)';
    }
  }, [currentSectionIndex]);

  const calcStickyTopValue = useCallback(() => {
    const content = document.querySelector('#pricing-content');
    const sticky = document.querySelector('#pricing-sticky');

    const { scrollY, innerHeight } = window;

    const anchorDocumentGap = anchorRef.current?.getBoundingClientRect().y || 0;
    const stickyDocumentGap = (content?.getBoundingClientRect().y || 0) + scrollY;
    const anchorWindowGap = (innerHeight - (anchorRef.current?.clientHeight || 0)) / 2;

    const stickyTopValue = scrollY + anchorDocumentGap - stickyDocumentGap - anchorWindowGap;

    topRef.current = stickyTopValue;

    content.style.height = `${
      (content?.clientHeight || 0) + (anchorRef.current?.clientHeight || 0) * items.length
    }px`;
    sticky.style.position = 'sticky';
    sticky.style.top = `${stickyTopValue * -1}px`;
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debauncedCalcStickyTopValue = useCallback(debounce(calcStickyTopValue, 300), []);

  useEffect(() => {
    calcStickyTopValue();

    window.addEventListener('resize', debauncedCalcStickyTopValue);

    return () => window.removeEventListener('resize', debauncedCalcStickyTopValue);
  }, [calcStickyTopValue, debauncedCalcStickyTopValue]);

  useEffect(() => {
    const delta = scrollY - topRef.current;
    const height = anchorRef.current?.clientHeight || 0;

    const sectionIdx = items.findIndex((_, idx) => delta < height * (idx + 1));

    if (sectionIdx !== -1 && sectionIdx !== currentSectionIndex) {
      setCurrentSectionIndex(sectionIdx);
    }
  }, [currentSectionIndex, scrollY]);

  return (
    <section className="safe-paddings pb-80 pt-60 3xl:py-36 lg:pt-32" ref={contentRef}>
      <Container className="relative z-10 flex flex-col items-center" size="md">
        <Heading className="text-center" badge="Metrics" tag="h2" size="2sm">
          Neon charges on <span className="text-pricing-primary-1">4 metrics</span>
        </Heading>
        <p className="mt-4 text-lg font-light leading-snug xl:text-base lg:mt-2 lg:text-center">
          Refer to our{' '}
          <Link
            className="!border-b !border-pricing-primary-3 font-normal hover:!border-pricing-primary-1"
            theme="underline-primary-1"
            to={`${LINKS.docs}introduction/billing`}
          >
            billing documentation
          </Link>{' '}
          for rates per region.
        </p>
      </Container>
      <Container className="relative z-0 pt-52 3xl:pt-20 lg:pt-16" size="md">
        <div className="h-[367px] 3xl:h-[326px] lg:h-[324px]" ref={anchorRef}>
          <div className="grid-gap-x grid h-full grid-cols-12">
            <div className="col-span-5 col-start-2 3xl:col-span-6 3xl:col-start-1">
              <div
                className="relative -top-[200px] transition-transform duration-700 3xl:-top-[100px] lg:-top-[50px]"
                ref={riveRef}
              >
                <div className="aspect-[0.6086956522] w-[590px] 3xl:mx-auto 3xl:w-[390px] lg:w-[320px]">
                  {isContentInView ? <RiveComponent /> : null}
                </div>
              </div>
            </div>
            <div className="col-span-5 col-start-8 3xl:col-span-6 3xl:col-start-7">
              <AnimatePresence>
                {items.map(
                  ({ name, priceFrom, details, prices }, idx) =>
                    currentSectionIndex === idx && (
                      <motion.div
                        key={idx}
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: 'auto' },
                          collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <h2 className="text-4xl font-medium leading-tight tracking-tighter text-white xl:text-[28px]">
                          {name}
                          <span className="block font-light text-pricing-primary-1">
                            {priceFrom}
                          </span>
                        </h2>
                        <p className="mt-2 text-lg leading-tight tracking-tight xl:text-base">
                          {details}
                        </p>
                        <div className="mt-8 max-w-[464px] xl:mt-5">
                          <div className="grid grid-cols-2 gap-x-20 border-b border-[rgba(255,255,255,0.06)] py-2.5 text-[12px] uppercase leading-none text-pricing-gray-4 xl:gap-x-[20%] lg:gap-x-1">
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
                                <span className="font-light tracking-tight text-pricing-gray-7">
                                  {unit}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Metrics;
