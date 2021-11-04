import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import illustration from './images/illustration.svg';

const SaaS = () => (
  <section className="py-48 bg-black safe-paddings">
    <Container className="flex items-center justify-between">
      <div>
        <Heading tag="h2" size="lg" theme="white">
          Perfect for SaaS
        </Heading>
        <p className="max-w-[600px] t-2xl mt-5 text-white">
          With Zenith SaaS vendors can provisioning database clusters for each customer without
          worrying about the costs of provisioned capacity. Databases can be shut down when they are
          not active, while automated capacity adjustments can meet application needs.
        </p>
        <Button className="mt-10" to="/" size="md" theme="primary">
          Try it Now
        </Button>
      </div>
      <img src={illustration} alt="" loading="lazy" aria-hidden />
    </Container>
  </section>
);

export default SaaS;
