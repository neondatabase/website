'use client';

import * as Slider from '@radix-ui/react-slider';
import clsx from 'clsx';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';
import CheckIcon from 'icons/black-check.inline.svg';
import InfoIcon from 'icons/info.inline.svg';
import ThumbIcon from 'icons/thumb.inline.svg';

const COMPUTE_TIME_PRICE = 0.102;
const PROJECT_STORAGE_PRICE = 0.000164;
const PROJECT_STORAGE_HOURS = 24;
const DATA_TRANSFER_PRICE = 0.09;
const WRITTEN_DATA_PRICE = 0.096;
const PERCENTAGE_OF_MONTHLY_COST = 0.1;
const AVERAGE_DAYS_IN_MONTH = 30.416666;

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

  const estimatedPrice = useMemo(
    () => (totalCost >= 416 ? 'Custom' : `$${totalCost.toFixed(2)}`),
    [totalCost]
  );

  useEffect(
    () =>
      isAdvanced
        ? setWrittenAndTransferDataCost(dataTransferCost + writtenDataCost)
        : setWrittenAndTransferDataCost(totalCost * PERCENTAGE_OF_MONTHLY_COST),
    [dataTransferCost, isAdvanced, totalCost, writtenDataCost]
  );

  return (
    <section className="faq safe-paddings my-40 2xl:my-32 xl:my-28 lg:my-24 md:my-20">
      <Container size="mdDoc">
        <div className="mx-auto flex max-w-[972px] flex-col items-center">
          <span className="text-center text-lg uppercase leading-snug text-primary-1">
            Pricing Calculator
          </span>
          <h2 className="mt-2.5 inline-flex flex-col text-center text-5xl font-bold leading-tight 2xl:max-w-[968px] 2xl:text-[44px] 2xl:leading-snug xl:text-4xl lg:inline lg:text-[36px] lg:leading-tight">
            Calculate your monthly bill based <br /> on compute time and storage
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1220px] grid-cols-[1fr_314px] gap-[10px] xl:mt-10 lg:grid-cols-1 sm:mt-6">
          <div className="row-span-1 flex rounded-lg bg-gray-1 md:flex-col">
            <div className="grow px-7 py-6 xl:py-5 xl:px-6 md:px-5 md:pb-3">
              <h3 className="text-2xl font-medium leading-none tracking-tight text-white xl:text-xl">
                Compute time
              </h3>
              <div className="mt-8 flex flex-col gap-2 md:mt-7">
                <div className="flex justify-between">
                  <h4 className="font-medium leading-none tracking-tight">
                    <span>Compute size</span>
                    <Tooltip
                      id="compute"
                      content="Compute size is measured in Compute Units (CU). In Neon, a CU has 1 vCPU and 4 GB of RAM. The number of CUs defines the processing power of your Neon compute."
                    />
                  </h4>
                  <p className="text-[15px] font-medium leading-none tracking-tight">
                    <span className="after:mx-2 after:inline-block after:h-[4px] after:w-[4px] after:rounded-full after:bg-primary-1 after:align-middle">
                      {computeUnits <= 0.5 ? COMPUTE_UNITS_RANGES[computeUnits] : computeUnits}vCPU
                    </span>
                    <span>{computeUnits * 4}GB RAM</span>
                  </p>
                </div>
                <div className="flex items-center py-[4px]">
                  <span className="text-[12px] tracking-tight text-[#C9CBCF]">1/4</span>
                  <Slider.Root
                    className="md:w-aut md:pb-3o relative mx-4 flex h-5 w-64 grow touch-none items-center"
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
                    <Slider.Track className="relative h-[6px] w-full grow rounded-[10px] bg-gray-2">
                      <Slider.Range className="absolute h-full rounded-full bg-primary-1" />
                    </Slider.Track>
                    <Slider.Thumb
                      className={clsx(
                        'flex cursor-pointer items-center justify-center rounded-full',
                        'focus-visible:ring-purple-500 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75'
                      )}
                    >
                      <ThumbIcon aria-hidden />
                    </Slider.Thumb>
                  </Slider.Root>
                  <span className="text-[12px] tracking-tight text-[#C9CBCF]">&#62;7</span>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-2 xl:mt-6 md:mt-6">
                <div className="flex justify-between">
                  <h4 className="font-medium leading-none tracking-tight">
                    Active time per day
                    <Tooltip
                      id="activeTime"
                      content="The number of hours per day that your compute resources are active, on average."
                    />
                  </h4>
                  <p className="text-[15px] font-medium leading-none tracking-tight">
                    {activeTime} hours <span className="text-[#94979E]">/day</span>
                  </p>
                </div>
                <div className="flex items-center py-[5px]">
                  <span className="shrink-0 text-[12px] tracking-tight text-[#C9CBCF]">
                    {COMPUTE_TIME_VALUES.min} h
                  </span>
                  <Slider.Root
                    className="md:w-aut md:pb-3o relative mx-4 flex h-5 w-64 grow touch-none items-center"
                    defaultValue={[COMPUTE_TIME_VALUES.default]}
                    min={COMPUTE_TIME_VALUES.min}
                    max={COMPUTE_TIME_VALUES.max}
                    step={COMPUTE_TIME_VALUES.step}
                    aria-label="Active time"
                    onValueChange={(value) => setActiveTime(value[0])}
                  >
                    <Slider.Track className="relative h-[6px] w-full grow rounded-[10px] bg-gray-2">
                      <Slider.Range className="absolute h-full rounded-full bg-primary-1" />
                    </Slider.Track>
                    <Slider.Thumb
                      className={clsx(
                        'flex cursor-pointer items-center justify-center rounded-full',
                        'focus-visible:ring-purple-500 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75'
                      )}
                    >
                      <ThumbIcon aria-hidden />
                    </Slider.Thumb>
                  </Slider.Root>
                  <span className="text-[12px] tracking-tight text-[#C9CBCF]">
                    {COMPUTE_TIME_VALUES.max}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-[189px] shrink-0 flex-col items-center border-l border-dashed border-[#303236] py-8 xl:w-[155px] lg:w-[168px] md:w-full md:flex-row md:items-center md:justify-between md:border-l-0 md:border-t md:px-5 md:py-5">
              <h2 className="text-lg font-medium leading-none tracking-tight md:text-base">
                Subtotal
              </h2>
              <p className="mt-12 text-[40px] leading-none tracking-tighter text-[#00E599] xl:text-3xl md:mt-0 md:text-xl">
                ${computeTimeCost.toFixed(2)}
                <span className="block text-center text-sm leading-none tracking-normal text-[#EFEFF0] md:ml-1 md:inline-block md:align-middle">
                  /month
                </span>
              </p>
              <span className="mt-12 text-sm leading-none text-[#EFEFF0] xl:mt-10 md:hidden">
                <span className="text-[#00E599]">${COMPUTE_TIME_PRICE}</span> / hour
              </span>
            </div>
          </div>

          <div className="row-span-1 flex rounded-lg bg-gray-1 md:flex-col">
            <div className="grow px-7 py-6 pb-8 xl:py-5 xl:px-6 md:px-5 md:pb-3">
              <h3 className="text-2xl font-medium leading-none tracking-tighter text-white xl:text-xl">
                Project storage
              </h3>
              <div className="mt-7 flex flex-col gap-2">
                <div className="flex justify-between">
                  <h4 className="font-medium leading-none tracking-tight">Data</h4>
                  <p className="text-[15px] font-medium leading-none tracking-tight">
                    {storageValue} GiB
                  </p>
                </div>
                <div className="flex items-center py-[4px]">
                  <span className="text-[12px] tracking-tight text-[#C9CBCF]">
                    {STORAGE_VALUES.min} GiB
                  </span>
                  <Slider.Root
                    className="relative mx-4 flex h-5 w-64 grow touch-none items-center md:w-auto"
                    defaultValue={[STORAGE_VALUES.default]}
                    min={STORAGE_VALUES.min}
                    max={STORAGE_VALUES.max}
                    aria-label="Compute units"
                    onValueChange={(value) => setStorageValue(value[0])}
                  >
                    <Slider.Track className="relative h-[6px] w-full grow rounded-[10px] bg-gray-2">
                      <Slider.Range className="absolute h-full rounded-full bg-primary-1" />
                    </Slider.Track>
                    <Slider.Thumb
                      className={clsx(
                        'flex cursor-pointer items-center justify-center rounded-full',
                        'focus-visible:ring-purple-500 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75'
                      )}
                    >
                      <ThumbIcon aria-hidden />
                    </Slider.Thumb>
                  </Slider.Root>
                  <span className="text-[12px] tracking-tight text-[#C9CBCF]">
                    &#62;{STORAGE_VALUES.max} GiB
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-[189px] shrink-0 flex-col items-center justify-center border-l border-dashed border-[#303236] py-8 xl:w-[155px] lg:w-[168px] md:w-full md:flex-row md:items-center md:justify-between md:border-l-0 md:border-t md:px-5 md:py-5">
              <h2 className="hidden text-base font-medium leading-none tracking-tight md:block">
                Subtotal
              </h2>
              <p className="text-[40px] leading-none tracking-tighter text-[#00E599] xl:text-3xl md:text-xl">
                ${storageCost.toFixed(2)}
                <span className="block text-center text-sm leading-none tracking-normal text-[#EFEFF0] md:ml-1 md:inline-block md:align-middle">
                  /month
                </span>
              </p>
            </div>
          </div>

          <div className="row-span-1 flex rounded-lg bg-gray-1 md:flex-col">
            <div className="min-h-[141px] grow px-6 pt-7 pb-9 xl:min-h-[161px] xl:py-8 lg:pb-6 md:px-5 md:py-5 xs:min-h-[214px]">
              <h3 className="text-2xl font-medium leading-none tracking-tight text-white xl:text-xl">
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
                      className="mt-7 flex items-center gap-x-10 xl:flex-wrap xl:gap-x-7 sm:gap-4"
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
                      <li>
                        <label htmlFor="dataTransfer">Data transfer</label>
                        <input
                          id="dataTransfer"
                          className="ml-5 mr-2 w-14 border-none bg-gray-2 px-2 text-center text-[15px] tracking-tight xl:mx-2"
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
                        <span>GiB</span>
                      </li>
                      <li>
                        <label htmlFor="writtenData">Written data</label>
                        <input
                          id="writtenData"
                          className="ml-5 mr-2 w-14 border-none bg-gray-2 px-2 text-center text-[15px] tracking-tight xl:mx-2"
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
                        <span>GiB</span>
                      </li>
                      <li>
                        <button
                          className="relative mx-0 border-b border-primary-1 text-primary-1 transition-colors duration-200 hover:border-transparent xl:mx-0 xl:block"
                          type="button"
                          onClick={() => setIsAdvanced(false)}
                        >
                          Use average percentage
                        </button>
                      </li>
                    </m.ul>
                  ) : (
                    <m.p
                      className="mt-7 text-base tracking-tight text-[#94979E]"
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
                        className="relative mx-2 border-b border-primary-1 text-primary-1 transition-colors duration-200 hover:border-transparent xl:mx-0 xl:block"
                        type="button"
                        onClick={() => setIsAdvanced(true)}
                      >
                        Enter your own values
                      </button>
                    </m.p>
                  )}
                </AnimatePresence>
              </LazyMotion>
            </div>
            <div className="flex w-[189px] shrink-0 flex-col items-center justify-center border-l border-dashed border-[#303236] xl:w-[155px] lg:w-[168px] md:w-full md:flex-row md:items-center md:justify-between md:border-l-0 md:border-t md:px-5 md:py-5">
              <h2 className="hidden text-base font-medium leading-none tracking-tight md:block">
                Subtotal
              </h2>
              <p className="text-[40px] leading-none tracking-tighter text-[#00E599] xl:text-3xl md:text-xl">
                ${writtenAndTransferDataCost.toFixed(2)}
                <span className="block text-center text-sm leading-none tracking-normal text-[#EFEFF0] md:ml-1 md:inline-block md:align-middle">
                  /month
                </span>
              </p>
            </div>
          </div>

          <div className="col-start-2 row-span-3 row-start-1 flex flex-col items-center rounded-lg bg-secondary-2 p-7 pb-9 lg:col-start-1 lg:row-span-1 lg:grid lg:grid-cols-2 lg:gap-x-32 sm:grid-cols-1 sm:gap-x-0">
            <h3 className="text-center text-lg font-semibold leading-none tracking-tight text-black lg:col-start-2 sm:col-start-1">
              Estimated price
            </h3>
            <p className="mt-8 text-center text-[72px] font-medium leading-none tracking-tighter text-black xl:mt-10 xl:text-[60px] lg:col-start-2 sm:col-start-1 sm:mt-8">
              <span>{estimatedPrice}</span>
              <span className="mt-1 block text-xl leading-normal tracking-normal">per month</span>
              <span className="mt-1 block text-base font-normal tracking-normal">
                based on the US East (Ohio) region
              </span>
            </p>
            <ul className="my-11 flex w-full flex-col space-y-8 text-lg leading-none tracking-tight text-black lg:col-span-1 lg:row-span-3 lg:row-start-1 lg:my-0 lg:self-center sm:row-span-1 sm:my-8 sm:mx-auto sm:max-w-[260px]">
              <li className="relative flex pl-[3.25rem] after:absolute after:left-0 after:-bottom-4 after:h-[1px] after:w-full after:bg-[#0C0D0D] after:opacity-[0.05] lg:pl-0 sm:pl-16">
                <CheckIcon className="mr-2" />
                <span className="mr-1 font-semibold">{computeUnits}</span>
                <span>compute units</span>
              </li>
              <li className="relative flex pl-[3.25rem] after:absolute after:left-0 after:-bottom-4 after:h-[1px] after:w-full after:bg-[#0C0D0D] after:opacity-[0.05] lg:pl-0 sm:pl-16">
                <CheckIcon className="mr-2" />
                <span className="mr-1 font-semibold">{storageValue} GiB</span>
                <span>storage</span>
              </li>
              <li className="relative flex pl-[3.25rem] text-black after:absolute after:left-0 after:-bottom-4 after:h-[1px] after:w-full after:bg-[#0C0D0D] after:opacity-[0.05] lg:pl-0 sm:pl-16">
                <CheckIcon className="mr-2" />
                {isAdvanced && <span className="mr-1 font-semibold">{writtenDataValue} GiB</span>}
                <span>written data</span>
              </li>
              <li className="relative flex pl-[3.25rem] lg:pl-0 sm:pl-16">
                <CheckIcon className="mr-2" />
                {isAdvanced && <span className="mr-1 font-semibold">{dataTransferValue} GiB</span>}
                <span>data transfer</span>
              </li>
            </ul>
            <Button
              className="mt-auto w-full max-w-[260px] !bg-black py-6 !text-lg !text-white xl:mt-4 lg:col-start-2 lg:mx-auto lg:mt-8 sm:col-start-1 sm:mt-1"
              theme="primary"
              to={estimatedPrice === 'Custom' ? LINKS.contactSales : LINKS.dashboard}
              size="sm"
            >
              {estimatedPrice === 'Custom' ? 'Get Custom Quote' : 'Get Started'}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

const Tooltip = ({ content, id }) => (
  <span className="relative ml-2 inline-flex align-middle">
    <span
      className="peer cursor-pointer lg:hidden"
      data-tooltip-id={id}
      data-tooltip-content={content}
    >
      <InfoIcon />
    </span>
    <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-50 w-[15rem] -translate-y-1/2 rounded-[4px] bg-gray-2 px-4 py-1.5 text-sm font-normal leading-snug tracking-tight text-[#AFB1B6] opacity-0 shadow-tooltip transition-opacity duration-200 peer-hover:opacity-100 lg:static lg:mt-1.5 lg:hidden lg:translate-y-0 lg:bg-transparent lg:p-0">
      {content}
    </span>
    <span className="absolute left-[calc(100%+6px)] top-1/2 h-0 w-0 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-2 opacity-0 transition-opacity duration-200 peer-hover:opacity-100 lg:hidden" />
  </span>
);

Tooltip.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
};

export default Calculator;
