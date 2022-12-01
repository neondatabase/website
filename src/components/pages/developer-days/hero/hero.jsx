import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

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

const Hero = () => (
  <section className="safe-paddings relative bg-black pt-[182px] text-white">
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
      <p className="mt-3 text-center text-xl md:text-lg">
        Welcome to Neon Developer Days. December 6-8, 2022.
      </p>
      <div className="relative mt-14">
        <StickerIcon className="absolute top-[-198px] right-[-154px] h-[300px] w-[300px]" />
        <div className="absolute top-16 left-1/2 h-auto w-[1068px] -translate-x-1/2">
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
        <StaticImage
          className="rounded-2xl"
          imgClassName="rounded-2xl"
          src="./images/bg-hero.jpg"
          width={940}
          height={520}
          alt=""
          loading="eager"
          aria-hidden
        />
        <div className="absolute top-8 left-[38px] h-full max-w-[330px] rounded-2xl bg-primary-1 px-5 pt-7 pb-8">
          <Button
            className="w-full px-8 !text-lg"
            theme="secondary"
            size="sm"
            style={{ boxShadow: '0px 10px 30px rgba(26, 26, 26, 0.6)' }}
          >
            <PlayIcon className="mr-4 h-[22px] w-4 shrink-0" />
            <span>Watch announcements</span>
          </Button>
          <ul className="mt-7">
            {items.map(({ text, linkText, linkUrl }, index) => (
              <li
                className="flex flex-col border-t border-dashed border-black border-opacity-40 py-6 text-black last:pb-0"
                key={index}
              >
                <Link to={linkUrl}>
                  <p className="text-lg font-semibold leading-snug opacity-[85%]">{text}</p>
                  <span className="mt-3.5 inline-flex items-center space-x-2 font-semibold leading-none">
                    <span>{linkText}</span>
                    <ArrowIcon className="h-auto w-[18px]" />
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

export default Hero;
