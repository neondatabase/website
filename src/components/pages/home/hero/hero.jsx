import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

const Hero = () => (
  <section className="bg-black pt-[322px] safe-paddings 3xl:pt-[243px] 2xl:pt-[207px] xl:pt-[193px] lg:pt-12 md:pt-6">
    <Container className="flex items-center justify-between lg:flex-col lg:justify-center">
      <div className="relative z-10 max-w-[860px] 3xl:max-w-[750px] 2xl:max-w-[610px] xl:max-w-[535px] lg:text-center">
        <Heading
          id="hero-title"
          className="with-highlighted-text-secondary-2"
          tag="h1"
          size="xl"
          theme="white"
        >
          Zenith is PostgreSQL that is <span>/</span> Fault-tolerant
        </Heading>
        <Button
          id="hero-button"
          className="mt-10 2xl:mt-8 xl:mt-7 md:mt-6"
          to="/"
          size="md"
          theme="primary"
        >
          Get Early Access
        </Button>
      </div>
      <div
        className="!absolute top-[-165px] -right-1 w-[820px] lg:!relative lg:top-0 lg:right-0 lg:w-[640px] lg:mt-[-60px] md:w-[555px] md:mt-[-55px] xs:w-[420px] xs:-mt-10"
        aria-hidden
      >
        <StaticImage
          className="z-10"
          src="../hero/images/illustration.png"
          alt=""
          loading="eager"
        />
        <div className="absolute top-1/2 left-1/2 w-[888px] h-[888px] border-2 border-gray-1 rounded-full -translate-x-1/2 -translate-y-1/2 mt-[-15px] ml-[-7.5px]" />
        <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] border-2 border-gray-1 rounded-full -translate-x-1/2 -translate-y-1/2 mt-[-15px] ml-[-7.5px]" />
        <div className="absolute top-1/2 left-1/2 w-[1160px] h-[1160px] border-2 border-gray-1 rounded-full -translate-x-1/2 -translate-y-1/2 mt-[-15px] ml-[-7.5px]" />
        <div
          className="top-[-55px] left-[383px] !translate-x-0 !translate-y-0 circle circle-with-text circle-with-text-right"
          data-text="Cloudflare Workers"
        />
        <div
          className="top-[89px] right-[79px] !translate-x-0 !translate-y-0 circle circle-with-text circle-with-text-right"
          data-text="Hasura Cloud"
        />
        <div
          className="!translate-x-0 !translate-y-0 top-[185px] left-[-3px] circle circle-with-text circle-with-text-left"
          data-text="Gatsby Cloud"
        />
        <div
          className="!translate-x-0 !translate-y-0 circle circle-with-text circle-with-text-left top-auto bottom-[61px] left-[42px]"
          data-text="Netlify"
        />
        <div
          className="!translate-x-0 !translate-y-0 circle circle-with-text circle-with-text-right top-auto bottom-[-50px] right-[233px]"
          data-text="Amazon Lambda"
        />
      </div>
    </Container>
  </section>
);

export default Hero;
