import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import Table from './table';

const Plans = ({ className }) => (
  <section id="plans" className={clsx('plans px-safe', className)}>
    <Container
      className="mb-16 flex flex-col items-center text-center lg:mb-12 md:mb-10"
      size="1344"
    >
      <Heading
        className="text-center font-medium !leading-none tracking-tighter xl:text-4xl lg:text-[40px] md:!text-3xl"
        tag="h2"
        size="md"
      >
        Compare plans
      </Heading>
    </Container>
    <Table />
  </section>
);

Plans.propTypes = {
  className: PropTypes.string,
};

export default Plans;
