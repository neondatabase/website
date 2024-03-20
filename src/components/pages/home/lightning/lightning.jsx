import Image from 'next/image';

import Container from 'components/shared/container';
import phoneIllustration from 'images/pages/home/lightning/phone.png';

// TODO: add responsive styles, rive animation, check heading gradient when font will be available
const Lightning = () => (
  <section className="lightning safe-paddings mt-[216px] xl:mt-32 lg:mt-24 sm:mt-20">
    <Container
      className="pb-[311px] xl:max-w-[704px] xl:pb-[156px] lg:max-w-[640px] lg:pb-[60px] md:max-w-none md:pl-[84px] sm:pl-5"
      size="960"
    >
      <h2 className="inline-block bg-home-lightning-title bg-clip-text pb-6 text-[128px] font-medium leading-[0.95] -tracking-wider text-transparent xl:text-[96px] lg:max-w-lg lg:text-[72px] sm:text-[52px]">
        Lightning fast. Edge&nbsp;ready.
      </h2>
      <div className="ml-32 mt-20 font-medium leading-none text-white xl:ml-24 xl:mt-10 lg:ml-8  lg:mt-6 md:ml-0 sm:mt-[5px]">
        <span className="text-[128px] tracking-[-0.06em] xl:text-[96px] lg:text-[72px] sm:text-6xl">
          10
        </span>
        <span className="text-[38px] tracking-extra-tight xl:text-[28px] lg:text-[21px] sm:text-lg">
          ms
        </span>
      </div>
      <p className="ml-32 mt-8 max-w-[288px] font-light tracking-extra-tight text-gray-new-80 xl:ml-24 xl:mt-6 xl:leading-snug lg:ml-8  lg:mt-5 lg:max-w-[256px] md:ml-0 sm:mt-[9px] sm:max-w-[212px] sm:text-[15px]">
        <span className="font-medium text-white">Achieve low-latency</span> from an edge function to
        your regional compute.
      </p>
      <p className="ml-32 mt-5 max-w-[288px] font-light tracking-extra-tight text-gray-new-80 xl:ml-24 xl:mt-4 xl:leading-snug lg:ml-8  lg:mt-3 lg:max-w-[256px] md:ml-0 sm:max-w-[212px] sm:text-[15px]">
        The Neon serverless driver, designed for JavaScript and TypeScript, ensures{' '}
        <span className="font-medium text-white">low-latency Postgres queries</span>. It facilitates
        seamless data retrieval from both serverless and edge environments, utilizing HTTP.
      </p>
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
