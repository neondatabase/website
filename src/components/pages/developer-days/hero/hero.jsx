'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import CanvasVideo from 'components/shared/canvas-video';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import useBodyLockScroll from 'hooks/use-body-lock-scroll';

import ItemsList from '../items-list';
import VideoModal from '../video-modal';

import backgroundGradient from './images/bg-gradient-hero.jpg';
import bgShapeSvg from './images/bg-shape.svg';
import StickerIcon from './images/sticker.inline.svg';

const title = 'Neon is Live!';
const description = 'Welcome to Neon Developer Days. December 6-8, 2022.';

const items = [
  {
    text: 'Neon is Live!',
    linkText: 'Read blog post',
    linkUrl: '/blog/neon-serverless-postgres-is-live/',
  },
  {
    text: 'Database branching with Neon',
    linkText: 'Read blog post',
    linkUrl: '/blog/database-branching-for-postgres-with-neon/',
  },
  {
    text: 'Twitter Space: Neon is Live Q&A',
    linkText: 'Listen the recording',
    linkUrl: 'https://twitter.com/i/spaces/1YpJkgDDEXPJj',
  },
];

const Hero = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#f3f281');
  useBodyLockScroll(isOpenModal);
  return (
    <section className="safe-paddings relative bg-black pt-[182px] text-white xl:pt-[136px] lg:pt-[76px] md:pt-16 sm:pt-12">
      <img
        className="absolute left-1/2 top-0 w-full max-w-[1920px] -translate-x-1/2 blur-[80px] lg:hidden"
        src={bgShapeSvg}
        width={1920}
        height={760}
        alt=""
        aria-hidden
      />
      <Container className="flex w-full flex-col items-center" size="md">
        <time className="label-secondary-2 mx-auto" dateTime="2022-12-06">
          6th of December, 2022
        </time>
        <Heading className="mt-2.5 text-center" tag="h1" size="lg" theme="white">
          {title}
        </Heading>
        <p className="mt-3 text-center text-base xl:mt-2.5 md:mt-2">{description}</p>
        <div className="relative mt-14 xl:mt-12 xl:w-full lg:mt-9 md:mt-6">
          <StickerIcon className="absolute right-[-154px] top-[-198px] h-[300px] w-[300px] xl:hidden" />
          <div className="absolute -inset-x-16 top-16 md:w-[150%]">
            <Image
              className="rounded-[200px] opacity-30 blur-[70px] md:h-[132px]"
              src={backgroundGradient}
              width={1068}
              height={520}
              alt=""
              loading="eager"
              aria-hidden
            />
          </div>
          <div className="relative isolate overflow-hidden rounded-xl md:rounded-b-none">
            <img
              className="w-full"
              src={`data:image/svg+xml;charset=utf-8,%3Csvg width='940' height='520' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
              alt=""
              style={{ backgroundColor }}
              width={940}
              height={520}
              aria-hidden
            />
            <CanvasVideo
              className="absolute bottom-0 right-0 h-full w-auto max-w-none rounded-2xl md:left-1/2 md:right-auto md:-translate-x-[calc(50%+6rem)] sm:-translate-x-[calc(50%+3rem)]"
              label="Hero video"
              srcMp4="/videos/pages/developer-days/dr-brown.mp4"
              srcWebm="/videos/pages/developer-days/dr-brown.webm"
              setBackgroundColor={setBackgroundColor}
              lazyLoading={false}
              inView
            />
          </div>
          <ItemsList
            className="bg-primary-1"
            items={items}
            setIsOpenModal={setIsOpenModal}
            buttonText="Watch the recording"
          />
        </div>
      </Container>
      {isOpenModal && (
        <VideoModal
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          title={title}
          description={description}
          videoId="0Ly5gVQ87mM"
        />
      )}
    </section>
  );
};

export default Hero;
