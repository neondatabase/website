import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

const Hero = () => (
  <section className="bg-black pt-[322px] safe-paddings 3xl:pt-[243px] 2xl:pt-[207px] xl:pt-[193px] lg:pt-12">
    <Container className="flex items-center justify-between lg:flex-col lg:justify-center">
      <div className="relative z-10 max-w-[860px] 3xl:max-w-[750px] 2xl:max-w-[610px] xl:max-w-[535px] lg:text-center">
        <Heading className="with-highlighted-text-secondary-2" tag="h1" size="xl" theme="white">
          Zenith is PostgreSQL that is <span>/</span> Fault-tolerant
        </Heading>
        <Button className="mt-10 2xl:mt-8 xl:mt-7" to="/" size="md" theme="primary">
          Get Early Access
        </Button>
      </div>
      <StaticImage
        className="!absolute top-[-345px] right-[-165px] w-[1163px] 3xl:w-[960px] 3xl:top-[-270px] 3xl:right-[-150px] 2xl:w-[800px] 2xl:top-[-225px] 2xl:right-[-125px] xl:w-[697px] xl:top-[-197px] xl:right-[-228px] lg:!relative lg:top-0 lg:right-0 lg:w-[640px] lg:mt-[-60px]"
        src="../hero/images/illustration.png"
        alt=""
        loading="eager"
        aria-hidden
      />
    </Container>
  </section>
);

export default Hero;
