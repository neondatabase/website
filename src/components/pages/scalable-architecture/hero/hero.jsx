'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import interfaceCover from 'images/pages/scalable-architecture/hero/interface-cover.jpg';
import playIcon from 'images/pages/scalable-architecture/hero/play-icon.svg';
import videoBg from 'images/pages/scalable-architecture/hero/video-bg.svg';

const Hero = () => {
  const [isVideoActive, setIsVideoActive] = useState(false);
  return (
    <section className="hero safe-paddings pb-[94px] pt-36 2xl:pt-[150px] xl:pb-[91px] xl:pt-[120px] lg:pb-[119px] lg:pt-10 md:overflow-hidden md:pt-8 sm:pb-[95px]">
      <Container className="grid-gap-x grid grid-cols-12" size="medium">
        <Heading
          className="z-20 col-span-6 col-start-4 text-center text-[56px] font-medium leading-none tracking-extra-tight xl:col-span-8 xl:col-start-3 xl:text-5xl xl:tracking-tighter lg:col-span-10 lg:col-start-2 lg:text-4xl sm:col-span-12 sm:col-start-1 sm:text-[32px]"
          tag="h2"
          theme="white"
        >
          Scalable SaaS architecture in Postgres with Neon & AWS
        </Heading>
        <p
          className={clsx(
            'z-20 col-span-6 col-start-4 mt-[18px] flex flex-col gap-5 text-center text-lg font-light leading-snug tracking-extra-tight text-gray-new-80',
            'xl:col-span-10 xl:col-start-2 xl:mx-auto xl:mt-4 xl:max-w-[700px] xl:gap-4 lg:col-span-12 lg:col-start-1 lg:max-w-[626px] lg:text-base sm:mt-3'
          )}
        >
          Discover how to build and optimize scalable SaaS architectures in Postgres with Neon
          &&nbsp;AWS. Elevate your database management with expert insights in this video.
        </p>
        <div className="relative col-span-8 col-start-3 flex h-fit justify-center xl:col-span-10 xl:col-start-2 xl:px-2 lg:px-[3px] sm:col-span-12 sm:col-start-1">
          <div className="relative mt-[82px] rounded-[18px] xl:mt-11 lt:rounded-[16px] lg:mt-[65px] lg:rounded-xl md:rounded-lg sm:mt-7 sm:rounded-md">
            {isVideoActive ? (
              <div className="absolute inset-1.5 z-30 lt:inset-1 lg:inset-1 sm:inset-1 xs:inset-[5px]">
                <iframe
                  className="inset-0 h-full w-full rounded-[14px] bg-black lt:rounded-[13px] lg:rounded-[10px] md:rounded-[5px] sm:rounded-[3px]"
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/R0-o4TDcb84?autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <button
                className="group absolute inset-1.5 z-30 cursor-pointer overflow-hidden rounded-[14px] ring-[1px] ring-white/10 lt:inset-1 lt:rounded-[13px] lg:inset-1 lg:rounded-[9px] md:rounded-[5px] sm:inset-1 sm:rounded-[3px] xs:inset-[5px]"
                type="button"
                aria-label="Play video"
                onClick={() => setIsVideoActive(true)}
              >
                <Image src={interfaceCover} width={832} height={468} quality={95} alt="" priority />
                <div
                  className={clsx(
                    'absolute left-1/2 top-1/2 flex w-auto -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-[60px] bg-[linear-gradient(138.95deg,_#70A1C1_14.15%,_#2D5182_50.3%,_#31407C_85.04%)] py-3.5 pl-[30px] pr-6 text-lg font-semibold tracking-tighter text-white shadow-[0px_4px_30px_0px_#00000066,0px_4px_50px_0px_#00000066] transition-shadow duration-500 group-hover:shadow-[0px_4px_30px_0px_#0000004D,0px_4px_50px_0px_#0000004D]',
                    'after:absolute after:-left-[5%] after:-top-[30%] after:h-[55px] after:w-[200px] after:-rotate-[6deg] after:bg-[radial-gradient(47.49%_169.64%_at_18.14%_-69.64%,#264D69_0%,rgba(28,57,78,0)_100%)] after:opacity-100 after:blur-lg after:transition-all after:duration-500 group-hover:after:left-[50%] group-hover:after:opacity-0',
                    'before:absolute before:inset-px before:rounded-[60px] before:bg-[#0B0B10]',
                    'lg:py-2.5 lg:pl-[28px] lg:pr-[22px] sm:py-2 sm:pl-7 sm:pr-10 sm:text-lg sm:tracking-tighter'
                  )}
                  type="button"
                >
                  <span className="relative z-30 flex items-center gap-2">
                    Watch the video
                    <Image
                      className="w-[18px]"
                      src={playIcon}
                      alt=""
                      width={18}
                      height={20}
                      priority
                    />
                  </span>
                </div>
              </button>
            )}
            <span className="absolute inset-0 rounded-[inherit] border-image-azure-form-border" />
            <Image
              className="relative z-20 rounded-[inherit]"
              src={videoBg}
              width={844}
              height={480}
              alt=""
              priority
            />
          </div>
          <div className="pointer-events-none absolute -left-[20%] -top-[33%] z-10 size-[680px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#1E343E80_19.69%,#1E343E00_100%)] lg:size-[466px] md:-top-[15%] md:size-[258px]" />
          <div className="pointer-events-none absolute -bottom-[55%] -right-[14%] z-10 size-[648px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#1E233E99_19.69%,#1E203E00_100%)] lg:-bottom-[42%] lg:-right-[13%] lg:size-[444px] md:-bottom-[40%] md:size-[246px]" />
        </div>
      </Container>
    </section>
  );
};

export default Hero;
