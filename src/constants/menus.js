const links = {
  docs: 'https://github.com/zenithdb/zenith/tree/main/docs',
  team: '/team',
  jobs: '/jobs',
  community: '#',
  discord: 'https://discord.gg/YKY4CBXZT2',
  discussions: 'https://github.com/zenithdb/zenith/discussions',
  github: 'https://github.com/zenithdb/zenith',
  twitter: '/',
  postgresDocs: 'https://www.postgresql.org/docs/',
  postgresList: 'https://www.postgresql.org/list/',
  privacy: '/',
  terms: '/',
};

export default {
  header: [
    {
      text: 'Docs',
      to: links.docs,
    },
    {
      text: 'Team',
      to: links.team,
    },
    {
      text: 'Jobs',
      to: links.jobs,
    },
    {
      text: 'Community',
      to: links.community,
      items: [
        {
          iconName: 'discord',
          text: 'Discord',
          description: 'Join our community',
          to: links.discord,
        },
        {
          iconName: 'discussions',
          text: 'Discussions',
          description: 'Get help',
          to: links.discussions,
        },
      ],
    },
  ],
  footer: [
    {
      heading: 'Company',
      links: [
        {
          text: 'Team',
          to: links.team,
        },
        {
          text: 'Jobs',
          to: links.jobs,
        },
      ],
    },
    {
      heading: 'Docs',
      links: [
        {
          text: 'Our docs',
          to: links.docs,
        },
        {
          text: 'Postgres docs',
          to: links.postgresDocs,
        },
        {
          text: 'Postgres mailing lists',
          to: links.postgresList,
        },
      ],
    },
    {
      heading: 'Social',
      links: [
        // {
        //   text: 'Twitter',
        //   to: links.twitter,
        // },
        {
          text: 'Discord',
          to: links.discord,
        },
        {
          text: 'Github',
          to: links.github,
        },
      ],
    },
    // {
    //   heading: 'Legal',
    //   links: [
    //     {
    //       text: 'Privacy policy',
    //       to: links.privacy,
    //     },
    //     {
    //       text: 'Terms of service',
    //       to: links.terms,
    //     },
    //   ],
    // },
  ],
  mobile: [
    {
      text: 'Docs',
      to: links.docs,
    },
    {
      text: 'Team',
      to: links.team,
    },
    {
      text: 'Jobs',
      to: links.jobs,
    },
    {
      iconName: 'discord',
      text: 'Discord',
      description: 'Join our community',
      to: links.discord,
    },
    {
      iconName: 'discussions',
      text: 'Discussions',
      description: 'Get help',
      to: links.discussions,
    },
  ],
};
