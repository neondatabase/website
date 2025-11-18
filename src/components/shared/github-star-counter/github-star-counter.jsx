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

const GitHubStarCounter = ({ className = '', starsCount, tagName }) => (
  <Link
    className={clsx(
      'group flex items-center gap-x-1.5 text-sm leading-none tracking-extra-tight text-white transition-colors duration-200 hover:text-gray-new-70',
      className
    )}
    to={LINKS.github}
    target="_blank"
    rel="noopener noreferrer"
    tagName={tagName}
    tagText="GitHub"
  >
    <GitHubIcon
      width={18}
      height={18}
      className="text-gray-new-90 transition-colors group-hover:text-gray-new-80"
    />
    <span className="whitespace-nowrap" aria-label={`Star us on GitHub (${starsCount})`}>
      {formatStars(starsCount)}
    </span>
  </Link>
);

export default GitHubStarCounter;

GitHubStarCounter.propTypes = {
  className: PropTypes.string,
  starsCount: PropTypes.number.isRequired,
  tagName: PropTypes.string,
};
