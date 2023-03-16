'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import circleSvg from './images/circle.svg';

const items = [
  {
    type: 'Prototype',
    metrics: [
      {
        name: 'Compute hours',
        usage: '56 hrs',
        details: '224 hrs * 0.25 Compute Units',
        price: '$7.17',
      },
      {
        name: 'Project storage',
        usage: '0.6 GiB',
        price: '$0.03',
      },
      {
        name: 'Written data',
        usage: '0.2 GiB',
        price: '$0.02',
      },
      {
        name: 'Data transfer',
        usage: '0.01 GiB',
        price: '$0.001',
      },
    ],
  },
  {
    type: 'Launch',
    metrics: [
      {
        name: 'Compute hours',
        usage: '1,460 hrs',
        details: '730 hrs * 2 Compute Units',
        price: '$187',
      },
      {
        name: 'Project storage',
        usage: '22 GiB',
        price: '$2',
      },
      {
        name: 'Written data',
        usage: '4 GiB',
        price: '$0.38',
      },
      {
        name: 'Data transfer',
        usage: '3 GiB',
        price: '$0.27',
      },
    ],
  },
  {
    type: 'Scale',
    metrics: [
      {
        name: 'Compute hours',
        usage: '38,000 hrs',
        details: '19,000 hrs * 2 Compute Units',
        price: '$4,966',
      },
      {
        name: 'Project storage',
        usage: '115 GiB',
        price: '$10',
      },
      {
        name: 'Written data',
        usage: '260 GiB',
        price: '$25',
      },
      {
        name: 'Data transfer',
        usage: '74 GiB',
        price: '$7',
      },
    ],
  },
];

const gridClassName =
  'grid grid-cols-[34%_auto_16%] gap-x-10 2xl:grid-cols-[30%_auto_16%] xl:grid-cols-[29%_auto_19%] lg:grid-cols-[28%_auto_16%]';

const Estimates = () => {
  const [selected, setSelected] = useState(items[0].type);

  const handleSelect = (item) => {
    setSelected(item);
  };

  return (
    <section className="estimates safe-paddings mt-48 2xl:mt-40 xl:mt-32 lg:mt-24 md:mt-20">
      <Container size="mdDoc">
        <div className="mx-auto flex max-w-[972px] flex-col items-center">
          <span className="text-center text-lg uppercase leading-snug text-primary-1">
            Billing & usage estimates
          </span>
          <h2 className="mt-2.5 inline-flex flex-col text-center text-5xl font-bold leading-tight 2xl:max-w-[968px] 2xl:text-[44px] 2xl:leading-snug xl:text-4xl lg:inline lg:text-[36px] lg:leading-tight">
            <span>Each user is unique.</span> However, we can give you some estimates.
          </h2>
          <p className="mt-7 text-center text-xl 2xl:mt-5 xl:text-base">
            <Link className="font-semibold" theme="underline-primary-1" to={LINKS.contactSales}>
              Contact sales
            </Link>{' '}
            if you require assistance forecasting billing and usage.
          </p>
          <ul className="mt-[53px] mb-12 grid w-full grid-cols-3 gap-x-7 2xl:mx-auto 2xl:max-w-[801px] xl:mb-8 xl:mt-10 xl:max-w-[616px] xl:gap-x-5 lg:mb-6 lg:mt-7 md:mt-6 md:mb-5 md:gap-x-4 sm:gap-x-2.5 xs:grid-cols-1 xs:gap-y-2">
            {items.map(({ type }, index) => (
              <li key={index}>
                <button
                  className={clsx(
                    'w-full rounded-[80px] border py-6 text-lg font-bold leading-none transition-colors duration-200 hover:border-white hover:text-white xl:py-4 md:py-3',
                    type === selected
                      ? 'border-white text-white'
                      : 'border-dashed border-gray-4 text-gray-4'
                  )}
                  type="button"
                  onClick={() => handleSelect(type)}
                >
                  {type}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Container className="no-scrollbars md:-mx-4 md:overflow-x-auto md:px-4" size="mdDoc">
          <LazyMotion features={domAnimation}>
            <AnimatePresence initial={false} mode="wait">
              {items.map(({ type, metrics }, index) => {
                const totalPrice = metrics.reduce(
                  (acc, { price }) => acc + Number(price.slice(1).replace(/,/g, '')),
                  0
                );
                const formattedPrice = totalPrice.toFixed(2).replace(/\.00$/, '');
                const formattedPriceWithCommas = formattedPrice.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ','
                );

                return type === selected ? (
                  <m.div
                    className="mx-auto w-full max-w-[740px] rounded-2xl bg-gray-1 p-10 2xl:max-w-[592px] 2xl:p-7 xl:max-w-[616px] lg:max-w-[584px] lg:p-6 lg:pb-8 md:min-w-[584px] md:max-w-none"
                    key={index}
                    initial={{
                      opacity: 0,
                      translateY: 10,
                    }}
                    animate={{
                      opacity: 1,
                      translateY: 0,
                      transition: { duration: 0.3 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.2 },
                    }}
                    transition={{ ease: [0.25, 0.1, 0, 1] }}
                  >
                    <div
                      className={clsx(
                        'mb-4 font-semibold uppercase leading-none tracking-[0.02em] text-gray-6',
                        gridClassName
                      )}
                    >
                      <span>Billing metric</span>
                      <span>Avg usage</span>
                      <span>Avg price</span>
                    </div>
                    {metrics.map(({ name, usage, details, price }, index) => (
                      <div
                        className={clsx(
                          'border-b border-gray-2 py-3.5 font-semibold',
                          gridClassName
                        )}
                        key={index}
                      >
                        <span className="">{name}</span>
                        <span className="inline-flex flex-col">
                          <span>
                            {usage} <span className="text-gray-6">/month</span>
                          </span>
                          <span className="font-normal text-gray-6">{details}</span>
                        </span>
                        <span className="text-primary-1">{price}</span>
                      </div>
                    ))}
                    <div className={clsx('mt-3.5 text-xl font-semibold', gridClassName)}>
                      <span className="col-span-2 inline-flex flex-col">
                        <span className="uppercase">Total:</span>
                      </span>
                      <span className="relative text-primary-1">
                        ${formattedPriceWithCommas}
                        <img
                          className="absolute -top-4 left-1/2 h-auto w-[107px] max-w-none -translate-x-[calc(50%+16px)] 2xl:-top-3.5 xl:-translate-x-[calc(50%+18px)] lg:-top-4 sm:-translate-x-[calc(50%+8px)]"
                          src={circleSvg}
                          width={107}
                          height={63}
                          alt=""
                          loading="lazy"
                          aria-hidden
                        />
                      </span>
                    </div>
                    <span className="mt-3 block text-base font-normal text-gray-6">
                      *Pricing is based off of US East (Ohio)
                    </span>
                  </m.div>
                ) : null;
              })}
            </AnimatePresence>
          </LazyMotion>
        </Container>
      </Container>
    </section>
  );
};

export default Estimates;
