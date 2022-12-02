import { StaticImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Alignment, Fit, Layout, useRive } from 'rive-react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import ArrowIcon from 'icons/arrow-right.inline.svg';
import PlayIcon from 'icons/play.inline.svg';

import bgShapeSvg from './images/bg-shape.svg';
import StickerIcon from './images/sticker.inline.svg';

const items = [
  {
    text: 'Neon drops the invite gate! A generous free tier for everyone.',
    linkText: 'Read blog post',
    linkUrl: '/', // TODO: add missing link
  },
  {
    text: 'Neon drops the invite gate! A generous free tier for everyone.',
    linkText: 'Read blog post',
    linkUrl: '/', // TODO: add missing link
  },
  {
    text: 'Neon drops the invite gate! A generous free tier for everyone.',
    linkText: 'Read blog post',
    linkUrl: '/', // TODO: add missing link
  },
];

const Hero = ({ setIsOpenModal }) => {
  const [wrapperRef, isWrapperInView] = useInView({ threshold: 0.3 });
  const { RiveComponent, rive, setContainerRef } = useRive({
    src: '/animations/pages/developer-days/dr-brown.riv',
    autoplay: false,
    stateMachines: 'State Machine',
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
  });

  useEffect(() => {
    if (rive) {
      if (isWrapperInView) {
        rive.play();
      } else {
        rive.pause();
      }
    }
  }, [isWrapperInView, rive]);

  return (
    <section
      className="safe-paddings relative bg-black pt-[182px] text-white xl:pt-[136px] lg:pt-[76px] md:pt-16 sm:pt-12"
      ref={wrapperRef}
    >
      <img
        className="absolute top-0 left-1/2 w-full max-w-[1920px] -translate-x-1/2 blur-[80px]"
        src={bgShapeSvg}
        width={1920}
        height={760}
        alt=""
        aria-hidden
      />
      <Container className="flex flex-col items-center" size="md">
        <time className="label-secondary-2 mx-auto" dateTime="2022-12-06">
          6th of December, 2022
        </time>
        <Heading className="mt-2.5 text-center" tag="h1" size="lg">
          Neon is Live!
        </Heading>
        <p className="mt-3 text-center text-base xl:mt-2.5 md:mt-2">
          Welcome to Neon Developer Days. December 6-8, 2022.
        </p>
        <div className="relative mt-14 xl:mt-12 lg:mt-9 md:mt-6">
          <StickerIcon className="absolute top-[-198px] right-[-154px] h-[300px] w-[300px] xl:hidden" />
          <div className="absolute -inset-x-16 top-16">
            <StaticImage
              className="rounded-[200px] opacity-30 blur-[70px]"
              imgClassName="rounded-[200px]"
              src="./images/bg-gradient-hero.jpg"
              width={1068}
              height={520}
              alt=""
              loading="lazy"
              aria-hidden
            />
          </div>
          <div className="relative">
            <svg
              width="940"
              height="520"
              className="rounded-2xl xl:w-full md:max-h-[390px]"
              ref={setContainerRef}
            >
              <rect width="940" height="520" className="fill-secondary-2" />
            </svg>
            <RiveComponent className="absolute bottom-0 -right-2 h-full max-h-[448px] w-full max-w-[612px] sm:max-w-none" />
          </div>
          <div className="absolute top-8 left-[38px] min-h-[520px] max-w-[330px] rounded-2xl bg-primary-1 px-5 pt-7 pb-8 xl:left-6 lg:min-h-[442px] lg:max-w-[290px] md:static md:mx-auto md:-mt-2 md:min-h-0 md:w-[85%] md:max-w-none md:rounded-t-none">
            <Button
              className="w-full px-8"
              theme="secondary"
              size="sm"
              style={{ boxShadow: '0px 10px 30px rgba(26, 26, 26, 0.6)' }}
              onClick={() => {
                setIsOpenModal(true);
              }}
            >
              <PlayIcon className="mr-4 h-[22px] w-4 shrink-0" />
              <span>Watch announcements</span>
            </Button>
            <ul className="mt-7">
              {items.map(({ text, linkText, linkUrl }, index) => (
                <li
                  className="group flex flex-col border-t border-dashed border-black border-opacity-40 py-6 text-black last:pb-0"
                  key={index}
                >
                  <Link to={linkUrl}>
                    <p className="text-lg font-semibold leading-snug opacity-[85%] lg:text-base">
                      {text}
                    </p>
                    <span className="mt-3.5 inline-flex items-center space-x-2 font-semibold leading-none">
                      <span>{linkText}</span>
                      <ArrowIcon className="h-auto w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
};

Hero.propTypes = {
  setIsOpenModal: PropTypes.func.isRequired,
};

export default Hero;
