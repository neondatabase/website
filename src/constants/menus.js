import LINKS from './links';

export default {
  header: [
    {
      text: 'Docs',
      to: LINKS.docs,
    },
    {
      text: 'Team',
      to: LINKS.team,
    },
    {
      text: 'Jobs',
      to: LINKS.jobs,
    },
    {
      text: 'Blog',
      to: LINKS.blog,
    },
    {
      text: 'Community',
      to: '#',
      items: [
        // {
        //   iconName: 'discord',
        //   text: 'Discord',
        //   description: 'Join our community',
        //   to: LINKS.discord,
        // },
        {
          iconName: 'discussions',
          text: 'Discussions',
          description: 'Get help',
          to: LINKS.discussions,
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
          to: LINKS.team,
        },
        {
          text: 'Jobs',
          to: LINKS.jobs,
        },
        {
          text: 'Blog',
          to: LINKS.blog,
        },
      ],
    },
    {
      heading: 'Resources',
      links: [
        {
          text: 'Neon docs',
          to: LINKS.docs,
        },
        {
          text: 'Postgres docs',
          to: LINKS.postgresDocs,
        },
        {
          text: 'Security',
          to: LINKS.security,
        },
        {
          text: 'Postgres mailing lists',
          to: LINKS.postgresList,
        },
      ],
    },
    {
      heading: 'Social',
      links: [
        {
          text: 'Twitter',
          to: LINKS.twitter,
        },
        {
          text: 'LinkedIn',
          to: LINKS.linkedin,
        },
        // {
        //   text: 'Discord',
        //   to: LINKS.discord,
        // },
        {
          text: 'Github',
          to: LINKS.github,
        },
      ],
    },
    // {
    //   heading: 'Legal',
    //   links: [
    //     {
    //       text: 'Privacy policy',
    //       to: LINKS.privacy,
    //     },
    //     {
    //       text: 'Terms of service',
    //       to: LINKS.terms,
    //     },
    //   ],
    // },
  ],
  mobile: [
    {
      text: 'Docs',
      to: LINKS.docs,
    },
    {
      text: 'Team',
      to: LINKS.team,
    },
    {
      text: 'Jobs',
      to: LINKS.jobs,
    },
    {
      text: 'Blog',
      to: LINKS.blog,
    },
    // {
    //   iconName: 'discord',
    //   text: 'Discord',
    //   description: 'Join our community',
    //   to: LINKS.discord,
    // },
    {
      iconName: 'discussions',
      text: 'Discussions',
      description: 'Get help',
      to: LINKS.discussions,
    },
  ],
};
