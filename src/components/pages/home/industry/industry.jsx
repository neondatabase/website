'use client';

import clsx from 'clsx';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useRef, useState, useEffect } from 'react';

import Container from 'components/shared/container';
import Link from 'components/shared/link';

import Testimonials from './testimonials';

const TESTIMONIAL_VIDEO_FRAMES = [70, 250, 380, 500];
const FRAME_RATE = 30;

const Industry = () => {
  const videoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonialsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const video = videoRef.current;

    testimonialsRef.current.forEach((testimonial, index) => {
      const frameStart = TESTIMONIAL_VIDEO_FRAMES[index];
      const startTime = frameStart / FRAME_RATE;
      const nextFrameStart = TESTIMONIAL_VIDEO_FRAMES[index + 1] || frameStart + 30; // Handling last frame scenario
      const endTime = nextFrameStart / FRAME_RATE;

      ScrollTrigger.create({
        trigger: testimonial,
        start: '-=200 center', // Adjust based on when you want the trigger to start
        end: 'bottom center',
        scrub: false,
        onUpdate: (self) => {
          const { progress } = self;
          const targetTime = startTime + progress * (endTime - startTime);
          video.currentTime = targetTime;
          // Set active index if the current time is greater than or equal to start time
          if (video.currentTime >= startTime) {
            setActiveIndex(index);
          }
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [setActiveIndex]);

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

          <Testimonials
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            testimonialsRef={testimonialsRef}
          />
        </div>
      </Container>
    </section>
  );
};

export default Industry;
