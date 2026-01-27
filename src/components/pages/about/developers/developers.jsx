import PropTypes from 'prop-types';
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

const FeatureCard = ({ icon: Icon, title, description, isLast = false }) => (
  <div
    className={`flex w-[260px] flex-col xl:w-[220px] lg:w-full ${!isLast ? 'pr-20 xl:pr-14 lg:pr-0' : ''}`}
  >
    <Icon className="h-14 w-14 shrink-0 xl:h-12 xl:w-12 lg:h-10 lg:w-10" aria-hidden="true" />
    <h3 className="mt-6 text-[32px] font-normal leading-tight tracking-extra-tight text-white xl:mt-5 xl:text-[28px] lg:mt-4 lg:text-2xl">
      {title}
    </h3>
    <p className="mt-10 text-base font-normal leading-normal tracking-extra-tight text-gray-new-60 xl:mt-8 lg:mt-6 lg:text-sm">
      {description}
    </p>
  </div>
);

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isLast: PropTypes.bool,
};

const VerticalDivider = () => (
  <div
    className="h-[232px] w-px shrink-0 bg-gray-new-20 xl:h-[200px] lg:hidden"
    aria-hidden="true"
  />
);

const Developers = () => (
  <section className="developers safe-paddings bg-black-pure">
    <h2 className="sr-only">Developer-Focused Features</h2>
    <Container
      size={1280}
      className="pb-[200px] pt-[153px] xl:pb-40 xl:pt-32 lg:pb-32 lg:pt-24 md:pb-24 md:pt-20 sm:pb-20 sm:pt-16"
    >
      <p className="max-w-[800px] text-6xl font-normal leading-none tracking-[-0.05em] text-white xl:max-w-[680px] xl:text-5xl lg:max-w-[560px] lg:text-[40px] md:max-w-full md:text-[32px] sm:text-[28px]">
        Developers are at the center of everything we&nbsp;do.
      </p>

      <ul className="mt-40 flex items-start justify-between xl:mt-32 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12 md:mt-16 md:grid-cols-1 md:gap-y-10 sm:mt-12">
        {FEATURES_DATA.map((feature, index) => (
          <React.Fragment key={index}>
            <li>
              <FeatureCard {...feature} isLast={index === FEATURES_DATA.length - 1} />
            </li>
            {index < FEATURES_DATA.length - 1 && <VerticalDivider />}
          </React.Fragment>
        ))}
      </ul>
    </Container>
  </section>
);

export default Developers;
