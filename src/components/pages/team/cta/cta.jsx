import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';

const CTA = () => (
  <section className="safe-paddings mt-48 bg-secondary-6 py-32 text-center 3xl:mt-44 2xl:mt-40 2xl:py-28 xl:mt-32 xl:py-20 lg:mt-24 lg:py-16 md:mt-20">
    <Container size="sm">
      <h2 className="t-5xl font-bold">Want to join Neon’s team?</h2>
      <Button className="mt-10 2xl:mt-8 xl:mt-7 md:mt-6" to={LINKS.jobs} size="sm" theme="primary">
        Check open positions
      </Button>
    </Container>
  </section>
);

export default CTA;
