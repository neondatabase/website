'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { aiChatSettings, getInkeepBaseSettings } from 'lib/inkeep-settings';
import sendGtagEvent from 'utils/send-gtag-event';

import InkeepAIButton from './inkeep-ai-button';
import InkeepSearch from './inkeep-search';
import SiteSearchModal from './site-search-modal';

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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInkeepEvent = (event) => {
    const { eventName } = event;

    if (eventName === 'user_message_submitted') {
      const payload = latestInputMessageRef.current ? { text: latestInputMessageRef.current } : {};
      sendGtagEvent('AI Chat Message Submitted', payload);
      latestInputMessageRef.current = '';
    }
  };

  const baseSettings = getInkeepBaseSettings({
    onEvent: handleInkeepEvent,
    themeMode,
  });

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
      <SiteSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {isChatOpen && <InkeepModalChat {...chatModalProps} />}
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
