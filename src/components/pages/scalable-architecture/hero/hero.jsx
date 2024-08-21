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
    <section className="hero safe-paddings pb-[94px] pt-36 2xl:pt-[150px] xl:pt-[120px] lg:pt-[52px] md:overflow-hidden md:pt-[40px] sm:pb-[80px]">
      <Container className="grid-gap-x grid grid-cols-12" size="medium">
        <Heading
          className="z-20 col-span-6 col-start-4 text-center text-[56px] font-medium leading-none -tracking-[0.02em] xl:col-span-10 xl:col-start-2 lg:text-4xl sm:col-span-12 sm:col-start-1 sm:text-[36px]"
          tag="h2"
          theme="white"
        >
          Scalable SAAS architecture in Postgres with Neon & AWS
        </Heading>
        <p className="z-20 col-span-6 col-start-4 mt-[18px] flex flex-col gap-5 text-center text-lg font-light leading-snug -tracking-[0.016em] text-[#898D95] xl:col-span-10 xl:col-start-2 xl:mt-6 xl:max-w-none xl:gap-4 xl:text-center lg:text-lg sm:col-span-12 sm:col-start-1">
          Discover how to build and optimize scalable SAAS architectures in Postgres with Neon
          &&nbsp;AWS. Elevate your database management with expert insights in this video.
        </p>
        <div className="relative col-span-8 col-start-3 flex h-fit justify-center lg:col-span-10 lg:col-start-2 sm:col-span-12 sm:col-start-1">
          <div className="relative mt-[82px] xl:mt-16 lg:mt-14 sm:mt-12">
            {isVideoActive ? (
              <div className="absolute inset-1.5 z-30 lt:inset-1 lg:inset-1 sm:inset-0.5 xs:inset-px">
                <iframe
                  className="inset-0 h-full w-full rounded-[13px] bg-black lt:rounded-[11px] lg:rounded-[10px] md:rounded-lg sm:rounded-md"
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
              <div
                className="group absolute inset-1.5 z-30 cursor-pointer overflow-hidden rounded-[13px] lt:inset-1 lt:rounded-[11px] lg:inset-1 lg:rounded-[10px] md:rounded-lg sm:inset-0.5 sm:rounded-md xs:inset-px"
                role="button"
                tabIndex={0}
                aria-label="Play video"
                onClick={() => setIsVideoActive(true)}
                onKeyDown={(e) => e.key === 'Enter' && setIsVideoActive(true)}
              >
                <Image src={interfaceCover} width={832} height={468} quality={95} alt="" priority />
                <button
                  className={clsx(
                    'absolute left-1/2 top-1/2 flex w-auto -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-[60px] bg-[linear-gradient(138.95deg,_#70A1C1_14.15%,_#2D5182_50.3%,_#31407C_85.04%)] py-3.5 pl-[30px] pr-6 text-lg font-semibold tracking-tighter text-white shadow-[0px_4px_30px_0px_#00000066,0px_4px_50px_0px_#00000066] transition-shadow duration-500 group-hover:shadow-[0px_4px_30px_0px_#0000004D,0px_4px_50px_0px_#0000004D]',
                    'after:absolute after:-left-[5%] after:-top-[30%] after:h-[55px] after:w-[200px] after:-rotate-[6deg] after:bg-[radial-gradient(47.49%_169.64%_at_18.14%_-69.64%,#264D69_0%,rgba(28,57,78,0)_100%)] after:opacity-100 after:blur-lg after:transition-all after:duration-500 group-hover:after:left-[50%] group-hover:after:opacity-0',
                    'before:absolute before:inset-px before:rounded-[60px] before:bg-[#0B0B10]',
                    'sm:text-base xs:px-5 xs:py-2.5'
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
                </button>
              </div>
            )}
            <Image
              className="relative z-20"
              src={videoBg}
              width={844}
              height={480}
              alt=""
              priority
            />
          </div>
          <div className="pointer-events-none absolute -left-[20%] -top-[33%] z-10 size-[680px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#1E343E80_19.69%,#1E343E00_100%)] md:-top-[15%] md:size-[400px]" />
          <div className="pointer-events-none absolute -bottom-[55%] -right-[20%] z-10 size-[648px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#1E233E99_19.69%,#1E203E00_100%)] md:-bottom-[24%] md:size-[300px]" />
        </div>
      </Container>
    </section>
  );
};

export default Hero;
