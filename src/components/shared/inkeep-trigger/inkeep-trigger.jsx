'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import { baseSettings } from 'lib/inkeep-settings';

import InkeepSearch from '../inkeep-search';

const InkeepCustomTrigger = dynamic(
  () => import('@inkeep/uikit').then((mod) => mod.InkeepCustomTrigger),
  { ssr: false }
);

const InkeepTrigger = ({
  className = null,
  isNotFoundPage = false,
  isDarkTheme = false,
  isPostgresPage = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, systemTheme } = useTheme();

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
    baseSettings: {
      ...baseSettings,
      colorMode: {
        forcedColorMode: themeMode,
      },
      theme: {
        stylesheetUrls: ['/inkeep/css/base.css', '/inkeep/css/modal.css'],
      },
      optOutFunctionalCookies: true,
    },
    modalSettings: {
      defaultView: 'SEARCH',
      forceInitialDefaultView: true,
      isModeSwitchingEnabled: true,
    },
    searchSettings: {
      tabSettings: {
        tabOrderByLabel: isPostgresPage
          ? ['PostgreSQL Tutorial', 'Neon Docs', 'All']
          : ['Neon Docs', 'PostgreSQL Tutorial', 'All'],
      },
    },
  };

  return (
    <>
      <InkeepSearch
        className={clsx('lg:w-auto', className)}
        handleClick={() => setIsOpen(!isOpen)}
        isNotFoundPage={isNotFoundPage}
      />
      <InkeepCustomTrigger {...inkeepCustomTriggerProps} />
    </>
  );
};

InkeepTrigger.propTypes = {
  className: PropTypes.string,
  topOffset: PropTypes.number,
  isNotFoundPage: PropTypes.bool,
  isDarkTheme: PropTypes.bool,
  isPostgresPage: PropTypes.bool,
};

export default InkeepTrigger;
