'use client';

import clsx from 'clsx';
import { useState, useMemo } from 'react';

import Field from 'components/shared/field';

const rsdCostParams = {
  storageCostPerGB: 0.115, // B17
  computeCostPerHourFree: 0.0104, // B18
  computeCostPerHourPro: 0.126, // B19
  minStoragePerInstanceGB: 20, // B20
};

const neonCostParams = {
  computeCostPerCUHour: 0.144, // B22
  storageCostPerGB: 1.35, // B23
  cuConfigurationFree: 0.25, // B24
  cuConfigurationPro: 1, // B25
};

const inputParamsBlock = [
  {
    name: 'usersNum',
    title: 'Number of users',
    values: [500, 1000, 20000],
  },
  {
    name: 'proUsersPercentage',
    title: '% of Pro accounts vs Free. <span>If this doesn&apos;t apply, select 0.</span>',
    values: [0, 20, 30, 100],
  },
  {
    name: 'freeUsersDbHours',
    title: 'How many hours/week do the Free Plan users run the DB?',
    values: [1, 3, 15],
  },
  {
    name: 'proUsersDbHours',
    title: 'How many hours/week do the Pro users run the DB?',
    values: [5, 15, 40],
  },
];

const totalsBlock = [
  {
    name: 'inRds',
    title: 'AWS RDS',
    valueClassName: 'bg-variable-value-3',
  },
  {
    name: 'inNeon',
    title: 'Neon',
    valueClassName: 'bg-variable-value-2',
  },
  {
    name: 'costSavings',
    title: 'Total cost-savings',
    valueClassName: 'bg-variable-value-2',
  },
];

const prettifiedTotal = (num, char, order = true) => {
  const formattedNum = num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return order ? `${char}${formattedNum}` : `${formattedNum}${char}`;
};

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

