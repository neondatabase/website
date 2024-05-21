'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import closeIcon from './images/close.svg';
import ExampleIcon from './images/example.inline.svg';
import SparksIcon from './images/sparks.inline.svg';

const InkeepCustomTrigger = dynamic(
  () => import('@inkeep/widgets').then((mod) => mod.InkeepCustomTrigger),
  { ssr: false }
);

const baseSettings = {
  apiKey: process.env.INKEEP_INTEGRATION_API_KEY,
  integrationId: process.env.INKEEP_INTEGRATION_ID,
  organizationId: process.env.INKEEP_ORGANIZATION_ID,
  primaryBrandColor: '#00E599',
  organizationDisplayName: 'Neon',
  customIcons: {
    close: { custom: closeIcon },
  },
};

const aiChatSettings = {
  placeholder: 'How can I help you?',
  quickQuestionsLabel: 'Examples',
  quickQuestions: [
    'What’s Neon?',
    'How do I sign up for Neon?',
    'How to create a project?',
    'How to get started with the Neon API?',
  ],
  botAvatarSrcUrl: '/inkeep/images/example.svg',
  botAvatarDarkSrcUrl: '/inkeep/images/example.svg',
  userAvatarSrcUrl: '/inkeep/images/user.svg',
};

const InkeepTrigger = ({ className, isSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, systemTheme } = useTheme();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const inkeepCustomTriggerProps = {
    isOpen,
    onClose: handleClose,
    stylesheetUrls: ['/inkeep/css/inkeep-chat.css'],
    baseSettings: {
      ...baseSettings,
      colorMode: {
        forcedColorMode: theme === 'system' ? systemTheme : theme,
      },
    },
    aiChatSettings,
    modalSettings: {
      defaultView: 'AI_CHAT',
    },
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={clsx(
          'chat-widget group flex text-sm focus:outline-none',
          isSidebar
            ? 'absolute right-2 top-1.5 items-center space-x-1 text-secondary-8 dark:text-green-45 lg:right-4 lg:top-3'
            : 'w-full flex-col xl:flex-row xl:items-center xl:space-x-1.5',
          className
        )}
        type="button"
        aria-label="Open Neon AI"
        onClick={handleClick}
      >
        {isSidebar ? (
          <SparksIcon className="relative z-10 h-3.5 w-3.5" />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#00CC88] dark:bg-[rgba(0,229,153,0.1)] xl:h-6 xl:w-6 xl:shrink-0 xl:rounded">
            <ExampleIcon className="h-[26px] w-[26px] text-white dark:text-green-45 xl:h-4 xl:w-4" />
          </span>
        )}
        <div
          className={clsx(
            !isSidebar &&
              'mt-2.5 flex min-h-[22px] w-full items-center justify-between xl:mt-0 lg:w-auto'
          )}
        >
          <span
            className={clsx(
              'block',
              isSidebar
                ? 'border-b border-secondary-8/50 text-[11px] font-medium leading-tight transition-colors duration-200 group-hover:border-transparent dark:border-green-45/50'
                : 'font-semibold'
            )}
          >
            <span
              className={clsx('block', {
                'lg:hidden': !isSidebar,
              })}
            >
              Ask Neon AI
            </span>
            <span
              className={clsx('hidden text-gray-new-20 dark:text-gray-new-90 ', {
                'lg:inline': !isSidebar,
              })}
              aria-hidden
            >
              Ask Neon AI instead
            </span>
          </span>
        </div>
      </button>
      <InkeepCustomTrigger {...inkeepCustomTriggerProps} />
    </>
  );
};

InkeepTrigger.propTypes = {
  className: PropTypes.string,
  isSidebar: PropTypes.bool,
};

export default InkeepTrigger;
