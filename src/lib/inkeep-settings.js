import closeIcon from '../icons/close.svg';

const baseSettings = {
  apiKey: process.env.INKEEP_INTEGRATION_API_KEY,
  integrationId: process.env.INKEEP_INTEGRATION_ID,
  organizationId: process.env.INKEEP_ORGANIZATION_ID,
  primaryBrandColor: '#00E599',
  organizationDisplayName: 'Neon',
  customIcons: {
    close: { custom: closeIcon },
  },
  customCardSettings: [
    {
      filters: {
        UrlMatch: {
          ruleType: 'PartialUrl',
          partialUrl: 'https://neon.tech/docs',
        },
      },
      searchTabLabel: 'Neon Docs',
    },
    {
      filters: {
        UrlMatch: {
          ruleType: 'PartialUrl',
          partialUrl: 'https://neon.tech/postgresql',
        },
      },
      searchTabLabel: 'PostgreSQL Tutorial',
    },
  ],
};

const searchSettings = {
  searchMode: 'KEYWORD',
  placeholder: 'Search',
};

const aiChatSettings = {
  botName: 'Neon AI',
  placeholder: 'How can I help you?',
  quickQuestionsLabel: 'Examples',
  quickQuestions: [
    'What’s Neon?',
    'How do I sign up for Neon?',
    'How to create a project?',
    'How to get started with the Neon API?',
  ],
  botAvatarSrcUrl: '/inkeep/images/example.svg',
  botAvatarDarkSrcUrl: '/inkeep/images/example.svg',
  userAvatarSrcUrl: '/inkeep/images/user.svg',
  isChatSharingEnabled: true,
  shareChatUrlBasePath: 'https://neon.tech/docs/introduction',
};

export { baseSettings, searchSettings, aiChatSettings };
