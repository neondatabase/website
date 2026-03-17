import LINKS from 'constants/links';
import closeIcon from 'icons/close.svg';

const BASE_URL = 'https://neon.com';

const inkeepTheme = {
  styles: [
    {
      key: 'neon-inkeep-base',
      type: 'link',
      value: '/inkeep/css/base.css',
    },
    {
      key: 'neon-inkeep-modal',
      type: 'link',
      value: '/inkeep/css/modal.css',
    },
    {
      key: 'neon-inkeep-chat',
      type: 'link',
      value: '/inkeep/css/chat.css',
    },
  ],
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
};

const baseSettings = {
  apiKey: process.env.INKEEP_INTEGRATION_API_KEY,
  integrationId: process.env.INKEEP_INTEGRATION_ID,
  organizationId: process.env.INKEEP_ORGANIZATION_ID,
  primaryBrandColor: '#00E599',
  organizationDisplayName: 'Neon',
  customIcons: {
    close: { custom: closeIcon.src },
  },
};

const aiChatSettings = {
  aiAssistantName: 'Neon AI',
  chatSubjectName: 'Neon',
  placeholder: 'How do I get started?',
  introMessage:
    "Hi!\nI'm an AI assistant trained on documentation, help articles, and other content.\n\nAsk me anything about Neon.",
  exampleQuestions: [
    'What’s Neon?',
    'How do I sign up for Neon?',
    'How to create a project?',
    'How to get started with the Neon API?',
  ],
  aiAssistantAvatar: {
    light: '/inkeep/images/bot.svg',
    dark: '/inkeep/images/bot-dark.svg',
  },
  userAvatar: '/inkeep/images/user.svg',
  isShareButtonVisible: true,
  shareChatUrlBasePath: `${BASE_URL}${LINKS.docsHome}`,
  getHelpOptions: [
    {
      icon: { builtIn: 'FaDiscord' },
      name: 'Discord',
      action: {
        type: 'open_link',
        url: LINKS.discord,
      },
    },
    {
      icon: { builtIn: 'IoChatbubblesOutline' },
      name: 'Neon Support',
      action: {
        type: 'open_link',
        url: LINKS.consoleSupport,
      },
    },
  ],
};

const getInkeepBaseSettings = ({ onEvent, themeMode }) => ({
  ...baseSettings,
  colorMode: {
    forcedColorMode: themeMode,
  },
  theme: inkeepTheme,
  privacyPreferences: {
    optOutFunctionalCookies: true,
  },
  onEvent,
});

export { aiChatSettings, baseSettings, getInkeepBaseSettings };
