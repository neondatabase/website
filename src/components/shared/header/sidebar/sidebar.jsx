import clsx from 'clsx';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import DiscordIcon from 'icons/discord.inline.svg';

const themePropTypes = {
  isDarkTheme: PropTypes.bool,
};

const DiscordLink = ({ isDarkTheme }) => (
  <Link
    className={clsx(
      'transition-colors duration-200',
      isDarkTheme
        ? 'text-white hover:text-green-45'
        : 'text-gray-new-40 hover:text-green-45 dark:text-white dark:hover:text-green-45'
    )}
    to={LINKS.discord}
    target="_blank"
    rel="noopener noreferrer"
  >
    <DiscordIcon width={20} height={20} />
    <span className="sr-only">Discord</span>
  </Link>
);

DiscordLink.propTypes = themePropTypes;

const Sidebar = ({ isDarkTheme }) => (
  <div className="flex items-center gap-x-6 lg:hidden">
    <DiscordLink isDarkTheme={isDarkTheme} />
    <Link
      className="whitespace-nowrap text-[13px] leading-none tracking-extra-tight lg:hidden"
      to={LINKS.login}
      theme={isDarkTheme ? 'white' : 'black'}
    >
      Log In
    </Link>

    <Button
      className="h-8 whitespace-nowrap px-6 text-[13px] font-semibold leading-none tracking-extra-tight transition-colors duration-200 lg:hidden"
      to={LINKS.signup}
      theme="primary"
      tagName="Header"
      analyticsEvent="header_sign_up_clicked"
    >
      Sign Up
    </Button>
  </div>
);

Sidebar.propTypes = {
  ...themePropTypes,
  isClient: PropTypes.bool,
};

export default Sidebar;
