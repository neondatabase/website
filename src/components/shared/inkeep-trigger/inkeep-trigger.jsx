'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import LINKS from 'constants/links';
import { baseSettings, aiChatSettings } from 'lib/inkeep-settings';
import sendGtagEvent from 'utils/send-gtag-event';

import InkeepAIButton from './inkeep-ai-button';
import InkeepSearch from './inkeep-search';

const InkeepCustomTrigger = dynamic(
  () => import('@inkeep/uikit').then((mod) => mod.InkeepCustomTrigger),
  { ssr: false }
);

const tabsOrder = {
  default: ['Neon Docs', 'PostgreSQL Tutorial', 'Changelog', 'All'],
  postgres: ['PostgreSQL Tutorial', 'Neon Docs', 'Changelog', 'All'],
  changelog: ['Changelog', 'Neon Docs', 'PostgreSQL Tutorial', 'All'],
};

const InkeepTrigger = ({ className = null, isNotFoundPage = false, docPageType = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [defaultModalView, setDefaultModalView] = useState('SEARCH');
  const pathname = usePathname();
  const [pageType, setPageType] = useState(docPageType);

  useEffect(() => {
    if (pathname === LINKS.changelog) {
      setPageType('changelog');
    }
  }, [pathname]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  let themeMode;
  switch (true) {
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
      logEventCallback: (event) => {
        const { eventName, properties } = event;
        if (eventName === 'search_query_submitted') {
          sendGtagEvent('Search Query Submitted', { text: properties.query });
        }
      },
    },
    modalSettings: {
      defaultView: defaultModalView,
      forceInitialDefaultView: true,
      isModeSwitchingEnabled: true,
      askAILabel: 'Ask AI',
    },
    searchSettings: {
      tabSettings: {
        tabOrderByLabel: pageType ? tabsOrder[pageType] : tabsOrder.default,
      },
    },
    aiChatSettings,
  };

  const handleClick = (type) => {
    setDefaultModalView(type);
    setIsOpen(!isOpen);
  };

  return (
    <>
      <InkeepSearch
        className={className}
        handleClick={() => handleClick('SEARCH')}
        isNotFoundPage={isNotFoundPage}
      />
      <InkeepAIButton handleClick={handleClick} />
      <InkeepCustomTrigger {...inkeepCustomTriggerProps} />
    </>
  );
};

InkeepTrigger.propTypes = {
  className: PropTypes.string,
  topOffset: PropTypes.number,
  isNotFoundPage: PropTypes.bool,
  docPageType: PropTypes.string,
};

export default InkeepTrigger;
