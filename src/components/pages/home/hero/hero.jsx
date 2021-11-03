import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

const Hero = () => (
  <section className="bg-black pt-11">
    <Container className="flex items-center justify-between">
      <div className="max-w-[860px]">
        <Heading className="with-highlighted-text-secondary-2" tag="h1" size="xl" theme="white">
          Zenith is PostgreSQL that is <span>/</span> Fault-tolerant
        </Heading>
        <Button className="mt-10" to="/" size="md" theme="primary">
          Try it Now
        </Button>
      </div>
      <StaticImage
        className="max-w-[820px] -mr-5 -mb-7"
        src="../hero/images/illustration.png"
        alt=""
        aria-hidden
      />
    </Container>
  </section>
);

export default Hero;
