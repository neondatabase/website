import Discourse from '../icons/discourse.inline.svg';
import Github from '../icons/github.inline.svg';
import LinkedIn from '../icons/linkedin.inline.svg';
import Twitter from '../icons/twitter.inline.svg';

import LINKS from './links';

export default {
  header: [
    {
      text: 'Docs',
      to: LINKS.docs,
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
  socialUrls: [
    {
      text: 'Twitter',
      Icon: Twitter,
      to: LINKS.twitter,
    },
    {
      text: 'LinkedIn',
      Icon: LinkedIn,
      to: LINKS.linkedin,
    },
    // {
    //   text: 'Discord',
    //   to: LINKS.discord,
    // },
    {
      text: 'GitHub',
      Icon: Github,
      to: LINKS.github,
    },
    {
      text: 'Discourse',
      Icon: Discourse,
      to: LINKS.discourse,
    },
  ],
  mobile: [
    {
      text: 'Docs',
      to: LINKS.docs,
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
      text: 'GitHub',
      to: LINKS.github,
    },
    {
      text: 'Community',
      to: LINKS.discourse,
    },
  ],
};
