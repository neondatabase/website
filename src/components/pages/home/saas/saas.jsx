import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import illustration from './images/illustration.svg';

const SaaS = () => (
  <section className="py-48 bg-black safe-paddings 3xl:py-44 2xl:py-40 xl:py-32 lg:py-24">
    <Container className="flex items-center justify-between lg:block">
      <div>
        <Heading tag="h2" size="lg" theme="white">
          Perfect for SaaS
        </Heading>
        <p className="max-w-[600px] t-2xl mt-5 text-white 2xl:max-w-[488px] 2xl:mt-4 xl:max-w-[400px] lg:max-w-none">
          With Zenith SaaS vendors can provisioning database clusters for each customer without
          worrying about the costs of provisioned capacity. Databases can be shut down when they are
          not active, while automated capacity adjustments can meet application needs.
        </p>
        <Button className="mt-10 2xl:mt-8 xl:mt-7" to="/" size="md" theme="primary">
          Try it Now
        </Button>
      </div>
      <img
        className="3xl:max-w-[716px] 2xl:max-w-[592px] xl:max-w-[500px] lg:max-w-[524px] lg:mt-10"
        src={illustration}
        alt=""
        loading="lazy"
        aria-hidden
      />
    </Container>
  </section>
);

export default SaaS;
