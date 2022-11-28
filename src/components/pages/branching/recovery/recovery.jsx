import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import screenImage from './images/screen.svg';

const items = [
  'Create a branch from a point in time in the past to reproduce an issue.',
  'Instantly restore your production instance from a point in time in the past via branch creation.',
  'Find the latest point before the data was removed.',
  'Use branches as backups and inspect their data without hassle.',
];

const Recovery = () => (
  <section className="recovery safe-paddings bg-black pt-[200px] text-white 2xl:pt-36 xl:pt-32 lg:pt-28 md:pt-20">
    <Container className="" size="sm">
      <Heading className="t-5xl font-bold" tag="h2">
        Debugging and Disaster Recovery
      </Heading>
      <div className="grid-gap-x mt-10 grid grid-cols-10 items-center md:mt-6">
        <ul className="col-span-4 max-w-[484px] divide-y divide-dashed divide-gray-2 md:col-span-full md:max-w-none">
          {items.map((item, index) => (
            <li className="t-xl flex space-x-4 py-5 leading-snug" key={index}>
              <span className="font-semibold text-primary-1">{index + 1}.</span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
        <img
          className="col-span-6 md:col-span-full md:mt-10"
          src={screenImage}
          width={710}
          height={420}
          alt=""
          loading="lazy"
          aria-hidden
        />
      </div>
    </Container>
  </section>
);

export default Recovery;
