'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Field from 'components/shared/field';

// TODO: make labels horizontal to the number input, add animation using motion number and also add glow effect to the card, include pricing comparison to RDS, double check maths, add more details to the breakdown, make the layout less compact. add form validation and error handling. add title for basic configuration.

// write down the list of assumptions made. Perhaps, no need to configure archive percentage.

const DashedBorder = () => (
  <>
    <span
      className="pointer-events-none relative z-20 block h-px w-full bg-[url('/images/pages/variable-load/dashed-border.png')] bg-[8px,1px] bg-repeat-x mix-blend-overlay"
      aria-hidden
    />
    <span
      className="pointer-events-none relative z-10 -mt-px block h-px w-full bg-[url('/images/pages/variable-load/dashed-border.png')] bg-[8px,1px] bg-repeat-x opacity-50 mix-blend-overlay"
      aria-hidden
    />
  </>
);

const ComputeSizes = [
  { value: 0.25, label: '0.25 CU (0.25 vCPU, 1GB RAM)' },
  { value: 0.5, label: '0.5 CU (0.5 vCPU, 2GB RAM)' },
  { value: 1, label: '1 CU (1 vCPU, 4GB RAM)' },
  { value: 2, label: '2 CU (2 vCPU, 8GB RAM)' },
  { value: 4, label: '4 CU (4 vCPU, 16GB RAM)' },
  { value: 8, label: '8 CU (8 vCPU, 32GB RAM)' },
  { value: 16, label: '16 CU (16 vCPU, 64GB RAM)' },
];

const numberFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const schema = yup
  .object({
    numProjects: yup.number().required().min(1),
    computeSize: yup
      .number()
      .required()
      .oneOf(ComputeSizes.map((size) => size.value)),
    lowUsage: yup.number().required().min(0).max(100),
    moderateUsage: yup.number().required().min(0).max(100),
    highUsage: yup.number().required().min(0).max(100),
    smallDB: yup.number().required().min(0).max(100),
    mediumDB: yup.number().required().min(0).max(100),
    largeDB: yup.number().required().min(0).max(100),
    archivePercentage: yup.number().required().min(0).max(100),
  })
  .required();

const labelClassName = 'text-sm text-gray-new-90';
const errorClassName = '!top-0';

