'use client';

import clsx from 'clsx';
import { useState } from 'react';

import Button from 'components/shared/button';

import plans from './data/plans';
import Features from './features';
import ResourceSizeSelect, { RESOURCE_SIZES } from './resource-size-select';

const Plans = () => {
  const [selectedSize, setSelectedSize] = useState('medium');

  return (
    <div className="relative mt-16 w-full xl:mt-14 lg:mt-12 md:mx-0 md:mt-11 md:w-full">
      <h2 className="sr-only">Neon pricing plans</h2>

      <div className="mt-0.5 grid grid-cols-3 xl:mt-0 lg:grid-cols-2 md:mb-4 md:grid-cols-1">
        <div className="border-l border-black-pure lg:hidden" aria-hidden />
        <div
          className={clsx(
            'flex h-12 items-center border-l border-t border-gray-new-30 px-6 md:border-r md:px-5'
          )}
        >
          <span className="text-sm leading-none tracking-extra-tight text-white">
            Choose the resource size for your project:
          </span>
        </div>
        <ResourceSizeSelect value={selectedSize} onChange={setSelectedSize} />
      </div>

      <ul className="relative z-10 grid grid-cols-3 gap-y-[18px] border-b border-t border-gray-new-30 lg:grid-cols-2 lg:border-0 md:grid-cols-1">
        {plans.map(
          (
            {
              type,
              title,
              subtitle,
              highlighted = false,
              price,
              features,
              button,
              hasDynamicPricing = false,
            },
            index
          ) => {
            const displayPrice = price[selectedSize];
            const selectedResource = RESOURCE_SIZES.find((size) => size.id === selectedSize);

            return (
              <li
                className={clsx(
                  'group relative flex min-h-full flex-col border-l border-gray-new-30 last:border-r',
                  'lg:border lg:pb-[66px] lg:first:border-r-0 lg:last:pb-0',
                  'md:pb-0 md:first:border'
                )}
                key={index}
              >
                <div className="p-6 pb-2 md:p-5 md:pb-2">
                  <h3
                    className={clsx(
                      'font-mono text-sm font-medium uppercase leading-none',
                      highlighted ? 'text-green-52' : 'text-gray-new-60'
                    )}
                  >
                    {type}
                  </h3>
                  <div className="mt-14 flex flex-col gap-3">
                    <h4 className="whitespace-nowrap text-[28px] font-normal leading-none tracking-extra-tight lg:text-2xl lg:tracking-tighter">
                      {title}
                    </h4>
                    {hasDynamicPricing ? (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-1 leading-snug tracking-extra-tight">
                          <span className="text-[15px] text-gray-new-60">Typical spend:</span>
                          <span className="text-lg text-gray-new-80">${displayPrice}</span>
                          <span className="text-sm text-gray-new-80">/mo</span>
                        </div>
                        <p className="text-[15px] leading-snug tracking-extra-tight text-gray-new-60">
                          Based on:{' '}
                          <span className="text-gray-new-80">
                            {selectedResource.cu} CU-hours, {selectedResource.storage} GB
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-0.5 leading-snug tracking-extra-tight">
                          <span className="text-lg text-gray-new-80">${displayPrice}</span>
                          <span className="text-sm text-gray-new-80">/mo</span>
                        </div>
                        {subtitle && (
                          <p className="text-[15px] leading-snug tracking-extra-tight text-gray-new-60">
                            {subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    className="mt-6 w-full"
                    theme={highlighted ? 'white-filled' : 'outlined'}
                    to={button.url}
                    size="sm-new"
                    tagName={button.event}
                  >
                    {button.text || 'Get started'}
                  </Button>
                </div>
                <div className="flex flex-col divide-y divide-dashed divide-gray-new-20 pb-2 lg:mt-1 md:pb-1">
                  {Object.entries(features).map(([key, section]) => (
                    <Features
                      key={key}
                      title={section.title}
                      features={section.features}
                      type={type}
                      highlighted={highlighted}
                    />
                  ))}
                </div>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};

export default Plans;
