import Image from 'next/image';

import Container from 'components/shared/container';

import FeatureHeading from './feature-heading';
import GlobeAnimation from './globe';

const ASSET_ROOT = '/images/pages/home/scale-your-app';

const ScaleNoise = () => (
  <div
    className="pointer-events-none absolute top-0 left-1/2 z-[1] h-[66.2733%] w-[99.9479%] -translate-x-1/2"
    style={{
      WebkitMaskImage: `url(${ASSET_ROOT}/scale-noise-mask.png)`,
      WebkitMaskPosition: 'center',
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskSize: '100% 100%',
      maskImage: `url(${ASSET_ROOT}/scale-noise-mask.png)`,
      maskMode: 'alpha',
      maskPosition: 'center',
      maskRepeat: 'no-repeat',
      maskSize: '100% 100%',
    }}
    aria-hidden="true"
  >
    <Image
      className="absolute max-w-none"
      src={`${ASSET_ROOT}/scale-noise.svg`}
      width={1687}
      height={1163}
      sizes="(max-width: 639px) 796px, (max-width: 1023px) 1174px, 1687px"
      style={{
        height: '109.0%',
        left: '5.5237%',
        top: '4.5923%',
        width: '87.9104%',
      }}
      alt=""
    />
  </div>
);

const ScaleStat = () => (
  <div className="h-[330px] w-[736px] border border-[#242628] bg-black-pure p-1 xl:h-80 xl:w-160 lg:w-md md:h-[286px] md:w-sm sm:h-auto sm:w-full">
    <div className="flex h-[37px] items-center justify-between bg-[#303236] px-3 font-mono text-base font-semibold text-white md:text-sm">
      <span>Trusted by giants</span>
    </div>
    <div className="px-[27px] pt-[92px] xl:pt-20 md:px-5 md:pt-15 sm:pt-8 sm:pb-8">
      <strong className="block text-[98px] leading-none font-normal tracking-extra-tight text-white md:text-[5rem] sm:text-[4rem]">
        250M+
      </strong>
      <p className="mt-[18px] max-w-[235px] text-xl leading-tight tracking-extra-tight text-gray-new-80 md:mt-4 md:text-lg sm:max-w-[220px] sm:text-base">
        Monthly users powered by Zillow’s agentic AI
      </p>
    </div>
  </div>
);

const Scale = () => (
  <div className="relative h-[1051px] overflow-hidden xl:h-250 lg:h-205 md:h-[700px] sm:h-[600px]">
    <div
      className="pointer-events-none absolute top-0 left-1/2 z-0 h-[1610px] w-[1920px] -translate-x-1/2 lg:h-[1120px] lg:w-[1336px] sm:h-[760px] sm:w-[906px] sm:-translate-x-[53%]"
      aria-hidden="true"
    >
      <div className="absolute top-[231px] left-1/2 h-[1176px] w-[1176px] -translate-x-1/2 overflow-hidden rounded-full lg:top-[163.5px] lg:h-[818px] lg:w-[818px] sm:top-32 sm:h-[555px] sm:w-[555px]">
        <div className="xl: absolute top-1/2 left-1/2 aspect-1920/1610 w-[1920px] -translate-x-1/2 -translate-y-1/2 xl:w-410 lg:h-[1120px] lg:w-[1336px] sm:h-[760px] sm:w-[906px]">
          <GlobeAnimation />
        </div>
      </div>
      <ScaleNoise />
    </div>

    <Container className="relative z-10 pt-6 lg:pt-0" size="1600">
      <FeatureHeading
        className="ml-24 lg:ml-0"
        lines={[
          { text: 'WHERE THE FORTUNE', width: 672 },
          { text: '500 SCALES', width: 544 },
        ]}
        description="Trusted by the most demanding production workloads."
      />
    </Container>

    <div className="absolute top-[570px] left-1/2 -translate-x-3/4 lg:top-[430px] md:top-[360px] sm:inset-5 sm:top-88 sm:translate-x-0">
      <ScaleStat />
    </div>
  </div>
);

export default Scale;
