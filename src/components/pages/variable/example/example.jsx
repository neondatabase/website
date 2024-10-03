import Image from 'next/image';
import PropTypes from 'prop-types';

import BgDecor from 'components/pages/use-case/bg-decor';

import Calculator from '../calculator';

import leftGlowMobile from './images/left-glow-mobile.png';
import leftGlow from './images/left-glow.png';
import rightGlowMobile from './images/right-glow-mobile.png';
import rightGlow from './images/right-glow.png';

const DEFAULT_DATABASES = [
  {
    type: '1 production database',
    instance: 'db.r6g.8xlarge',
    usage: 'Runs 24/7',
  },
  {
    type: 'Dev databases',
    instance: 'db.t4g.micro',
    usage: 'Used interminently',
  },
  {
    type: 'Test databases',
    instance: 'db.t3.medium',
    usage: 'Used interminently',
  },
];

const DEFAULT_VALUES = [
  {
    name: 'wasted_money',
    title: 'Dollars overpaid',
    valueClassName: 'bg-variable-value-1',
    period: 'month',
  },
  {
    name: 'saved_money',
    title: 'Bill that could be saved',
    period: 'month',
    valueClassName: 'bg-variable-value-2',
    text: 'With scale to zero and autoscaling',
  },
];

const DEFAULT_INPUT_PARAMS_BLOCK = [
  {
    title: 'Deployment',
    items: [
      {
        name: 'test_databases_num',
        title: 'Number of test databases',
        values: [1, 3, 5, 10],
      },
      {
        name: 'dev_databases_num',
        title: 'Number of dev databases',
        values: [1, 3, 5, 10],
      },
    ],
  },
  {
    title: 'Usage',
    items: [
      {
        name: 'test_databases_daily_hrs',
        title: 'How many hrs/day are test databases&nbsp;running?',
        values: [1, 2, 3, 5, 8],
      },
      {
        name: 'dev_databases_daily_hrs',
        title: 'How many hrs/day are dev databases&nbsp;running?',
        values: [1, 2, 3, 5, 8],
      },
      {
        name: 'peak_traffic_hrs',
        title: 'How many hrs/ day do you hit&nbsp;peak&nbsp;traffic?',
        values: [0.5, 1, 3, 5],
      },
    ],
  },
];

const Example = ({
  databases = DEFAULT_DATABASES,
  values = DEFAULT_VALUES,
  inputParamsBlock = DEFAULT_INPUT_PARAMS_BLOCK,
}) => (
  <div className="not-prose relative w-full overflow-hidden rounded-lg bg-[#0D0E10] px-8 py-6 sm:p-6">
    <div className="relative z-10 pb-[18px]">
      <h3 className="mb-5 text-2xl font-medium leading-snug tracking-tighter xl:text-xl sm:mb-4 sm:text-lg">
        Example deployment in RDS
      </h3>
      <ul className="space-y-2 text-lg tracking-extra-tight sm:text-sm sm:leading-snug">
        {databases.map(({ type, instance, usage }) => (
          <li key={type} className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-0">
            <span>
              <span className="font-medium text-gray-new-90">{type}</span>{' '}
              <span className="text-gray-new-70">({instance})</span>
            </span>
            <span className="block size-[3px] rounded-full bg-gray-new-30 sm:hidden" aria-hidden />
            <span className="text-gray-new-50">{usage}</span>
          </li>
        ))}
      </ul>
    </div>
    <Calculator inputParamsBlock={inputParamsBlock} values={values} />
    <BgDecor hasBorder hasNoise hasPattern>
      <Image
        className="absolute right-0 top-0 h-[776px] w-[617px] sm:hidden"
        src={rightGlow}
        width={617}
        height={776}
        alt=""
      />
      <Image
        className="absolute right-0 top-0 hidden h-[536px] w-[320px] sm:block"
        src={rightGlowMobile}
        width={430}
        height={650}
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

Example.propTypes = {
  databases: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      instance: PropTypes.string.isRequired,
      usage: PropTypes.string.isRequired,
    })
  ),
  values: PropTypes.array,
  inputParamsBlock: PropTypes.array,
};

export default Example;
