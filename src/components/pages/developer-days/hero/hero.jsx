import { StaticImage } from 'gatsby-plugin-image';
import React, { useState } from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import useBodyLockScroll from 'hooks/use-body-lock-scroll';
import useVideo from 'hooks/use-video';

import ItemsList from '../items-list';
import VideoModal from '../video-modal';

import bgShapeSvg from './images/bg-shape.svg';
import StickerIcon from './images/sticker.inline.svg';

const title = 'Neon is Live!';
const description = 'Welcome to Neon Developer Days. December 6-8, 2022.';

const items = [
  {
    text: 'Neon is Live!',
    // linkText: 'Read blog post',
    // linkUrl: '/blog/neon-serverless-postgres-is-live/',
    linkText: 'Coming soon!',
  },
  {
    text: 'Database branching with Neon',
    linkText: 'Coming soon!',
    // linkText: 'Read blog post',
    // linkUrl: '/blog/database-branching-for-postgres-with-neon/',
  },
  {
    text: 'Twitter Space: Neon is Live Q&A',
    linkText: 'Set reminder',
    linkUrl: 'https://twitter.com/i/spaces/1YpJkgDDEXPJj',
  },
];

const Hero = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  useBodyLockScroll(isOpenModal);
  const { containerRef, videoRef } = useVideo();
  return (
    <section className="safe-paddings relative bg-black pt-[182px] text-white xl:pt-[136px] lg:pt-[76px] md:pt-16 sm:pt-12">
      <img
        className="absolute top-0 left-1/2 w-full max-w-[1920px] -translate-x-1/2 blur-[80px] lg:hidden"
        src={bgShapeSvg}
        width={1920}
        height={760}
        alt=""
        aria-hidden
      />
      <Container className="flex flex-col items-center" size="md" ref={containerRef}>
        <time className="label-secondary-2 mx-auto" dateTime="2022-12-06">
          6th of December, 2022
        </time>
        <Heading className="mt-2.5 text-center" tag="h1" size="lg" theme="white">
          {title}
        </Heading>
        <p className="mt-3 text-center text-base xl:mt-2.5 md:mt-2">{description}</p>
        <div className="relative mt-14 xl:mt-12 lg:mt-9 md:mt-6 sm:w-full">
          <StickerIcon className="absolute top-[-198px] right-[-154px] h-[300px] w-[300px] xl:hidden" />
          <div className="absolute -inset-x-16 top-16 md:w-[150%]">
            <StaticImage
              className="rounded-[200px] opacity-30 blur-[70px] md:h-[132px]"
              imgClassName="rounded-[200px]"
              src="./images/bg-gradient-hero.jpg"
              width={1068}
              height={520}
              alt=""
              loading="lazy"
              aria-hidden
            />
          </div>
          <div className="relative overflow-hidden rounded-xl">
            <svg
              width="940"
              height="520"
              className="rounded-2xl xl:w-full lg:max-h-[390px] sm:max-h-[211px]"
            >
              <rect width="940" height="520" className="fill-[#f3f281]" />
            </svg>
            <video
              className="absolute bottom-0 right-0 h-full w-auto max-w-none rounded-2xl md:left-1/2 md:right-auto md:-translate-x-[calc(50%+7rem)] sm:-translate-x-[calc(50%+4rem)]"
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/pages/developer-days/dr-brown.mp4" type="video/mp4" />
              <source src="/videos/pages/developer-days/dr-brown.webm" type="video/webm" />
            </video>
          </div>
          <ItemsList className="bg-primary-1" items={items} setIsOpenModal={setIsOpenModal} />
        </div>
      </Container>
      <VideoModal
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        title={title}
        description={description}
        videoId="tu-bgIg-Luo"
      />
    </section>
  );
};

export default Hero;
