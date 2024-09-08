'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import { aiChatSettings, baseSettings, searchSettings } from 'lib/inkeep-settings';

import InkeepAIButton from '../inkeep-ai-button';
import InkeepSearch from '../inkeep-search';

const InkeepCustomTrigger = dynamic(
  () => import('@inkeep/uikit').then((mod) => mod.InkeepCustomTrigger),
  { ssr: false }
);

const InkeepTrigger = ({
  className = null,
  isNotFoundPage = false,
  isDarkTheme = false,
  topOffset,
  showAIButton = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [defaultModalView, setDefaultModalView] = useState('SEARCH');

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  let themeMode;
  switch (true) {
    case isDarkTheme:
      themeMode = 'dark';
      break;
    case theme === 'system':
      themeMode = systemTheme;
      break;
    default:
      themeMode = theme;
  }

  const handleKeyDown = (event) => {
    if (event.key === 'k' && event.metaKey) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      defaultView: defaultModalView,
      askAILabel: 'Ask Neon AI',
    },
    searchSettings,
    aiChatSettings,
  };

  const handleClick = (type) => {
    setDefaultModalView(type);
    setIsOpen(!isOpen);
  };

  return (
    <>
      <InkeepSearch
        className={clsx('lg:w-auto', className)}
        handleClick={handleClick}
        isNotFoundPage={isNotFoundPage}
      />
      {showAIButton && <InkeepAIButton handleClick={handleClick} topOffset={topOffset} />}
      <InkeepCustomTrigger {...inkeepCustomTriggerProps} />
    </>
  );
};

InkeepTrigger.propTypes = {
  className: PropTypes.string,
  topOffset: PropTypes.number,
  showAIButton: PropTypes.bool,
  isNotFoundPage: PropTypes.bool,
  isDarkTheme: PropTypes.bool,
};

export default InkeepTrigger;
