'use client';

import clsx from 'clsx';
import { useState } from 'react';

import Button from 'components/shared/button';

import plans from './data/plans';
import Features from './features';
import ResourceSizeSelect, {
  LAUNCH_RESOURCE_SIZES,
  SCALE_RESOURCE_SIZES,
} from './resource-size-select';

const Plans = () => {
  const [launchSize, setLaunchSize] = useState('small');
  const [scaleSize, setScaleSize] = useState('xlarge');

  return (
    <div className="relative mt-16 w-full xl:mt-14 lg:mt-12 md:mx-0 md:mt-11 md:w-full">
      <h2 className="sr-only">Neon pricing plans</h2>

      <ul className="relative z-10 grid grid-cols-3 gap-y-[18px] border-b border-t border-gray-new-30 lg:grid-cols-2 lg:border-0 md:grid-cols-1">
        {plans.map(
          (
            {
              planId,
              type,
              title,
              subtitle,
              highlighted = false,
              price,
              computeRate,
              storageRate,
              features,
              button,
              hasDynamicPricing = false,
            },
            index
          ) => {
            // Determine which size state to use based on the plan
            let currentSize;
            let setCurrentSize;
            let resourceSizes;

            if (planId === 'launch') {
              currentSize = launchSize;
              setCurrentSize = setLaunchSize;
              resourceSizes = LAUNCH_RESOURCE_SIZES;
            } else if (planId === 'scale') {
              currentSize = scaleSize;
              setCurrentSize = setScaleSize;
              resourceSizes = SCALE_RESOURCE_SIZES;
            }

            // Calculate price dynamically based on resource size and rates
            let displayPrice = 0;

            if (
              hasDynamicPricing &&
              computeRate !== undefined &&
              storageRate !== undefined &&
              resourceSizes &&
              currentSize
            ) {
              const selectedResource = resourceSizes.find((size) => size.id === currentSize);
              if (
                selectedResource &&
                selectedResource.cu !== undefined &&
                selectedResource.storage !== undefined
              ) {
                const computeCost = Number(selectedResource.cu) * Number(computeRate);
                const storageCost = Number(selectedResource.storage) * Number(storageRate);
                displayPrice = Math.round(computeCost + storageCost);
              }
            } else {
              displayPrice = price !== undefined ? price : 0;
            }

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
                  <div className="mt-14 flex flex-col gap-4">
                    <h4 className="whitespace-nowrap text-[28px] font-normal leading-none tracking-tighter lg:text-2xl">
                      {title}
                    </h4>
                    {hasDynamicPricing ? (
                      <div className="flex flex-col gap-1.5">
                        <div className="leading-snug">
                          <span className="text-[15px] -tracking-wide text-gray-new-60">
                            Typical spend:
                          </span>{' '}
                          <span className="text-xl -tracking-wide text-white">${displayPrice}</span>{' '}
                          <span className="text-[15px] -tracking-wide text-gray-new-80">/mo</span>
                        </div>
                        {currentSize && setCurrentSize && resourceSizes && (
                          <ResourceSizeSelect
                            value={currentSize}
                            sizes={resourceSizes}
                            onChange={setCurrentSize}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <div className="leading-snug">
                          <span className="text-xl -tracking-wide text-white">${displayPrice}</span>{' '}
                          <span className="text-[15px] -tracking-wide text-gray-new-80">/mo</span>
                        </div>
                        {subtitle && (
                          <p className="text-[15px] leading-snug -tracking-wide text-gray-new-60">
                            {subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    className="mt-5 w-full"
                    theme={highlighted ? 'white-filled' : 'outlined'}
                    to={button.url}
                    size="sm-new"
                    tagName={button.event}
                  >
                    {button.text || 'Get started'}
                  </Button>
                </div>
                <div className="flex flex-col divide-y divide-dashed divide-gray-new-20 pb-1 lg:mt-1">
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
