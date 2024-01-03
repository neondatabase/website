import CalendarIcon from 'icons/calendar.inline.svg';
import ConsoleIcon from 'icons/console.inline.svg';
import aboutUsIcon from 'icons/header-about-us.svg';
import careersIcon from 'icons/header-careers.svg';
import partnersIcon from 'icons/header-partners.svg';
import PostgresDocsIcon from 'icons/postgres.inline.svg';
import TransactionsIcon from 'icons/transactions.inline.svg';

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
          icon: aboutUsIcon,
          text: 'About us',
          description: 'Meet the team',
          to: LINKS.aboutUs,
        },
        {
          icon: careersIcon,
          text: 'Careers',
          description: 'Become a member',
          to: LINKS.careers,
        },
        {
          icon: partnersIcon,
          text: 'Partners',
          description: 'Become a partner',
          to: LINKS.partners,
        },
      ],
    },
    {
      text: 'Blog',
      to: LINKS.blog,
    },
    {
      text: 'AI',
      to: LINKS.ai,
    },
    {
      text: 'Pricing',
      to: LINKS.pricing,
    },
  ],
  footer: [
    {
      heading: 'Company',
      links: [
        {
          text: 'About us',
          to: LINKS.aboutUs,
        },
        {
          text: 'Careers',
          to: LINKS.careers,
        },
        {
          text: 'Partners',
          to: LINKS.partners,
        },
        {
          text: 'Trust',
          to: LINKS.trust,
        },
        {
          text: 'Pricing',
          to: LINKS.pricing,
        },
        {
          text: 'Contact Sales',
          to: LINKS.contactSales,
        },

        // {
        //   text: 'Changelog',
        //   to: LINKS.changelog,
        // },
      ],
    },
    {
      heading: 'Resources',
      links: [
        {
          text: 'AI',
          to: LINKS.ai,
        },
        {
          text: 'Blog',
          to: LINKS.blog,
        },
        {
          text: 'Docs',
          to: LINKS.docs,
        },
        {
          text: 'Changelog',
          to: LINKS.changelog,
        },
        {
          text: 'Support',
          to: LINKS.support,
        },
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
          text: 'X',
          to: LINKS.twitter,
          icon: 'x-icon',
        },
        {
          text: 'LinkedIn',
          to: LINKS.linkedin,
          icon: 'linkedin-icon',
        },
        // {
        //   text: 'Discord',
        //   to: LINKS.discord,
        // },
        {
          text: 'GitHub',
          to: LINKS.github,
          icon: 'github-icon',
        },
        {
          text: 'Discord',
          to: LINKS.discord,
          icon: 'discord-icon',
        },
        {
          text: 'Discourse',
          to: LINKS.discourse,
          icon: 'discourse-icon',
        },
        {
          text: 'YouTube',
          to: LINKS.youtube,
          icon: 'youtube-icon',
        },
      ],
    },
    {
      heading: 'Legal',
      links: [
        {
          text: 'Privacy Policy',
          to: LINKS.privacy,
        },
        {
          text: 'Terms of Service',
          to: LINKS.terms,
        },
        {
          text: 'DPA',
          to: LINKS.dpa,
        },
        {
          text: 'Subprocessors List',
          to: LINKS.subprocessors,
        },
        {
          text: 'Privacy Guide',
          to: LINKS.privacyGuide,
        },
        {
          text: 'Cookie Policy',
          to: LINKS.cookiePolicy,
        },
        {
          text: 'Business Information',
          to: LINKS.businessInformation,
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
      text: 'Pricing',
      to: LINKS.pricing,
    },
    {
      text: 'Partners',
      to: LINKS.partners,
    },
    {
      text: 'AI',
      to: LINKS.ai,
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
  ],
  docSidebar: [
    {
      icon: TransactionsIcon,
      title: 'API Reference',
      slug: LINKS.apiReference,
    },
    {
      icon: ConsoleIcon,
      title: 'CLI Reference',
      slug: LINKS.cliReference,
    },
    {
      icon: CalendarIcon,
      title: 'Changelog',
      slug: LINKS.changelog,
    },
    {
      icon: PostgresDocsIcon,
      title: 'Postgres Docs',
      slug: LINKS.postgres,
    },
  ],
  postgresSidebar: [
    {
      icon: PostgresDocsIcon,
      title: 'Neon Docs',
      slug: LINKS.docs,
    },
  ],
};
