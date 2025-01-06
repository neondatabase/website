'use client';

// TODO: add comparison with RDS

import { yupResolver } from '@hookform/resolvers/yup';
import * as SliderPrimitive from '@radix-ui/react-slider';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Field from 'components/shared/field';

const COMPUTE_SIZES = [
  { value: 0.25, label: '0.25 CU (0.25 vCPU, 1GB RAM)' },
  { value: 0.5, label: '0.5 CU (0.5 vCPU, 2GB RAM)' },
  { value: 1, label: '1 CU (1 vCPU, 4GB RAM)' },
  { value: 2, label: '2 CU (2 vCPU, 8GB RAM)' },
  { value: 4, label: '4 CU (4 vCPU, 16GB RAM)' },
  { value: 8, label: '8 CU (8 vCPU, 32GB RAM)' },
  { value: 16, label: '16 CU (16 vCPU, 64GB RAM)' },
];

const PLANS = {
  FREE: {
    name: 'Free',
    basePrice: 0,
    computeHours: 191.9,
    storage: 0.5,
    archiveStorage: 0,
    projectLimit: 10,
    maxComputeSize: 2,
    computePrice: 0,
    storagePrice: 0,
    archiveStoragePrice: 0,
  },
  LAUNCH: {
    name: 'Launch',
    basePrice: 19,
    computeHours: 300,
    storage: 10,
    archiveStorage: 50,
    projectLimit: 100,
    maxComputeSize: 4,
    computePrice: 0.16,
    storagePrice: 1.75,
    archiveStoragePrice: 0.1,
  },
  SCALE: {
    name: 'Scale',
    basePrice: 69,
    computeHours: 750,
    storage: 50,
    archiveStorage: 250,
    projectLimit: 1000,
    maxComputeSize: 8,
    computePrice: 0.16,
    storagePrice: 1.5,
    archiveStoragePrice: 0.1,
    projectUnitSize: 1000,
    projectUnitPrice: 50,
  },
  BUSINESS: {
    name: 'Business',
    basePrice: 700,
    computeHours: 1000,
    storage: 500,
    archiveStorage: 2500,
    projectLimit: 5000,
    maxComputeSize: 16,
    computePrice: 0.16,
    storagePrice: 0.5,
    archiveStoragePrice: 0.1,
    projectUnitSize: 5000,
    projectUnitPrice: 50,
  },
};

const DEFAULT_VALUES = {
  numProjects: 100,
  computeSize: 0.25,
  archivePercentage: 95,
  // The slider values represent percentages that divide usage into 3 tiers
  // For example, computeSliderValues: [95, 99] means:
  // - 0-95%: Testing usage
  // - 95-99%: Business hours usage  (difference between the 95 and 99)
  // - 99-100%: Always on usage (difference between the 99 and 100)
  computeSliderValues: [95, 99],
  storageSliderValues: [95, 99],
  computeHours: {
    low: 5,
    moderate: 160,
    high: 730,
  },
  storageGB: {
    small: 1,
    medium: 10,
    large: 100,
  },
};

const computeValueData = [
  {
    title: 'Testing',
    description: `(${DEFAULT_VALUES.computeHours.low} active hours/month)`,
    color: 'bg-primary-1',
  },
  {
    title: 'Business hours',
    description: `(${DEFAULT_VALUES.computeHours.moderate} active hours/month)`,
    color: 'bg-secondary-2',
  },
  {
    title: 'Always on',
    description: `(${DEFAULT_VALUES.computeHours.high} active hours/month)`,
    color: 'bg-secondary-3',
  },
];

const storageValueData = [
  {
    title: `${DEFAULT_VALUES.storageGB.small} GB`,
    color: 'bg-primary-1',
  },
  {
    title: `${DEFAULT_VALUES.storageGB.medium} GB`,
    color: 'bg-secondary-2',
  },
  {
    title: `${DEFAULT_VALUES.storageGB.large} GB`,
    color: 'bg-secondary-3',
  },
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
      .oneOf(COMPUTE_SIZES.map((size) => size.value)),
    archivePercentage: yup.number().required().min(0).max(100),
  })
  .required();

