import clsx from 'clsx';
import PropTypes from 'prop-types';

import Table from './table';

const Plans = ({ className }) => (
  <section id="plans" className={clsx('plans px-safe', className)}>
    <Table />
  </section>
);

Plans.propTypes = {
  className: PropTypes.string,
};

export default Plans;
