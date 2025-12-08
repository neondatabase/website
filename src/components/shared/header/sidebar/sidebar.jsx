import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Suspense } from 'react';

import Button from 'components/shared/button';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import DiscordIcon from 'icons/discord.inline.svg';
import GitHubIcon from 'icons/github.inline.svg';
import { getGitHubStars } from 'utils/get-github-data';

const formatStars = (starsCount) => {
  const fixedThousands = (starsCount / 1000).toFixed(1);
  if (fixedThousands.endsWith('.0')) {
    return `${fixedThousands.replace('.0', '')}k`;
  }

  return `${fixedThousands}k`;
};

const GitHubStars = async () => {
  const starsCount = await getGitHubStars();
  return (
    <Suspense>
      <span className="whitespace-nowrap" aria-label={`Star us on GitHub (${starsCount})`}>
        {formatStars(starsCount)}
      </span>
    </Suspense>
  );
};

const Sidebar = ({ isClient, simpleMode, className }) => (
  <div
    className={clsx('flex items-center lg:hidden', simpleMode ? 'gap-x-2.5' : 'gap-x-6', className)}
  >
    <Link
      className={clsx(
        'group flex items-center gap-1.5 tracking-extra-tight transition-colors duration-200 ',
        simpleMode
          ? 'hover:border-black-new hover:text-black-new dark:text-gray-new-60 dark:hover:border-gray-new-40 dark:hover:text-white'
          : 'text-black-pure hover:text-gray-new-20 dark:text-white hover:dark:text-gray-new-70',
        {
          'size-8 justify-center rounded-full border border-gray-new-70 dark:border-gray-new-30':
            simpleMode,
        }
      )}
      to={LINKS.discord}
      target="_blank"
      rel="noopener noreferrer"
      tagName="Header"
    >
      <DiscordIcon
        width={18}
        height={18}
        className={clsx(
          !simpleMode &&
            'text-gray-new-10 transition-colors group-hover:text-gray-new-30 dark:text-gray-new-90 group-hover:dark:text-gray-new-80'
        )}
      />
      {!simpleMode && <span className="text-sm leading-none tracking-extra-tight">Discord</span>}
    </Link>
    {!isClient && (
      <Link
        className={clsx(
          'group flex items-center gap-1.5 text-[14px] tracking-extra-tight transition-colors duration-200',
          simpleMode
            ? 'hover:border-black-new hover:text-black-new dark:text-gray-new-60 dark:hover:border-gray-new-40 dark:hover:text-white'
            : 'text-black-pure hover:text-gray-new-20 dark:text-white hover:dark:text-gray-new-70',
          {
            'size-8 justify-center rounded-full border border-gray-new-70 dark:border-gray-new-30':
              simpleMode,
          }
        )}
        to={LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        tagName="Header"
        tagText="GitHub"
      >
        <GitHubIcon
          width={18}
          height={18}
          className={clsx(
            !simpleMode &&
              'text-gray-new-10 transition-colors group-hover:text-gray-new-30 dark:text-gray-new-90 group-hover:dark:text-gray-new-80'
          )}
        />
        {!simpleMode && <GitHubStars />}
      </Link>
    )}
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
