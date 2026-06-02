import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

import Table from './table';

const Plans = ({ className }) => (
  <section id="plans" className={cn('plans px-safe', className)}>
    <Table />
  </section>
);

Plans.propTypes = {
  className: PropTypes.string,
};

export default Plans;
