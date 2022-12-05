import { StaticImage } from 'gatsby-plugin-image';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import useBodyLockScroll from 'hooks/use-body-lock-scroll';
import ArrowIcon from 'icons/arrow-right.inline.svg';
import PlayIcon from 'icons/play.inline.svg';
import StraightLineSvg from 'images/developer-days/straight-line.inline.svg';

import VideoModal from '../video-modal';

import LineSvg from './images/line.inline.svg';
import vercelLineSvg from './images/vercel-line.svg';

const items = [
  {
    text: 'Data Recovery with Branching',
    linkText: 'Read blog post',
    linkUrl: '/', // TODO: add missing link
  },
  {
    text: 'CI/CD with Branching and GitHub Actions',
    linkText: 'Read blog post',
    linkUrl: '/', // TODO: add missing link
  },
  {
    text: 'Serverless driver technical post',
    linkText: 'Read blog post',
    linkUrl: '/', // TODO: add missing link
  },
];

const Branching = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  useBodyLockScroll(isOpenModal);
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, rootMargin: '500px' });

  return (
    <section
      className="branching safe-paddings sm:pt[190px] bg-black pt-[672px] text-white xl:pt-[408px] md:pt-[364px] sm:pt-[190px]"
      ref={wrapperRef}
    >
      <Container className="grid-gap-x grid grid-cols-12" size="md">
        <div className="relative col-span-8 ml-[50px] flex max-w-[940px] flex-col items-center xl:col-span-full xl:mx-auto xl:w-full">
          <LineSvg className="absolute bottom-[calc(100%+2rem)] left-1/2 h-auto w-[393px] -translate-x-[calc(50%-11.3rem)] xl:hidden" />
          <StraightLineSvg className="absolute bottom-[calc(100%+1rem)] left-1/2 hidden h-auto w-8 -translate-x-1/2 xl:block lg:w-[30px] md:w-7 sm:w-3.5" />
          <time className="label-secondary-2 mx-auto" dateTime="2022-12-07">
            7th of December, 2022
          </time>
          <Heading className="mt-2.5 text-center" tag="h2" size="lg" theme="white">
            All-Things-Branching
          </Heading>
          <p className="mt-3 text-center text-xl xl:mt-2.5 xl:text-base md:mt-2">
            Join us Wednesday, December 7th, to learn about database branching with Neon.
          </p>
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
                  className="absolute bottom-0 right-0 h-full w-auto max-w-none rounded-2xl md:left-1/2 md:right-auto md:-translate-x-[calc(50%+8rem)]"
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
            <div className="absolute top-8 left-[38px] min-h-[520px] max-w-[330px] rounded-2xl bg-secondary-5 px-5 pt-7 pb-8 lg:top-6 lg:left-6 lg:min-h-[442px] lg:max-w-[290px] md:static md:mx-auto md:-mt-2 md:min-h-0 md:w-[85%] md:max-w-none md:rounded-t-none">
              <Button
                className="w-full px-8 !text-lg lg:!text-base xs:!text-sm"
                theme="secondary"
                size="sm"
                style={{ boxShadow: '0px 10px 30px rgba(26, 26, 26, 0.6)' }}
                onClick={() => setIsOpenModal(true)}
              >
                <PlayIcon className="mr-4 h-[22px] w-4 shrink-0 lg:h-4 lg:w-[11px] xs:mr-3" />
                <span>Watch announcements</span>
              </Button>
              <ul className="mt-7 lg:mt-6">
                {items.map(({ text, linkText, linkUrl }, index) => (
                  <li
                    className="group flex flex-col border-t border-dashed border-black border-opacity-40 py-6 text-black last:pb-0"
                    key={index}
                  >
                    <Link to={linkUrl}>
                      <p className="text-lg font-semibold leading-snug opacity-[85%] lg:text-base">
                        {text}
                      </p>
                      <span className="mt-3.5 inline-flex items-center space-x-2 font-semibold leading-none lg:mt-2">
                        <span>{linkText}</span>
                        <ArrowIcon className="h-auto w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
      <VideoModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} videoId="tu-bgIg-Luo" />
    </section>
  );
};

export default Branching;
