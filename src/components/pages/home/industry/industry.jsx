'use client';

import clsx from 'clsx';
import gsap from 'gsap';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import useWindowSize from 'react-use/lib/useWindowSize';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import useIsSafari from 'hooks/use-is-safari';

import Testimonials from './testimonials';

const Hls = require('hls.js/dist/hls.light.min.js');

const TESTIMONIAL_VIDEO_FRAMES = [120, 275, 425, 550];
const IS_MOBILE_SCREEN_WIDTH = 639;

const Industry = () => {
  const [videoVisibilityRef, isInView] = useInView({
    triggerOnce: true,
    rootMargin: '0px 0px 900px 0px',
  });

  const videoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth <= IS_MOBILE_SCREEN_WIDTH;

  const isSafari = useIsSafari();

  useEffect(() => {
    const videoElement = videoRef?.current;

    if (!videoElement || !isInView || isMobile) {
      return;
    }

    // Each video is optimized to work well in different browsers
    const videoSrc = isSafari
      ? '/videos/pages/home/industry/testimonials.mp4?updated=20240422183243'
      : '/videos/pages/home/industry/testimonials.m3u8?updated=20240422183243';

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
  }, [isInView, isSafari, isMobile]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !isInView) {
      return;
    }

    const targetTime = TESTIMONIAL_VIDEO_FRAMES[activeIndex]
      ? TESTIMONIAL_VIDEO_FRAMES[activeIndex] / 30
      : 0;

    gsap.to(video, {
      currentTime: targetTime,
      duration: isSafari ? 0 : 1,
      ease: 'none',
    });
  }, [activeIndex, isSafari, isInView]);

  return (
    <section
      className="industry mt-[264px] xl:mt-[75px] lg:mt-24 sm:mt-20"
      ref={videoVisibilityRef}
    >
      <Container
        className={clsx(
          'box-content flex gap-24',
          'xl:max-w-[768px] xl:gap-[76px]',
          'lg:!max-w-[627px] lg:gap-[67px]',
          'md:gap-[40px]',
          'sm:m-0 sm:!max-w-full sm:p-0'
        )}
        size="960"
      >
        {/* 
            Video optimization parameters:
            -mp4: -pix_fmt yuv420p -vf "scale=-2:3254" -movflags faststart -vcodec libx264 -crf 20 -g 1
            -m3u8: -codec: copy -start_number 0 -hls_time 3 -hls_list_size 0 -f hls testimonials.m3u8
        */}
        <video
          className="max-w-[230px] xl:w-[180px] lg:w-36 sm:hidden"
          height={3254}
          width={448}
          controls={false}
          ref={videoRef}
          preload="auto"
          muted
          playsInline
        />
        <div className="flex w-full flex-col sm:items-center">
          <h2
            className={clsx(
              'mt-11 font-title text-[88px] font-medium leading-[0.96] -tracking-[0.03em] text-white',
              'xl:mt-[64px] xl:text-[72px] lg:mt-6 lg:text-[56px]',
              'sm:mt-0 sm:text-center sm:text-[32px] sm:leading-[0.9em] sm:tracking-extra-tight'
            )}
          >
            Industry&nbsp;leaders
            <br />
            trust Neon
          </h2>
          <Link
            className="mt-5 flex w-fit items-center text-[15px] font-medium leading-none tracking-[-0.03em] [&_svg]:ml-[7px] [&_svg]:scale-110"
            to={LINKS.caseStudies}
            theme="white"
            withArrow
          >
            Dive into success stories
          </Link>

          <Testimonials
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            isMobile={isMobile}
            windowWidth={windowWidth}
          />
        </div>
      </Container>
    </section>
  );
};

export default Industry;
