import Image from 'next/image';

import BgDecor from './bg-decor';
import Calculator from './calculator';
import rightGlowMobile from './images/right-glow-mobile.png';
import rightGlow from './images/right-glow.png';

const UseCaseCalculator = () => (
  <div className="relative mt-11 w-full overflow-hidden rounded-lg bg-[#0D0E10] px-8 py-6 xl:mt-10 lg:mt-9 md:mt-7 sm:p-6">
    <div className="relative z-10 pb-[18px]">
      <h2 className="sr-only">Use case</h2>
      <h3 className="mb-5 text-2xl font-medium leading-snug tracking-tighter xl:text-xl sm:mb-4 sm:text-lg">
        Costs estimator
      </h3>
      <div className="space-y-4 tracking-extra-tight text-gray-new-70">
        <p>
          Pied Piper, a developer platform, wants to give one managed Postgres database to each one
          of their end users.
        </p>
        <p>
          Pied Piper.&apos;s users fall into two categories:{' '}
          <strong className="font-normal text-white">companies with Pro accounts</strong>, storing
          an average of 20 GB, and{' '}
          <strong className="font-normal text-white">hobbyists on the Free plan</strong>, storing an
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
        priority
      />
      <Image
        className="absolute right-0 top-0 hidden h-[536px] w-[320px] sm:block"
        src={rightGlowMobile}
        width={430}
        height={650}
        alt=""
        priority
      />
    </BgDecor>
  </div>
);

export default UseCaseCalculator;
