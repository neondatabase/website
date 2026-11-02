import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import LastUpdatedDate from 'components/shared/doc-footer/last-updated-date';
import { cn } from 'utils/cn';

import Table from './table';

const Plans = ({ className, updatedOn = null }) => (
  <section id="plans" className={cn('plans px-safe', className)}>
    <Table />
    {updatedOn && (
      <Container size="1152" className="mt-6 md:pl-5">
        <LastUpdatedDate className="text-gray-new-60 dark:text-gray-new-60" updatedOn={updatedOn} />
      </Container>
    )}
  </section>
);

Plans.propTypes = {
  className: PropTypes.string,
  updatedOn: PropTypes.string,
};

export default Plans;
