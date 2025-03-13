'use client';

import clsx from 'clsx';
import { useState, useRef, createRef, useEffect, useCallback } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';

import Container from 'components/shared/container';
import LINKS from 'constants/links';
import useIsSafari from 'hooks/use-is-safari';
import branchingIcon from 'icons/home/hero/branching.svg';
import scalingIcon from 'icons/home/hero/scaling.svg';

import Video from './video';

const Hls = require('hls.js/dist/hls.light.min.js');

const IS_MOBILE_SCREEN_WIDTH = 639;

/* 
  Video optimization parameters:
    -mp4: -pix_fmt yuv420p -vf "scale=-2:932" -movflags faststart -vcodec libx264 -crf 20
    Scaling
      -m3u8: -codec: copy -start_number 0 -hls_time 2 -hls_list_size 0 -f hls scaling.m3u8
    Branching
      -m3u8: -codec: copy -start_number 0 -hls_time 3 -hls_list_size 0 -f hls branching.m3u8
*/
const ITEMS = [
  {
    video: {
      icon: scalingIcon,
      title: 'Scaling',
      mp4: '/videos/pages/home/hero/scaling.mp4?updated=20240514120633',
      m3u8: '/videos/pages/home/hero/scaling.m3u8?updated=20240514120633',
      bgImage: '/videos/pages/home/hero/scaling.jpg',
    },
    title: 'Scaling',
    description:
      'Focus on building applications with time and money-saving features like instant provisioning, autoscaling according to load, and scale to zero.',
    linkLabel: 'Discover Autoscaling',
    linkUrl: LINKS.autoscaling,
  },
  {
    video: {
      icon: branchingIcon,
      title: 'Branching',
      mp4: '/videos/pages/home/hero/branching.mp4?updated=20240508184252',
      m3u8: '/videos/pages/home/hero/branching.m3u8?updated=20240508184252',
      bgImage: '/videos/pages/home/hero/branching.jpg',
    },
    title: 'Branching',
    description:
      'Instantly branch your data and schema to access isolated DB copies for development, CI/CD, and schema migrations with copy-on-write storage.',
    linkLabel: 'Explore Branching',
    linkUrl: LINKS.docsBranching,
  },
];

const Hero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const { width: windowWidth } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const [initialVideoPlayback, setInitialVideoPlayback] = useState(true);

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
    <section className="hero safe-paddings relative pt-40 xl:pt-[152px] lg:pt-32 md:pt-[88px]">
      <Container className="relative z-10 xl:px-8" size="1100">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-title text-[62px] font-medium leading-none -tracking-[0.03em] text-white xl:text-[56px] lg:text-[48px] sm:text-[36px]">
            About Neon
          </h1>
          <p className="mt-2.5 max-w-xl text-lg font-light leading-snug tracking-tighter text-gray-new-80 lg:mt-2.5 lg:text-base">
            Neon is the Postgres database you love, on a serverless platform designed
            to&nbsp;help&nbsp;you build reliable and scalable applications faster.
          </p>
        </div>

        <div className="mt-12 flex gap-x-2.5 xl:mt-10 sm:mt-7 sm:flex-col sm:gap-y-9">
          {ITEMS.map((item, index) => (
            <Video
              className={clsx(
                'transition-all duration-700',
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
              initialVideoPlayback={initialVideoPlayback}
              setInitialVideoPlayback={setInitialVideoPlayback}
              ref={videoRefs.current[index]}
              index={index}
              key={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Hero;
