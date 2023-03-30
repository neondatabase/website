'use client';

import * as Slider from '@radix-ui/react-slider';
import clsx from 'clsx';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import CheckIcon from 'icons/black-check.inline.svg';

const Calculator = () => (
  <section className="faq safe-paddings my-40 2xl:my-32 xl:my-28 lg:my-24 md:my-20">
    <Container className="" size="mdDoc">
      <div className="mx-auto flex max-w-[972px] flex-col items-center">
        <span className="text-center text-lg uppercase leading-snug text-primary-1">
          Pricing Calculator
        </span>
        <h2 className="mt-2.5 inline-flex flex-col text-center text-5xl font-bold leading-tight 2xl:max-w-[968px] 2xl:text-[44px] 2xl:leading-snug xl:text-4xl lg:inline lg:text-[36px] lg:leading-tight">
          Calculate your monthly bill based <br /> on compute time and storage
        </h2>
      </div>

      <div className="mx-auto mt-12 grid max-w-[1220px] grid-cols-[1fr_338px] gap-2">
        <div className="row-span-1 flex rounded-lg bg-[#131415]">
          <div className="grow p-7 pb-8">
            <h3 className="text-2xl font-medium leading-none tracking-tight text-white">Compute</h3>
            <div className="mt-8 flex flex-col gap-2">
              <div className="flex justify-between">
                <h4 className="font-medium leading-none tracking-tight">Compute size</h4>
                <p className="text-[15px] font-medium leading-none tracking-tight">
                  1vCPU - 4GB RAM
                </p>
              </div>
              <div className="flex items-center py-[4px]">
                <span className="text-[12px] tracking-tight text-[#C9CBCF]">0.25</span>
                <Slider.Root
                  className="relative mx-4 flex h-5 w-64 grow touch-none items-center"
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  aria-label="Compute time"
                >
                  <Slider.Track className="relative h-1 w-full grow rounded-full bg-[#242628]">
                    <Slider.Range className="absolute h-full rounded-full bg-[#00E599] dark:bg-white" />
                  </Slider.Track>
                  <Slider.Thumb
                    className={clsx(
                      'block h-5 w-5 rounded-full bg-[#C9CBCF]',
                      'focus-visible:ring-purple-500 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75'
                    )}
                  />
                </Slider.Root>
                <span className="text-[12px] tracking-tight text-[#C9CBCF]">&#62;32</span>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              <div className="flex justify-between">
                <h4 className="font-medium leading-none tracking-tight">Active time</h4>
                <p className="text-[15px] font-medium leading-none tracking-tight">
                  10 hours <span className="text-[#94979E]">/day</span>
                </p>
              </div>
              <div className="flex items-center py-[5px]">
                <span className="text-[12px] tracking-tight text-[#C9CBCF]">0.5 h</span>
                <Slider.Root
                  className="relative mx-4 flex h-5 w-64 grow touch-none items-center"
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  aria-label="Active time"
                >
                  <Slider.Track className="relative h-1 w-full grow rounded-full bg-[#242628]">
                    <Slider.Range className="absolute h-full rounded-full bg-[#00E599] dark:bg-white" />
                  </Slider.Track>
                  <Slider.Thumb
                    className={clsx(
                      'block h-5 w-5 rounded-full bg-[#C9CBCF]',
                      'focus-visible:ring-purple-500 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75'
                    )}
                  />
                </Slider.Root>
                <span className="text-[12px] tracking-tight text-[#C9CBCF]">24</span>
              </div>
            </div>
          </div>
          <div className="flex w-[189px] shrink-0 flex-col items-center border-l border-dashed border-[#303236] py-8">
            <h2 className="text-lg font-medium leading-none tracking-tight">Subtotal</h2>
            <p className="mt-12 text-[40px] leading-none tracking-tighter text-[#00E599]">$14.00</p>
            <span className="text-sm leading-none text-[#EFEFF0]">/month</span>
            <span className="mt-12 text-sm leading-none text-[#EFEFF0]">
              <span className="text-[#00E599]">$0.0072</span> / hour
            </span>
          </div>
        </div>

        <div className="row-span-1 flex rounded-lg bg-[#131415]">
          <div className="grow p-7 pb-8">
            <h3 className="text-2xl font-medium leading-none tracking-tighter text-white">
              Project storage
            </h3>
            <div className="mt-7 flex flex-col gap-2">
              <div className="flex justify-between">
                <h4 className="font-medium leading-none tracking-tight">Compute units</h4>
                <p className="text-[15px] font-medium leading-none tracking-tight">10 GiB</p>
              </div>
              <div className="flex items-center py-[4px]">
                <span className="text-[12px] tracking-tight text-[#C9CBCF]">0 GB</span>
                <Slider.Root
                  className="relative mx-4 flex h-5 w-64 grow touch-none items-center"
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  aria-label="Compute units"
                >
                  <Slider.Track className="relative h-1 w-full grow rounded-full bg-[#242628]">
                    <Slider.Range className="absolute h-full rounded-full bg-[#00E599] dark:bg-white" />
                  </Slider.Track>
                  <Slider.Thumb
                    className={clsx(
                      'block h-5 w-5 rounded-full bg-[#C9CBCF]',
                      'focus-visible:ring-purple-500 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75'
                    )}
                  />
                </Slider.Root>
                <span className="text-[12px] tracking-tight text-[#C9CBCF]">&#62;1 TB</span>
              </div>
            </div>
          </div>
          <div className="flex w-[189px] shrink-0 flex-col items-center justify-center border-l border-dashed border-[#303236] py-8">
            <p className="text-[40px] leading-none tracking-tighter text-[#00E599]">$3.15</p>
            <span className="text-sm leading-none text-[#EFEFF0]">/month</span>
          </div>
        </div>

        <div className="row-span-1 flex rounded-lg bg-[#131415]">
          <div className="grow p-7 pb-8">
            <h3 className="text-2xl font-medium leading-none tracking-tighter text-white [text-shadow:0px_0px_20px_rgba(255,_255,_255,_0.05)]">
              Data transfer and Written data
            </h3>
            <p className="text-base leading-none tracking-tight text-[#94979E]">
              Accounts for x% of your monthly cost, on average.
              <button
                className="relative mx-2 text-primary-1 after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:bg-primary-1 after:opacity-40"
                type="button"
              >
                Are you an advanced user?
              </button>
            </p>
          </div>
          <div className="flex w-[189px] shrink-0 flex-col items-center justify-center border-l border-dashed border-[#303236]">
            <p className="text-[40px] leading-none tracking-tighter text-[#00E599]">$2.00</p>
            <span className="text-sm leading-none text-[#EFEFF0]">/month</span>
          </div>
        </div>

        <div className="col-start-2 row-span-3 row-start-1 rounded-lg bg-secondary-2 p-7">
          <h3 className="text-center text-lg font-semibold leading-none tracking-tight text-black [text-shadow:0px_0px_20px_rgba(255,_255,_255,_0.05)]">
            Estimated price
          </h3>
          <p className="mt-8 text-center text-[72px] font-medium leading-none tracking-tighter text-black">
            $<span>24.16</span>
            <span className="mt-1 block text-base tracking-normal">/per month</span>
          </p>
          <ul className="my-11 flex flex-col space-y-8">
            <li className="relative flex pl-[3.25rem] text-lg leading-none tracking-tight text-black after:absolute after:left-0 after:-bottom-4 after:h-[1px] after:w-full after:bg-[#0C0D0D] after:opacity-[0.05]">
              <CheckIcon className="mr-2" />
              <span className="mr-1 font-semibold">0.25</span>
              <span>compute units</span>
            </li>
            <li className="relative flex pl-[3.25rem] text-lg leading-none tracking-tight text-black after:absolute after:left-0 after:-bottom-4 after:h-[1px] after:w-full after:bg-[#0C0D0D] after:opacity-[0.05]">
              <CheckIcon className="mr-2" />
              <span className="mr-1 font-semibold">10 GB</span>
              <span>storage</span>
            </li>
            <li className="relative flex pl-[3.25rem] text-lg leading-none tracking-tight text-black after:absolute after:left-0 after:-bottom-4 after:h-[1px] after:w-full after:bg-[#0C0D0D] after:opacity-[0.05]">
              <CheckIcon className="mr-2" />
              <span className="mr-1 font-semibold">3 GB</span>
              <span>written data</span>
            </li>
            <li className="relative flex pl-[3.25rem] text-lg leading-none tracking-tight text-black">
              <CheckIcon className="mr-2" />
              <span className="mr-1 font-semibold">3 GB</span>
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

export default Calculator;
