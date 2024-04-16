'use client';

import clsx from 'clsx';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useRef, useState, useEffect } from 'react';

import Container from 'components/shared/container';
import Link from 'components/shared/link';

import Testimonials from './testimonials';

const TESTIMONIAL_VIDEO_FRAMES = [60, 200, 350, 500];
const FRAME_RATE = 30;

const Industry = () => {
  const videoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const video = videoRef.current;

    ScrollTrigger.create({
      trigger: video,
      start: '+=400 center',
      end: 'bottom center',
      scrub: true,
      onUpdate: (self) => {
        const scrollProgress = self.progress; // Progress is from 0 to 1
        const totalVideoTime = video.duration;
        const currentTime = scrollProgress * totalVideoTime;
        video.currentTime = currentTime;

        // Calculate the current frame based on the current time
        const currentFrame = currentTime * FRAME_RATE;

        // Determine the correct active index based on the current frame
        let newIndex = TESTIMONIAL_VIDEO_FRAMES.findIndex((frame, index) => {
          if (index === TESTIMONIAL_VIDEO_FRAMES.length - 1) {
            return currentFrame >= frame; // Always set the last index if it reaches the last frame threshold
          }
          return currentFrame >= frame && currentFrame < TESTIMONIAL_VIDEO_FRAMES[index + 1];
        });

        // If no appropriate index is found, retain the last index
        if (newIndex === -1) {
          newIndex = TESTIMONIAL_VIDEO_FRAMES.length - 1;
        }

        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      },
    });

    return () => ScrollTrigger.killAll();
  }, [activeIndex]); // Keep the dependency array to ensure it re-runs only if necessary

  return (
    <section className="industry mt-[264px] xl:mt-[75px] lg:mt-24 sm:mt-20">
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
            -webm: -c:v libvpx-vp9 -crf 20 -vf scale=448:-2 -deadline best -g 1 -an
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
        >
          <source src="/videos/pages/home/industry/testimonials.mp4" type="video/mp4" />
        </video>
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
            className="mt-5 flex w-fit items-center text-[15px] font-medium leading-none tracking-[-0.03em] text-white [&_svg]:ml-[7px] [&_svg]:scale-110"
            to="#"
            withArrow
          >
            Dive into success stories
          </Link>

          <Testimonials activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </div>
      </Container>
    </section>
  );
};

export default Industry;
