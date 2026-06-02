import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import DiscordIcon from 'icons/chat-options/discord.inline.svg';
import GitHubIcon from 'icons/chat-options/github.inline.svg';
import VSCodeIcon from 'icons/chat-options/vscode.inline.svg';
import { cn } from 'utils/cn';

const ITEMS = [
  {
    title: 'GitHub Copilot',
    icon: GitHubIcon,
    link: LINKS.githubCopilot,
    isExternal: true,
  },
  {
    title: 'VS Code',
    icon: VSCodeIcon,
    link: LINKS.vscodeCopilot,
    isExternal: true,
  },
  {
    title: 'Discord',
    icon: DiscordIcon,
    link: LINKS.discordCopilot,
    isExternal: true,
  },
];

const themeClassNames = {
  sidebar: {
    title: 'mb-4 text-sm font-semibold leading-tight tracking-extra-tight',
    list: 'flex flex-wrap gap-2',
    item: 'block',
  },
  default: {
    block: 'mt-12 hidden xl:block',
    title: 'w-fit',
    list: 'not-prose mt-7! grid list-none grid-cols-4 gap-x-4 gap-y-5 p-0! md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1',
    item: 'flex items-center gap-3 w-fit',
  },
};

const ChatOptions = ({ isSidebar = false }) => {
  const TitleTag = isSidebar ? 'h3' : 'h2';
  const theme = isSidebar ? 'sidebar' : 'default';
  const classNames = themeClassNames[theme];

  return (
    <div className={classNames.block}>
      <TitleTag className={classNames.title}>Neon AI chat assistants</TitleTag>
      <ul className={classNames.list}>
        {ITEMS.map(({ title, icon, link, isExternal, className }) => {
          const Icon = icon;

          return (
            <li className={cn('m-0! before:hidden', className)} key={link}>
              <Link
                className={cn('group', classNames.item)}
                to={link}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
              >
                <div
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-lg border',
                    'transition-colors duration-200',
                    'border-gray-new-90 text-gray-new-50 group-hover:border-gray-new-80 group-hover:bg-gray-new-98',
                    'dark:border-gray-new-15 dark:text-gray-new-60 dark:group-hover:border-gray-new-20 dark:group-hover:bg-gray-new-8'
                  )}
                >
                  <Icon width={18} height={18} />
                </div>
                <p
                  className={
                    isSidebar ? 'sr-only' : 'leading-tight tracking-extra-tight whitespace-nowrap'
                  }
                >
                  {title}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ChatOptions.propTypes = {
  isSidebar: PropTypes.bool,
};

export default ChatOptions;
