'use client';

import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const StartupPricing = ({ className }) => (
  <section className={`startup-pricing safe-paddings py-14 md:py-10 ${className || ''}`}>
    <Container className="flex flex-col items-center text-center" size="1344">
      <Heading
        className="text-center font-medium !leading-none tracking-tighter xl:text-4xl lg:text-[40px] md:!text-3xl"
        tag="h2"
        size="md"
      >
        Special deals for Startups
      </Heading>
      <p className="mx-auto mt-5 max-w-[680px] text-center text-lg font-light leading-snug tracking-extra-tight text-gray-new-80 xl:max-w-[560px] lg:text-base md:mt-3 md:text-base">
        Growing your own startup? We offer special pricing and up to $100K in credits for startups
        and venture backed companies. Let us worry about scaling your database, so you can focus on
        growing your business.
      </p>
      <Link className="mt-5 md:mt-4" to="https://neon.tech/startups" theme="blue-green">
        Neon for Startups
      </Link>
    </Container>
  </section>
);

StartupPricing.propTypes = {
  className: PropTypes.string,
};

export default StartupPricing;
