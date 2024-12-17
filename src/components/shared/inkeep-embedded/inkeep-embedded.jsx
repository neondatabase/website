'use client';

import { InkeepEmbeddedChat } from '@inkeep/uikit';
import { useTheme } from 'next-themes';
import { PropTypes } from 'prop-types';

import { aiChatSettings, baseSettings } from 'lib/inkeep-settings';

const InkeepEmbedded = ({ isDarkTheme = false }) => {
  const { theme, systemTheme } = useTheme();

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

  const inkeepEmbeddedChatProps = {
    baseSettings: {
      ...baseSettings,
      colorMode: {
        forcedColorMode: themeMode,
      },
      theme: {
        stylesheetUrls: ['/inkeep/css/base.css', '/inkeep/css/chat.css'],
        components: {
          AIChatPageWrapper: {
            defaultProps: {
              size: 'expand', // 'shrink-vertically' 'expand', 'default', 'full-viewport'
              variant: 'no-shadow', // 'no-shadow' or 'container-with-shadow'
            },
          },
        },
        tokens: {
          fonts: {
            body: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          },
          colors: {
            'grayDark.900': '#000',
          },
        },
      },
    },
    aiChatSettings: {
      ...aiChatSettings,
      introMessage: "<span class='chat-title'>What do you want to know?</span>",
    },
  };

  return (
    <div>
      <InkeepEmbeddedChat {...inkeepEmbeddedChatProps} />
    </div>
  );
};

InkeepEmbedded.propTypes = {
  isDarkTheme: PropTypes.bool,
};

export default InkeepEmbedded;
