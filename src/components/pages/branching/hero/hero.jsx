import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const Hero = () => (
  <section className="hero safe-paddings bg-black pt-[158px] text-white lg:pt-20 md:pt-16">
    <Container
      className="flex w-full items-center justify-between border-b border-dashed border-gray-2 lg:flex-col lg:space-y-16 md:space-y-10"
      size="sm"
    >
      <div className="max-w-[605px] pb-[88px] xl:pb-0 lg:text-center">
        <Heading
          className="text-[72px] font-bold leading-dense 2xl:text-6xl xl:text-5xl lg:text-4xl"
          tag="h1"
        >
          Instant branching for Postgres
        </Heading>
        <p className="mt-7 text-xl md:text-lg sm:text-base">
          Neon allows you to instantly branch your data the same way that you branch your code.
        </p>
        <div className="mt-9 space-x-10">
          <Button
            className="py-6 px-9 !text-lg lg:py-5 lg:px-8 lg:!text-base"
            theme="primary"
            size="sm"
            to="/early-access"
          >
            Get early access
          </Button>
          <Link
            className="text-lg font-semibold before:-bottom-1 before:h-[3px] lg:text-base"
            theme="black-primary-1"
            to="/docs/conceptual-guides/branching/"
          >
            Explore the docs
          </Link>
        </div>
      </div>
      <StaticImage
        className="lg:max-w-[650px]"
        src="./images/illustration.png"
        quality={70}
        width={752}
        height={616}
        alt=""
        loading="eager"
        aria-hidden
      />
    </Container>
  </section>
);

export default Hero;
