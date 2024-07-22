'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import { useState, useMemo } from 'react';

import Field from 'components/shared/field';
import ChevronIcon from 'icons/chevron-down.inline.svg';

import BgDecor from '../bg-decor';

import leftGlowMobile from './images/left-glow-mobile.png';
import leftGlow from './images/left-glow.png';
import rightGlowMobile from './images/right-glow-mobile.png';
import rightGlow from './images/right-glow.png';

const databases = [
  {
    type: '1 production database',
    instance: 'db.r6g.8xlarge',
    usage: 'Runs 24/7',
  },
  {
    type: '1 staging database',
    instance: 'db.r6g.4xlarge',
    usage: 'Used interminently',
  },
  {
    type: 'Dev database',
    instance: '10 db.t4g.micro',
    usage: 'Used interminently',
  },
  {
    type: 'Test database ',
    instance: 'db.t3.medium',
    usage: 'Used interminently',
  },
];

const instancePrices = {
  prod: 2.25,
  staging: 1.125,
  testing: 0.0376,
  dev: 0.016,
};

const values = [
  {
    name: 'wasted_money',
    title: 'Dollars overpaid',
    valueClassName: 'bg-variable-value-1',
    period: 'month',
  },
  {
    name: 'saved_money',
    title: 'Bill that could be saved ',
    period: 'month',
    valueClassName: 'bg-variable-value-2',
    text: 'With scale to zero and autoscaling',
  },
];

const variantsAnimation = {
  open: {
    opacity: 1,
    height: 'auto',
    pointerEvents: 'auto',
  },
  closed: {
    opacity: 0,
    height: 0,
    pointerEvents: 'none',
  },
};

const inputParamsBlock = [
  {
    title: 'Deployment',
    items: [
      {
        name: 'test_databases_num',
        title: 'Number of test databases',
        values: [1, 3, 5, 10],
        defaultValue: 1,
      },
      {
        name: 'dev_databases_num',
        title: 'Number of dev databases',
        values: [1, 3, 5, 10],
        defaultValue: 5,
      },
    ],
  },
  {
    title: 'Usage',
    items: [
      {
        name: 'test_databases_daily_hrs',
        title: 'How many hrs/day are test databases&nbsp;running? ',
        values: [1, 2, 3, 5, 8],
      },
      {
        name: 'dev_databases_daily_hrs',
        title: 'How many hrs/day are dev databases&nbsp;running? ',
        values: [1, 2, 3, 5, 8],
      },
      {
        name: 'staging_databases_daily_hrs',
        title: 'How many hrs/day is staging running? ',
        values: [2, 5, 8],
      },
      {
        name: 'peak_traffic_hrs',
        title: 'How many hrs/ day do you hit&nbsp;peak&nbsp;traffic? ',
        values: [0.5, 1, 3, 5],
      },
    ],
  },
];

const DashedBorder = () => (
  <>
    <span
      className="pointer-events-none relative z-20 block h-px w-full bg-[url('/images/pages/variable/dashed-border.png')] bg-[8px,1px] bg-repeat-x mix-blend-overlay"
      aria-hidden
    />
    <span
      className="pointer-events-none relative z-10 -mt-px block h-px w-full bg-[url('/images/pages/variable/dashed-border.png')] bg-[8px,1px] bg-repeat-x opacity-50 mix-blend-overlay"
      aria-hidden
    />
  </>
);

