'use client';

import clsx from 'clsx';
import { useState } from 'react';

import Button from 'components/shared/button/button';
import Container from 'components/shared/container/container';
import LinesIllustration from 'components/shared/lines-illustration';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import ArrowIcon from 'icons/arrow-sm.inline.svg';

import ChevronDownIcon from './images/chevron-down.inline.svg';
import InputSearchIcon from './images/input-search.inline.svg';

const activities = [
  {
    title: 'Always active',
    description: 'Users are active 24/7 and requires instant connection.',
  },
  {
    title: 'Only during business days',
    description: 'Users access app only within business hours.',
  },
  {
    title: 'Rarely active',
    description: 'Users rarely access the app. Less than 10% compute usage.',
  },
];

// @TODO: Replace with real data
const performance = [
  {
    title: '0.25 vCPU, 1GB RAM',
    description: 'Starts from $0.0082/h',
  },
  {
    title: '0.5 vCPU, 2GB RAM',
    description: 'Starts from $0.0164/h',
  },
  {
    title: '1 vCPU, 4GB RAM',
    description: 'Starts from $0.0328/h',
  },
];

// @TODO: Replace with real data
const storage = [
  {
    title: '1GB',
    description: 'Starts from $0.000164 / GiB-hour',
  },
  {
    title: '10GB',
    description: 'Starts from $0.00164 / GiB-hour',
  },
  {
    title: '100GB',
    description: 'Starts from $0.0164 / GiB-hour',
  },
];

const Forecast = () => {
  const [activeItems, setActiveItems] = useState({
    activity: activities[0],
    performance: performance[0],
    storage: storage[0],
  });

  return (
    <section className="forecast safe-paddings pt-[200px] pb-60">
      <Container className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lg:gap-x-4" size="medium">
        <div className="col-start-2 col-span-5 -mr-10">
          <h2 className="text-6xl leading-none font-medium tracking-tighter">
            Forecasting is easy
          </h2>
          <p className="text-lg leading-snug font-light mt-4 max-w-[464px]">
            Follow a simple survey to quickly estimate potential monthly bill based on your app
            users’ activity.
          </p>
        </div>

        <div className="col-end-12 col-span-4 -ml-10">
          <div>
            <p className="text-lg leading-snug font-light mt-4 max-w-[255px]">
              Need an additional help or custom volume-based plans
            </p>
            <Link
              className="mt-3.5 py-[7px] px-3 text-[15px] border border-green-45 rounded-[50px] inline-flex items-baseline leading-none text-green-45 tracking-extra-tight"
              to={LINKS.contactSales}
            >
              Contact Sales
              <ArrowIcon className="ml-1" />
            </Link>
          </div>

          <div className="mt-[91px]">
            <span className="text-green-45 font-medium leading-none -tracking-extra-tight">
              Activity
            </span>
            <h3 className="text-4xl tracking-tighter leading-dense font-light mt-3.5">
              How active your users?
            </h3>
            <ul className="mt-7 grid gap-y-5">
              {activities.map(({ title, description }) => (
                <li key={title}>
                  <button
                    className={clsx(
                      'pt-5 w-full flex flex-col px-6 pb-6 border rounded-[10px] hover:border-green-45 duration-200 transition-colors',
                      activeItems.activity.title === title
                        ? 'border-green-45'
                        : 'border-gray-new-15'
                    )}
                    type="button"
                    onClick={() =>
                      setActiveItems({ ...activeItems, activity: { title, description } })
                    }
                  >
                    <h4 className="text-xl font-medium leading-tight">{title}</h4>
                    <p className="text-left mt-2 text-gray-new-70 font-light leading-tight text-[15px]">
                      {description}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-40">
            <span className="text-yellow-70 leading-none font-medium -tracking-extra-tight">
              Performance
            </span>
            <h3 className="text-4xl tracking-tighter leading-dense font-light mt-3.5">
              What peak performance is needed for your app?
            </h3>

            <button
              className="mt-7 pt-5 w-full flex items-center px-6 pb-6 border border-gray-new-15 rounded-[10px] hover:border-green-45 duration-200 transition-colors"
              type="button"
            >
              <div className="flex flex-col items-start">
                <h4 className="text-xl font-medium leading-tight">0.25 vCPU, 1GB RAM</h4>
                <p className="text-left mt-2 text-gray-new-70 font-light leading-tight text-[15px]">
                  Starts from $0.0082/h
                </p>
              </div>
              <ChevronDownIcon className="w-6 h-6 mt-2 ml-auto" />
            </button>
          </div>

          <div className="mt-40">
            <span className="text-blue-80 leading-none font-medium -tracking-extra-tight">
              Storage
            </span>
            <h3 className="text-4xl tracking-tighter leading-dense font-light mt-3.5">
              How much storage is required?
            </h3>
            <button
              className="mt-7 pt-5 w-full flex items-center px-6 pb-6 border border-gray-new-15 rounded-[10px] hover:border-green-45 duration-200 transition-colors"
              type="button"
            >
              <div className="flex flex-col items-start">
                <h4 className="text-xl font-medium leading-tight">1GB</h4>
                <p className="text-left mt-2 text-gray-new-70 font-light leading-tight text-[15px]">
                  Starts from $0.000164 / GiB-hour
                </p>
              </div>
              <ChevronDownIcon className="w-6 h-6 mt-2 ml-auto" />
            </button>
          </div>

          <div className="mt-40 py-7 px-8 border border-green-45 rounded-[10px] overflow-hidden">
            <p className="font-medium -tracking-extra-tight leading-none">Estimated price</p>
            <p className="mt-6">
              <span className="text-6xl text-green-45 leading-none font-light tracking-[-0.06em]">
                $24.50
              </span>
              <span className="tracking-[-0.06em] text-2xl leading-none inline-block ml-1">
                / mo
              </span>
            </p>
            <p className="mt-2 text-[15px] font-light text-gray-new-70 leading-tight">
              The price calculated for Ohio region
            </p>

            <ul className="mt-6 pt-7 border-t border-gray-new-15 flex flex-col gap-y-[18px]">
              {Object.values(activeItems).map(({ title }) => (
                <li className="flex items-center" key={title}>
                  <InputSearchIcon className="mr-3.5 w-8 h-8" />
                  <span className="text-lg font-medium leading-tight tracking-extra-tight">
                    {title}
                  </span>
                </li>
              ))}
            </ul>
            <div className="relative mt-8">
              <Button
                className="w-full relative z-20 !font-semibold tracking-extra-tight"
                theme="primary"
                size="new-lg"
              >
                Sign up and start
              </Button>
              <LinesIllustration className="z-10 !w-[125%]" color="#00E599" />
            </div>

            <p className="mt-11 relative z-10 text-base leading-snug font-light text-gray-new-80">
              <strong className="font-medium text-white">Want to learn more?</strong> For advanced
              users we highly recommend explore our billing documentation.{' '}
              <Link
                className="inline-flex items-baseline font-normal text-[15px] leading-none tracking-extra-tight"
                theme="green"
                to={LINKS.billing}
              >
                Billing docs
                <ArrowIcon className="ml-1" />
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

Forecast.propTypes = {};

export default Forecast;
