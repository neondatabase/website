import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const LastUpdatedDate = ({ className = null, updatedOn }) => {
  const lastUpdatedOn = new Date(updatedOn).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <p className={cn('text-sm leading-snug text-gray-new-30 dark:text-gray-new-85', className)}>
      Last updated on <time dateTime={updatedOn}>{lastUpdatedOn}</time>
    </p>
  );
};

LastUpdatedDate.propTypes = {
  className: PropTypes.string,
  updatedOn: PropTypes.string.isRequired,
};

export default LastUpdatedDate;
