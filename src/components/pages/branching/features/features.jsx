import clsx from 'clsx';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import DataIcon from './images/data.inline.svg';
import QueriesIcon from './images/queries.inline.svg';
import TestIcon from './images/test.inline.svg';
import WhatIfSvg from './images/what-if.inline.svg';

const items = [
  {
    className: 'bg-secondary-2',
    icon: DataIcon,
    text: 'Perform scenario analysis on production-like data',
  },
  {
    className: 'bg-secondary-6',
    icon: QueriesIcon,
    text: 'Optimize queries<br/> on production data',
  },
  {
    className: 'bg-secondary-4',
    icon: TestIcon,
    text: 'A/B test<br/> new products',
  },
];

const Features = () => (
  <section className="features safe-paddings bg-black pt-[200px] text-white 2xl:pt-36 xl:pt-32 lg:pt-28 md:pt-20">
    <Container size="md">
      <Heading className="t-5xl text-center font-bold leading-snug" tag="h2">
        Run simulations and answer{' '}
        <span>
          <span className="sr-only">What if</span>
          <WhatIfSvg className="inline h-auto w-[228px] pb-2 xl:w-[167px] lg:w-36 lg:pb-0" />
        </span>{' '}
        questions
      </Heading>
      <div className="grid-gap mt-12 grid grid-cols-12 lg:mt-12 md:mt-10">
        {items.map(({ className, icon: Icon, text }, index) => (
          <div
            className={clsx(
              'col-span-4 flex flex-col items-center rounded-[18px] px-8 pb-[74px] pt-[72px] 2xl:py-16 xl:px-6 xl:py-11 lg:py-9 md:col-start-2 md:col-end-12 md:py-12 sm:col-span-full sm:py-7',
              className
            )}
            key={index}
          >
            <Icon className="h-16 w-16 2xl:h-14 2xl:w-14 xl:h-12 xl:w-12 lg:h-11 lg:w-11" />
            <Heading className="t-3xl mt-5 text-center font-semibold" theme="black" tag="h3" asHTML>
              {text}
            </Heading>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

export default Features;
