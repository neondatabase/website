import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

const TITLE = 'Release Notes';
const DESCRIPTION = 'The latest product updates from Neon';

const Hero = () => (
  <Container
    size="sm"
    className="mb-12 border-b border-b-gray-4 pb-12 pt-40 lg:pt-16 md:mb-10 md:py-10 sm:mb-7 sm:py-7"
  >
    <Heading size="md" tag="h2" theme="black">
      {TITLE}
    </Heading>
    <p className="mt-3 text-xl">{DESCRIPTION}</p>
  </Container>
);

export default Hero;
