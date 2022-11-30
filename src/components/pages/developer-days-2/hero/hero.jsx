import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';

import bgShapeSvg from './images/bg-shape.svg';
import PlayIcon from './images/play.inline.svg';
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
      <time
        className="mx-auto rounded-[40px] bg-secondary-2 py-2 px-4 text-xs font-bold uppercase leading-none text-black"
        dateTime="2022-12-06"
      >
        6th of December, 2022
      </time>
      <h1 className="mt-2.5 text-center text-[72px] font-bold leading-tight 2xl:text-6xl xl:text-5xl lg:text-4xl">
        Neon is Live!
      </h1>
      <p className="mt-3 text-center text-xl md:text-lg">
        Welcome to Neon Developer days from 6-8 December, 2022
      </p>
      <div className="relative mt-14 after:absolute ">
        <StickerIcon className="absolute top-[-208px] right-[-154px] h-[300px] w-[300px]" />
        <StaticImage
          className="rounded-2xl"
          imgClassName="rounded-2xl"
          src="./images/background.jpg"
          width={940}
          height={520}
          alt=""
          aria-hidden
        />
        <div className="absolute top-8 left-[38px] max-w-[330px] rounded-2xl bg-primary-1 px-5 pt-7 pb-8">
          <Button
            className="w-full"
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
                <p className="text-lg font-semibold leading-snug opacity-[85%]">{text}</p>
                <Link
                  className="mt-3.5 font-semibold leading-none"
                  theme="black"
                  size="2xs"
                  to={linkUrl}
                  withArrow
                >
                  {linkText}
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
