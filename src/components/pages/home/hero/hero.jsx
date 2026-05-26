import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import Logos from 'components/shared/logos';
import PauseableVideo from 'components/shared/pauseable-video';
import SectionLabel from 'components/shared/section-label';
import Tooltip from 'components/shared/tooltip';
import LINKS from 'constants/links';
import DataApiIcon from 'icons/home/hero/data-api.svg';
import DatabaseIcon from 'icons/home/hero/database.svg';
import LightningIcon from 'icons/home/hero/lightning.svg';
import LockIcon from 'icons/home/hero/lock.svg';
import StorageIcon from 'icons/home/hero/storage.svg';
import mobileBgIllustration from 'images/pages/home/hero/bg-illustration.jpg';
import { cn } from 'utils/cn';

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

const productFeatures = [
  {
    title: 'Postgres Database',
    description: 'Serverless Postgres that scales and branches with your app.',
    icon: DatabaseIcon,
  },
  {
    title: 'Authentication',
    description: 'Managed auth with users and sessions stored in Postgres.',
    icon: LockIcon,
  },
  {
    title: 'Data API',
    description: 'PostgREST-compatible API for querying Postgres over HTTP.',
    icon: DataApiIcon,
  },
  {
    title: 'Storage',
    description: 'Store files with Postgres-backed metadata and access control.',
    icon: StorageIcon,
    comingSoon: true,
  },
  {
    title: 'Events',
    description: 'Trigger workflows from Postgres database changes.',
    icon: LightningIcon,
    comingSoon: true,
  },
];

const Hero = () => (
  <section className="hero relative mt-16 safe-paddings lg:mt-14">
    <Container
      className="relative z-30 pt-88 pb-2 xl:px-16 xl:pt-[216px] lg:pt-[208px] md:px-5! md:pt-[212px]"
      size="1600"
    >
      <Link href="#backed-by-giants">
        <SectionLabel theme="white" icon="databricks">
          A DATABRICKS COMPANY
        </SectionLabel>
      </Link>

      <h1 className="mt-5 max-w-236 text-[68px] leading-dense tracking-tighter xl:max-w-[760px] xl:text-[52px] lg:max-w-[640px] lg:text-[44px] md:mt-4 sm:text-[28px]">
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

      <div className="relative mt-12 flex border-t border-gray-new-20 pt-12 lg:mt-11 lg:pt-11 sm:mt-10 sm:pt-10">
        <ul className="flex flex-row gap-x-11 gap-y-10 xl:-mx-16 xl:no-scrollbars xl:flex xl:snap-x xl:snap-mandatory xl:scroll-px-16 xl:gap-x-8 xl:overflow-x-auto xl:px-16 lg:-mx-5 lg:scroll-px-5 lg:px-5">
          {productFeatures.map(({ title, description, icon: Icon, comingSoon }) => {
            const tooltipId = `home-hero-${title.toLowerCase().replace(/\s+/g, '-')}-tooltip`;
            const tooltipProps = comingSoon
              ? {
                  'data-tooltip-id': tooltipId,
                  // 'data-tooltip-html': comingSoonTooltip,
                }
              : {};

            return (
              <li
                className="min-w-0 text-white xl:w-69 xl:shrink-0 xl:snap-start sm:w-60"
                key={title}
                {...tooltipProps}
              >
                <div className={cn('flex items-center gap-x-3', comingSoon ? 'mb-2.5' : 'mb-3.5')}>
                  <Image
                    className="size-4 shrink-0"
                    src={Icon}
                    width={16}
                    height={16}
                    loading="eager"
                    alt=""
                  />
                  <span
                    className={cn(
                      'text-base leading-none font-medium tracking-extra-tight',
                      comingSoon ? 'text-gray-new-60' : 'text-white'
                    )}
                  >
                    {title}
                  </span>
                  {comingSoon && (
                    <>
                      <span className="inline-flex items-center rounded-full bg-green-44 px-2 py-1 font-mono text-[13px] leading-none font-medium tracking-extra-tight text-black-pure uppercase">
                        early access
                      </span>
                      <Tooltip
                        className="-mt-6 max-w-[310px]! border-gray-new-30! bg-gray-new-8! px-3.5! py-2.5! md:-mt-2 [&.react-tooltip\_\_place-right]:-ml-17!"
                        id={tooltipId}
                        place="right"
                        clickable
                      >
                        <p className="mb-2 text-base leading-snug tracking-extra-tight text-white">
                          Subscribe to get early access to the Neon backend platform.
                        </p>
                        <Link
                          class="border-b border-dashed border-gray-new-50 pb-0 text-sm leading-tight tracking-extra-tight text-gray-new-80 transition-colors duration-200"
                          to="docs/introduction/roadmap#now-shipping-neon-is-a-complete-backend-platform"
                          theme="gray-80"
                        >
                          Subscribe now
                        </Link>
                      </Tooltip>
                    </>
                  )}
                </div>
                <p className="max-w-[290px] text-base tracking-extra-tight text-gray-new-50">
                  {description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative mt-40 select-none xl:mt-28 lg:mt-24 md:mt-20 sm:mt-16">
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
          'relative -top-16 left-1/2 w-[1920px] -translate-x-1/2',
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
