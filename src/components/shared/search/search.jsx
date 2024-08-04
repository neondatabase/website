'use client';

import { DocSearchButton } from '@docsearch/react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import sendGtagEvent from 'utils/send-gtag-event';

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
};

const Search = ({ className = null, isBlog = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, systemTheme } = useTheme();

  const onOpen = useCallback(() => {
    setIsOpen(true);
    if (!isBlog) {
      sendGtagEvent('open_docs_search');
    }
  }, [isBlog]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const inkeepCustomTriggerProps = {
    isOpen,
    onClose,
    stylesheetUrls: ['/inkeep/css/inkeep-chat.css'],
    baseSettings: {
      ...baseSettings,
      colorMode: {
        forcedColorMode: theme === 'system' ? systemTheme : theme,
      },
    },
    modalSettings: {
      defaultView: 'SEARCH',
      // isModeSwitchingEnabled: false,
    },
    searchSettings: {
      searchMode: 'KEYWORD',
    },
  };

  return (
    <div className={clsx('relative flex items-center justify-between', className)}>
      <DocSearchButton aria-label="Open search with CTRL+K or Command+K" onClick={onOpen} />
      <InkeepCustomTrigger {...inkeepCustomTriggerProps} />
    </div>
  );
};

Search.propTypes = {
  className: PropTypes.string,
  isBlog: PropTypes.bool,
};

export default Search;
