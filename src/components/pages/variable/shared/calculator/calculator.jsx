import clsx from 'clsx';
import Image from 'next/image';

import ChevronIcon from 'icons/chevron-down.inline.svg';

import BgDecor from '../bg-decor';

import leftGlowMobile from './images/left-glow-mobile.png';
import leftGlow from './images/left-glow.png';
import rightGlowMobile from './images/right-glow-mobile.png';
import rightGlow from './images/right-glow.png';

const databases = [
  {
    type: '1 production database',
    instance: 'db.r6g.8xlarge',
    usage: 'Runs 24/7',
  },
  {
    type: '1 staging database',
    instance: 'db.r6g.4xlarge',
    usage: 'Used interminently',
  },
  {
    type: 'Dev database',
    instance: '10 db.t4g.micro',
    usage: 'Used interminently',
  },
  {
    type: 'Test database ',
    instance: 'db.t3.medium',
    usage: 'Used interminently',
  },
];

const values = [
  {
    title: 'Dollars overpaid',
    value: '$1,167',
    valueClassName: 'bg-variable-value-1',
    period: 'month',
  },
  {
    title: 'Bill that could be saved ',
    value: '60%',
    period: 'month',
    valueClassName: 'bg-variable-value-2',
    text: 'With scale to zero and autoscaling',
  },
];

const DashedBorder = () => (
  <>
    <span
      className="pointer-events-none relative z-20 block h-px w-full bg-[url('/images/pages/variable/dashed-border.png')] bg-[8px,1px] bg-repeat-x mix-blend-overlay"
      aria-hidden
    />
    <span
      className="pointer-events-none relative z-10 -mt-px block h-px w-full bg-[url('/images/pages/variable/dashed-border.png')] bg-[8px,1px] bg-repeat-x opacity-50 mix-blend-overlay"
      aria-hidden
    />
  </>
);

const Calculator = () => (
  <div className="relative my-3 w-full overflow-hidden rounded-lg bg-[#0D0E10] px-8 py-6 sm:my-2 sm:p-6">
    <div className="relative z-10 pb-[18px]">
      <h3 className="mb-5 text-2xl font-medium leading-snug tracking-tighter xl:text-xl sm:text-lg">
        Example deployment in RDS
      </h3>
      <ul className="space-y-2 text-lg tracking-extra-tight">
        {databases.map(({ type, instance, usage }) => (
          <li key={type} className="flex items-center gap-2 sm:flex-col sm:items-start">
            <span>
              <span className="font-medium text-gray-new-90">{type}</span>{' '}
              <span className="text-gray-new-70">({instance})</span>
            </span>
            <span className="block size-[3px] rounded-full bg-gray-new-30" aria-hidden />
            <span className="text-gray-new-50">{usage}</span>
          </li>
        ))}
      </ul>
    </div>
    <DashedBorder />
    <div className="relative z-10 py-[18px]">
      <h3 className="text-2xl font-medium leading-snug tracking-tighter xl:text-xl sm:text-lg">
        Input parameters
        <ChevronIcon className="ml-2.5 inline-block h-auto w-3" />
      </h3>
    </div>
    <DashedBorder />
    <div className="relative z-10 flex justify-between pt-6 sm:flex-col sm:gap-6">
      {values.map(({ title, value, valueClassName, period, text }) => (
        <div key={title} className="min-w-[239px]">
          <p className="mb-2.5 leading-dense tracking-extra-tight">{title}</p>
          <div className="flex items-end gap-1.5">
            <span
              className={clsx(
                'bg-clip-text pr-1 font-title text-6xl font-medium leading-none tracking-tighter text-transparent sm:text-4xl',
                valueClassName
              )}
            >
              {value}
            </span>
            <span className="mb-1 text-xl text-[#7485A9]">/{period}</span>
          </div>
          {text && (
            <p className="bg-variable-value-text bg-clip-text text-sm font-light leading-dense tracking-extra-tight text-transparent">
              {text}
            </p>
          )}
        </div>
      ))}
    </div>
    <BgDecor hasBorder hasNoise hasPattern>
      <Image
        className="absolute right-0 top-0 h-full sm:hidden"
        src={rightGlow}
        width={617}
        height={452}
        alt=""
      />
      <Image
        className="absolute right-0 top-0 hidden h-[536px] w-[320px] sm:block"
        src={rightGlowMobile}
        width={320}
        height={536}
        alt=""
      />
      <Image
        className="absolute bottom-0 left-0 h-[339px] w-[389px] sm:hidden"
        src={leftGlow}
        width={389}
        height={339}
        alt=""
      />
      <Image
        className="absolute bottom-0 left-0 hidden h-[273px] w-[320px] sm:block"
        src={leftGlowMobile}
        width={320}
        height={273}
        alt=""
      />
    </BgDecor>
  </div>
);

export default Calculator;
