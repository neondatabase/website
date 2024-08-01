import Image from 'next/image';

import BgDecor from '../bg-decor';
import Calculator from '../calculator';

import rightGlowMobile from './images/right-glow-mobile.png';
import rightGlow from './images/right-glow.png';

const Example = () => (
  <div className="relative mb-10 mt-11 w-full overflow-hidden rounded-lg bg-[#0D0E10] px-8 py-6 xl:mb-9 xl:mt-10 lg:mb-9 lg:mt-9 md:mb-6 md:mt-7 sm:p-6">
    <div className="relative z-10 pb-[18px]">
      <h3 className="mb-5 text-2xl font-medium leading-snug tracking-tighter xl:text-xl sm:mb-4 sm:text-lg">
        Use case description: dev platform
      </h3>
      <div className="space-y-4 tracking-extra-tight text-gray-new-70">
        <p>
          Pied Piper, a rapidly growing developer platform, is enhancing its user experience by soon
          allowing end users to create Postgres databases directly within the platform.
          Their&nbsp;goal is to provide every customer with their own isolated instance.
        </p>
        <p>
          Pied Piper.&apos;s users fall into two categories:{' '}
          <strong className="font-normal text-white">companies with Pro accounts</strong>, storing
          an average of 20 GB, and{' '}
          <strong className="font-normal text-white">hobbyists on the free tier</strong>, storing an
          average of 0.5 GB.
        </p>
      </div>
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
        width={320}
        height={536}
        alt=""
      />
    </BgDecor>
  </div>
);

export default Example;
