import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import CostEfficientIcon from './images/cost-efficient.inline.svg';
import EasyToUseIcon from './images/easy-to-use.inline.svg';
import PlayIcon from './images/play.inline.svg';
import ScalableIcon from './images/scalable.inline.svg';

const Advantages = () => (
  <section className="bg-black py-80">
    <Container>
      <div className="flex items-center space-x-[100px]">
        <div className="relative">
          <StaticImage className="max-w-[800px]" src="./images/cover.jpg" alt="" aria-hidden />
          <button
            className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-40 h-40 flex items-center justify-center rounded-full before:bg-[#00ace6] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-full before:mix-blend-multiply"
            type="button"
          >
            <PlayIcon
              className="relative rounded-full"
              style={{ 'box-shadow': '0px 10px 20px rgba(26, 26, 26, 0.4)' }}
            />
          </button>
        </div>
        <div>
          <Heading className="max-w-[490px]" tag="h2" size="lg" theme="white">
            Distributed Database, Made Simple
          </Heading>
          <p className="max-w-[600px] t-xl mt-5 text-white">
            Go through our 5 minutes tutorials video and start using scalable, cost efficient
            database architecture for your project.
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-12 mt-40 gap-x-10">
        <li className="col-span-3">
          <ScalableIcon />
          <Heading className="mt-6" tag="h3" size="sm" theme="white">
            Scalable
          </Heading>
          <p className="mt-4 text-white t-xl">
            Separation of storage and compute. allows Zenith reconfigure amount of the compute power
            on the fly.
          </p>
        </li>
        <li className="col-span-3 col-start-5">
          <CostEfficientIcon />
          <Heading className="mt-6" tag="h3" size="sm" theme="white">
            Cost efficient
          </Heading>
          <p className="mt-4 text-white t-xl">
            Being serverless allows using of resources on-demand, which significantly cuts the
            costs.
          </p>
        </li>
        <li className="col-span-3 col-start-9">
          <EasyToUseIcon />
          <Heading className="mt-6" tag="h3" size="sm" theme="white">
            Easy to use
          </Heading>
          <p className="mt-4 text-white t-xl">
            No complex onboarding needed. Use a single CLI command to create a new Zenith database.
          </p>
        </li>
      </ul>
    </Container>
  </section>
);

export default Advantages;
