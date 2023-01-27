import LINKS from './links';

export default {
  header: [
    {
      text: 'Docs',
      to: LINKS.docs,
    },
    {
      text: 'Branching',
      to: LINKS.branching,
    },
    {
      text: 'Company',
      items: [
        {
          iconName: 'aboutUs',
          text: 'About us',
          description: 'Meet the team',
          to: LINKS.aboutUs,
        },
        {
          iconName: 'careers',
          text: 'Careers',
          description: 'Become a member',
          to: LINKS.careers,
        },
      ],
    },
    {
      text: 'Blog',
      to: LINKS.blog,
    },
    {
      text: 'Community',
      to: LINKS.discourse,
      // items: [
      // {
      //   iconName: 'discord',
      //   text: 'Discord',
      //   description: 'Join our community',
      //   to: LINKS.discord,
      // },
      //   {
      //     iconName: 'discussions',
      //     text: 'Community',
      //     description: 'Get help',
      //     to: LINKS.discourse,
      //   },
      // ],
    },
    {
      text: 'Contact Sales',
      to: LINKS.contactSales,
    },
  ],
  footer: [
    {
      heading: 'Company',
      links: [
        {
          text: 'Blog',
          to: LINKS.blog,
        },
        {
          text: 'About Us',
          to: LINKS.aboutUs,
        },
        {
          text: 'Careers',
          to: LINKS.careers,
        },
        {
          text: 'Contact Sales',
          to: LINKS.contactSales,
        },

        // {
        //   text: 'Release notes',
        //   to: LINKS.releaseNotes,
        // },
      ],
    },
    {
      heading: 'Resources',
      links: [
        {
          text: 'Docs',
          to: LINKS.docs,
        },
        {
          text: 'Release notes',
          to: LINKS.releaseNotes,
        },
        // {
        //   text: 'PostgreSQL docs',
        //   to: LINKS.postgresDocs,
        // },
        {
          text: 'Security',
          to: LINKS.security,
        },
      ],
    },
    {
      heading: 'Community',
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
          text: 'GitHub',
          to: LINKS.github,
        },
        {
          text: 'Discourse',
          to: LINKS.discourse,
        },
        {
          text: 'YouTube',
          to: LINKS.youtube,
        },
      ],
    },
    {
      heading: 'Legal',
      links: [
        {
          text: 'Privacy policy',
          to: LINKS.privacy,
        },
        {
          text: 'Terms of service',
          to: LINKS.terms,
        },
      ],
    },
  ],
  mobile: [
    {
      text: 'Docs',
      to: LINKS.docs,
    },
    {
      text: 'Branching',
      to: LINKS.branching,
    },
    {
      text: 'About us',
      to: LINKS.aboutUs,
    },
    {
      text: 'Careers',
      to: LINKS.careers,
    },
    {
      text: 'Blog',
      to: LINKS.blog,
    },
    {
      text: 'Contact Sales',
      to: LINKS.contactSales,
    },
    // {
    //   iconName: 'discord',
    //   text: 'Discord',
    //   description: 'Join our community',
    //   to: LINKS.discord,
    // },
    {
      text: 'GitHub',
      to: LINKS.github,
    },
    {
      text: 'Community',
      to: LINKS.discourse,
    },
  ],
};
