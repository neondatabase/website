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
    text: 'Perform scenario analysis on production like data',
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
  <section className="features safe-paddings bg-black pt-[200px] text-white">
    <Container size="md">
      <Heading className="t-5xl text-center font-bold" tag="h2">
        Run simulations and answer{' '}
        <span>
          <span className="sr-only">What if</span>
          <WhatIfSvg className="inline h-auto w-[228px] pb-2" />
        </span>{' '}
        questions
      </Heading>
      <div className="grid-gap mt-16 grid grid-cols-12">
        {items.map(({ className, icon: Icon, text }, index) => (
          <div
            className={clsx(
              'col-span-4 flex flex-col items-center rounded-[18px] px-8 pt-[72px] pb-[74px]',
              className
            )}
            key={index}
          >
            <Icon className="h-20 w-20" />
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
