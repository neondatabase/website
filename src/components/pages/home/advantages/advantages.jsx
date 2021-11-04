import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import CostEfficientIcon from './images/cost-efficient.inline.svg';
import EasyToUseIcon from './images/easy-to-use.inline.svg';
import PlayIcon from './images/play.inline.svg';
import ScalableIcon from './images/scalable.inline.svg';

const items = [
  {
    icon: ScalableIcon,
    title: 'Scalable',
    description:
      'Separation of storage and compute. allows Zenith reconfigure amount of the compute power on the fly.',
  },
  {
    icon: CostEfficientIcon,
    title: 'Cost efficient',
    description:
      'Being serverless allows using of resources on-demand, which significantly cuts the costs.',
  },
  {
    icon: EasyToUseIcon,
    title: 'Easy to use',
    description:
      'No complex onboarding needed. Use a single CLI command to create a new Zenith database.',
  },
];

const Advantages = () => (
  <section className="bg-black py-80 safe-paddings 3xl:py-72 2xl:py-64">
    <Container>
      <div className="flex items-center space-x-[100px] 3xl:space-x-[76px] 2xl:space-x-[64px]">
        <div className="relative max-w-[800px] 3xl:max-w-[680px] 2xl:max-w-[560px]">
          <StaticImage
            className="rounded"
            src="../advantages/images/cover.jpg"
            alt=""
            aria-hidden
          />
          <button
            className="absolute flex items-center justify-center w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 group 3xl:w-[136px] 3xl:h-[136px] 2xl:w-[112px] 2xl:h-[112px]"
            type="button"
          >
            <PlayIcon
              className="relative rounded-full transition-transform duration-200 group-hover:scale-[1.1] 3xl:w-[82px] 2xl:w-[68px]"
              style={{ boxShadow: '0px 10px 20px rgba(26, 26, 26, 0.4)' }}
            />
          </button>
        </div>
        <div>
          <Heading className="max-w-[490px] 2xl:max-w-[385px]" tag="h2" size="lg" theme="white">
            Distributed Database, Made Simple
          </Heading>
          <p className="max-w-[600px] t-xl mt-5 text-white 2xl:max-w-[520px] 2xl:mt-4">
            Go through our 5 minutes tutorials video and start using scalable, cost efficient
            database architecture for your project.
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-12 mt-40 grid-gap 3xl:mt-36 2xl:mt-32">
        {items.map(({ icon: Icon, title, description }, index) => (
          <li className="col-span-4 max-w-[410px] 3xl:max-w-[340px] 2xl:max-w-[312px]" key={index}>
            <Icon className="w-24 2xl:w-20" />
            <Heading className="mt-6" tag="h3" size="sm" theme="white">
              {title}
            </Heading>
            <p className="mt-4 text-white t-xl">{description}</p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Advantages;
