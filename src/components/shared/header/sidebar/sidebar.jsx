import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Suspense } from 'react';

import Button from 'components/shared/button';
import GitHubStarCounter from 'components/shared/github-star-counter';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import DiscordIcon from 'icons/discord.inline.svg';
import { getGitHubStars } from 'utils/get-github-data';

const themePropTypes = {
  isDarkTheme: PropTypes.bool,
};

const GitHubStars = async ({ isDarkTheme }) => {
  const starsCount = await getGitHubStars();
  return (
    <Suspense>
      <GitHubStarCounter isDarkTheme={isDarkTheme} starsCount={starsCount} tagName="Header" />
    </Suspense>
  );
};

GitHubStars.propTypes = themePropTypes;

const Sidebar = ({ isDarkTheme, isClient, className }) => (
  <div className={clsx('flex items-center gap-x-6 lg:hidden', className)}>
    <Link
      className={clsx(
        'flex items-center gap-1.5 transition-colors duration-200',
        isDarkTheme
          ? 'text-gray-new-90 hover:text-green-45'
          : 'text-gray-new-8 hover:text-green-45 dark:text-gray-new-90 dark:hover:text-green-45'
      )}
      to={LINKS.discord}
      target="_blank"
      rel="noopener noreferrer"
      tagName="Header"
    >
      <DiscordIcon width={18} height={18} />
      <span className="text-sm leading-none tracking-extra-tight">Discord</span>
    </Link>
    {!isClient && <GitHubStars isDarkTheme={isDarkTheme} />}
    <div className="flex gap-2.5 lg:hidden">
      <Button
        className={clsx(
          'px-4.5 whitespace-nowrap border font-semibold',
          isDarkTheme
            ? 'border-gray-new-30 text-white hover:border-gray-new-40'
            : 'border-gray-new-70 hover:border-gray-new-50 dark:border-gray-new-30 dark:hover:border-gray-new-40'
        )}
        to={LINKS.login}
        size="xxs"
        tagName="Header"
        analyticsEvent="header_sign_up_clicked"
      >
        Log In
      </Button>
      <Button
        className="px-4.5 whitespace-nowrap font-semibold"
        to={LINKS.signup}
        theme="primary"
        size="xxs"
        tagName="Header"
        analyticsEvent="header_sign_up_clicked"
      >
        Sign Up
      </Button>
    </div>
  </div>
);

Sidebar.propTypes = {
  ...themePropTypes,
  isClient: PropTypes.bool,
  className: PropTypes.string,
};

export default Sidebar;
