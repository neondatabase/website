import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import CostEfficientIcon from 'icons/cost-efficient.inline.svg';
import EasyToUseIcon from 'icons/easy-to-use.inline.svg';
import ScalableIcon from 'icons/scalable.inline.svg';

const Advantages = () => (
  <section className="pt-40 bg-black pb-80">
    <Container>
      <ul className="grid grid-cols-12 gap-x-10">
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
