/* eslint-disable react/prop-types */
import clsx from 'clsx';
import PropTypes from 'prop-types';

const LastUpdatedDate = ({ className = null, updatedOn }) => {
  const lastUpdatedOn = updatedOn
    ? new Date(updatedOn).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <p className={clsx('mt-10 text-sm text-gray-new-40 dark:text-gray-new-80', className)}>
      Last updated on <time dateTime={lastUpdatedOn}>{lastUpdatedOn}</time>
    </p>
  );
};

LastUpdatedDate.propTypes = {
  className: PropTypes.string,
  updatedOn: PropTypes.string,
};

export default LastUpdatedDate;