const Calculator = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggler = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const [inputParams, setInputParams] = useState({
    test_databases_num: 1,
    dev_databases_num: 5,
    test_databases_daily_hrs: 2,
    dev_databases_daily_hrs: 8,
    staging_databases_daily_hrs: 5,
    peak_traffic_hrs: 1,
  });

  const handleSelect = (e, name) => {
    setInputParams({ ...inputParams, [name]: e.target.value });
  };

  const instanceCost = useMemo(
    () => ({
      production: instancePrices.prod * 730,
      staging: instancePrices.staging * 730,
      testing: instancePrices.testing * 730 * inputParams.test_databases_num,
      development: instancePrices.dev * 730 * inputParams.dev_databases_num,
    }),
    [inputParams]
  );

  const totalCost = useMemo(
    () => Object.values(instanceCost).reduce((acc, cost) => acc + cost, 0),
    [instanceCost]
  );

  const userCost = useMemo(
    () => ({
      // TO-DO: fix calc bug here for production
      production:
        (instancePrices.prod * inputParams.peak_traffic_hrs +
          (24 - instancePrices.prod) * 0.3 * inputParams.peak_traffic_hrs) *
        30.4166,
      testing:
        instancePrices.testing *
        inputParams.test_databases_daily_hrs *
        inputParams.test_databases_num *
        30.4166,
      development:
        instancePrices.dev *
        inputParams.dev_databases_daily_hrs *
        inputParams.dev_databases_num *
        30.4166,
    }),
    [inputParams]
  );

  const wastedMoney = useMemo(
    () => ({
      production: instanceCost.production - userCost.production,
      testing: instanceCost.testing - userCost.testing,
      development: instanceCost.development - userCost.development,
    }),
    [instanceCost, userCost]
  );

  const totalWastedMoney = useMemo(
    () => Object.values(wastedMoney).reduce((acc, cost) => acc + cost, 0),
    [wastedMoney]
  );

  const totalSavedMoney = useMemo(
    () => (totalWastedMoney / totalCost) * 100,
    [totalCost, totalWastedMoney]
  );

  const totals = useMemo(
    () => ({
      wasted_money: `$${totalWastedMoney.toFixed(0)}`,
      saved_money: `${totalSavedMoney.toFixed(0)}%`,
    }),
    [totalWastedMoney, totalSavedMoney]
  );

  return (
    <div className="relative my-3 w-full overflow-hidden rounded-lg bg-[#0D0E10] px-8 py-6 sm:my-2 sm:p-6">
      <div className="relative z-10 pb-[18px]">
        <h3 className="mb-5 text-2xl font-medium leading-snug tracking-tighter xl:text-xl sm:mb-4 sm:text-lg">
          Example deployment in RDS
        </h3>
        <ul className="space-y-2 text-lg tracking-extra-tight sm:text-sm sm:leading-snug">
          {databases.map(({ type, instance, usage }) => (
            <li key={type} className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-0">
              <span>
                <span className="font-medium text-gray-new-90">{type}</span>{' '}
                <span className="text-gray-new-70">({instance})</span>
              </span>
              <span
                className="block size-[3px] rounded-full bg-gray-new-30 sm:hidden"
                aria-hidden
              />
              <span className="text-gray-new-50">{usage}</span>
            </li>
          ))}
        </ul>
      </div>
      <DashedBorder />
      <div className="relative z-10 py-[18px] sm:py-4">
        <button
          className="flex items-center justify-between"
          type="button"
          aria-expanded={isOpen}
          onClick={handleToggler}
        >
          <h3 className="text-2xl font-medium leading-snug tracking-tighter xl:text-xl sm:text-lg">
            Input parameters
            <ChevronIcon className="ml-2.5 inline-block h-auto w-3" />
          </h3>
        </button>

        <LazyMotion features={domAnimation}>
          <m.div
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
            variants={variantsAnimation}
            transition={{
              opacity: { duration: 0.2 },
              height: { duration: 0.3 },
            }}
          >
            <div className="space-y-6 pt-6">
              {inputParamsBlock.map(({ title, items }) => (
                <div key={title}>
                  <p className="mb-3.5 font-medium uppercase leading-none tracking-extra-tight text-gray-new-40 sm:text-sm">
                    {title}
                  </p>
                  <ul className="space-y-1.5 sm:space-y-4">
                    {items.map(({ name, title, values }) => (
                      <li
                        className="flex items-center justify-between gap-2 sm:flex-col sm:items-start"
                        key={title}
                      >
                        <p
                          className="text-lg leading-none tracking-extra-tight text-gray-new-90 sm:text-base sm:leading-tight"
                          dangerouslySetInnerHTML={{ __html: title }}
                        />
                        <Field
                          className="w-[98px] sm:w-full"
                          name={title}
                          labelClassName="hidden"
                          inputClassName="remove-autocomplete-styles !m-0 !h-8 !px-3 !border-[1px] !border-gray-new-15 !bg-[#0D0E10] !text-base text-white placeholder:tracking-extra-tight focus:outline-none !focus:border-white sm:placeholder:text-sm !bg-[center_right_12px]"
                          tag="select"
                          onChange={(e) => handleSelect(e, name)}
                        >
                          {values?.map((option, index) => (
                            <option
                              value={option}
                              key={index}
                              selected={name === inputParams[name]}
                            >
                              {option}
                            </option>
                          ))}
                        </Field>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </m.div>
        </LazyMotion>
      </div>
      <DashedBorder />
      <div className="relative z-10 flex justify-between pt-6 sm:flex-col sm:gap-6">
        {values.map(({ name, title, valueClassName, period, text }) => (
          <div key={title} className="min-w-[239px]">
            <p className="mb-2.5 leading-dense tracking-extra-tight lg:mb-2">{title}</p>
            <div className="flex items-end gap-1.5">
              <span
                className={clsx(
                  'bg-clip-text pr-1 font-title text-6xl font-medium leading-none tracking-tighter text-transparent xl:text-[56px] lg:pr-0.5 lg:text-5xl sm:text-4xl',
                  valueClassName
                )}
              >
                {totals[name]}
              </span>
              <span className="mb-1 text-xl text-[#7485A9] xl:mb-0 sm:text-lg">/{period}</span>
            </div>
            {text && (
              <p className="bg-variable-value-text bg-clip-text text-sm font-light leading-dense tracking-extra-tight text-transparent">
                {text}
              </p>
            )}
          </div>
        ))}
      </div>
      <BgDecor hasBorder hasNoise hasPattern>
        <Image
          className="absolute right-0 top-0 h-[776px] w-[617px] sm:hidden"
          src={rightGlow}
          width={617}
          height={776}
          alt=""
        />
        <Image
          className="absolute right-0 top-0 hidden h-[536px] w-[320px] sm:block"
          src={rightGlowMobile}
          width={320}
          height={536}
          alt=""
        />
        <Image
          className="absolute bottom-0 left-0 h-[339px] w-[389px] sm:hidden"
          src={leftGlow}
          width={389}
          height={339}
          alt=""
        />
        <Image
          className="absolute bottom-0 left-0 hidden h-[273px] w-[320px] sm:block"
          src={leftGlowMobile}
          width={320}
          height={273}
          alt=""
        />
      </BgDecor>
    </div>
  );
};

export default Calculator;
