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

import LineSvg from './images/line.inline.svg';
import vercelLineSvg from './images/vercel-line.svg';

const title = 'All-Things-Branching';
const description =
  ' Join us Wednesday, December 7th, to learn about database branching with Neon.';

const items = [
  {
    text: 'Branching with the Neon API',
    linkText: 'Coming soon!',
    // linkText: 'Read blog post',
    // linkUrl: '/blog/branching-postgres-databases-with-the-neon-api/',
  },
  {
    text: 'Data Recovery with Branching',
    linkText: 'Coming soon!',
    // linkText: 'Read blog post',
    // linkUrl: '/blog/postgres-data-recovery-with-branching/',
  },
  {
    text: 'Twitter Space: All-Things-Branching Q&A',
    linkText: 'Set reminder',
    linkUrl: 'https://twitter.com/i/spaces/1ynJOammAvVKR',
  },
];

const Branching = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  useBodyLockScroll(isOpenModal);
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, rootMargin: '500px' });
  const { containerRef, videoRef } = useVideo();
  return (
    <section
      className="branching safe-paddings sm:pt[190px] bg-black pt-[672px] text-white xl:pt-[408px] md:pt-[364px] sm:pt-[190px]"
      ref={wrapperRef}
    >
      <Container className="grid-gap-x grid grid-cols-12" size="md" ref={containerRef}>
        <div className="relative col-span-8 ml-[50px] flex max-w-[940px] flex-col items-center xl:col-span-full xl:mx-auto xl:w-full">
          <LineSvg className="absolute bottom-[calc(100%+2rem)] left-1/2 h-auto w-[393px] -translate-x-[calc(50%-11.3rem)] xl:hidden" />
          <StraightLineSvg className="absolute bottom-[calc(100%+1rem)] left-1/2 hidden h-auto w-8 -translate-x-1/2 xl:block lg:w-[30px] md:w-7 sm:w-3.5" />
          <time className="label-secondary-2 mx-auto" dateTime="2022-12-07">
            7th of December, 2022
          </time>
          <Heading className="mt-2.5 text-center" tag="h2" size="lg" theme="white">
            {title}
          </Heading>
          <p className="mt-3 text-center text-xl xl:mt-2.5 xl:text-base md:mt-2">{description}</p>
          <div className="relative mt-14 xl:mt-12 lg:mt-9 md:mt-6 sm:w-full">
            <div className="absolute -inset-x-16 top-16 md:w-[150%]">
              <StaticImage
                className="rounded-[200px] opacity-30 blur-[70px] md:h-[132px]"
                imgClassName="rounded-[200px]"
                src="./images/bg-gradient-branching.jpg"
                width={1068}
                height={520}
                alt=""
                loading="lazy"
                aria-hidden
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <svg
                width="940"
                height="520"
                className="w-auto rounded-2xl xl:w-full lg:mx-auto lg:max-h-[390px] sm:max-h-[211px]"
              >
                <rect width="940" height="520" className="fill-secondary-6" />
              </svg>
              {isWrapperInView && (
                <video
                  className="absolute bottom-0 right-0 h-full w-auto max-w-none rounded-2xl md:left-1/2 md:right-auto md:-translate-x-[calc(50%+8rem)] sm:-translate-x-[calc(50%+4.5rem)]"
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/videos/pages/developer-days/cactus.mp4" type="video/mp4" />
                  <source src="/videos/pages/developer-days/cactus.webm" type="video/webm" />
                </video>
              )}
            </div>
            <ItemsList className="bg-secondary-5" items={items} setIsOpenModal={setIsOpenModal} />
          </div>
        </div>
        <div className="col-span-4 flex justify-center 2xl:justify-end xl:hidden">
          <img
            className="-mt-9 mr-[153px] 3xl:mr-0"
            src={vercelLineSvg}
            width={169}
            height={760}
            alt="vercel-55z94eq"
            loading="lazy"
          />
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

export default Branching;
