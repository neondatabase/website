'use client';

import * as Slider from '@radix-ui/react-slider';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import CheckIcon from 'icons/black-check.inline.svg';
import InfoIcon from 'icons/info.inline.svg';
import ThumbIcon from 'icons/thumb.inline.svg';

const COMPUTE_TIME_PRICE = 0.102;
const PROJECT_STORAGE_PRICE = 0.000164;
const PROJECT_STORAGE_HOURS = 168;
const DATA_TRANSFER_PRICE = 0.09;
const WRITTEN_DATA_PRICE = 0.096;
const PERCENTAGE_OF_MONTHLY_COST = 0.1;

const COMPUTE_UNITS_VALUES = {
  min: 0.25,
  max: 32,
  step: 1,
  default: 1,
};

const COMPUTE_TIME_VALUES = {
  min: 0.5,
  max: 24,
  step: 1,
  default: 10,
};

const STORAGE_VALUES = {
  min: 0,
  max: 1000,
  step: 10,
  default: 50,
};

const Calculator = () => {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [computeUnits, setComputeUnits] = useState(COMPUTE_UNITS_VALUES.default);
  const [activeTime, setActiveTime] = useState(COMPUTE_TIME_VALUES.default);
  const [storageValue, setStorageValue] = useState(STORAGE_VALUES.default);
  const [dataTransferValue, setDataTransferValue] = useState(10);
  const [writtenDataValue, setWrittenDataValue] = useState(10);
  const [writtenAndTransferDataCost, setWrittenAndTransferDataCost] = useState(0);

  const computeTimeCost = useMemo(
    () => computeUnits * activeTime * COMPUTE_TIME_PRICE,
    [activeTime, computeUnits]
  );

  const storageCost = useMemo(
    () => storageValue * PROJECT_STORAGE_HOURS * PROJECT_STORAGE_PRICE,
    [storageValue]
  );

  const dataTransferCost = useMemo(
    () => dataTransferValue * DATA_TRANSFER_PRICE,
    [dataTransferValue]
  );

  const writtenDataCost = useMemo(() => writtenDataValue * WRITTEN_DATA_PRICE, [writtenDataValue]);

  const totalCost = useMemo(
    () => computeTimeCost + storageCost + writtenAndTransferDataCost,
    [computeTimeCost, storageCost, writtenAndTransferDataCost]
  );

  const estimatedPrice = useMemo(
    () =>
      computeUnits > 8 || storageValue >= 200 || totalCost >= 420
        ? 'Custom'
        : `$${totalCost.toFixed(2)}`,
    [computeUnits, storageValue, totalCost]
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

        <div className="mx-auto mt-12 grid max-w-[1220px] grid-cols-[1fr_338px] gap-[10px]">
          <div className="row-span-1 flex rounded-lg bg-gray-1">
            <div className="grow px-7 py-6">
              <h3 className="text-2xl font-medium leading-none tracking-tight text-white">
                Compute
              </h3>
              <div className="mt-8 flex flex-col gap-2">
                <div className="flex justify-between">
                  <h4 className="font-medium leading-none tracking-tight">
                    <span>Compute size</span>
                    <Tooltip
                      id="compute"
                      content="A Compute Unit (CU) is a measure of processing power and memory. In Neon, a CU has 1 vCPU and 4 GB of RAM. The number CUs defines the processing power of your Neon compute."
                    />
                  </h4>
                  <p className="text-[15px] font-medium leading-none tracking-tight">
                    {computeUnits}vCPU - 4GB RAM
                  </p>
                </div>
                <div className="flex items-center py-[4px]">
                  <span className="text-[12px] tracking-tight text-[#C9CBCF]">
                    {COMPUTE_UNITS_VALUES.min}
                  </span>
                  <Slider.Root
                    className="relative mx-4 flex h-5 w-64 grow touch-none items-center"
                    defaultValue={[COMPUTE_UNITS_VALUES.default]}
                    min={COMPUTE_UNITS_VALUES.min}
                    max={COMPUTE_UNITS_VALUES.max}
                    step={COMPUTE_UNITS_VALUES.step}
                    aria-label="Compute units"
                    onValueChange={(value) => setComputeUnits(value[0])}
                  >
                    <Slider.Track className="relative h-[6px] w-full grow rounded-[10px] bg-gray-2">
                      <Slider.Range className="absolute h-full h-[6px] rounded-full bg-primary-1" />
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
                    &#62;{COMPUTE_UNITS_VALUES.max}
                  </span>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-2">
                <div className="flex justify-between">
                  <h4 className="font-medium leading-none tracking-tight">
                    Active time
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
                  <span className="text-[12px] tracking-tight text-[#C9CBCF]">
                    {COMPUTE_TIME_VALUES.min} h
                  </span>
                  <Slider.Root
                    className="relative mx-4 flex h-5 w-64 grow touch-none items-center"
                    defaultValue={[COMPUTE_TIME_VALUES.default]}
                    min={COMPUTE_TIME_VALUES.min}
                    max={COMPUTE_TIME_VALUES.max}
                    step={COMPUTE_TIME_VALUES.step}
                    aria-label="Active time"
                    onValueChange={(value) => setActiveTime(value[0])}
                  >
                    <Slider.Track className="relative h-[6px] w-full grow rounded-[10px] bg-gray-2">
                      <Slider.Range className="absolute h-full h-[6px] rounded-full bg-primary-1" />
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
            <div className="flex w-[189px] shrink-0 flex-col items-center border-l border-dashed border-[#303236] py-8">
              <h2 className="text-lg font-medium leading-none tracking-tight">Subtotal</h2>
              <p className="mt-12 text-[40px] leading-none tracking-tighter text-[#00E599]">
                ${computeTimeCost.toFixed(2)}
              </p>
              <span className="text-sm leading-none text-[#EFEFF0]">/month</span>
              <span className="mt-12 text-sm leading-none text-[#EFEFF0]">
                <span className="text-[#00E599]">${COMPUTE_TIME_PRICE}</span> / hour
              </span>
            </div>
          </div>

          <div className="row-span-1 flex rounded-lg bg-gray-1">
            <div className="grow px-7 py-6 pb-8">
              <h3 className="text-2xl font-medium leading-none tracking-tighter text-white">
                Project storage
              </h3>
              <div className="mt-7 flex flex-col gap-2">
                <div className="flex justify-between">
                  <h4 className="font-medium leading-none tracking-tight">Compute units</h4>
                  <p className="text-[15px] font-medium leading-none tracking-tight">
                    {storageValue} GiB
                  </p>
                </div>
                <div className="flex items-center py-[4px]">
                  <span className="text-[12px] tracking-tight text-[#C9CBCF]">
                    {STORAGE_VALUES.min} GiB
                  </span>
                  <Slider.Root
                    className="relative mx-4 flex h-5 w-64 grow touch-none items-center"
                    defaultValue={[STORAGE_VALUES.default]}
                    min={STORAGE_VALUES.min}
                    max={STORAGE_VALUES.max}
                    step={STORAGE_VALUES.step}
                    aria-label="Compute units"
                    onValueChange={(value) => setStorageValue(value[0])}
                  >
                    <Slider.Track className="relative h-[6px] w-full grow rounded-[10px] bg-gray-2">
                      <Slider.Range className="absolute h-full h-[6px] rounded-full bg-primary-1" />
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
                  <span className="text-[12px] tracking-tight text-[#C9CBCF]">&#62;1 TB</span>
                </div>
              </div>
            </div>
            <div className="flex w-[189px] shrink-0 flex-col items-center justify-center border-l border-dashed border-[#303236] py-8">
              <p className="text-[40px] leading-none tracking-tighter text-[#00E599]">
                ${storageCost.toFixed(2)}
              </p>
              <span className="text-sm leading-none text-[#EFEFF0]">/month</span>
            </div>
          </div>

          <div className="row-span-1 flex rounded-lg bg-gray-1">
            <div className="grow px-6 pt-7 pb-9">
              <h3 className="text-2xl font-medium leading-none tracking-tight text-white [text-shadow:0px_0px_20px_rgba(255,_255,_255,_0.05)]">
                Data transfer and Written data
              </h3>
              {isAdvanced ? (
                <ul className="mt-7 flex gap-14">
                  <li>
                    <label htmlFor="dataTransfer">Data transfer</label>
                    <input
                      id="dataTransfer"
                      className="ml-8 mr-2 w-14 border-none bg-gray-2 px-2 text-center text-[15px] tracking-tight"
                      name="data-transfer"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="10"
                      value={dataTransferValue}
                      onChange={(event) => setDataTransferValue(event?.target?.value)}
                    />
                    <span>GiB</span>
                  </li>
                  <li>
                    <label htmlFor="writtenData">Written data</label>
                    <input
                      id="writtenData"
                      className="ml-8 mr-2 w-14 border-none bg-gray-2 px-2 text-center text-[15px] tracking-tight"
                      name="written-data"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="10"
                      value={writtenDataValue}
                      onChange={(event) => setWrittenDataValue(event?.target?.value)}
                    />
                    <span>GiB</span>
                  </li>
                </ul>
              ) : (
                <p className="mt-5 text-base tracking-tight text-[#94979E]">
                  Accounts for x% of your monthly cost, on average.
                  <button
                    className="relative mx-2 text-primary-1 after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:bg-primary-1 after:opacity-40"
                    type="button"
                    onClick={() => setIsAdvanced(true)}
                  >
                    Are you an advanced user?
                  </button>
                </p>
              )}
            </div>
            <div className="flex w-[189px] shrink-0 flex-col items-center justify-center border-l border-dashed border-[#303236]">
              <p className="text-[40px] leading-none tracking-tighter text-[#00E599]">
                ${writtenAndTransferDataCost.toFixed(2)}
              </p>
              <span className="text-sm leading-none text-[#EFEFF0]">/month</span>
            </div>
          </div>

          <div className="col-start-2 row-span-3 row-start-1 flex flex-col rounded-lg bg-secondary-2 p-7 pb-9">
            <h3 className="text-center text-lg font-semibold leading-none tracking-tight text-black [text-shadow:0px_0px_20px_rgba(255,_255,_255,_0.05)]">
              Estimated price
            </h3>
            <p className="mt-8 text-center text-[72px] font-medium leading-none tracking-tighter text-black">
              <span>{estimatedPrice}</span>
              <span className="mt-1 block text-base tracking-normal">/per month</span>
            </p>
            <ul className="my-11 flex flex-col space-y-8">
              <li className="relative flex pl-[3.25rem] text-lg leading-none tracking-tight text-black after:absolute after:left-0 after:-bottom-4 after:h-[1px] after:w-full after:bg-[#0C0D0D] after:opacity-[0.05]">
                <CheckIcon className="mr-2" />
                <span className="mr-1 font-semibold">{computeUnits}</span>
                <span>compute units</span>
              </li>
              <li className="relative flex pl-[3.25rem] text-lg leading-none tracking-tight text-black after:absolute after:left-0 after:-bottom-4 after:h-[1px] after:w-full after:bg-[#0C0D0D] after:opacity-[0.05]">
                <CheckIcon className="mr-2" />
                <span className="mr-1 font-semibold">{storageValue} GiB</span>
                <span>storage</span>
              </li>
              <li className="relative flex pl-[3.25rem] text-lg leading-none tracking-tight text-black after:absolute after:left-0 after:-bottom-4 after:h-[1px] after:w-full after:bg-[#0C0D0D] after:opacity-[0.05]">
                <CheckIcon className="mr-2" />
                {isAdvanced && <span className="mr-1 font-semibold">{writtenDataValue} GiB</span>}
                <span>written data</span>
              </li>
              <li className="relative flex pl-[3.25rem] text-lg leading-none tracking-tight text-black">
                <CheckIcon className="mr-2" />
                {isAdvanced && <span className="mr-1 font-semibold">{dataTransferValue} GiB</span>}
                <span>data transfer</span>
              </li>
            </ul>
            <Button
              className="mt-auto w-full !bg-black py-6 !text-lg !text-white sm:max-w-none"
              theme="primary"
              to="https://console.neon.tech/sign_in"
              size="sm"
            >
              Get Started
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
    <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-50 w-[15rem] -translate-y-1/2 rounded-[4px] rounded-sm bg-[#242628] px-4 py-1.5 text-sm font-normal leading-snug leading-none tracking-tight text-[#AFB1B6] opacity-0 shadow-tooltip transition-opacity duration-200 peer-hover:opacity-100 lg:static lg:mt-1.5 lg:translate-y-0 lg:bg-transparent lg:p-0 lg:opacity-100">
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
