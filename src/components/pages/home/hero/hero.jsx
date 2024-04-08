'use client';

import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { forwardRef, useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import bg from 'images/pages/home/hero/bg.png';

const ITEMS = [
  {
    videoUrl: '/videos/pages/home/ai-loop.mp4',
    title: 'Scaling',
    description:
      'We separated storage and compute. Compute activates on an incoming connection and shuts down to save resources on inactivity.',
    linkLabel: 'Discover Autoscaling',
    linkUrl: '#',
  },
  {
    videoUrl: '/videos/pages/home/ai-loop.mp4',
    title: 'Branching',
    description:
      'Neon allows to instantly branch your Postgres database to support a modern development workflow.',
    linkLabel: 'Explore Branching',
    linkUrl: '#',
  },
];

// TODO: optimize and improve the animation of the transition between cards, as well as:
//       - make a smooth transition of the progress bar state - at the moment it twitches
//       - update current videos
const Item = forwardRef(
  // eslint-disable-next-line react/prop-types
  (
    { className, videoUrl, title, description, linkLabel, linkUrl, isPlayVideo, switchVideo },
    videoRef
  ) => {
    const [visibilityRef, isInView] = useInView();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const video = videoRef.current;

      const updateProgress = () => {
        requestAnimationFrame(() => {
          const { currentTime } = video;
          const { duration } = video;
          setProgress((currentTime / duration) * 100);
        });
      };

      if (isInView && isPlayVideo) {
        video.play();
      } else {
        video.pause();
      }

      video.addEventListener('timeupdate', updateProgress);

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
      };
    }, [isInView, isPlayVideo, videoRef]);

    const progressBarWidth = `${progress}%`;

    return (
      <div className={className} ref={visibilityRef} onClick={switchVideo}>
        <div className="rounded-[14px] bg-black-pure/40 p-1">
          <video
            className="h-[466px] rounded-[14px] mix-blend-lighten"
            height={466}
            width={704}
            controls={false}
            ref={videoRef}
            muted
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
        <div className="mt-5 px-1">
          <h3 className="text-xl leading-dense tracking-extra-tight text-white">{title}</h3>
          <div className="relative mt-3.5 h-px w-full bg-gray-new-15" aria-hidden>
            <span
              className="absolute left-0 top-0 h-full bg-[linear-gradient(90deg,rgba(228,229,231,0.10)_0%,#E4E5E7_100%)] duration-500"
              style={{ width: progressBarWidth }}
            />
          </div>
          <p
            className={clsx(
              'mt-3.5 max-w-[366px] tracking-extra-tight transition-colors duration-200',
              isPlayVideo ? 'text-gray-new-80' : 'text-gray-new-40'
            )}
          >
            {description}
          </p>
          <Link
            className="mt-2.5 flex w-fit items-center text-sm font-medium leading-none tracking-[-0.03em] text-white"
            to={linkUrl}
            withArrow
          >
            {linkLabel}
          </Link>
        </div>
      </div>
    );
  }
);

Item.propTypes = {
  className: PropTypes.string,
  videoUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  linkLabel: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  isPlayVideo: PropTypes.bool.isRequired,
  switchVideo: PropTypes.func.isRequired,
};

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
      <Image
        className="absolute left-1/2 top-0 min-w-[1920px] -translate-x-1/2"
        src={bg}
        height={1080}
        width={1920}
        alt=""
        priority
      />

      <Container size="1100">
        <div className="text-center">
          <h1 className="font-title text-[88px] font-medium leading-dense tracking-extra-tight text-white">
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
            <Item
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