const PostgresForPlatformsCalculator = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      numProjects: 1000,
      computeSize: 0.25,
      lowUsage: 95,
      moderateUsage: 3,
      highUsage: 2,
      smallDB: 95,
      mediumDB: 3,
      largeDB: 2,
      archivePercentage: 50,
    },
  });

  const formValues = watch();

  // Constants
  const BUSINESS_BASE_PRICE = 700;
  const COMPUTE_HOUR_PRICE = 0.16;
  const STORAGE_PRICE = 0.5;
  const ARCHIVE_STORAGE_PRICE = 0.1;

  // Calculate costs based on form values
  const calculateCosts = () => {
    const {
      numProjects,
      computeSize,
      lowUsage,
      moderateUsage,
      highUsage,
      smallDB,
      mediumDB,
      largeDB,
      archivePercentage,
    } = formValues;

    // Compute hours calculation
    const lowHours = 5;
    const moderateHours = 160;
    const highHours = 730;

    const totalComputeHours =
      numProjects *
      ((lowUsage / 100) * lowHours +
        (moderateUsage / 100) * moderateHours +
        (highUsage / 100) * highHours) *
      computeSize;

    const extraComputeHours = Math.max(0, totalComputeHours - 1000);
    const computeCost = extraComputeHours * COMPUTE_HOUR_PRICE;

    // Storage calculation
    const avgStorage =
      numProjects * ((smallDB / 100) * 1 + (mediumDB / 100) * 10 + (largeDB / 100) * 100);

    const regularStorage = avgStorage * (1 - archivePercentage / 100);
    const archiveStorage = avgStorage * (archivePercentage / 100);

    const extraRegularStorage = Math.max(0, regularStorage - 500);
    const extraArchiveStorage = Math.max(0, archiveStorage - 2500);

    const storageCost =
      extraRegularStorage * STORAGE_PRICE + extraArchiveStorage * ARCHIVE_STORAGE_PRICE;

    return {
      basePrice: BUSINESS_BASE_PRICE,
      computeCost,
      storageCost,
      totalCost: BUSINESS_BASE_PRICE + computeCost + storageCost,
      totalComputeHours,
      regularStorage,
      archiveStorage,
    };
  };

  const costs = calculateCosts();

  return (
    <div className="bg-gray-900 text-white">
      <div className="mx-auto max-w-4xl">
        <form className="space-y-8">
          {/* Basic Configuration */}
          <div
            className={clsx(
              'relative z-10 rounded-xl border border-gray-new-10 bg-[#020203] p-8',
              'bg-[radial-gradient(131.75%_102.44%_at_16.67%_0%,_rgba(20,24,31,.5),_rgba(20,24,31,0.30)_47.96%,_rgba(20,24,31,0))]'
            )}
          >
            <div className="flex flex-wrap justify-between gap-4">
              <Field
                name="numProjects"
                label="Number of Projects"
                type="number"
                theme="transparent"
                labelClassName={labelClassName}
                errorClassName={errorClassName}
                error={errors.numProjects?.message}
                {...register('numProjects')}
              />

              <Field
                name="computeSize"
                label="Average compute size"
                tag="select"
                theme="transparent"
                labelClassName={labelClassName}
                errorClassName={errorClassName}
                error={errors.computeSize?.message}
                {...register('computeSize')}
              >
                {ComputeSizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </Field>
            </div>

            <h2 className="text-xl font-semibold">Compute usage distribution across projects</h2>
            <p className="text-sm text-gray-new-80">
              The compute usage distribution across projects is used to calculate the total compute
              hours for the month.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-end gap-x-2">
                  <Field
                    name="lowUsage"
                    label="Low - Testing"
                    type="number"
                    theme="transparent"
                    labelClassName={labelClassName}
                    errorClassName={errorClassName}
                    error={errors.lowUsage?.message}
                    {...register('lowUsage')}
                  />
                  <span className="pb-2 text-gray-new-80">%</span>
                </div>
                <span className="text-xs text-gray-new-80"> 5 active hours/month</span>
              </div>
              <div>
                <div className="flex items-end gap-x-2">
                  <Field
                    name="moderateUsage"
                    label="Moderate - Business hours"
                    type="number"
                    theme="transparent"
                    labelClassName={labelClassName}
                    errorClassName={errorClassName}
                    error={errors.moderateUsage?.message}
                    {...register('moderateUsage')}
                  />
                  <span className="pb-2 text-gray-new-80">%</span>
                </div>
                <span className="text-xs text-gray-new-80"> 160 active hours/month</span>
              </div>
              <div>
                <div className="flex items-end gap-x-2">
                  <Field
                    name="highUsage"
                    label="High - Always on"
                    type="number"
                    theme="transparent"
                    labelClassName={labelClassName}
                    errorClassName={errorClassName}
                    error={errors.highUsage?.message}
                    {...register('highUsage')}
                  />
                  <span className="pb-2 text-gray-new-80">%</span>
                </div>
                <span className="text-xs text-gray-new-80"> 730 active hours/month</span>
              </div>
            </div>

            <div className="mb-8 mt-8">
              <div className="flex h-4 w-full overflow-hidden rounded bg-gray-new-10">
                <div
                  className="bg-primary-1 transition-all duration-200"
                  style={{ width: `${watch('lowUsage')}%` }}
                  title={`Low Usage: ${watch('lowUsage')}%`}
                />
                <div
                  className="bg-secondary-2 transition-all duration-200"
                  style={{ width: `${watch('moderateUsage')}%` }}
                  title={`Moderate Usage: ${watch('moderateUsage')}%`}
                />
                <div
                  className="bg-secondary-3 transition-all duration-200"
                  style={{ width: `${watch('highUsage')}%` }}
                  title={`High Usage: ${watch('highUsage')}%`}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-primary-1" />
                  <span className="text-sm text-gray-new-80">Low Usage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-secondary-2" />
                  <span className="text-sm text-gray-new-80">Moderate Usage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-secondary-3" />
                  <span className="text-sm text-gray-new-80">High Usage</span>
                </div>
              </div>
            </div>

            <h2 className="mb-4 text-xl font-semibold">Storage usage distribution</h2>
            <p className="text-sm text-gray-new-80">
              The storage usage distribution across projects is used to calculate the total storage
              for the month.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-end gap-x-2">
                    <Field
                      name="smallDB"
                      label="Small"
                      type="number"
                      theme="transparent"
                      labelClassName={labelClassName}
                      errorClassName={errorClassName}
                      error={errors.smallDB?.message}
                      {...register('smallDB')}
                    />
                    <span className="pb-2 text-gray-new-80">%</span>
                  </div>
                  <span className="text-xs text-gray-new-80"> 1 GB of storage</span>
                </div>
                <div>
                  <div className="flex items-end gap-x-2">
                    <Field
                      name="mediumDB"
                      label="Medium"
                      type="number"
                      theme="transparent"
                      labelClassName={labelClassName}
                      errorClassName={errorClassName}
                      error={errors.mediumDB?.message}
                      {...register('mediumDB')}
                    />
                    <span className="pb-2 text-gray-new-80">%</span>
                  </div>
                  <span className="text-xs text-gray-new-80">10 GB of storage</span>
                </div>
                <div>
                  <div className="flex items-end gap-x-2">
                    <Field
                      name="largeDB"
                      label="Large"
                      type="number"
                      theme="transparent"
                      labelClassName={labelClassName}
                      errorClassName={errorClassName}
                      error={errors.largeDB?.message}
                      {...register('largeDB')}
                    />
                    <span className="pb-2 text-gray-new-80">%</span>
                  </div>
                  <span className="text-xs text-gray-new-80">100 GB of storage</span>
                </div>
              </div>

              <div className="mb-8 mt-8">
                <div className="flex h-4 w-full overflow-hidden rounded bg-gray-new-10">
                  <div
                    className="bg-primary-1 transition-all duration-200"
                    style={{ width: `${watch('smallDB')}%` }}
                    title={`Small DB: ${watch('smallDB')}%`}
                  />
                  <div
                    className="bg-secondary-2 transition-all duration-200"
                    style={{ width: `${watch('mediumDB')}%` }}
                    title={`Medium DB: ${watch('mediumDB')}%`}
                  />
                  <div
                    className="bg-secondary-3 transition-all duration-200"
                    style={{ width: `${watch('largeDB')}%` }}
                    title={`Large DB: ${watch('largeDB')}%`}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-primary-1" />
                    <span className="text-sm text-gray-new-80">Small (1 GB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-secondary-2" />
                    <span className="text-sm text-gray-new-80">Medium (10 GB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-secondary-3" />
                    <span className="text-sm text-gray-new-80">Large (100 GB)</span>
                  </div>
                </div>
              </div>

              <Field
                name="archivePercentage"
                label="Archive Storage %"
                type="number"
                theme="transparent"
                labelClassName={labelClassName}
                errorClassName={errorClassName}
                error={errors.archivePercentage?.message}
                helperText="Percentage of storage that will be archived"
                className="w-32 pt-4"
                {...register('archivePercentage')}
              />
            </div>

            <DashedBorder />

            <p className="mt-4 text-xl font-bold">
              Total Monthly Cost: {numberFormatter.format(costs.totalCost)}
            </p>

            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Details</summary>
              <div className="mt-4">
                <h2 className="mb-4 text-xl font-semibold">Cost Breakdown</h2>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Base Price: {numberFormatter.format(costs.basePrice)}/month</li>
                  <li>Extra Compute Cost: {numberFormatter.format(costs.computeCost)}/month</li>
                  <li>Extra Storage Cost: {numberFormatter.format(costs.storageCost)}/month</li>
                </ul>

                <h2 className="mb-4 text-xl font-semibold">Usage Details</h2>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Total Compute Hours: {numberFormatter.format(costs.totalComputeHours)}</li>
                  <li>
                    Storage
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                      <li>Regular: {numberFormatter.format(costs.regularStorage)} GB</li>
                      <li>Archive: {numberFormatter.format(costs.archiveStorage)} GB</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostgresForPlatformsCalculator;
