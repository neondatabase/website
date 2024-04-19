'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import GitHubIcon from 'icons/github.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';

const API_URL = 'https://api.github.com/repos/neondatabase/neon';
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const formatStars = (starsCount) => {
  if (!starsCount) return '...';

  const fixedThousands = (starsCount / 1000).toFixed(1);
  if (fixedThousands.endsWith('.0')) {
    return `${fixedThousands.replace('.0', '')}k`;
  }

  return `${fixedThousands}k`;
};

const GithubStarCounter = ({ className = '', isThemeBlack = false }) => {
  const [starsCount, setStarsCount] = useState(null);

  const fetchStarCount = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      const updatedStarsCount = json.stargazers_count;

      if (updatedStarsCount !== undefined) {
        window.localStorage.setItem('neon_github_stargazers_count', updatedStarsCount);
        const now = new Date().getTime();
        window.localStorage.setItem('neon_github_last_updated', now);
        setStarsCount(updatedStarsCount);
      } else {
        console.log('Unable to find stargazers_count in response:', json);
      }
    } catch (error) {
      console.error('Error fetching GitHub star count:', error);
    }
  };

  useEffect(() => {
    const lastUpdated = window.localStorage.getItem('neon_github_last_updated');
    const now = new Date().getTime();

    if (!lastUpdated || now - lastUpdated > ONE_DAY_IN_MS) {
      fetchStarCount();
    } else {
      const prevStarsCount = window.localStorage.getItem('neon_github_stargazers_count');
      setStarsCount(prevStarsCount);
    }
  }, []);

  return (
    <Link
      className={clsx(
        'flex items-center gap-x-1.5 text-[13px] leading-none tracking-extra-tight transition-colors duration-200',
        className,
        isThemeBlack
          ? 'text-white hover:text-green-45'
          : 'text-gray-new-8 hover:text-green-45 dark:text-white dark:hover:text-green-45'
      )}
      to={LINKS.github}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        sendGtagEvent('click_star_us_button');
      }}
    >
      <GitHubIcon width={20} height={20} />
      <span className="w-8 whitespace-nowrap">{formatStars(starsCount)}</span>
    </Link>
  );
};

export default GithubStarCounter;

GithubStarCounter.propTypes = {
  className: PropTypes.string,
  isThemeBlack: PropTypes.bool,
};
