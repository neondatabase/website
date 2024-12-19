'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { PropTypes } from 'prop-types';

import { aiChatSettings, baseSettings } from 'lib/inkeep-settings';

const Skeleton = () => (
  <div className="mx-auto w-full max-w-[640px] flex-col justify-center overflow-hidden pt-4">
    <span className="skeleton h-11 w-full" />
    <span className="skeleton mt-7 h-[90px] w-full" />
    <span className="skeleton mt-10 h-14 w-full" />
    <span className="skeleton mt-4 h-6 w-full" />
  </div>
);

const InkeepEmbeddedChat = dynamic(
  () => import('@inkeep/uikit').then((mod) => mod.InkeepEmbeddedChat),
  { ssr: false, loading: () => <Skeleton /> }
);

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
    <div className="w-full max-w-[704px]">
      <InkeepEmbeddedChat {...inkeepEmbeddedChatProps} />
    </div>
  );
};

InkeepEmbedded.propTypes = {
  isDarkTheme: PropTypes.bool,
};

export default InkeepEmbedded;
