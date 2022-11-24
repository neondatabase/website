import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

const CTA = () => (
  <section className="cta safe-paddings bg-black pt-[200px] text-white">
    <Container className="flex items-center justify-between space-x-10" size="sm">
      <div className="max-w-[661px]">
        <Heading
          className="text-[72px] font-bold leading-dense 2xl:text-6xl xl:text-5xl lg:text-4xl"
          tag="h2"
        >
          Try branching in your project now
        </Heading>
        <Button className="mt-9 py-6 px-9 !text-lg" theme="primary" size="sm">
          Try branching now
        </Button>
      </div>
      <StaticImage
        src="./images/illustration.png"
        width={752}
        height={567}
        alt=""
        loading="lazy"
        aria-hidden
      />
    </Container>
  </section>
);

export default CTA;
