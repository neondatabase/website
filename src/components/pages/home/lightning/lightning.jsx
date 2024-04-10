import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import PauseableVideo from 'components/shared/pauseable-video';
import phoneIllustration from 'images/pages/home/lightning/phone.png';

// TODO: check heading gradient position when font will be available
const Lightning = () => (
  <section className="lightning safe-paddings mt-[208px] xl:mt-32 lg:mt-24 sm:mt-20">
    <Container
      className="pb-[280px] xl:max-w-[704px] xl:pb-[178px] lg:!max-w-[640px] lg:pb-6 md:!max-w-none md:pl-[84px] sm:pl-5"
      size="960"
    >
      <h2 className="inline-block bg-home-lightning-title bg-clip-text pb-6 font-title text-[128px] font-medium leading-[0.95] -tracking-wider text-transparent xl:text-[96px] lg:max-w-lg lg:text-[72px] sm:text-[52px]">
        Lightning fast. Edge&nbsp;ready.
      </h2>
      <div className="relative z-10 -mt-10 ml-32 aspect-[1.181818] max-w-[431px] mix-blend-plus-lighter xl:-mt-14 xl:ml-24 xl:max-w-[333px] lg:-mt-[72px] lg:ml-8 lg:max-w-[297px] md:ml-0 md:max-w-[277px] sm:mt-[-60px] sm:max-w-[226px]">
        <PauseableVideo width={431} height={365}>
          <source src="/videos/pages/home/lightning-loop-crf-22.mp4" type="video/mp4" />
          <source src="/videos/pages/home/lightning-loop-crf-20.webm" type="video/webm" />
        </PauseableVideo>
      </div>
      <p className="relative z-10 -mt-[84px] ml-32 max-w-[288px] font-light tracking-extra-tight text-gray-new-80 xl:-mt-16 xl:ml-24 xl:leading-snug lg:-mt-16 lg:ml-8 lg:max-w-[256px] md:ml-0 sm:-mt-[53px] sm:max-w-[212px] sm:text-[15px]">
        <span className="font-medium text-white">The Neon serverless driver</span>, designed for
        JavaScript and TypeScript, ensures low-latency Postgres queries. It unlocks database
        connectivity for both serverless and edge environments, utilizing HTTP.
      </p>
      <Link
        className="ml-32 mt-[22px] flex w-fit items-center text-sm font-medium leading-none tracking-[-0.03em] text-white xl:ml-24 lg:ml-8 md:ml-0"
        to="#"
        withArrow
      >
        Get the Serverless Driver
      </Link>
      <Image
        className="absolute -right-6 top-32 xl:-right-11 xl:top-[84px] xl:max-w-[348px] lg:left-[337px] lg:right-auto lg:top-14 lg:max-w-[271px] sm:left-56 sm:top-6"
        src={phoneIllustration}
        width={464}
        height={840}
        alt=""
      />
    </Container>
  </section>
);

export default Lightning;
