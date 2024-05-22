import CalendarIcon from 'icons/calendar.inline.svg';
import ConsoleIcon from 'icons/console.inline.svg';
import aboutUsIcon from 'icons/header/about-us.svg';
import aiIcon from 'icons/header/ai.svg';
import autoscalingIcon from 'icons/header/autoscaling.svg';
import blogIcon from 'icons/header/blog.svg';
import branchingIcon from 'icons/header/branching.svg';
import careersIcon from 'icons/header/careers.svg';
import caseStudiesIcon from 'icons/header/case-studies.svg';
import changelogIcon from 'icons/header/changelog.svg';
import cliIcon from 'icons/header/cli.svg';
import demosIcon from 'icons/header/demos.svg';
import discordIcon from 'icons/header/discord.svg';
import enterpriseIcon from 'icons/header/enterprise.svg';
import partnersIcon from 'icons/header/partners.svg';
import onDemandStorageIcon from 'icons/header/storage.svg';
import PostgresDocsIcon from 'icons/postgres.inline.svg';
import TransactionsIcon from 'icons/transactions.inline.svg';

import LINKS from './links';

export default {
  header: [
    {
      text: 'Features',
      items: [
        {
          icon: branchingIcon,
          text: 'Branching',
          description: 'Work with data like code',
          to: LINKS.branching,
        },
        {
          icon: autoscalingIcon,
          text: 'Autoscaling',
          description: 'Scale compute on demand',
          to: LINKS.autoscaling,
        },
        {
          icon: cliIcon,
          text: 'CLI',
          description: 'Neon in your terminal',
          to: LINKS.cliReference,
        },
        {
          icon: onDemandStorageIcon,
          text: 'On-demand storage',
          description: 'Custom-built for the cloud',
          to: LINKS.onDemandStorage,
        },
        {
          icon: aiIcon,
          text: 'AI',
          description: 'Neon as your vector store',
          to: LINKS.ai,
        },
      ],
    },
    {
      text: 'Pricing',
      to: LINKS.pricing,
    },
    {
      text: 'Docs',
      to: LINKS.docs,
    },
    {
      text: 'Resources',
      items: [
        {
          icon: blogIcon,
          text: 'Blog',
          description: 'Learn from the experts',
          to: LINKS.blog,
        },
        {
          icon: changelogIcon,
          text: 'Changelog',
          description: 'Explore product updates',
          to: LINKS.changelog,
        },
        {
          icon: demosIcon,
          text: 'Demos',
          description: 'Try interactive demos',
          to: LINKS.demos,
        },
        {
          icon: discordIcon,
          text: 'Discord',
          description: 'Join the community',
          to: LINKS.discord,
        },
      ],
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
        {
          icon: caseStudiesIcon,
          text: 'Case studies',
          description: 'Explore customer stories',
          to: LINKS.caseStudies,
        },
        {
          icon: enterpriseIcon,
          text: 'Enterprise',
          description: 'Scale & grow',
          to: LINKS.enterprise,
        },
      ],
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
          text: 'Case Studies',
          to: LINKS.caseStudies,
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
        {
          text: 'Early Access',
          to: LINKS.earlyAccess,
        },
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
          text: 'Guides',
          to: LINKS.guides,
        },
        {
          text: 'Changelog',
          to: LINKS.changelog,
        },
        {
          text: 'Demos',
          to: LINKS.demos,
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
          text: 'x.com',
          to: LINKS.twitter,
          icon: 'x-icon',
        },
        {
          text: 'LinkedIn',
          to: LINKS.linkedin,
          icon: 'linkedin-icon',
        },
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
        {
          text: 'Creators',
          to: LINKS.creators,
          icon: 'creators-icon',
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
      title: 'PostgreSQL Docs',
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
