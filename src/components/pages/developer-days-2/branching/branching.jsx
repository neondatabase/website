import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import LineSvg from './images/line.inline.svg';

const Branching = () => (
  <section className="branching safe-paddings  bg-black pt-[608px] text-white">
    <Container className="grid-gap-x grid grid-cols-12" size="md">
      <div className="relative col-span-8 flex flex-col items-center">
        <LineSvg className="absolute bottom-[calc(100%+1rem)] left-1/2 h-auto w-[377px] -translate-x-[calc(50%-11rem)]" />
        <time
          className="mx-auto rounded-[40px] bg-secondary-2 py-2 px-4 text-xs font-bold uppercase leading-none text-black"
          dateTime="2022-12-07"
        >
          7th of December, 2022
        </time>
        <Heading
          className="text-[72px] font-bold leading-tight 2xl:text-6xl xl:text-5xl lg:text-4xl"
          tag="h2"
        >
          All-Things-Branching
        </Heading>
        <p>Welcome to Neon Developer days from 6-8 December, 2022</p>
      </div>
    </Container>
  </section>
);

Branching.propTypes = {};

Branching.defaultProps = {};

export default Branching;
