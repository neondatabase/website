'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import closeIcon from './images/close.svg';
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
  botName: 'Neon AI',
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

const InkeepTrigger = ({ className }) => {
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
          'sm:absolute sm:right-2 sm:top-1.5 sm:items-center sm:space-x-1 sm:text-secondary-8 sm:dark:text-green-45',
          className
        )}
        type="button"
        aria-label="Open Neon AI"
        onClick={handleClick}
      >
        <SparksIcon className="relative z-10 h-3.5 w-3.5" />
        <div>
          <span className="block border-b border-secondary-8/50 text-[11px] font-medium leading-tight transition-colors duration-200 group-hover:border-transparent dark:border-green-45/50 lg:text-[13px]">
            <span className="block">Ask Neon AI</span>
            <span className="hidden text-gray-new-20 dark:text-gray-new-90 " aria-hidden>
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
};

export default InkeepTrigger;
