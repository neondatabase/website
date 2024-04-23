'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState, useRef, createRef, useEffect, useCallback } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';
import useIsSafari from 'hooks/use-is-safari';
import branchingIcon from 'icons/home/hero/branching.svg';
import serverlessIcon from 'icons/home/hero/serverless.svg';
import bg from 'images/pages/home/hero/bg.jpg';

import Video from './video';

const Hls = require('hls.js/dist/hls.light.min.js');

const IS_MOBILE_SCREEN_WIDTH = 639;

const ITEMS = [
  {
    video: {
      icon: serverlessIcon,
      // title: 'Scaling',
      mp4: '/videos/pages/home/hero/serverless.mp4?updated=20240423165910',
      m3u8: '/videos/pages/home/hero/serverless.m3u8?updated=20240423165910',
    },
    title: 'Scaling',
    description:
      'We separated storage and compute to bring the best of serverless to Postgres: instant provisioning, autoscaling according to load, and scale to zero.',
    linkLabel: 'Discover Autoscaling',
    linkUrl: LINKS.autoscaling,
  },
  {
    video: {
      icon: branchingIcon,
      title: 'Branching',
      mp4: '/videos/pages/home/hero/branching.mp4',
      m3u8: '/videos/pages/home/hero/branching.m3u8',
    },
    title: 'Branching',
    description:
      'Neon uses copy-on-write to instantly branch your data and schema. Access isolated data copies for development, CI/CD, and schema changes.',
    linkLabel: 'Explore Branching',
    linkUrl: LINKS.branching,
  },
];

// TODO: optimize and improve the animation of the transition between cards, as well as:
//       - update current videos
const Hero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const { width: windowWidth } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  const videoRefs = useRef(ITEMS.map(() => createRef()));

  const isSafari = useIsSafari();

  useEffect(() => {
    setIsMobile(windowWidth <= IS_MOBILE_SCREEN_WIDTH);
  }, [windowWidth]);

  useEffect(() => {
    videoRefs.current.forEach((ref, index) => {
      const videoElement = ref.current;
      const videoSrc = isSafari ? ITEMS[index].video.mp4 : ITEMS[index].video.m3u8;

      if (!videoElement) return;

      // Using HLS.js for browsers that support it, except for Safari which has native HLS support.
      if (Hls.isSupported() && !isSafari) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(videoElement);
      } else {
        const source = document.createElement('source');
        source.src = videoSrc;
        source.type = 'video/mp4';
        videoElement.appendChild(source);
      }
    });
  }, [videoRefs, isSafari]);

  const switchVideo = useCallback(
    (index) => {
      videoRefs.current[currentVideoIndex].current.pause();
      videoRefs.current[currentVideoIndex].current.currentTime = 0;
      setCurrentVideoIndex(index);
    },
    [currentVideoIndex]
  );

  return (
    <section className="hero safe-paddings relative pt-[142px] xl:pt-[120px] lg:pt-24">
      <Image
        className="absolute left-1/2 top-0 min-w-[1760px] -translate-x-1/2 xl:min-w-[1588px] lg:top-[-22px] lg:min-w-[1420px] md:top-[46px] md:min-w-[1058px]"
        src={bg}
        sizes="(max-width: 639px) 1058px"
        width={1760}
        height={980}
        quality={100}
        alt=""
        priority
      />

      <Container className="xl:px-8" size="1100">
        <div className="text-center">
          <h1 className="font-title text-[88px] font-medium leading-none -tracking-[0.03em] text-white xl:text-[72px] lg:text-[56px] sm:text-[32px]">
            Serverless Postgres
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-lg font-light leading-snug -tracking-[0.04em] text-gray-new-80 lg:mt-2.5 lg:max-w-[396px] lg:text-base">
            The fully managed serverless Postgres with a generous free tier. We separate storage and
            compute to offer autoscaling, branching, and bottomless storage.
          </p>
          <Button
            className="pointer-events-auto relative mt-9 !font-semibold tracking-tighter xl:mt-8 lg:mt-6 sm:h-10"
            size="lg"
            theme="green-outline"
            to={LINKS.signup}
            target="_blank"
          >
            Get Started
          </Button>
        </div>

        <div className="mt-[74px] flex gap-x-2.5 xl:mt-16 lg:mt-14 sm:mt-9 sm:flex-col sm:gap-y-9">
          {ITEMS.map((item, index) => (
            <Video
              className={clsx(
                'transition-all duration-1000',
                currentVideoIndex === index
                  ? 'w-[64.7273%] flex-shrink-0 xl:w-[61.863%] lg:w-[62.746%] sm:w-full'
                  : 'w-full'
              )}
              videoClassName={clsx(index === 1 && 'left-[-172px]')}
              {...item}
              isActive={currentVideoIndex === index}
              isMobile={isMobile}
              switchVideo={() => switchVideo((currentVideoIndex + 1) % ITEMS.length)}
              setActiveVideoIndex={() => setCurrentVideoIndex(index)}
              ref={videoRefs.current[index]}
              key={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Hero;
