'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import InkeepSearch from 'components/shared/inkeep-search';
import LINKS from 'constants/links';
import { baseSettings } from 'lib/inkeep-settings';

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
    },
    modalSettings: {
      defaultView: 'SEARCH',
      forceInitialDefaultView: true,
      isModeSwitchingEnabled: false,
    },
    searchSettings: {
      tabSettings: {
        tabOrderByLabel: pageType ? tabsOrder[pageType] : tabsOrder.default,
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
  docPageType: PropTypes.string,
};

export default InkeepTrigger;
