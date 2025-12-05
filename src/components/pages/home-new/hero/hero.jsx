import clsx from 'clsx';
import Image from 'next/image';

import HeadingLabel from 'components/pages/home-new/heading-label';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Logos from 'components/shared/logos';
import PauseableVideo from 'components/shared/pauseable-video';
import links from 'constants/links';
import mobileBgIllustration from 'images/pages/home-new/hero/bg-illustration.jpg';

const logos = ['replit', 'outfront', 'doordash', 'bcg', 'pepsi', 'zimmer', 'retool', 'meta'];

const Hero = () => (
  <section className="hero safe-paddings relative mt-16 lg:mt-14">
    <Container
      className="relative z-30 pt-[409px] xl:px-16 xl:pt-[216px] lg:pt-[192px] md:!px-5 md:pt-[204px]"
      size="1600"
    >
      <HeadingLabel>Ship faster with Postgres</HeadingLabel>

      <h1 className="mt-5 max-w-[890px] text-[60px] leading-dense tracking-tighter xl:max-w-[760px] xl:text-[52px] lg:max-w-[640px] lg:text-[44px] md:mt-4 sm:text-[28px]">
        Faster application development on trusted serverless Postgres
      </h1>

      <div className="mt-8 flex gap-x-5 lg:mt-7 lg:gap-x-4">
        <Button theme="white-filled" size="new" to={links.signup}>
          Get started
        </Button>
        <Button
          className="!font-normal"
          theme="gray-40-outline"
          size="new"
          to={links.docsBranching}
        >
          Read the docs
        </Button>
      </div>

      <div className="relative mt-16 select-none border-b border-gray-new-20 pb-10 lg:mt-14 lg:pb-8 sm:mt-12">
        <Logos className="max-w-full !p-0" logos={logos} size="md" staticDesktop />
      </div>
    </Container>

    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/*
        Video optimization parameters:
          mp4: ffmpeg -i hero-origin.mp4 -c:v libx265 -crf 26 -vf scale=3840:-2 -preset veryslow -tag:v hvc1 -movflags faststart -an hero.mp4
          webm: ffmpeg -i hero-origin.mp4 -c:v libvpx-vp9 -crf 40 -vf scale=3840:-2 -deadline best -an hero.webm
      */}
      <PauseableVideo
        className={clsx(
          'relative left-1/2 w-[1920px] -translate-x-1/2',
          'xl:-top-[50px] xl:w-[1304px] lg:-top-2 lg:w-[1016px] sm:hidden'
        )}
        width={1920}
        height={832}
        poster="/videos/pages/home-new/hero/poster.jpg"
      >
        <source src="/videos/pages/home-new/hero/hero.mp4" type="video/mp4" />
        <source src="/videos/pages/home-new/hero/hero.webm" type="video/webm" />
      </PauseableVideo>
      <Image
        className="relative left-[40%] hidden w-[752px] max-w-none -translate-x-1/2 sm:block"
        src={mobileBgIllustration}
        width={752}
        height={326}
        quality={100}
        sizes="100vw"
        alt=""
        priority
      />
    </div>

    <div className="absolute bottom-0 z-20 h-[88px] w-full bg-[linear-gradient(0deg,#000_0%,rgba(0,0,0,0.00)_100%)] xl:h-[165px] lg:h-[156px] sm:h-[258px]" />
  </section>
);

export default Hero;
