import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';

const CTA = () => (
  <section className="safe-paddings mt-48 bg-black py-36 text-center 3xl:mt-44 2xl:mt-40 xl:mt-32 lg:mt-24 md:mt-20">
    <Container size="sm">
      <h2 className="t-5xl font-bold text-white">Want to join Zenith’s team?</h2>
      <Button className="mt-10" to="/jobs" size="sm" theme="primary">
        Check open positions
      </Button>
    </Container>
  </section>
);

export default CTA;
