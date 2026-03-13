'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import Button from 'components/shared/button';
import { baseSettings, aiChatSettings } from 'lib/inkeep-settings';
import sendGtagEvent from 'utils/send-gtag-event';

const InkeepModalChat = dynamic(
  () => import('@inkeep/cxkit-react').then((mod) => mod.InkeepModalChat),
  { ssr: false }
);

const ButtonAiHelper = ({
  className,
  children,
  botName = aiChatSettings.botName,
  placeholder = aiChatSettings.placeholder,
  introMessage = aiChatSettings.introMessage,
  quickQuestions = aiChatSettings.quickQuestions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, systemTheme } = useTheme();

  let themeMode;
  switch (true) {
    case theme === 'system':
      themeMode = systemTheme;
      break;
    default:
      themeMode = theme;
  }

  const handleButtonClick = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const customAiChatSettings = useMemo(
    () => ({
      ...aiChatSettings,
      botName,
      placeholder,
      introMessage,
      quickQuestions,
    }),
    [botName, placeholder, introMessage, quickQuestions]
  );

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
      },
    },
    modalSettings: {
      isOpen,
      onOpenChange: setIsOpen,
    },
    aiChatSettings: customAiChatSettings,
  };

  return (
    <>
      <Button className={className} theme="white-filled" size="new" onClick={handleButtonClick}>
        {children}
      </Button>
      <InkeepModalChat {...inkeepModalProps} />
    </>
  );
};

ButtonAiHelper.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  botName: PropTypes.string,
  placeholder: PropTypes.string,
  introMessage: PropTypes.string,
  quickQuestions: PropTypes.arrayOf(PropTypes.string),
};

export default ButtonAiHelper;
