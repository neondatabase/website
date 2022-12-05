import { StaticImage } from 'gatsby-plugin-image';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import useBodyLockScroll from 'hooks/use-body-lock-scroll';
import useVideo from 'hooks/use-video';
import StraightLineSvg from 'images/developer-days/straight-line.inline.svg';

import ItemsList from '../items-list';
import VideoModal from '../video-modal';

import featureLineSvg from './images/feature-line.svg';
import LineSvg from './images/line.inline.svg';

const title = 'Serverless & Postgres';
const description =
  'Join us Thursday, December 8th, to learn about building serverless apps with Postgres.';

const items = [
  {
    text: 'Serverless Driver for Postgres',
    linkText: 'Coming soon!',
    // linkText: 'Read blog post',
    // linkUrl: '/blog/serverless-driver-for-postgres/',
  },
  {
    text: 'Twitter Space: Serverless & Postgres Q&A',
    linkText: 'Set reminder',
    linkUrl: 'https://twitter.com/i/spaces/1zqKVPDDrDMJB',
  },
];

const Partners = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  useBodyLockScroll(isOpenModal);
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, rootMargin: '300px' });
  const { containerRef, videoRef } = useVideo();
  return (
    <section
      className="branching safe-paddings bg-black pt-[672px] text-white 3xl:pt-[690px] xl:pt-[408px] md:pt-[364px] sm:pt-[190px]"
      ref={wrapperRef}
    >
      <Container className="grid-gap-x grid grid-cols-12" size="md" ref={containerRef}>
        <div className="col-span-4 flex justify-center 2xl:col-span-3 2xl:justify-start xl:hidden">
          <img
            className="-mt-20 ml-[74px] 3xl:ml-0"
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
              <StaticImage
                className="rounded-[200px] opacity-30 blur-[70px] md:h-[132px]"
                imgClassName="rounded-[200px]"
                src="./images/bg-gradient-partners.jpg"
                width={1068}
                height={520}
                alt=""
                loading="lazy"
                aria-hidden
              />
            </div>
            <div className="relative isolate overflow-hidden rounded-2xl">
              <svg
                width="940"
                height="520"
                className="w-auto rounded-2xl xl:w-full lg:mx-auto lg:max-h-[390px] sm:max-h-[211px]"
              >
                <rect width="940" height="520" className="fill-[#ffdde0]" />
              </svg>

              {isWrapperInView && (
                <video
                  className="absolute bottom-0 right-0 h-full w-auto max-w-none rounded-2xl md:-bottom-6 md:h-[calc(100%+2rem)] sm:-bottom-3"
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/videos/pages/developer-days/hands.mp4" type="video/mp4" />
                  <source src="/videos/pages/developer-days/hands.webm" type="video/webm" />
                </video>
              )}
            </div>
            <ItemsList className="bg-secondary-2" items={items} setIsOpenModal={setIsOpenModal} />
          </div>
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

export default Partners;
