'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import GitHubIcon from 'icons/github.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';
import sendSegmentEvent from 'utils/send-segment-event';

const API_URL = 'https://api.github.com/repos/neondatabase/neon';

const GithubStarCounter = ({ className = '', isThemeBlack = false }) => {
  const [starsCount, setStarsCount] = useState(null);

  useEffect(() => {
    const prevStarsCount = window.localStorage.getItem('neon_github_stargazers_count');

    if (prevStarsCount) {
      setStarsCount(prevStarsCount);

      return;
    }

    async function getStarCount() {
      const updatedStarsCount = await fetch(API_URL)
        .then((res) => res.json())
        .then((json) => json.stargazers_count);

      window.localStorage.setItem('neon_github_stargazers_count', updatedStarsCount);

      setStarsCount(updatedStarsCount);
    }

    getStarCount();
  }, []);

  return (
    <Link
      className={clsx(
        'flex items-center gap-x-2.5 text-16 leading-none tracking-extra-tight transition-colors duration-200',
        className,
        isThemeBlack
          ? 'text-white hover:text-green-45'
          : 'text-gray-new-8 dark:text-white hover:text-green-45 dark:hover:text-green-45'
      )}
      to={LINKS.github}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        sendGtagEvent('click_star_us_button');
        sendSegmentEvent('click_star_us_button');
      }}
    >
      <GitHubIcon width={20} height={20} />
      <span className="w-10 whitespace-nowrap xl:hidden">
        {starsCount ? `${(starsCount / 1000).toFixed(1)}k` : '...'}
      </span>
    </Link>
  );
};

export default GithubStarCounter;

GithubStarCounter.propTypes = {
  className: PropTypes.string,
  isThemeBlack: PropTypes.bool,
};
