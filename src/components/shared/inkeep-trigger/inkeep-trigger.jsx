'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { FAQS_BASE_PATH } from 'constants/faqs';
import { GUIDES_BASE_PATH } from 'constants/guides';
import { aiChatSettings, getInkeepBaseSettings } from 'lib/inkeep-settings';
import sendGtagEvent from 'utils/send-gtag-event';
import { SITE_SEARCH_CATEGORIES } from 'utils/site-search-request';

import InkeepAIButton from './inkeep-ai-button';
import InkeepSearch from './inkeep-search';
import SiteSearchModal from './site-search-modal';

const InkeepModalChat = dynamic(
  () => import('@inkeep/cxkit-react').then((mod) => mod.InkeepModalChat),
  { ssr: false }
);

// Each section searches its own content by default; the modal's filter widens it.
const SECTION_CATEGORIES = {
  postgres: ['postgresql'],
};
const DOCS_CATEGORIES = ['docs', 'api'];
// Offered as a filter only on that section's own pages.
const SECTION_ONLY_FILTERS = { guides: GUIDES_BASE_PATH, faqs: FAQS_BASE_PATH };

const isInSection = (pathname, basePath) =>
  pathname === basePath.slice(0, -1) || pathname.startsWith(basePath);

const filtersFor = (pathname) =>
  SITE_SEARCH_CATEGORIES.filter(
    ({ id }) => !SECTION_ONLY_FILTERS[id] || isInSection(pathname, SECTION_ONLY_FILTERS[id])
  );

const InkeepTrigger = ({
  className = null,
  isNotFoundPage = false,
  isDocsHeader = false,
  docPageType = null,
}) => {
  const pathname = usePathname();
  const isGuidePage = isInSection(pathname, GUIDES_BASE_PATH);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [sharedChatId, setSharedChatId] = useState(null);
  const latestInputMessageRef = useRef('');
  const pendingAskRef = useRef('');

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
      if (event.defaultPrevented) return;
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
      onOpenChange: (open) => {
        if (!open) pendingAskRef.current = '';
        setIsChatOpen(open);
      },
    },
    aiChatSettings: {
      ...aiChatSettings,
      onInputMessageChange: (message) => {
        latestInputMessageRef.current = message;
      },
      chatFunctionsRef: (fns) => {
        if (!fns) return;
        const pending = pendingAskRef.current;
        if (pending === '') return;
        pendingAskRef.current = '';
        fns.submitMessage(pending);
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
        isDocsHeader={isDocsHeader}
      />
      {!isNotFoundPage && (
        <InkeepAIButton
          className="shrink-0"
          handleClick={() => setIsChatOpen(true)}
          isDocsHeader={isDocsHeader}
        />
      )}
      <SiteSearchModal
        isOpen={isSearchOpen}
        defaultCategories={isGuidePage ? [] : (SECTION_CATEGORIES[docPageType] ?? DOCS_CATEGORIES)}
        categoryOptions={filtersFor(pathname)}
        onClose={() => setIsSearchOpen(false)}
        onAskAi={
          isNotFoundPage
            ? undefined
            : (askQuery) => {
                pendingAskRef.current = askQuery;
                setIsSearchOpen(false);
                setIsChatOpen(true);
              }
        }
      />
      {isChatOpen && <InkeepModalChat {...chatModalProps} />}
    </div>
  );
};

InkeepTrigger.propTypes = {
  className: PropTypes.string,
  topOffset: PropTypes.number,
  isNotFoundPage: PropTypes.bool,
  isDocsHeader: PropTypes.bool,
  docPageType: PropTypes.string,
};

export default InkeepTrigger;
