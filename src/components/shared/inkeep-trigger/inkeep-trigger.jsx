'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { aiChatSettings, getInkeepBaseSettings } from 'lib/inkeep-settings';
import sendGtagEvent from 'utils/send-gtag-event';

import InkeepAIButton from './inkeep-ai-button';
import InkeepSearch from './inkeep-search';

const InkeepModalSearch = dynamic(
  () => import('@inkeep/cxkit-react').then((mod) => mod.InkeepModalSearch),
  { ssr: false }
);

const InkeepModalChat = dynamic(
  () => import('@inkeep/cxkit-react').then((mod) => mod.InkeepModalChat),
  { ssr: false }
);

const InkeepTrigger = ({ className = null, isNotFoundPage = false }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [sharedChatId, setSharedChatId] = useState(null);
  const latestInputMessageRef = useRef('');

  // Check if URL contains chatId parameter and open AI chat modal automatically on doc pages
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chatId');

    if (chatId) {
      setSharedChatId(chatId);
      setIsChatOpen(true);
    }
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
      setIsSearchOpen(true);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInkeepEvent = (event) => {
    const { eventName, properties = {} } = event;

    if (eventName === 'user_message_submitted') {
      const payload = latestInputMessageRef.current ? { text: latestInputMessageRef.current } : {};
      sendGtagEvent('AI Chat Message Submitted', payload);
      latestInputMessageRef.current = '';
    }

    if (eventName === 'search_query_submitted') {
      sendGtagEvent('Search Query Submitted', { text: properties.searchQuery });
    }
  };

  const baseSettings = getInkeepBaseSettings({
    onEvent: handleInkeepEvent,
    themeMode,
  });

  const searchModalProps = {
    baseSettings,
    modalSettings: {
      isOpen: isSearchOpen,
      onOpenChange: setIsSearchOpen,
    },
  };

  const chatModalProps = {
    baseSettings,
    modalSettings: {
      isOpen: isChatOpen,
      onOpenChange: setIsChatOpen,
    },
    aiChatSettings: {
      ...aiChatSettings,
      onInputMessageChange: (message) => {
        latestInputMessageRef.current = message;
      },
      ...(sharedChatId && { chatId: sharedChatId }),
    },
  };

  return (
    <div className="flex items-center gap-x-2">
      <InkeepSearch
        className={className}
        handleClick={() => setIsSearchOpen(true)}
        isNotFoundPage={isNotFoundPage}
      />
      {!isNotFoundPage && (
        <InkeepAIButton className="shrink-0" handleClick={() => setIsChatOpen(true)} />
      )}
      <InkeepModalSearch {...searchModalProps} />
      <InkeepModalChat {...chatModalProps} />
    </div>
  );
};

InkeepTrigger.propTypes = {
  className: PropTypes.string,
  topOffset: PropTypes.number,
  isNotFoundPage: PropTypes.bool,
  docPageType: PropTypes.string,
};

export default InkeepTrigger;
