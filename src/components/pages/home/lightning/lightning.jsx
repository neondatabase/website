'use client';

import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import PauseableVideo from 'components/shared/pauseable-video';
import phoneCameraIllustration from 'images/pages/home/lightning/phone-camera.png';

import useLightningAnimation from './use-lightning-animation';

/* 
  Video optimization parameters:
    active
      -mp4: -pix_fmt yuv420p -vf scale=1656:-2 -movflags faststart -vcodec libx264 -crf 20
      -webm: -c:v libvpx-vp9 -crf 20 -vf scale=1656:-2 -deadline best -an
    idle
      -mp4: -pix_fmt yuv420p -vf scale=1656:-2 -movflags faststart -vcodec libx264 -crf 20
      -webm: -c:v libvpx-vp9 -crf 20 -vf scale=1656:-2 -deadline best -an
    popup
      -mp4: -pix_fmt yuv420p -vf scale=702:-2 -movflags faststart -vcodec libx264 -crf 20
      -webm: -c:v libvpx-vp9 -crf 20 -vf scale=702:-2 -deadline best -an
*/
const VIDEO_PATHS = {
  active: {
    mp4: '/videos/pages/home/lightning/active.mp4?updated=20240510192048',
    webm: '/videos/pages/home/lightning/active.webm?updated=20240510192048',
  },
  idle: {
    mp4: '/videos/pages/home/lightning/idle.mp4?updated=20240510192048',
    webm: '/videos/pages/home/lightning/idle.webm?updated=20240510192048',
  },
  popup: {
    mp4: '/videos/pages/home/lightning/popup.mp4?updated=20240510192048',
    webm: '/videos/pages/home/lightning/popup.webm?updated=20240510192048',
  },
};

const Lightning = () => {
  const { videoContainerRef, videoActiveRef, videoIdleRef, isVideoActive } =
    useLightningAnimation();

  return (
    <section className="lightning safe-paddings mt-56 xl:mt-32 lg:mt-[76px] sm:mt-20">
      <Container
        className="pb-[280px] xl:max-w-[704px] xl:pb-[178px] lg:!max-w-[640px] lg:pb-6 md:!max-w-none md:pl-[84px] sm:pl-5"
        size="960"
      >
        <h2
          className={clsx(
            'relative z-20 inline-block max-w-[790px] bg-home-lightning-title bg-clip-text pb-6 font-title text-[128px] font-medium leading-[0.95] -tracking-wider text-transparent [mask-image:radial-gradient(80px_80px_at_77.8%_86%,transparent_50%,transparent_94%,black_90%)]',
            'xl:max-w-2xl xl:bg-home-lightning-title-xl xl:text-[96px]',
            'lg:max-w-lg lg:bg-home-lightning-title-lg lg:text-[72px]',
            'md:max-w-md md:bg-home-lightning-title-md md:text-[72px] md:[mask-image:radial-gradient(40px_68px_at_78.1%_82%,transparent_100%,black)]',
            'sm:min-w-[320px] sm:max-w-xs sm:bg-home-lightning-title-sm sm:text-[52px] sm:[mask-image:radial-gradient(49px_55px_at_93.6%_73%,transparent_97%,black)]'
          )}
        >
          Lightning fast. Edge&nbsp;ready.
        </h2>

        <div
          className="relative ml-32 mt-[-113px] aspect-[1.181818] xl:ml-24 xl:mt-[-103px] xl:min-w-[647px] lg:ml-8 lg:mt-[-95px] lg:w-full lg:min-w-0 lg:max-w-[620px] md:ml-8 md:w-[560px] sm:ml-0 sm:mt-[-85px] sm:w-[500px]"
          ref={videoContainerRef}
        >
          <div className="absolute">
            <PauseableVideo
              className="[mask-image:radial-gradient(120%_120%_at_45%_-10%,black_77%,transparent_90%)]"
              width={828}
              height={684}
              ref={videoActiveRef}
            >
              <source src={VIDEO_PATHS.active.mp4} type="video/mp4" />
              <source src={VIDEO_PATHS.active.webm} type="video/webm" />
            </PauseableVideo>
          </div>

          <PauseableVideo
            className={clsx(
              'transition-opacity duration-500 [mask-image:radial-gradient(120%_120%_at_45%_-10%,black_77%,transparent_90%)]',
              {
                'opacity-0': isVideoActive,
              }
            )}
            width={828}
            height={684}
            ref={videoIdleRef}
          >
            <source src={VIDEO_PATHS.idle.mp4} type="video/mp4" />
            <source src={VIDEO_PATHS.idle.webm} type="video/webm" />
          </PauseableVideo>

          <div className="absolute bottom-[9.5%] left-[53.6%] w-[42.188%]">
            <PauseableVideo
              className="[mask-image:radial-gradient(120%_120%_at_45%_-10%,black_77%,transparent_90%)]"
              width={351}
              height={298}
            >
              <source src={VIDEO_PATHS.popup.mp4} type="video/mp4" />
              <source src={VIDEO_PATHS.popup.webm} type="video/webm" />
            </PauseableVideo>
          </div>
        </div>
        <p className="relative z-10 ml-32 mt-[-347px] max-w-[288px] font-light tracking-extra-tight text-gray-new-70 xl:ml-24 xl:mt-[-283px] xl:leading-snug lg:-mt-56 lg:ml-8 lg:max-w-[250px] sm:ml-0 sm:mt-[-203px] sm:max-w-[212px] sm:text-[15px]">
          <span className="font-medium text-gray-new-94">The Neon serverless driver</span>, designed
          for fast queries over HTTP
        </p>
        <code className="relative z-10 ml-32 mt-5 flex max-w-xs flex-col gap-y-2.5 text-[13px] leading-dense text-gray-new-50 [mask-image:radial-gradient(110%_110%_at_29%_52%,rgba(0,0,0,.85),rgba(0,0,0,.8)_35%,transparent_96%)] xl:ml-24 xl:max-w-[300px] lg:ml-8 lg:max-w-[270px] lg:gap-y-2 lg:text-xs sm:ml-0 sm:max-w-[212px]">
          <span>{`import { neon } from '@neondatabase/\nserverless';`}</span>
          <span>
            {`const sql = neon('postgresql://\nusr:pass@proj.us-east-2.aws.neon.tech/db');`}
          </span>
          <span>{`const posts = await sql('SELECT * FROM posts');`}</span>
        </code>
        <Link
          className="relative z-10 ml-32 mt-6 flex w-fit items-center text-[15px] font-medium leading-none tracking-[-0.03em] xl:ml-24 lg:ml-8 sm:ml-0 sm:mt-3.5"
          to="/docs/serverless/serverless-driver"
          theme="white"
          withArrow
        >
          Get the Serverless Driver
        </Link>
        <Image
          className="absolute right-[141px] top-[193px] z-10 h-9 w-auto xl:right-[69px] xl:top-[132px] xl:h-[27px] lg:left-[432px] lg:right-auto lg:top-[91px] lg:h-[21px] sm:left-[351px] sm:top-[66px]"
          src={phoneCameraIllustration}
          width={144}
          height={36}
          quality={100}
          alt=""
        />
      </Container>
    </section>
  );
};

export default Lightning;
