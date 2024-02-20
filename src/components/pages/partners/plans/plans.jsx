import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import GradientLabel from 'components/shared/gradient-label';
import Heading from 'components/shared/heading';

import Table from './table';

const Plans = ({ className }) => (
  <section id="partner-plans" className={clsx('plans px-safe', className)}>
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2">
        <GradientLabel className="mx-auto block w-fit">Plans</GradientLabel>
        <Heading
          className="mt-4 text-center text-[48px] font-medium leading-none tracking-tight lg:text-4xl sm:text-[36px]"
          tag="h2"
          theme="white"
        >
          Partner Plan Details
        </Heading>
        <p className="mt-3 text-center text-lg font-light leading-snug sm:text-base">
          Neon offers two partner tiers to help businesses of all types and sizes deliver serverless
          Postgres to their customers.
        </p>
      </div>
    </Container>
    <Table />
  </section>
);

Plans.propTypes = {
  className: PropTypes.string,
};

export default Plans;
