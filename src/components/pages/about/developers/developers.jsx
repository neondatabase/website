import clsx from 'clsx';
import React from 'react';

import Container from 'components/shared/container';

import IconCost from './images/icon-cost.inline.svg';
import IconEasy from './images/icon-easy.inline.svg';
import IconPostgres from './images/icon-postgres.inline.svg';
import IconReliable from './images/icon-reliable.inline.svg';

const FEATURES_DATA = [
  {
    icon: IconPostgres,
    title: 'Just be Postgres',
    description:
      'Achieve this by leveraging the pluggable storage layer, preserving the core of Postgres.',
  },
  {
    icon: IconEasy,
    title: 'Easy',
    description:
      'Simplify the life of developers by bringing the serverless consumption model to Postgres.',
  },
  {
    icon: IconCost,
    title: 'Cost efficient',
    description: 'Aim to deliver the best price-performance Postgres service in the world.',
  },
  {
    icon: IconReliable,
    title: 'Reliable',
    description:
      'Use modern replication techniques to provide high availability and high durability guarantees.',
  },
];

const Developers = () => (
  <section className="developers safe-paddings bg-black-pure">
    <h2 className="sr-only">Developer-Focused Features</h2>
    <Container
      size="small"
      className="pb-[200px] pt-[153px] xl:px-32 xl:pb-[184px] xl:pt-[136px] lg:pb-[136px] lg:pt-[108px] md:pb-[104px] md:pt-[88px]"
    >
      <p className="max-w-[800px] text-[64px] font-normal leading-none tracking-[-0.05em] text-white xl:max-w-[696px] xl:text-[56px] lg:max-w-[544px] lg:text-[44px] md:max-w-full md:text-[32px]">
        Developers are at the center of everything we&nbsp;do.
      </p>

      <ul className="mt-40 grid grid-cols-4 gap-x-20 xl:mt-[136px] xl:grid-cols-2 xl:gap-[72px] lg:mt-28 lg:gap-16 md:mt-20 md:grid-cols-1 md:gap-y-14">
        {FEATURES_DATA.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <li
              key={index}
              className={clsx(
                'relative flex flex-col',
                {
                  'before:absolute before:-left-6 before:top-0 before:h-full before:w-px before:bg-gray-new-20 md:before:hidden':
                    index > 0,
                },
                {
                  'after:absolute after:-top-7 after:left-0 after:hidden after:h-px after:w-full after:-translate-y-1/2 after:bg-gray-new-20 md:after:block':
                    index > 0,
                },
                { 'xl:before:hidden': index === 0 || index === 2 },
                { 'xl:before:-left-9 xl:before:-translate-x-1/2': index === 1 || index === 3 }
              )}
            >
              <Icon
                className="h-14 w-14 shrink-0 xl:h-[52px] xl:w-[52px] lg:h-11 lg:w-11 md:h-9 md:w-9"
                aria-hidden="true"
              />
              <h3 className="mt-6 text-[32px] font-normal leading-tight tracking-extra-tight text-white xl:mt-6 xl:text-[28px] lg:mt-5 lg:text-2xl md:mt-[18px]">
                {feature.title}
              </h3>
              <p className="mt-10 text-base font-normal leading-normal tracking-extra-tight text-gray-new-60 xl:mt-9 lg:mt-7 md:mt-5">
                {feature.description}
              </p>
            </li>
          );
        })}
      </ul>
    </Container>
  </section>
);

export default Developers;
