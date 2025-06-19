import closeIcon from 'icons/close.svg';

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
        AND: [
          {
            UrlMatch: {
              ruleType: 'PartialUrl',
              partialUrl: 'https://neon.com/docs',
            },
          },
          {
            NOT: {
              UrlMatch: {
                ruleType: 'PartialUrl',
                partialUrl: 'https://neon.com/docs/changelog',
              },
            },
          },
        ],
      },
      searchTabLabel: 'Neon Docs',
    },
    {
      filters: {
        UrlMatch: {
          ruleType: 'PartialUrl',
          partialUrl: 'https://neon.com/postgresql',
        },
      },
      searchTabLabel: 'PostgreSQL Tutorial',
    },
    {
      filters: {
        UrlMatch: {
          ruleType: 'PartialUrl',
          partialUrl: 'https://neon.com/docs/changelog',
        },
      },
      searchTabLabel: 'Changelog',
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
  botAvatarSrcUrl: '/inkeep/images/bot.svg',
  botAvatarDarkSrcUrl: '/inkeep/images/bot-dark.svg',
  userAvatarSrcUrl: '/inkeep/images/user.svg',
  userAvatarDarkSrcUrl: '/inkeep/images/user-dark.svg',
  isChatSharingEnabled: true,
  shareChatUrlBasePath: 'https://neon.com/ai-chat',
  getHelpCallToActions: [
    {
      type: 'OPEN_LINK',
      icon: { builtIn: 'FaDiscord' },
      name: 'Discord',
      url: 'https://discord.gg/92vNTzKDGp',
    },
    {
      type: 'OPEN_LINK',
      icon: { builtIn: 'IoChatbubblesOutline' },
      name: 'Neon Support',
      url: 'https://console.neon.com/app/projects?modal=support',
    },
  ],
};

export { baseSettings, searchSettings, aiChatSettings };
