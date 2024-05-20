'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import CanvasVideo from 'components/shared/canvas-video';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import useBodyLockScroll from 'hooks/use-body-lock-scroll';
import StraightLineSvg from 'images/pages/developer-days/straight-line.inline.svg';

import ItemsList from '../items-list';
import VideoModal from '../video-modal';

import backgroundGradient from './images/bg-gradient-partners.jpg';
import featureLineSvg from './images/feature-line.svg';
import LineSvg from './images/line.inline.svg';

const title = 'Serverless & Postgres';
const description =
  'Join us Thursday, December 8th, to learn about building serverless apps with Postgres.';

const items = [
  {
    text: 'Frictionless development experience with Neon branching',
    linkText: 'Read blog post',
    linkUrl: '/blog/frictionless-development-experience-with-neon-branching/',
  },
  {
    text: 'Twitter Space: Serverless & Postgres Q&A',
    linkText: 'Listen the recording',
    linkUrl: 'https://twitter.com/i/spaces/1zqKVPDDrDMJB',
  },
];

const Partners = () => {
  const [containerRef, isContainerInView] = useInView();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffdde0');

  useBodyLockScroll(isOpenModal);

  return (
    <section className="branching safe-paddings bg-black-pure pt-[672px] text-white 3xl:pt-[690px] xl:pt-[408px] md:pt-[364px] sm:pt-[190px]">
      <Container
        className="grid-gap-x grid w-full grid-cols-12"
        size="md"
        ref={containerRef}
        id="day-3"
      >
        <div className="col-span-4 flex justify-center 2xl:col-span-3 2xl:justify-start xl:hidden">
          <img
            className="-mt-20 ml-[74px] 3xl:ml-0 2xl:mt-0"
            src={featureLineSvg}
            width={144}
            height={784}
            alt="feature/auth"
            loading="lazy"
          />
        </div>
        <div className="relative col-span-8 ml-auto mr-[50px] flex max-w-[940px] flex-col items-center 2xl:col-span-9 xl:col-span-full xl:mx-auto xl:w-full">
          <LineSvg className="absolute bottom-[calc(100%+2rem)] left-1/2 h-auto w-[752px] -translate-x-[calc(50%+22.5rem)] xl:hidden" />
          <StraightLineSvg className="absolute bottom-[calc(100%+1rem)] left-1/2 hidden h-auto w-8 -translate-x-1/2 xl:block lg:w-[30px] md:w-7 sm:w-3.5" />
          <time className="label-secondary-2 mx-auto" dateTime="2022-12-07">
            8th of December, 2022
          </time>
          <Heading className="mt-2.5 text-center" tag="h2" size="lg" theme="white">
            {title}
          </Heading>
          <p className="mt-3 text-center text-xl xl:mt-2.5 xl:text-base md:mt-2">{description}</p>
          <div className="relative mt-14 xl:mt-12 xl:w-full lg:mt-9 md:mt-6">
            <div className="absolute -inset-x-16 top-16 md:w-[150%]">
              <Image
                className="rounded-[200px] opacity-30 blur-[70px] md:h-[132px]"
                src={backgroundGradient}
                width={1068}
                height={520}
                alt=""
                loading="lazy"
                aria-hidden
              />
            </div>
            <div className="relative isolate w-[940px] overflow-hidden rounded-2xl xl:w-full md:rounded-b-none">
              <img
                className="w-full"
                src={`data:image/svg+xml;charset=utf-8,%3Csvg width='940' height='520' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
                alt=""
                width={940}
                height={520}
                style={{ backgroundColor }}
                aria-hidden
              />
              <CanvasVideo
                className="absolute bottom-0 right-0 h-full w-auto max-w-none rounded-2xl md:hidden"
                label="Partners video"
                srcMp4="/videos/pages/developer-days/hands.mp4"
                srcWebm="/videos/pages/developer-days/hands.webm"
                inView={isContainerInView}
                setBackgroundColor={setBackgroundColor}
              />
              <CanvasVideo
                className="absolute bottom-0 right-0 hidden h-full w-auto max-w-none rounded-2xl md:block"
                label="Partners video"
                srcMp4="/videos/pages/developer-days/hands-mobile.mp4"
                srcWebm="/videos/pages/developer-days/hands-mobile.webm"
                inView={isContainerInView}
                setBackgroundColor={setBackgroundColor}
              />
            </div>
            <ItemsList
              className="bg-secondary-2"
              items={items}
              setIsOpenModal={setIsOpenModal}
              buttonText="Watch the recording"
            />
          </div>
        </div>
      </Container>
      {isContainerInView && (
        <VideoModal
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          title={title}
          description={description}
          videoId="v-NGAiBb2r8"
        />
      )}
    </section>
  );
};

export default Partners;
