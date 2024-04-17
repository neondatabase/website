'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState, useRef } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import branchingIcon from 'icons/home/hero/branching.svg';
import serverlessIcon from 'icons/home/hero/serverless.svg';
import bg from 'images/pages/home/hero/bg.jpg';

import Video from './video';

const ITEMS = [
  {
    video: {
      icon: serverlessIcon,
      title: 'Serverless',
      mp4: '/videos/pages/home/serverless.mp4',
      webm: '/videos/pages/home/serverless.webm',
    },
    title: 'Serverless',
    description:
      'We separated storage and compute to bring the best of serverless to Postgres: instant provisioning, autoscaling according to load, and scale to zero.',
    linkLabel: 'Discover Serverless',
    linkUrl: '#',
  },
  {
    video: {
      icon: branchingIcon,
      title: 'Branching',
      mp4: '/videos/pages/home/branching.mp4',
      webm: '/videos/pages/home/branching.webm',
    },
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
    <section className="hero safe-paddings relative pt-[142px] xl:pt-[120px] lg:pt-8">
      <Image
        className="absolute left-1/2 top-0 -translate-x-1/2 xl:min-w-[1286px] md:min-w-[1010px] sm:top-28 sm:min-w-[526px]"
        src={bg}
        width={1760}
        height={980}
        quality={100}
        priority
      />

      <Container className="2xl:px-10" size="1100">
        <div className="text-center">
          <h1 className="font-title text-[88px] font-medium leading-none -tracking-[0.03em] text-white xl:text-[72px] lg:text-[56px] sm:text-[32px]">
            The Future of Postgres
          </h1>
          <p className="mx-auto mt-3 max-w-[490px] text-lg font-light leading-snug -tracking-[0.04em] text-gray-new-80 lg:mt-2.5 lg:max-w-[396px] lg:text-base">
            Neon is serverless Postgres with autoscaling, on-demand storage and code-like database
            branching
          </p>
          <Button
            className="pointer-events-auto relative mt-9 !font-semibold tracking-tighter xl:mt-8 lg:mt-6 sm:h-10"
            size="lg"
            theme="green-outline"
            to="#"
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
              videoClassName={index === 1 && 'left-[-172px]'}
              {...item}
              isActive={currentVideoIndex === index}
              switchVideo={() => switchVideo((currentVideoIndex + 1) % ITEMS.length)}
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
