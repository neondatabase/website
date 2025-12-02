import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Suspense } from 'react';

import Button from 'components/shared/button';
import GitHubStarCounter from 'components/shared/github-star-counter';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import DiscordIcon from 'icons/discord.inline.svg';
import { getGitHubStars } from 'utils/get-github-data';

const GitHubStars = async () => {
  const starsCount = await getGitHubStars();
  return (
    <Suspense>
      <GitHubStarCounter starsCount={starsCount} tagName="Header" />
    </Suspense>
  );
};

const Sidebar = ({ isClient, simpleMode, className }) => (
  <div
    className={clsx('flex items-center lg:hidden', simpleMode ? 'gap-x-2.5' : 'gap-x-6', className)}
  >
    <Link
      className="group flex items-center gap-1.5 tracking-extra-tight text-black-pure transition-colors duration-200 hover:text-gray-new-20 dark:text-white hover:dark:text-gray-new-70"
      to={LINKS.discord}
      target="_blank"
      rel="noopener noreferrer"
      tagName="Header"
    >
      <DiscordIcon
        width={18}
        height={18}
        className="text-gray-new-10 transition-colors group-hover:text-gray-new-30 dark:text-gray-new-90 group-hover:dark:text-gray-new-80"
      />
      <span className="text-sm leading-none tracking-extra-tight">Discord</span>
    </Link>
    {!isClient && <GitHubStars />}
    <div className="flex gap-2.5 lg:hidden">
      <Button
        className="h-9 px-[18px]"
        to={LINKS.signup}
        theme="white-filled-multi"
        size="xxs"
        tagName="Header"
        analyticsEvent="header_sign_up_clicked"
      >
        Sign Up
      </Button>
      <Button
        className="h-9 px-[18px]"
        to={LINKS.login}
        theme="transparent"
        size="xxs"
        tagName="Header"
        analyticsEvent="header_log_in_clicked"
      >
        Log In
      </Button>
    </div>
  </div>
);
Sidebar.propTypes = {
  isClient: PropTypes.bool,
  simpleMode: PropTypes.bool,
  className: PropTypes.string,
};

export default Sidebar;
