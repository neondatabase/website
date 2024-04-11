'use client';

import clsx from 'clsx';
import { useState, useRef } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import RiveAnimation from 'components/shared/rive-animation';

import Video from './video';

const ITEMS = [
  {
    videoUrl: '/videos/pages/home/ai-loop.mp4',
    title: 'Serverless',
    description:
      'We separated storage and compute to bring the best of serverless to Postgres: instant provisioning, autoscaling according to load, and scale to zero.',
    linkLabel: 'Discover Serverless',
    linkUrl: '#',
  },
  {
    videoUrl: '/videos/pages/home/ai-loop.mp4',
    title: 'Branching',
    description:
      'Neon uses copy-on-write to instantly branch your data and schema. Access isolated data copies for development, CI/CD, and schema changes.',
    linkLabel: 'Explore Branching',
    linkUrl: '#',
  },
];

// TODO: optimize and improve the animation of the transition between cards, as well as:
//       - make a smooth transition of the progress bar state - at the moment it twitches
//       - update current videos
const Hero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const videoRefs = ITEMS.map(() => useRef(null));

  const switchVideo = (index) => {
    videoRefs[currentVideoIndex].current.pause();
    videoRefs[currentVideoIndex].current.currentTime = 0;
    setCurrentVideoIndex(index);
  };

  return (
    <section className="hero safe-paddings relative pt-[136px]">
      <RiveAnimation
        className="absolute left-1/2 top-0 min-w-[1920px] -translate-x-1/2"
        src="/animations/pages/home/hero-bg.riv"
        artboard="hero"
      />

      <Container size="1100">
        <div className="text-center">
          <h1 className="font-title text-[88px] font-medium leading-dense -tracking-[0.03em] text-white">
            The Future of Postgres
          </h1>
          <p className="mx-auto mt-2.5 max-w-[490px] text-lg font-light leading-snug -tracking-[0.04em] text-gray-new-80">
            Neon is serverless Postgres with autoscaling, on-demand storage and code-like database
            branching
          </p>
          <Button
            className="pointer-events-auto relative mt-9 !font-semibold tracking-tighter xl:mt-8 lg:mt-7 sm:mt-5"
            size="lg"
            theme="green-outline"
            to="#"
          >
            Get Started
          </Button>
        </div>

        <div className="mt-[74px] flex gap-x-2.5">
          {ITEMS.map((item, index) => (
            <Video
              className={clsx(
                'transition-all duration-500',
                currentVideoIndex === index ? 'w-[712px] flex-shrink-0' : 'w-full'
              )}
              {...item}
              isPlayVideo={currentVideoIndex === index}
              switchVideo={() => switchVideo(index)}
              ref={videoRefs[index]}
              key={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Hero;
