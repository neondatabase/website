'use client';

import * as Slider from '@radix-ui/react-slider';
import clsx from 'clsx';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import LINKS from 'constants/links';
import ArrowRight from 'icons/arrow-right-thin.inline.svg';
import CheckIcon from 'icons/check.inline.svg';
import InfoIcon from 'icons/info.inline.svg';

const COMPUTE_TIME_PRICE = 0.102;
const PROJECT_STORAGE_PRICE = 0.000164;
const PROJECT_STORAGE_HOURS = 24;
const DATA_TRANSFER_PRICE = 0.09;
const WRITTEN_DATA_PRICE = 0.096;
const PERCENTAGE_OF_MONTHLY_COST = 0.1;
const AVERAGE_DAYS_IN_MONTH = 30.416666;
const CUSTOM_THRESHOLD = 416;

const COMPUTE_UNITS_VALUES = {
  min: 0.25,
  max: 2.25,
  step: 0.25,
  default: 0.75,
};

const COMPUTE_TIME_VALUES = {
  min: 0.5,
  max: 24,
  step: 1,
  default: 10,
};

const STORAGE_VALUES = {
  min: 1,
  max: 200,
  default: 50,
};

const COMPUTE_UNITS_RANGES = {
  0.25: '1/4',
  0.5: '1/2',
  0.75: '1',
  1: '2',
  1.25: '3',
  1.5: '4',
  1.75: '5',
  2: '6',
  2.25: '7',
};

const calculateComputeCost = (computeUnits, activeTime) =>
  computeUnits * activeTime * COMPUTE_TIME_PRICE * AVERAGE_DAYS_IN_MONTH;

const calculateStorageCost = (storageValue) =>
  storageValue * PROJECT_STORAGE_HOURS * PROJECT_STORAGE_PRICE * AVERAGE_DAYS_IN_MONTH;

const calculateDataTransferCost = (dataTransferValue) => dataTransferValue * DATA_TRANSFER_PRICE;

const calculateWrittenDataCost = (writtenDataValue) => writtenDataValue * WRITTEN_DATA_PRICE;

