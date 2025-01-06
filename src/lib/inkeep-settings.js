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
  placeholder: 'Ask anything...',
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
  shareChatUrlBasePath:
    'https://neon-next-git-docs-perplexity-mode-neondatabase.vercel.app/ai-chat',
  getHelpCallToActions: [
    {
      type: 'OPEN_LINK',
      icon: { builtIn: 'FaDiscord' },
      name: 'Discord',
      url: 'https://discord.gg/92vNTzKDGp',
    },
    {
      type: 'OPEN_LINK',
      icon: { builtIn: 'FaPhone' },
      name: 'Neon Support',
      url: 'https://console.neon.tech/app/projects?modal=support',
    },
  ],
};

export { baseSettings, searchSettings, aiChatSettings };
