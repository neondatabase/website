import Image from 'next/image';

import BgDecor from 'components/pages/case/bg-decor';

import Calculator from '../calculator';

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

const Example = () => (
  <div className="relative w-full overflow-hidden rounded-lg bg-[#0D0E10] px-8 py-6 sm:p-6">
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
    <Calculator />
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

export default Example;
