import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import Logos from 'components/shared/logos';
import PauseableVideo from 'components/shared/pauseable-video';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';
import mobileBgIllustration from 'images/pages/home/hero/bg-illustration.jpg';
import { cn } from 'utils/cn';

import HeroServices from './hero-services';

const logos = [
  'replit',
  'outfront',
  'doordash',
  'bcg',
  'pepsi',
  'retool',
  'meta',
  'bitso',
  'framer',
];

export const heroServiceItems = [
  {
    title: 'Postgres Database',
    description: 'Serverless Postgres that scales and branches with your app.',
    videoBase: 'postgres-database',
    aspectRatio: 'aspect-square',
    width: 512,
    height: 512,
  },
  {
    title: 'Managed Better Auth',
    description: 'Authentication with users and sessions stored in Postgres.',
    videoBase: 'authentication',
    aspectRatio: 'aspect-512/390',
    width: 512,
    height: 390,
  },
  {
    title: 'Functions',
    description: 'Long-running, without timeouts, and closer to your database.',
    videoBase: 'compute',
    aspectRatio: 'aspect-512/308',
    width: 512,
    height: 308,
  },
  {
    title: 'Object Storage',
    description: 'S3-compatible blob storage that branches with your projects.',
    videoBase: 'storage',
    aspectRatio: 'aspect-512/696',
    width: 512,
    height: 696,
  },
  {
    title: 'AI Gateway',
    description: 'All models, one API, one bill. Powered by Databricks.',
    videoBase: 'ai-gateway',
    aspectRatio: 'aspect-512/226',
    width: 512,
    height: 226,
  },
];

const Hero = () => (
  <section className="hero relative mt-16 safe-paddings lg:mt-14">
    <Container className="relative z-30 pt-96 pb-2 xl:pt-54 lg:pt-52 md:px-5! md:pt-53" size="1600">
      <Link href="#backed-by-giants">
        <SectionLabel theme="white" icon="databricks">
          A DATABRICKS COMPANY
        </SectionLabel>
      </Link>

      <h1 className="mt-5 max-w-280 text-[72px] leading-dense tracking-tighter xl:max-w-215 xl:text-[64px] lg:max-w-180 lg:text-[52px] md:mt-4 md:text-[42px] sm:text-[32px]">
        Neon is the Postgres backend
        <br />
        designed for apps and agents.
      </h1>

      <div className="mt-8 flex gap-x-5 lg:mt-7 lg:gap-x-4">
        <Button theme="white-filled" size="new" to={LINKS.signup}>
          Get started
        </Button>
        <Button theme="outlined" size="new" to={LINKS.docsHome}>
          Read the docs
        </Button>
      </div>

      <div className="relative mt-16 md:mt-14 sm:mt-12">
        <HeroServices items={heroServiceItems} />
      </div>

      <div className="relative mt-16 border-t border-gray-new-20 pt-10 select-none lg:mt-14 md:mt-12 sm:mt-10 sm:pt-8">
        <Logos className="max-w-full p-0!" logos={logos} size="md" />
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
        className={cn(
          'relative -top-16 left-1/2 w-480 -translate-x-1/2',
          'xl:-top-12.5 xl:w-326 lg:-top-2 lg:w-254 sm:hidden'
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
        className="relative left-[40%] hidden w-188 max-w-none -translate-x-1/2 sm:block"
        src={mobileBgIllustration}
        width={752}
        height={326}
        quality={100}
        alt=""
        priority
      />
    </div>

    <div className="absolute bottom-0 z-20 h-22 w-full bg-[linear-gradient(0deg,#000_0%,rgba(0,0,0,0.00)_100%)] xl:h-41 lg:h-39 sm:h-64.5" />
  </section>
);

export default Hero;
