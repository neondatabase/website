import clsx from 'clsx';
import PropTypes from 'prop-types';

import Feedback from './feedback';
import LastUpdatedDate from './last-updated-date';

const DocFooter = ({ updatedOn, slug, className }) => (
  <div
    className={clsx(
      'mt-10 flex items-center justify-between border-t border-gray-new-90 pt-5 dark:border-gray-new-20 sm:flex-col sm:space-y-4',
      className
    )}
  >
    {updatedOn && <LastUpdatedDate updatedOn={updatedOn} />}
    <Feedback slug={slug} />
  </div>
);

DocFooter.propTypes = {
  updatedOn: PropTypes.string,
  slug: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default DocFooter;
