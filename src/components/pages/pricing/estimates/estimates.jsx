'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
// import Tooltip from 'components/shared/tooltip';
import LINKS from 'constants/links';
import infoHoveredIcon from 'icons/tooltip-hovered.svg';
import infoIcon from 'icons/tooltip.svg';

import ScaleIcon from './svg/fullsize-icon.inline.svg';
import ProtoIcon from './svg/gear-icon.inline.svg';
import LaunchIcon from './svg/spaceship-icon.inline.svg';

const items = [
  {
    type: 'Prototype',
    icon: ProtoIcon,
    metrics: [
      {
        name: 'Compute hours',
        usage: '70 hrs',
        details: '281 hrs * 0.25 Compute Units',
        price: '$7.17',
      },
      {
        name: 'Project storage',
        usage: '0.6 GiB',
        price: '$0.07',
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
    icon: LaunchIcon,
    metrics: [
      {
        name: 'Compute hours',
        usage: '1,825 hrs',
        details: '730 hrs * 2.5 Compute Units',
        price: '$186.15',
      },
      {
        name: 'Project storage',
        usage: '22 GiB',
        price: '$2.63',
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
    icon: ScaleIcon,
    metrics: [
      {
        name: 'Compute hours',
        usage: '48,904 hrs',
        details: '12,226 hrs * 4 Compute Units',
        price: '$4,988',
      },
      {
        name: 'Project storage',
        usage: '115 GiB',
        price: '$14',
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
  'grid grid-cols-[32%_auto_16%] gap-x-10 xl:grid-cols-[29%_auto_19%] lg:grid-cols-[28%_auto_16%]';

const Estimates = () => {
  const [selected, setSelected] = useState(items[0].type);

  const handleSelect = (item) => {
    setSelected(item);
  };

  return (
    <section className="estimates safe-paddings mt-[22rem] 2xl:mt-40 xl:mt-32 lg:mt-24 md:mt-20">
      <Container size="mdDoc">
        <div className="mx-auto flex max-w-[1220px] items-center justify-between gap-4 lg:flex-col lg:gap-16">
          <div className="w-[48%] lg:flex lg:w-full lg:flex-col lg:items-center">
            <Heading
              className="lg:text-center"
              badge="Billing & usage estimates"
              tag="h2"
              size="2sm"
            >
              <span className="text-pricing-primary-1">Each user is unique.</span> However, we can
              give you some estimates.
            </Heading>
            <p className="mt-4 text-lg font-light leading-snug 2xl:mt-5 xl:text-base lg:text-center">
              <Link
                className="!border-b !border-pricing-primary-3 font-normal hover:!border-pricing-primary-1"
                theme="underline-primary-1"
                to={LINKS.contactSales}
              >
                Contact sales
              </Link>{' '}
              if you require assistance forecasting billing and usage. Pricing is based on the US
              East (Ohio) region
            </p>
          </div>
          <div className="w-[38%] xl:overflow-x-hidden lg:w-full">
            <ul className="flex gap-8 py-2 lg:mx-auto lg:max-w-[584px] lg:px-6 md:max-w-full md:px-0 xs:gap-4">
              {items.map(({ type, icon: Icon }, index) => (
                <li key={index}>
                  <button
                    className={clsx(
                      'flex gap-1.5 border-b pb-1.5 text-sm font-medium uppercase leading-none tracking-wider text-white transition-colors duration-200',
                      type === selected && index === 0
                        ? '!border-pricing-primary-1 !text-pricing-primary-1'
                        : 'border-transparent',
                      type === selected && index === 1
                        ? '!border-secondary-2 !text-secondary-2'
                        : 'border-transparent',
                      type === selected && index === 2
                        ? '!border-pricing-secondary-9 !text-pricing-secondary-9'
                        : 'border-transparent',
                      index === 0 && 'hover:text-pricing-primary-1',
                      index === 1 && 'hover:text-secondary-2',
                      index === 2 && 'hover:text-pricing-secondary-9'
                    )}
                    type="button"
                    onClick={() => handleSelect(type)}
                  >
                    <Icon className="" />
                    {type}
                  </button>
                </li>
              ))}
            </ul>
            <Container
              className="no-scrollbars mt-7 2xl:!px-0 md:-mx-4 md:overflow-x-auto md:px-0"
              size="mdDoc"
            >
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
                        <div className="mx-auto w-full xl:max-w-[616px] lg:max-w-[584px] lg:p-6 lg:pb-8 md:min-w-[584px] md:max-w-none md:px-4">
                          <div
                            className={clsx(
                              'border-b border-[rgba(255,255,255,0.06)] pb-3 text-[12px] uppercase leading-none tracking-wider text-pricing-gray-4',
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
                                'border-b border-[rgba(255,255,255,0.06)] py-2.5 text-[15px] tracking-[-0.02em] text-[#EFEFF0]',
                                gridClassName
                              )}
                              key={index}
                            >
                              <span>{name}</span>
                              <span className="inline-flex items-center gap-x-2.5 xl:flex-col xl:items-start">
                                <span className="">
                                  {usage} <span className="text-pricing-gray-7">/month</span>
                                </span>
                                {details && (
                                  <span className="relative">
                                    <span
                                      className="group peer cursor-pointer xl:hidden"
                                      data-tooltip-id={`${name}-${index}`}
                                      data-tooltip-content={details}
                                    >
                                      <img
                                        className="group-hover:hidden"
                                        src={infoIcon}
                                        width={14}
                                        height={14}
                                        loading="lazy"
                                        alt=""
                                      />
                                      <img
                                        className="hidden group-hover:block"
                                        src={infoHoveredIcon}
                                        width={14}
                                        height={14}
                                        loading="lazy"
                                        alt=""
                                      />
                                    </span>
                                    <span className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm bg-pricing-gray-2 p-2 text-sm font-normal leading-none text-pricing-gray-6 opacity-0 transition-opacity duration-200 peer-hover:opacity-100 xl:static xl:mt-1.5 xl:translate-y-0 xl:whitespace-normal xl:bg-transparent	 xl:p-0 xl:opacity-100">
                                      {details}
                                    </span>
                                    <span className="absolute left-[calc(100%+6px)] top-1/2 h-0 w-0 -translate-y-1/2 border-b-4 border-r-4 border-t-4 border-transparent border-r-pricing-gray-2 opacity-0 transition-opacity duration-200 peer-hover:opacity-100 xl:hidden" />
                                  </span>
                                )}
                              </span>
                              <span className="text-[15px] text-[#EFEFF0]">{price}</span>
                            </div>
                          ))}
                          <div className={clsx('mt-2 text-base font-medium', gridClassName)}>
                            <span className="col-span-2 inline-flex flex-col">
                              <span className="uppercase text-[#EFEFF0]">Total price:</span>
                            </span>
                            <span className="relative tracking-[0.04em] text-pricing-primary-1">
                              ${formattedPriceWithCommas}
                            </span>
                          </div>
                        </div>
                      </m.div>
                    ) : null;
                  })}
                </AnimatePresence>
              </LazyMotion>
            </Container>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Estimates;
