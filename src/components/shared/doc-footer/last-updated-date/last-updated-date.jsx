/* eslint-disable react/prop-types */
import clsx from 'clsx';
import PropTypes from 'prop-types';

const LastUpdatedDate = ({ className = null, updatedOn }) => {
  const lastUpdatedOn = new Date(updatedOn).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <p className={clsx('text-sm leading-[1.375em] text-gray-new-80', className)}>
      Last updated on <time dateTime={updatedOn}>{lastUpdatedOn}</time>
    </p>
  );
};

LastUpdatedDate.propTypes = {
  className: PropTypes.string,
  updatedOn: PropTypes.string.isRequired,
};

export default LastUpdatedDate;