const Calculator = () => {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [computeUnits, setComputeUnits] = useState(1);
  const [activeTime, setActiveTime] = useState(COMPUTE_TIME_VALUES.default);
  const [storageValue, setStorageValue] = useState(STORAGE_VALUES.default);
  const [dataTransferValue, setDataTransferValue] = useState(10);
  const [writtenDataValue, setWrittenDataValue] = useState(10);
  const [writtenAndTransferDataCost, setWrittenAndTransferDataCost] = useState(0);

  const computeTimeCost = useMemo(
    () => calculateComputeCost(computeUnits, activeTime),
    [computeUnits, activeTime]
  );

  const storageCost = useMemo(() => calculateStorageCost(storageValue), [storageValue]);

  const dataTransferCost = useMemo(
    () => calculateDataTransferCost(dataTransferValue),
    [dataTransferValue]
  );

  const writtenDataCost = useMemo(
    () => calculateWrittenDataCost(writtenDataValue),
    [writtenDataValue]
  );

  const totalCost = useMemo(
    () => computeTimeCost + storageCost + writtenAndTransferDataCost,
    [computeTimeCost, storageCost, writtenAndTransferDataCost]
  );

  const estimatedPrice = `$${totalCost.toFixed(2)}`;

  useEffect(
    () =>
      isAdvanced
        ? setWrittenAndTransferDataCost(dataTransferCost + writtenDataCost)
        : setWrittenAndTransferDataCost(totalCost * PERCENTAGE_OF_MONTHLY_COST),
    [dataTransferCost, isAdvanced, totalCost, writtenDataCost]
  );

  return (
    <section className="faq safe-paddings mb-40 mt-[17.25rem] 2xl:my-32 xl:my-28 lg:my-24 md:my-20">
      <Container size="mdDoc">
        <div className="mx-auto flex max-w-[972px] flex-col items-center">
          <Heading className="text-center lg:inline" badge="Pricing Calculator" tag="h2" size="2sm">
            Calculate your monthly bill based <br className="sm:hidden" /> on compute time and
            storage
          </Heading>
        </div>
        <div className="mx-auto mt-16 grid max-w-[968px] grid-cols-[1fr_298px] gap-x-[40px] gap-y-[20px] xl:mt-10 lg:grid-cols-1 sm:mt-6">
          <div className="row-span-1 flex rounded-[10px] bg-pricing-gray-10 md:flex-col">
            <div className="grow p-5 xl:px-6 xl:py-5 md:px-5 md:pb-3">
              <h3 className="text-sm font-medium uppercase leading-none tracking-wider text-pricing-secondary-9">
                Compute time
              </h3>
              <div className="mt-5 grid grid-cols-2 items-center gap-2 md:mt-7">
                <h4 className="text-sm leading-none tracking-tight text-pricing-gray-9">
                  <span>Compute size</span>
                  <Tooltip
                    id="compute"
                    content="Compute size is measured in Compute Units (CU). In Neon, a CU has 1 vCPU and 4 GB of RAM. The number of CUs defines the processing power of your Neon compute."
                  />
                </h4>
                <Slider.Root
                  className="relative col-span-2 row-start-2 flex h-1 w-full grow touch-none items-center"
                  defaultValue={[COMPUTE_UNITS_VALUES.default]}
                  min={COMPUTE_UNITS_VALUES.min}
                  max={COMPUTE_UNITS_VALUES.max}
                  step={COMPUTE_UNITS_VALUES.step}
                  aria-label="Compute units"
                  onValueChange={(value) => {
                    let computeUnitsValue = value[0];

                    if (value[0] >= 0.75)
                      computeUnitsValue = Number(COMPUTE_UNITS_RANGES[value[0]]);

                    setComputeUnits(computeUnitsValue);
                  }}
                >
                  <Slider.Track className="relative h-[2px] w-full grow rounded-[10px] bg-pricing-gray-3">
                    <Slider.Range className="absolute h-full rounded-full bg-pricing-primary-1" />
                  </Slider.Track>
                  <Slider.Thumb
                    className={clsx(
                      'flex cursor-pointer items-center justify-center rounded-full',
                      'focus-visible:ring-purple-500 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75'
                    )}
                  >
                    <span className="h-2.5 w-1 rounded-[1px] bg-pricing-primary-1" />
                  </Slider.Thumb>
                </Slider.Root>
                <p className="text-right text-sm leading-none tracking-tight text-pricing-gray-9">
                  <span className="after:mx-2 after:inline-block after:h-[4px] after:w-[4px] after:rounded-full after:bg-pricing-primary-1 after:align-middle">
                    {computeUnits <= 0.5 ? COMPUTE_UNITS_RANGES[computeUnits] : computeUnits}vCPU
                  </span>
                  <span>{computeUnits * 4}GB RAM</span>
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 items-center gap-2 xl:mt-6 lg:mt-6">
                <h4 className="text-sm leading-none tracking-tight text-pricing-gray-9">
                  Active time
                  <Tooltip
                    id="activeTime"
                    content="The number of hours per day that your compute resources are active, on average."
                  />
                </h4>
                <Slider.Root
                  className="relative col-span-2 row-start-2 flex h-1 w-full grow touch-none items-center"
                  defaultValue={[COMPUTE_TIME_VALUES.default]}
                  min={COMPUTE_TIME_VALUES.min}
                  max={COMPUTE_TIME_VALUES.max}
                  step={COMPUTE_TIME_VALUES.step}
                  aria-label="Active time"
                  onValueChange={(value) => setActiveTime(value[0])}
                >
                  <Slider.Track className="relative h-[2px] w-full grow rounded-[10px] bg-pricing-gray-3">
                    <Slider.Range className="absolute h-full rounded-full bg-pricing-primary-1" />
                  </Slider.Track>
                  <Slider.Thumb
                    className={clsx(
                      'flex cursor-pointer items-center justify-center rounded-full',
                      'focus-visible:ring-purple-500 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75'
                    )}
                  >
                    <span className="h-2.5 w-1 rounded-[1px] bg-pricing-primary-1" />
                  </Slider.Thumb>
                </Slider.Root>
                <p className="text-right text-sm leading-none tracking-tight">
                  {activeTime} hour{activeTime <= 1 ? '' : 's'}{' '}
                  <span className="text-pricing-gray-7">per day</span>
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 border-t border-dashed border-pricing-gray-2 pb-2 pt-6 text-pricing-gray-94 ">
                <p className="text-sm font-medium leading-none">
                  <span className="uppercase">Subtotal: </span>
                  <span className="text-pricing-primary-1">${computeTimeCost.toFixed(2)} </span>
                  <span className="font-normal text-pricing-gray-7">per month</span>
                </p>
                <p className="text-right text-sm leading-none">
                  ${COMPUTE_TIME_PRICE} <span className="text-pricing-gray-7">per hour</span>
                </p>
              </div>
            </div>
          </div>

          <div className="row-span-1 flex rounded-[10px] bg-pricing-gray-10 md:flex-col">
            <div className="grow p-5 xl:px-6 xl:py-5 md:px-5 md:pb-3">
              <h3 className="text-sm font-medium uppercase leading-none tracking-wider text-pricing-secondary-9">
                Project storage
              </h3>
              <div className="mt-5 grid grid-cols-2 items-center gap-2 md:mt-7">
                <h4 className="text-sm leading-none tracking-tight text-pricing-gray-9">Data</h4>
                <Slider.Root
                  className="relative col-span-2 row-start-2 flex h-1 w-full grow touch-none items-center"
                  defaultValue={[STORAGE_VALUES.default]}
                  min={STORAGE_VALUES.min}
                  max={STORAGE_VALUES.max}
                  aria-label="Compute units"
                  onValueChange={(value) => setStorageValue(value[0])}
                >
                  <Slider.Track className="relative h-[2px] w-full grow rounded-[10px] bg-pricing-gray-3">
                    <Slider.Range className="absolute h-full rounded-full bg-pricing-primary-1" />
                  </Slider.Track>
                  <Slider.Thumb
                    className={clsx(
                      'flex cursor-pointer items-center justify-center rounded-full',
                      'focus-visible:ring-purple-500 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75'
                    )}
                  >
                    <span className="h-2.5 w-1 rounded-[1px] bg-pricing-primary-1" />
                  </Slider.Thumb>
                </Slider.Root>
                <p className="text-right text-sm leading-none tracking-tight text-pricing-gray-9">
                  {storageValue} GiB
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 border-t border-dashed border-pricing-gray-2 pb-2 pt-6 text-pricing-gray-94">
                <p className="text-sm font-medium leading-none">
                  <span className="uppercase">Subtotal: </span>
                  <span className="text-pricing-primary-1">${storageCost.toFixed(2)} </span>
                  <span className="font-normal text-pricing-gray-7">per month</span>
                </p>
                <p className="text-right text-sm leading-none text-pricing-gray-7">
                  <span className="text-pricing-gray-94">${COMPUTE_TIME_PRICE}</span> per hour
                </p>
              </div>
            </div>
          </div>

          <div className="row-span-1 rounded-[10px] bg-pricing-gray-10 p-5 md:flex-col md:p-0">
            <div className="min-h-[202px] md:px-5 md:py-5 [@media(min-width:428px)]:min-h-[151px] [@media(min-width:606px)]:min-h-[auto]">
              <h3 className="flex items-center text-sm font-medium uppercase leading-none tracking-wider text-pricing-secondary-9">
                Data transfer and Written data
                <Tooltip
                  id="data"
                  content="Written data is the amount of data written from compute to storage. Data transfer is the amount of data transferred out of Neon."
                />
              </h3>
              <LazyMotion features={domAnimation}>
                <AnimatePresence initial={false} mode="wait">
                  {isAdvanced ? (
                    <m.ul
                      className="mb-4 mt-5 flex items-center gap-x-8 text-[15px] tracking-tight text-pricing-gray-9 xl:flex-wrap xl:gap-x-7 sm:gap-4"
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
                      <li className="flex">
                        <label htmlFor="dataTransfer">Data transfer</label>
                        <input
                          id="dataTransfer"
                          className="ml-2 w-12 rounded-l-sm border-r border-pricing-gray-2 bg-[#242628] pl-2 pr-1 text-[15px] tracking-tight xl:ml-2"
                          name="data-transfer"
                          type="number"
                          min={0}
                          max={1000}
                          placeholder="10"
                          value={dataTransferValue}
                          onChange={(event) => {
                            if (event?.target?.value > 1000) return false;
                            return setDataTransferValue(event?.target?.value);
                          }}
                        />
                        <span className="rounded-r-sm bg-[#242628] px-2 pt-[3px] align-middle text-[11px] font-medium tracking-tight text-pricing-gray-6">
                          GiB
                        </span>
                      </li>
                      <li className="flex">
                        <label htmlFor="writtenData">Written data</label>
                        <input
                          id="writtenData"
                          className="ml-2 w-12 rounded-l-sm border-r border-pricing-gray-2 bg-[#242628] pl-2 pr-1 text-[15px] tracking-tight xl:ml-2"
                          name="written-data"
                          type="number"
                          min={0}
                          max={1000}
                          placeholder="10"
                          value={writtenDataValue}
                          onChange={(event) => {
                            if (event?.target?.value > 1000) return false;
                            return setWrittenDataValue(event?.target?.value);
                          }}
                        />
                        <span className="rounded-r-sm bg-[#242628] px-2 pt-[3px] align-middle text-[11px] font-medium tracking-tight text-pricing-gray-6">
                          GiB
                        </span>
                      </li>
                      <li>
                        <button
                          className="relative mx-0 inline-flex items-center text-pricing-primary-1 transition-colors duration-200 hover:text-[#00ffaa]"
                          type="button"
                          onClick={() => setIsAdvanced(false)}
                        >
                          Use average percentage
                        </button>
                      </li>
                    </m.ul>
                  ) : (
                    <m.p
                      className="mb-4 mt-5 text-[15px] tracking-tight text-pricing-gray-9"
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
                      Accounts for 10% of your monthly cost, on average.
                      <button
                        className="group relative mx-2 inline-flex items-center text-pricing-primary-1 transition-colors duration-200 hover:text-[#00ffaa]"
                        type="button"
                        onClick={() => setIsAdvanced(true)}
                      >
                        Enter your own values
                        <ArrowRight
                          className="ml-1 transition duration-200 group-hover:translate-x-1"
                          aria-hidden
                        />
                      </button>
                    </m.p>
                  )}
                </AnimatePresence>
              </LazyMotion>
            </div>
            <div className="flex justify-between border-t border-dashed border-pricing-gray-2 pb-2 pt-6 text-pricing-gray-94 md:px-5 md:pb-5">
              <p className="text-sm font-medium leading-none">
                <span className="uppercase">Subtotal: </span>
                <span className="text-pricing-primary-1">
                  ${writtenAndTransferDataCost.toFixed(2)}{' '}
                </span>
                <span className="font-normal text-pricing-gray-7">per month</span>
              </p>
            </div>
          </div>

          <div className="col-start-2 row-span-3 row-start-1 flex flex-col items-center self-start rounded-[10px] border border-secondary-2 p-6 lg:col-start-1 lg:row-span-1 lg:grid lg:grid-cols-2 lg:gap-x-32 sm:grid-cols-1 sm:gap-x-0">
            <h3 className="text-center text-lg leading-none tracking-tight text-white lg:col-start-2 sm:col-start-1">
              Estimated price
            </h3>
            <p className="mt-6 text-center leading-none text-white xl:mt-10 xl:text-[60px] lg:col-start-2 sm:col-start-1 sm:mt-8">
              <span className="text-[64px] font-light tracking-[-0.06em] text-secondary-2">
                {estimatedPrice}
              </span>
              <span className="mt-2 block text-base font-medium tracking-normal">per month</span>
            </p>
            <Button
              className="my-6 w-full max-w-[260px] !bg-secondary-2 !py-[17px] !text-lg font-medium xl:mt-4 lg:col-start-2 lg:mx-auto lg:mt-8 sm:col-start-1"
              theme="primary"
              to={totalCost >= CUSTOM_THRESHOLD ? LINKS.contactSales : LINKS.dashboard}
              size="sm"
            >
              {totalCost >= CUSTOM_THRESHOLD ? 'Get Custom Quote' : 'Get Started'}
            </Button>
            <ul className="my-12 flex w-full flex-col space-y-7 text-lg leading-none tracking-tight text-pricing-black lg:col-span-1 lg:row-span-3 lg:row-start-1 lg:my-0 lg:self-center sm:row-span-1 sm:mx-auto sm:my-8 sm:max-w-[260px]">
              <li className="relative flex text-base leading-tight tracking-tight text-white after:absolute after:-bottom-4 after:left-0 after:h-[1px] after:w-full after:bg-black after:opacity-[0.05] lg:pl-0 sm:pl-14">
                <CheckIcon className="mr-2 w-4 text-secondary-2" />
                <span className="mr-1">{computeUnits}</span>
                <span>compute units</span>
              </li>
              <li className="relative flex text-base leading-tight tracking-tight text-white after:absolute after:-bottom-4 after:left-0 after:h-[1px] after:w-full after:bg-black after:opacity-[0.05] lg:pl-0 sm:pl-14">
                <CheckIcon className="mr-2 w-4 text-secondary-2" />
                <span className="mr-1">{storageValue} GiB</span>
                <span>storage</span>
              </li>
              <li className="relative flex text-base leading-tight tracking-tight text-white after:absolute after:-bottom-4 after:left-0 after:h-[1px] after:w-full after:bg-black after:opacity-[0.05] lg:pl-0 sm:pl-14">
                <CheckIcon className="mr-2 w-4 text-secondary-2" />
                {isAdvanced && <span className="mr-1">{writtenDataValue} GiB</span>}
                <span>written data</span>
              </li>
              <li className="relative flex text-base leading-tight tracking-tight text-white lg:pl-0 sm:pl-14">
                <CheckIcon className="mr-2 w-4 text-secondary-2" />
                {isAdvanced && <span className="mr-1">{dataTransferValue} GiB</span>}
                <span>data transfer</span>
              </li>
            </ul>
            <span className="mt-6 block text-base font-light tracking-tight text-pricing-gray-7 sm:text-center">
              Based on the US East (Ohio) region
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};

const Tooltip = ({ content, id }) => (
  <span className="relative ml-2 inline-flex text-left align-middle normal-case lg:hidden">
    <span className="peer cursor-pointer" data-tooltip-id={id} data-tooltip-content={content}>
      <InfoIcon />
    </span>
    <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-50 w-[15rem] -translate-y-1/2 rounded-[4px] bg-pricing-gray-2 px-4 py-1.5 text-sm font-normal leading-snug tracking-tight text-[#AFB1B6] opacity-0 shadow-tooltip transition-opacity duration-200 peer-hover:opacity-100 lg:static lg:mt-1.5 lg:hidden lg:translate-y-0 lg:bg-transparent lg:p-0">
      {content}
    </span>
    <span className="absolute left-[calc(100%+6px)] top-1/2 h-0 w-0 -translate-y-1/2 border-b-4 border-r-4 border-t-4 border-transparent border-r-pricing-gray-2 opacity-0 transition-opacity duration-200 peer-hover:opacity-100 lg:hidden" />
  </span>
);

Tooltip.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
};

export default Calculator;
