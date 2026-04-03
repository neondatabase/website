'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';

import Button from 'components/shared/button';
import { aiChatSettings, getInkeepBaseSettings } from 'lib/inkeep-settings';
import sendGtagEvent from 'utils/send-gtag-event';

const InkeepModalChat = dynamic(
  () => import('@inkeep/cxkit-react').then((mod) => mod.InkeepModalChat),
  { ssr: false }
);

const ButtonAiHelper = ({
  className,
  children,
  aiAssistantName = aiChatSettings.aiAssistantName,
  placeholder = aiChatSettings.placeholder,
  introMessage = aiChatSettings.introMessage,
  exampleQuestions = aiChatSettings.exampleQuestions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, systemTheme } = useTheme();
  const latestInputMessageRef = useRef('');

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
      aiAssistantName,
      placeholder,
      introMessage,
      exampleQuestions,
      onInputMessageChange: (message) => {
        latestInputMessageRef.current = message;
      },
    }),
    [aiAssistantName, placeholder, introMessage, exampleQuestions]
  );

  const handleInkeepEvent = (event) => {
    if (event.eventName !== 'user_message_submitted') return;

    const payload = latestInputMessageRef.current ? { text: latestInputMessageRef.current } : {};
    sendGtagEvent('AI Chat Message Submitted', payload);
    latestInputMessageRef.current = '';
  };

  const inkeepModalProps = {
    baseSettings: getInkeepBaseSettings({
      onEvent: handleInkeepEvent,
      themeMode,
    }),
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
  aiAssistantName: PropTypes.string,
  placeholder: PropTypes.string,
  introMessage: PropTypes.string,
  exampleQuestions: PropTypes.arrayOf(PropTypes.string),
};

export default ButtonAiHelper;
