import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { cn } from 'utils/cn';

import Feedback from './feedback';
import LastUpdatedDate from './last-updated-date';

const DocFooter = ({ updatedOn, slug, className, withFeedback = true, tocLink = null }) => (
  <div
    className={cn(
      'mt-[76px] flex items-center justify-between pt-3 sm:flex-col sm:space-y-4',
      className
    )}
  >
    {tocLink && (
      <Link
        className="text-sm leading-snug text-gray-new-80 transition-colors duration-200 hover:text-white"
        to={tocLink}
      >
        Start from the beginning
      </Link>
    )}
    <div
      className={cn(
        'flex items-center justify-between gap-6 sm:flex-col sm:items-start sm:gap-4',
        !tocLink && 'w-full'
      )}
    >
      {updatedOn && <LastUpdatedDate updatedOn={updatedOn} />}
      {withFeedback && <Feedback slug={slug} />}
    </div>
  </div>
);

DocFooter.propTypes = {
  updatedOn: PropTypes.string,
  slug: PropTypes.string.isRequired,
  className: PropTypes.string,
  withFeedback: PropTypes.bool,
  tocLink: PropTypes.string,
};

export default DocFooter;
