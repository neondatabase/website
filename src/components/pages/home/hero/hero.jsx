import clsx from 'clsx';
import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import Logos from 'components/shared/logos';
import PauseableVideo from 'components/shared/pauseable-video';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';
import mobileBgIllustration from 'images/pages/home/hero/bg-illustration.jpg';

const logos = ['replit', 'outfront', 'doordash', 'bcg', 'pepsi', 'zimmer', 'retool', 'meta'];

const Hero = () => (
  <section className="hero safe-paddings relative mt-16 lg:mt-14">
    <Container
      className="relative z-30 pt-[409px] xl:px-16 xl:pt-[216px] lg:pt-[208px] md:!px-5 md:pt-[212px]"
      size="1600"
    >
      <Link href="#backed-by-giants">
        <SectionLabel theme="white" size="large" icon="databricks">
          A DATABRICKS COMPANY
        </SectionLabel>
      </Link>

      <h1 className="mt-5 max-w-[890px] text-[60px] leading-dense tracking-tighter xl:max-w-[760px] xl:text-[52px] lg:max-w-[640px] lg:text-[44px] md:mt-4 sm:text-[28px]">
        Fast Postgres Databases <br />
        for Teams and Agents
      </h1>

      <div className="mt-8 flex gap-x-5 lg:mt-7 lg:gap-x-4">
        <Button theme="white-filled" size="new" to={LINKS.signup}>
          Get started
        </Button>
        <Button theme="outlined" size="new" to={LINKS.docsHome}>
          Read the docs
        </Button>
      </div>

      <div className="relative mt-16 select-none border-t border-gray-new-20 pt-10 lg:mt-14 lg:pt-7 sm:mt-12">
        <Logos className="max-w-full !p-0" logos={logos} size="md" />
      </div>
    </Container>

    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/*
        Video optimization parameters:
          mp4 av1: ffmpeg -i hero.mov -c:v libaom-av1 -crf 25 -b:v 0 -pix_fmt yuv420p10le -vf scale=2880:-2 -cpu-used 0 -tiles 4x2 -row-mt 1 -threads 16 -strict experimental -tag:v av01 -movflags faststart -an hero-av1.mp4
          mp4: ffmpeg -i hero.mov -c:v libx265 -crf 25 -pix_fmt yuv420p10le -vf scale=2880:-2 -preset veryslow -tag:v hvc1 -movflags faststart -an hero.mp4
          webm: ffmpeg -i hero.mov -c:v libvpx-vp9 -pix_fmt yuv420p10le -crf 35 -vf scale=2880:-2 -deadline best -an hero.webm
      */}
      <PauseableVideo
        className={clsx(
          'relative left-1/2 w-[1920px] -translate-x-1/2',
          'xl:-top-[50px] xl:w-[1304px] lg:-top-2 lg:w-[1016px] sm:hidden'
        )}
        width={1920}
        height={832}
        poster={`${LINKS.cdn}/public/pages/home/hero/poster.jpg`}
      >
        <source
          src={`${LINKS.cdn}/public/pages/home/hero/hero-av1.mp4`}
          type="video/mp4; codecs=av01.0.05M.08,opus"
        />
        <source src={`${LINKS.cdn}/public/pages/home/hero/hero.mp4`} type="video/mp4" />
        <source src={`${LINKS.cdn}/public/pages/home/hero/hero.webm`} type="video/webm" />
      </PauseableVideo>
      <Image
        className="relative left-[40%] hidden w-[752px] max-w-none -translate-x-1/2 sm:block"
        src={mobileBgIllustration}
        width={752}
        height={326}
        quality={100}
        alt=""
        priority
      />
    </div>

    <div className="absolute bottom-0 z-20 h-[88px] w-full bg-[linear-gradient(0deg,#000_0%,rgba(0,0,0,0.00)_100%)] xl:h-[165px] lg:h-[156px] sm:h-[258px]" />
  </section>
);

export default Hero;