const Calculator = () => {
  const [inputParams, setInputParams] = useState({
    usersNum: 1000, // B5
    proUsersPercentage: 20, // B6
    freeUsersDbHours: 3, // B7
    proUsersDbHours: 15, // B8
  });

  const handleSelect = (e, name) => {
    setInputParams({ ...inputParams, [name]: e.target.value });
  };

  const derivedValues = useMemo(() => {
    const proUsers = (inputParams.usersNum * inputParams.proUsersPercentage) / 100; // B14
    const freeUsers = inputParams.usersNum - proUsers; // B15
    return { proUsers, freeUsers };
  }, [inputParams]);

  const rsdCost = useMemo(() => {
    const freeUsersStorage = 20 * derivedValues.freeUsers * rsdCostParams.storageCostPerGB; // B27
    const proUsersStorage = derivedValues.proUsers * 20 * rsdCostParams.storageCostPerGB; // B28
    const totalRdsStorage = freeUsersStorage + proUsersStorage; // B29
    const freeUsersCompute = rsdCostParams.computeCostPerHourFree * 730 * derivedValues.freeUsers; // B30
    const proUsersCompute = 730 * rsdCostParams.computeCostPerHourPro * derivedValues.proUsers; // B31
    const totalRdsCompute = freeUsersCompute + proUsersCompute; // B32
    const totalRdsMonthly = totalRdsCompute + totalRdsStorage; // B33

    return {
      freeUsersStorage,
      proUsersStorage,
      totalRdsStorage,
      freeUsersCompute,
      proUsersCompute,
      totalRdsCompute,
      totalRdsMonthly,
    };
  }, [derivedValues]);

  const neonCost = useMemo(() => {
    const freeUsersStorageCost = 0.5 * derivedValues.freeUsers * neonCostParams.storageCostPerGB; // B35
    const proUsersStorageCost = 20 * derivedValues.proUsers * neonCostParams.storageCostPerGB; // B36
    const totalNeonStorageCost = freeUsersStorageCost + proUsersStorageCost; // B37
    const freeUsersComputeCost =
      4 *
      inputParams.freeUsersDbHours *
      neonCostParams.computeCostPerCUHour *
      derivedValues.freeUsers *
      neonCostParams.cuConfigurationFree; // B38
    const proUsersComputeCost =
      4 *
      inputParams.proUsersDbHours *
      neonCostParams.computeCostPerCUHour *
      derivedValues.proUsers *
      neonCostParams.cuConfigurationPro; // B39
    const totalNeonComputeCost = freeUsersComputeCost + proUsersComputeCost; // B40
    const totalNeonMonthlyCost = totalNeonComputeCost + totalNeonStorageCost; // B41

    return {
      freeUsersStorageCost,
      proUsersStorageCost,
      totalNeonStorageCost,
      freeUsersComputeCost,
      proUsersComputeCost,
      totalNeonComputeCost,
      totalNeonMonthlyCost,
    };
  }, [derivedValues, inputParams]);

  const totals = useMemo(() => {
    const costSavings =
      ((rsdCost.totalRdsMonthly - neonCost.totalNeonMonthlyCost) / rsdCost.totalRdsMonthly) * 100;
    return {
      inRds: prettifiedTotal(rsdCost.totalRdsMonthly, '$'), // B10
      inNeon: prettifiedTotal(neonCost.totalNeonMonthlyCost, '$'), // B11
      costSavings: prettifiedTotal(costSavings, '%', false), // F11
    };
  }, [rsdCost, neonCost]);

  const longestTotal = Object.keys(totals).reduce(
    (widest, key) => (totals[key].length > widest.length ? totals[key] : widest),
    ''
  );
  const totalsFontSize =
    longestTotal.length < 8
      ? 'text-6xl md:text-5xl sm:text-[44px]'
      : 'text-5xl md:text-4xl sm:text-[44px]';

  return (
    <>
      <DashedBorder />
      <div className="relative z-10 py-[18px] sm:py-4">
        <h3 className="mb-5 text-2xl font-medium leading-snug tracking-tighter xl:text-xl sm:text-lg">
          Use case
        </h3>
        <ul className="space-y-1.5 sm:space-y-4">
          {inputParamsBlock.map(({ name, title, values }) => (
            <li
              className="flex items-center justify-between gap-2 sm:flex-col sm:items-start"
              key={title}
            >
              <p
                className="text-lg leading-none tracking-extra-tight text-gray-new-90 md:text-base md:leading-tight [&_span]:text-gray-new-50"
                dangerouslySetInnerHTML={{ __html: title }}
              />
              <Field
                className="w-[98px] sm:w-full"
                name={title}
                labelClassName="hidden"
                inputClassName="remove-autocomplete-styles !m-0 !h-8 !px-3 !border-[1px] !border-gray-new-15 !bg-[#0D0E10] !text-base text-white placeholder:tracking-extra-tight focus:outline-none !focus:border-white sm:placeholder:text-sm !bg-[center_right_12px]"
                tag="select"
                defaultValue={inputParams[name]}
                onChange={(e) => handleSelect(e, name)}
              >
                {values?.map((option, index) => (
                  <option value={option} key={index}>
                    {option}
                  </option>
                ))}
              </Field>
            </li>
          ))}
        </ul>
      </div>
      <DashedBorder />
      <div className="relative z-10 pt-6">
        <h3 className="mb-5 text-2xl font-medium leading-snug tracking-tighter xl:text-xl sm:text-lg">
          Monthly cost: AWS RDS vs Neon
        </h3>
        <div className="flex justify-between sm:flex-col sm:gap-6">
          {totalsBlock.map(({ name, title, valueClassName }) => (
            <div key={title}>
              <p className="mb-2.5 leading-dense tracking-extra-tight lg:mb-2">{title}</p>
              <div className="flex items-end gap-1.5">
                <span
                  className={clsx(
                    'bg-clip-text font-title  font-medium leading-none tracking-extra-tight text-transparent',
                    totalsFontSize,
                    'sm:text-[44px]',
                    valueClassName
                  )}
                >
                  {totals[name]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Calculator;
