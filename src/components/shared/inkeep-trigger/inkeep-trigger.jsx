'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import { aiChatSettings, baseSettings, searchSettings } from 'lib/inkeep-settings';

import InkeepAIButton from '../inkeep-ai-button';
import InkeepSearch from '../inkeep-search';

const InkeepCustomTrigger = dynamic(
  () => import('@inkeep/uikit').then((mod) => mod.InkeepCustomTrigger),
  { ssr: false }
);

const InkeepTrigger = ({ topOffset, isBlog = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [trigger, setTrigger] = useState('search');

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const themeMode = theme === 'system' ? systemTheme : theme;

  const inkeepCustomTriggerProps = {
    isOpen,
    onClose: handleClose,
    stylesheetUrls: ['/inkeep/css/inkeep-chat.css'],
    baseSettings: {
      ...baseSettings,
      colorMode: {
        forcedColorMode: themeMode,
      },
    },
    modalSettings: {
      defaultView: trigger === 'search' ? 'SEARCH' : 'AI_CHAT',
      askAILabel: 'Ask Neon AI',
    },
    searchSettings,
    aiChatSettings,
  };

  const handleClick = (type) => {
    setTrigger(type);
    setIsOpen(!isOpen);
  };

  return (
    <>
      <InkeepSearch
        className={clsx(
          'lg:w-auto',
          isBlog
            ? 'dark relative z-30 flex max-w-[152px] items-center justify-between lt:order-1 lt:w-full lg:hidden'
            : 'w-[272px]'
        )}
        handleClick={handleClick}
      />
      {!isBlog && <InkeepAIButton handleClick={handleClick} topOffset={topOffset} />}
      <InkeepCustomTrigger {...inkeepCustomTriggerProps} />
    </>
  );
};

InkeepTrigger.propTypes = {
  topOffset: PropTypes.number,
  isBlog: PropTypes.bool,
};

export default InkeepTrigger;
