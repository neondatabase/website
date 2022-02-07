import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';

const CTA = () => (
  <section className="safe-paddings mt-48 bg-black py-36 text-center 3xl:mt-44 2xl:mt-40 2xl:py-32 xl:mt-32 xl:py-24 lg:mt-24 lg:py-20 md:mt-20">
    <Container size="sm">
      <h2 className="t-5xl font-bold text-white">Want to join Zenith’s team?</h2>
      <Button className="mt-10 2xl:mt-8 xl:mt-7 md:mt-6" to="/jobs" size="sm" theme="primary">
        Check open positions
      </Button>
    </Container>
  </section>
);

export default CTA;
