'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import GitHubIcon from 'icons/github.inline.svg';

const formatStars = (starsCount) => {
  const fixedThousands = (starsCount / 1000).toFixed(1);
  if (fixedThousands.endsWith('.0')) {
    return `${fixedThousands.replace('.0', '')}k`;
  }

  return `${fixedThousands}k`;
};

const GitHubStarCounter = ({ className = '', isDarkTheme = false, starsCount, tagName }) => (
  <Link
    className={clsx(
      'flex items-center gap-x-1.5 text-sm leading-none tracking-extra-tight transition-colors duration-200',
      className,
      isDarkTheme
        ? 'text-gray-new-90 hover:text-green-45'
        : 'text-gray-new-8 hover:text-green-45 dark:text-gray-new-90 dark:hover:text-green-45'
    )}
    to={LINKS.github}
    target="_blank"
    rel="noopener noreferrer"
    tagName={tagName}
    tagText="GitHub"
  >
    <GitHubIcon width={18} height={18} />
    <span className="whitespace-nowrap" aria-label={`Star us on GitHub (${starsCount})`}>
      {formatStars(starsCount)}
    </span>
  </Link>
);

export default GitHubStarCounter;

GitHubStarCounter.propTypes = {
  className: PropTypes.string,
  isDarkTheme: PropTypes.bool,
  starsCount: PropTypes.number.isRequired,
  tagName: PropTypes.string,
};
