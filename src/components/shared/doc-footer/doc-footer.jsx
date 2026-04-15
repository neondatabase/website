import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import GitHubIcon from 'icons/github.inline.svg';
import { cn } from 'utils/cn';

import Feedback from './feedback';
import LastUpdatedDate from './last-updated-date';

const DocFooter = ({
  updatedOn,
  slug,
  className,
  withFeedback = true,
  tocLink = null,
  gitHubPath = null,
}) => (
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
        gitHubPath && !updatedOn && 'sm:flex-row sm:items-end sm:gap-3',
        !tocLink && 'w-full'
      )}
    >
      {updatedOn && <LastUpdatedDate updatedOn={updatedOn} />}
      {withFeedback && <Feedback slug={slug} />}
      {gitHubPath && !updatedOn && (
        <Link
          to={`${process.env.NEXT_PUBLIC_GITHUB_PATH}${gitHubPath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 items-center justify-center gap-x-2 border border-gray-new-80 px-3 text-gray-new-30 transition-colors duration-200 hover:bg-gray-new-98 dark:border-gray-new-20 dark:text-gray-new-85 dark:hover:bg-gray-new-8"
        >
          <GitHubIcon className="size-4" />
          <span className="text-sm leading-snug">Edit on GitHub</span>
        </Link>
      )}
    </div>
  </div>
);

DocFooter.propTypes = {
  updatedOn: PropTypes.string,
  slug: PropTypes.string.isRequired,
  className: PropTypes.string,
  withFeedback: PropTypes.bool,
  tocLink: PropTypes.string,
  gitHubPath: PropTypes.string,
};

export default DocFooter;
