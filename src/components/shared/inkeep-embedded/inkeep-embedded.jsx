'use client';

import { InkeepEmbeddedChat } from '@inkeep/uikit';

import { aiChatSettings, baseSettings } from 'lib/inkeep-settings';

const inkeepEmbeddedChatProps = {
  baseSettings: {
    ...baseSettings,
    theme: {
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
          'gray.800': '#000',
        },
      },
    },
  },
  aiChatSettings: {
    ...aiChatSettings,
    introMessage:
      "<span style='font-size:16px;'>Neon is a serverless Postgres platform designed to help you build reliable and scalable applications faster. We separate compute and storage to offer modern developer features such as autoscaling, branching, point-in-time restore, and more.<br/><br/> How can I help you today?</span>",
  },
};

const InkeepEmbedded = () => (
  <div>
    <InkeepEmbeddedChat {...inkeepEmbeddedChatProps} />
  </div>
);

export default InkeepEmbedded;
