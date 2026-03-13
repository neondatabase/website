'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import LINKS from 'constants/links';
import { baseSettings, aiChatSettings } from 'lib/inkeep-settings';
import sendGtagEvent from 'utils/send-gtag-event';

import InkeepAIButton from './inkeep-ai-button';
import InkeepSearch from './inkeep-search';

const InkeepModalSearchAndChat = dynamic(
  () => import('@inkeep/cxkit-react').then((mod) => mod.InkeepModalSearchAndChat),
  { ssr: false }
);

const TAB_LABELS = ['Neon Docs', 'PostgreSQL Tutorial', 'Guides', 'Changelog', 'All'];

const PAGE_TYPE_TO_LABEL = {
  postgres: 'PostgreSQL Tutorial',
  guides: 'Guides',
  changelog: 'Changelog',
};

const getTabsOrder = (pageType) => {
  if (!pageType || !PAGE_TYPE_TO_LABEL[pageType]) {
    return TAB_LABELS;
  }

  const priorityTab = TAB_LABELS[pageType];
  return [priorityTab, ...TAB_LABELS.filter((tab) => tab !== priorityTab)];
};

const modalViews = {
  SEARCH: 'search',
  AI_CHAT: 'chat',
};

/*
 * docPageType prop only for pages with separate layouts (e.g., /postgresql).
 * for shared layouts (docs/guides/changelog), useEffect determines type from pathname
 */
const InkeepTrigger = ({ className = null, isNotFoundPage = false, docPageType = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [defaultModalView, setDefaultModalView] = useState(modalViews.SEARCH);
  const pathname = usePathname();
  const [pageType, setPageType] = useState(docPageType);
  const [sharedChatId, setSharedChatId] = useState(null);

  // Check if URL contains chatId parameter and open AI chat modal automatically on doc pages
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chatId');

    if (chatId) {
      setSharedChatId(chatId);
      setDefaultModalView(modalViews.AI_CHAT);
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith(LINKS.guides)) {
      setPageType('guides');
      return;
    }

    if (pathname === LINKS.changelog) {
      setPageType('changelog');
    }
  }, [pathname]);

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

  const inkeepModalProps = {
    baseSettings: {
      ...baseSettings,
      colorMode: {
        forcedColorMode: themeMode,
      },
      theme: {
        stylesheetUrls: ['/inkeep/css/base.css', '/inkeep/css/modal.css', '/inkeep/css/chat.css'],
        components: {
          AIChatPageWrapper: {
            defaultProps: {
              size: 'expand',
              variant: 'no-shadow',
            },
          },
        },
        tokens: {
          colors: {
            'grayDark.900': '#09090B',
          },
        },
      },
      optOutFunctionalCookies: true,
      logEventCallback: (event) => {
        const { eventName, properties } = event;
        if (eventName === 'chat_message_submitted') {
          sendGtagEvent('AI Chat Message Submitted', { text: properties.content });
        }
        if (eventName === 'search_query_submitted') {
          sendGtagEvent('Search Query Submitted', { text: properties.query });
        }
      },
    },
    modalSettings: {
      isOpen,
      onOpenChange: setIsOpen,
    },
    searchSettings: {
      tabSettings: {
        tabOrderByLabel: getTabsOrder(pageType),
      },
    },
    aiChatSettings: {
      ...aiChatSettings,
      ...(sharedChatId && { chatId: sharedChatId }),
    },
    defaultView: defaultModalView,
    forceDefaultView: true,
    canToggleView: false,
  };

  const handleClick = (type) => {
    setDefaultModalView(type);
    setIsOpen(true);
  };

  return (
    <div className="flex items-center gap-x-2">
      <InkeepSearch
        className={className}
        handleClick={() => handleClick(modalViews.SEARCH)}
        isNotFoundPage={isNotFoundPage}
      />
      {!isNotFoundPage && (
        <InkeepAIButton className="shrink-0" handleClick={() => handleClick(modalViews.AI_CHAT)} />
      )}
      <InkeepModalSearchAndChat {...inkeepModalProps} />
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
