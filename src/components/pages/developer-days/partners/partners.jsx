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

import featureLineSvg from './images/feature-line.svg';
import LineSvg from './images/line.inline.svg';

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

const Partners = ({ setIsOpenModal }) => {
  const [wrapperRef, isWrapperInView] = useInView({ threshold: 0.3 });
  const [containerRef, isContainerInView] = useInView({ triggerOnce: true, rootMargin: '300px' });
  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/developer-days/hands.riv',
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
    <section className="branching safe-paddings  bg-black pt-[672px] text-white" ref={wrapperRef}>
      <Container className="grid-gap-x grid grid-cols-12" size="md" ref={containerRef}>
        <div className="ml col-span-4 flex justify-center">
          <img
            className="-mt-20 ml-[74px]"
            src={featureLineSvg}
            width={144}
            height={784}
            alt="feature/auth"
            loading="lazy"
          />
        </div>
        <div className="relative col-span-8 ml-auto mr-[50px] flex max-w-[940px] flex-col items-center">
          <LineSvg className="absolute bottom-[calc(100%+2rem)] left-1/2 h-auto w-[752px] -translate-x-[calc(50%+22.5rem)]" />
          <time className="label-secondary-2 mx-auto" dateTime="2022-12-07">
            8th of December, 2022
          </time>
          <Heading className="mt-2.5" size="lg" tag="h2">
            Partners & Ecosystem
          </Heading>
          <p className="mt-3 text-xl">Welcome to Neon Developer days from 6-8 December, 2022</p>
          <div className="relative mt-14">
            <div className="absolute -inset-x-16 top-16">
              <StaticImage
                className="rounded-[200px] opacity-30 blur-[70px]"
                imgClassName="rounded-[200px]"
                src="./images/bg-gradient-partners.jpg"
                width={1068}
                height={520}
                alt=""
                loading="lazy"
                aria-hidden
              />
            </div>
            <div className="relative">
              <svg width="940" height="520" className="rounded-2xl">
                <rect width="940" height="520" className="fill-secondary-4" />
              </svg>

              {isContainerInView && (
                <RiveComponent className="absolute bottom-0 right-0 h-full max-h-[448px] w-full max-w-[612px]" />
              )}
            </div>
            <div className="absolute top-8 left-[38px] min-h-[520px] max-w-[330px] rounded-2xl bg-secondary-2 px-5 pt-7 pb-8">
              <Button
                className="w-full px-8 !text-lg"
                theme="secondary"
                size="sm"
                style={{ boxShadow: '0px 10px 30px rgba(26, 26, 26, 0.6)' }}
                onClick={() => setIsOpenModal(true)}
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
                      <p className="text-lg font-semibold leading-snug opacity-[85%]">{text}</p>
                      <span className="with-moving-arrow mt-3.5 inline-flex items-center font-semibold leading-none">
                        <span>{linkText}</span>
                        <ArrowIcon className="h-auto w-[18px]" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

Partners.propTypes = {
  setIsOpenModal: PropTypes.func.isRequired,
};

export default Partners;
