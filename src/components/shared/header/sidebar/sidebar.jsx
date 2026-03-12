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

const SOCIALS = [
  {
    id: 'discord',
    to: LINKS.discord,
    icon: DiscordIcon,
    label: 'Discord',
  },
  {
    id: 'github',
    to: LINKS.github,
    icon: GitHubIcon,
    hasStars: true,
  },
];

const Sidebar = ({ isClient, isDocs, className }) => (
  <div className={clsx('flex items-center lg:hidden', isDocs ? 'gap-x-6' : 'gap-x-8', className)}>
    <div className={clsx('flex items-center', isDocs ? 'gap-x-4' : 'gap-x-6')}>
      {SOCIALS.map(({ id, to, icon: Icon, label, hasStars }) => (
        <Link
          className={clsx(
            'group flex items-center gap-1.5 tracking-extra-tight transition-colors duration-200',
            isDocs && 'size-8 justify-center border border-gray-new-60 dark:border-gray-new-40',
            isDocs
              ? 'rounded-full text-gray-new-10 hover:border-black-new hover:text-black-new dark:text-gray-new-90 dark:hover:border-gray-new-40 dark:hover:text-white'
              : 'rounded-sm text-white hover:text-gray-new-70'
          )}
          key={id}
          to={to}
          target="_blank"
          rel="noopener noreferrer"
          tagName="Header"
        >
          <Icon
            width={18}
            height={18}
            className={clsx(
              !isDocs && 'text-gray-new-90 transition-colors group-hover:text-gray-new-80'
            )}
          />
          {!isDocs && (
            <span className="text-sm leading-none tracking-extra-tight">
              {label}
              {hasStars && !isClient && <GitHubStars />}
            </span>
          )}
        </Link>
      ))}
    </div>
    <div className={clsx('flex', isDocs ? 'gap-x-2' : 'gap-x-3.5')}>
      <Button
        className="h-9 px-[18px]"
        to={LINKS.login}
        theme="outlined"
        size="xxs"
        tagName="Header"
      >
        Log in
      </Button>
      <Button
        className="h-9 px-[18px]"
        to={LINKS.signup}
        theme="white-filled-multi"
        size="xxs"
        tagName="Header"
      >
        Sign up
      </Button>
    </div>
  </div>
);

Sidebar.propTypes = {
  isClient: PropTypes.bool,
  isDocs: PropTypes.bool,
  className: PropTypes.string,
};

export default Sidebar;
