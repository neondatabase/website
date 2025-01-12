'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { PropTypes } from 'prop-types';

import { aiChatSettings, baseSettings } from 'lib/inkeep-settings';

const Skeleton = () => (
  <div className="w-full flex-col justify-center overflow-hidden">
    <span className="skeleton mt-6 h-[45px] w-full md:h-[30px]" />
    <span className="skeleton mt-10 h-24 w-full md:mt-7 sm:h-[200px]" />
    <span className="skeleton mt-6 h-[120px] w-full lg:h-14" />
    <span className="skeleton mt-4 h-[30px] w-full sm:h-[60px]" />
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
      introMessage: "<span class='intro-title'>What do you want to know?</span>",
    },
  };

  return (
    <div className="w-full max-w-[640px]">
      <InkeepEmbeddedChat {...inkeepEmbeddedChatProps} />
    </div>
  );
};

InkeepEmbedded.propTypes = {
  isDarkTheme: PropTypes.bool,
};

export default InkeepEmbedded;
