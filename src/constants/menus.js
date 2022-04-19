import LINKS from './links';

export default {
  header: [
    // {
    //   text: 'Docs',
    //   to: LINKS.docs,
    // },
    {
      text: 'Team',
      to: LINKS.team,
    },
    {
      text: 'Jobs',
      to: LINKS.jobs,
    },
    {
      text: 'Community',
      to: LINKS.community,
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
      ],
    },
    {
      heading: 'Docs',
      links: [
        {
          text: 'Our docs',
          to: LINKS.docs,
        },
        {
          text: 'Postgres docs',
          to: LINKS.postgresDocs,
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
        // {
        //   text: 'Twitter',
        //   to: LINKS.twitter,
        // },
        {
          text: 'Discord',
          to: LINKS.discord,
        },
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
      iconName: 'discord',
      text: 'Discord',
      description: 'Join our community',
      to: LINKS.discord,
    },
    {
      iconName: 'discussions',
      text: 'Discussions',
      description: 'Get help',
      to: LINKS.discussions,
    },
  ],
};
