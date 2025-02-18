import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';

import Tabs from './tabs';

const HowNeonHelps = ({ tabs }) => (
  <section className="how-neon-helps mt-48 px-safe xl:mt-40 lg:mt-32 md:mt-24">
    <Container size="960">
      <h2 className="max-w-[720px] font-title text-[48px] font-medium leading-none tracking-tighter xl:text-[44px] lg:max-w-[480px] lg:text-[36px] md:mx-auto md:text-center md:text-[32px]">
        Accelerate development with confidence at every stage
      </h2>
      <Tabs tabs={tabs} />
    </Container>
  </section>
);

HowNeonHelps.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      challenge: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default HowNeonHelps;