const UsageSlider = ({ values, setValues, valueData }) => {
  const handleSliderChange = (newValues) => {
    setValues(newValues);
  };

  const calculateProportions = (values) => {
    const sortedValues = [...values].sort((a, b) => a - b);
    return [sortedValues[0], sortedValues[1] - sortedValues[0], 100 - sortedValues[1]];
  };

  const proportions = calculateProportions(values);

  return (
    <div className="w-full">
      <div className="relative pb-10">
        <SliderPrimitive.Root
          className="relative flex h-10 w-full touch-none select-none items-center"
          value={values}
          min={0}
          max={100}
          step={1}
          aria-label="Usage Proportion Slider"
          onValueChange={handleSliderChange}
        >
          <SliderPrimitive.Track className="relative h-2 grow overflow-hidden rounded-full bg-gray-1">
            {valueData.map((data, index) => (
              <div
                key={index}
                className={`absolute bottom-0 top-0 ${data.color}`}
                style={{
                  left: index === 0 ? '0%' : `${values[index - 1]}%`,
                  right: index === valueData.length - 1 ? '0%' : `${100 - values[index]}%`,
                }}
              />
            ))}
          </SliderPrimitive.Track>
          {values.map((value, index) => (
            <SliderPrimitive.Thumb
              key={index}
              className="block size-4 rounded-sm border-2 border-white bg-white focus:outline-none focus-visible:ring focus-visible:ring-primary-2 focus-visible:ring-opacity-75"
              aria-label={`Thumb ${index + 1}`}
            />
          ))}
        </SliderPrimitive.Root>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs font-medium">
          {valueData.map((data, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className={`rounded px-2 py-1 ${data.color} mb-1 text-black-new`}>
                {data.title}
              </span>
              <span className="text-center">{proportions[index]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

UsageSlider.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  setValues: PropTypes.func.isRequired,
  valueData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const PostgresForPlatformsCalculator = () => {
  const [computeValues, setComputeValues] = useState(DEFAULT_VALUES.computeSliderValues);
  const [storageValues, setStorageValues] = useState(DEFAULT_VALUES.storageSliderValues);

  // Takes an array of 2 slider values (0-100) and calculates 3 proportions that add up to 100%:
  // - First proportion is the first slider value
  // - Second proportion is the difference between the two slider values
  // - Third proportion is the remaining percentage up to 100%
  const calculateProportions = (values) => {
    const sortedValues = [...values].sort((a, b) => a - b);
    return [sortedValues[0], sortedValues[1] - sortedValues[0], 100 - sortedValues[1]];
  };

  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      numProjects: DEFAULT_VALUES.numProjects,
      computeSize: DEFAULT_VALUES.computeSize,
      archivePercentage: DEFAULT_VALUES.archivePercentage,
    },
  });

  const formValues = watch();
  const computeProportions = calculateProportions(computeValues);
  const storageProportions = calculateProportions(storageValues);

  // Determine which plan is needed based on requirements
  const determinePlan = (requirements) => {
    const { numProjects, computeSize, totalComputeHours, regularStorage, archiveStorage } =
      requirements;

    if (
      numProjects <= PLANS.FREE.projectLimit &&
      computeSize <= PLANS.FREE.maxComputeSize &&
      totalComputeHours <= PLANS.FREE.computeHours &&
      regularStorage + archiveStorage <= PLANS.FREE.storage
    ) {
      return PLANS.FREE;
    }

    if (numProjects <= PLANS.LAUNCH.projectLimit && computeSize <= PLANS.LAUNCH.maxComputeSize) {
      return PLANS.LAUNCH;
    }

    if (numProjects <= PLANS.SCALE.projectLimit && computeSize <= PLANS.SCALE.maxComputeSize) {
      return PLANS.SCALE;
    }

    return PLANS.BUSINESS;
  };

  // Calculate costs based on form values
  const calculateCosts = () => {
    const { numProjects, computeSize, archivePercentage } = formValues;

    // Calculate total compute hours
    const totalComputeHours =
      numProjects *
      ((computeProportions[0] / 100) * DEFAULT_VALUES.computeHours.low +
        (computeProportions[1] / 100) * DEFAULT_VALUES.computeHours.moderate +
        (computeProportions[2] / 100) * DEFAULT_VALUES.computeHours.high) *
      computeSize;

    // Calculate storage
    const avgStorage =
      numProjects *
      ((storageProportions[0] / 100) * DEFAULT_VALUES.storageGB.small +
        (storageProportions[1] / 100) * DEFAULT_VALUES.storageGB.medium +
        (storageProportions[2] / 100) * DEFAULT_VALUES.storageGB.large);

    const regularStorage = avgStorage * (1 - archivePercentage / 100);
    const archiveStorage = avgStorage * (archivePercentage / 100);

    // Determine appropriate plan
    const plan = determinePlan({
      numProjects,
      computeSize,
      totalComputeHours,
      regularStorage,
      archiveStorage,
    });

    // Calculate extra costs based on plan limits
    const extraComputeHours = Math.max(0, totalComputeHours - plan.computeHours);
    const extraRegularStorage = Math.max(0, regularStorage - plan.storage);
    const extraArchiveStorage = Math.max(0, archiveStorage - plan.archiveStorage);

    const computeCost = extraComputeHours * plan.computePrice;
    const storageCost =
      extraRegularStorage * plan.storagePrice + extraArchiveStorage * plan.archiveStoragePrice;

    // Calculate extra projects cost if applicable
    let projectsCost = 0;
    if (plan.projectUnitSize && plan.projectUnitPrice) {
      const extraProjectUnits = Math.ceil(
        Math.max(0, numProjects - plan.projectLimit) / plan.projectUnitSize
      );
      projectsCost = extraProjectUnits * plan.projectUnitPrice;
    }

    return {
      plan: plan.name,
      basePrice: plan.basePrice,
      computeCost,
      storageCost,
      projectsCost,
      totalCost: plan.basePrice + computeCost + storageCost + projectsCost,
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
                labelClassName="text-sm text-gray-new-90"
                errorClassName="!top-0"
                error={errors.numProjects?.message}
                {...register('numProjects')}
              />

              <Field
                name="computeSize"
                label="Average compute size"
                tag="select"
                theme="transparent"
                labelClassName="text-sm text-gray-new-90"
                errorClassName="!top-0"
                error={errors.computeSize?.message}
                {...register('computeSize')}
              >
                {COMPUTE_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </Field>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold">Compute Usage</h2>
              <UsageSlider
                values={computeValues}
                setValues={setComputeValues}
                valueData={computeValueData}
              />
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold">Storage Usage</h2>
              <UsageSlider
                values={storageValues}
                setValues={setStorageValues}
                valueData={storageValueData}
              />
            </div>

            <div className="pt-4">
              <div className="mt-2 flex justify-between text-sm">
                <span>Archive Storage</span>
                <span className="text-gray-new-80">
                  {formValues.archivePercentage}% of storage that will be archived
                </span>
              </div>
              <SliderPrimitive.Root
                className="relative flex h-10 w-full touch-none select-none items-center"
                value={[formValues.archivePercentage]}
                min={0}
                max={100}
                step={1}
                aria-label="Archive Storage Percentage"
                onValueChange={([value]) => {
                  register('archivePercentage').onChange({
                    target: { value, name: 'archivePercentage' },
                  });
                }}
              >
                <SliderPrimitive.Track className="relative h-2 grow overflow-hidden rounded-full bg-gray-1">
                  <div
                    className="absolute bottom-0 top-0 bg-primary-1"
                    style={{
                      left: '0%',
                      right: `${100 - formValues.archivePercentage}%`,
                    }}
                  />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb
                  className="border-slate-900 block h-5 w-5 rounded-md border-2 bg-white focus:outline-none focus-visible:ring focus-visible:ring-primary-2 focus-visible:ring-opacity-75"
                  aria-label="Archive Storage Percentage"
                />
              </SliderPrimitive.Root>

              {errors.archivePercentage?.message && (
                <span className="text-red-500 text-sm">{errors.archivePercentage.message}</span>
              )}
            </div>

            <p className="mt-10 text-right text-xl font-bold text-white">
              Total: {numberFormatter.format(costs.totalCost)} / month
            </p>

            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Details</summary>
              <div className="mt-4">
                <h2 className="mb-4 text-xl font-semibold">Cost Breakdown</h2>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Base plan price: {costs.plan} - {numberFormatter.format(costs.basePrice)}/month
                    <div className="mt-1 text-sm text-gray-new-80">
                      Your usage requires the {costs.plan} plan which has a base price of{' '}
                      {numberFormatter.format(costs.basePrice)}/month
                    </div>
                  </li>
                  <li>
                    Extra Compute Cost: {numberFormatter.format(costs.computeCost)}/month
                    <div className="mt-1 text-sm text-gray-new-80">
                      Your plan includes{' '}
                      {costs.plan === 'Free'
                        ? '191.9'
                        : costs.plan === 'Launch'
                          ? '300'
                          : costs.plan === 'Scale'
                            ? '750'
                            : '1000'}{' '}
                      compute hours. You are using {Math.round(costs.totalComputeHours)} hours, so
                      the extra{' '}
                      {Math.round(
                        costs.totalComputeHours -
                          (costs.plan === 'Free'
                            ? 191.9
                            : costs.plan === 'Launch'
                              ? 300
                              : costs.plan === 'Scale'
                                ? 750
                                : 1000)
                      )}{' '}
                      hours are charged at ${costs.plan === 'Free' ? '0' : '0.16'}/hour
                    </div>
                  </li>
                  <li>
                    Extra Storage Cost: {numberFormatter.format(costs.storageCost)}/month
                    <div className="mt-1 text-sm text-gray-new-80">
                      Your plan includes{' '}
                      {costs.plan === 'Free'
                        ? '0.5'
                        : costs.plan === 'Launch'
                          ? '10'
                          : costs.plan === 'Scale'
                            ? '50'
                            : '500'}{' '}
                      GB regular storage and
                      {costs.plan === 'Free'
                        ? ' 0'
                        : costs.plan === 'Launch'
                          ? ' 50'
                          : costs.plan === 'Scale'
                            ? ' 250'
                            : ' 2500'}{' '}
                      GB archive storage. Extra regular storage is charged at $
                      {costs.plan === 'Free'
                        ? '0'
                        : costs.plan === 'Launch'
                          ? '1.75'
                          : costs.plan === 'Scale'
                            ? '1.50'
                            : '0.50'}
                      /GB and extra archive storage at ${costs.plan === 'Free' ? '0' : '0.10'}/GB
                    </div>
                  </li>
                  {costs.projectsCost > 0 && (
                    <li>
                      Extra Projects Cost: {numberFormatter.format(costs.projectsCost)}/month
                      <div className="mt-1 text-sm text-gray-new-80">
                        Your plan includes {costs.plan === 'Scale' ? '1,000' : '5,000'} projects.
                        Additional projects are charged in units of{' '}
                        {costs.plan === 'Scale' ? '1,000' : '5,000'} at $
                        {costs.plan === 'Scale' ? '50' : '50'}/unit
                      </div>
                    </li>
                  )}
                </ul>

                <h2 className="mb-4 mt-6 text-xl font-semibold">Usage Details</h2>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Total Compute Hours: {Math.round(costs.totalComputeHours)}
                    <div className="mt-1 text-sm text-gray-new-80">
                      Based on {formValues.numProjects} projects using a {formValues.computeSize} CU
                      instance with:
                      <ul className="mt-1 list-disc pl-5">
                        <li>
                          {computeProportions[0]}% testing usage ({DEFAULT_VALUES.computeHours.low}{' '}
                          hours/month)
                        </li>
                        <li>
                          {computeProportions[1]}% business hours (
                          {DEFAULT_VALUES.computeHours.moderate} hours/month)
                        </li>
                        <li>
                          {computeProportions[2]}% always on ({DEFAULT_VALUES.computeHours.high}{' '}
                          hours/month)
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    Storage
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                      <li>
                        Regular: {Math.round(costs.regularStorage)} GB
                        <div className="mt-1 text-sm text-gray-new-80">
                          {100 - formValues.archivePercentage}% of total storage, distributed as:
                          <ul className="mt-1 list-disc pl-5">
                            <li>
                              {storageProportions[0]}% small ({DEFAULT_VALUES.storageGB.small} GB)
                            </li>
                            <li>
                              {storageProportions[1]}% medium ({DEFAULT_VALUES.storageGB.medium} GB)
                            </li>
                            <li>
                              {storageProportions[2]}% large ({DEFAULT_VALUES.storageGB.large} GB)
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        Archive: {Math.round(costs.archiveStorage)} GB
                        <div className="mt-1 text-sm text-gray-new-80">
                          {formValues.archivePercentage}% of total storage
                        </div>
                      </li>
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
