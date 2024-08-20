'use client';

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
    <section className="hero safe-paddings pt-36 2xl:pt-[150px] xl:pt-[120px] lg:pt-[52px] md:pt-[40px]">
      <Container className="grid-gap-x grid grid-cols-12" size="1152">
        <Heading
          className="z-20 col-span-10 mt-4 max-w-[787px] text-left text-6xl font-medium leading-none -tracking-[0.02em] lg:text-4xl sm:text-[36px]"
          tag="h2"
          theme="white"
        >
          Scalable SAAS architecture in Postgres with Neon & AWS
        </Heading>
        <div className="z-20 col-span-5 mt-[130px] flex max-w-[385px] flex-col gap-5 text-left text-xl tracking-tight text-[#898D95]">
          <p className="leading-snug sm:text-base">
            <span className="text-white">
              Discover how to efficiently build and optimize scalable SAAS architectures
            </span>{' '}
            in Postgres with Neon & AWS. Elevate your database management with expert insights in
            this video.
          </p>
          <p className="leading-snug sm:text-base">
            Discover how to build and optimize scalable SAAS architectures in Postgres with Neon &
            AWS.
          </p>
        </div>
        <div className="relative col-span-7 h-[454px]">
          <div className="absolute -right-[42px] bottom-0">
            {isVideoActive ? (
              <iframe
                className="absolute left-1/2 top-1/2 z-30 aspect-video h-[378px] w-[672px] -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-black sm:rounded-[6px]"
                width="560"
                height="315"
                src="https://www.youtube.com/embed/R0-o4TDcb84?autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div
                className="group absolute left-1/2 top-1/2 z-30 h-[378px] w-[672px] -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-[10px]"
                role="button"
                tabIndex={0}
                aria-label="Play video"
                onClick={() => setIsVideoActive(true)}
                onKeyDown={(e) => e.key === 'Enter' && setIsVideoActive(true)}
              >
                <Image src={interfaceCover} width={672} height={378} quality={95} alt="" />
                <button
                  className="absolute left-1/2 top-1/2 flex w-auto -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1.5 overflow-hidden rounded-[60px] bg-primary-1 py-3.5 pl-9 pr-[33px] text-lg font-semibold tracking-tighter text-black shadow-[0px_10px_25px_0px_#0000004D,0px_3px_3px_0px_#0A151866] before:absolute before:-left-[16%] before:-top-[20%] before:h-[41px] before:w-[172px] before:-rotate-[6deg] before:bg-white before:opacity-50 before:blur-lg group-hover:bg-[#00e5bf]"
                  type="button"
                >
                  <span className="relative z-30 flex items-center gap-2">
                    Watch the video
                    <Image className="w-[12px]" src={playIcon} alt="" width={12} height={14} />
                  </span>
                </button>
              </div>
            )}
            <Image
              className="relative z-20 mx-auto h-[398px] w-[692px]"
              src={videoBg}
              width={692}
              height={398}
              quality={90}
              alt=""
            />
          </div>
          <div className="absolute -left-[25%] -top-[25%] z-10 size-[464px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(20,31,31,0.8)_19.69%,rgba(20,31,31,0)_100%)]" />
          <div className="absolute -bottom-[65%] -right-[35%] z-10 size-[625px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(20,31,31,0.6)_19.69%,rgba(20,31,31,0)_100%)]" />
        </div>
      </Container>
    </section>
  );
};

export default Hero;
