import CalendarIcon from 'icons/calendar.inline.svg';
import ConsoleIcon from 'icons/console.inline.svg';
import aboutUsDarkIcon from 'icons/header/about-us-dark.svg';
import aboutUsIcon from 'icons/header/about-us.svg';
import aiDarkIcon from 'icons/header/ai-dark.svg';
import aiIcon from 'icons/header/ai.svg';
import autoscalingDarkIcon from 'icons/header/autoscaling-dark.svg';
import autoscalingIcon from 'icons/header/autoscaling.svg';
import blogDarkIcon from 'icons/header/blog-dark.svg';
import blogIcon from 'icons/header/blog.svg';
import branchingDarkIcon from 'icons/header/branching-dark.svg';
import branchingIcon from 'icons/header/branching.svg';
import careersDarkIcon from 'icons/header/careers-dark.svg';
import careersIcon from 'icons/header/careers.svg';
import caseDatabaseDarkIcon from 'icons/header/case-database-dark.svg';
import caseDatabaseIcon from 'icons/header/case-database.svg';
import caseDevDarkIcon from 'icons/header/case-dev-dark.svg';
import caseDevIcon from 'icons/header/case-dev.svg';
import caseSaasDarkIcon from 'icons/header/case-saas-dark.svg';
import caseSaasIcon from 'icons/header/case-saas.svg';
import caseStudiesDarkIcon from 'icons/header/case-studies-dark.svg';
import caseStudiesIcon from 'icons/header/case-studies.svg';
import caseVariableDarkIcon from 'icons/header/case-variable-dark.svg';
import caseVariableIcon from 'icons/header/case-variable.svg';
import caseVelocityDarkIcon from 'icons/header/case-velocity-dark.svg';
import caseVelocityIcon from 'icons/header/case-velocity.svg';
import changelogDarkIcon from 'icons/header/changelog-dark.svg';
import changelogIcon from 'icons/header/changelog.svg';
import cliDarkIcon from 'icons/header/cli-dark.svg';
import cliIcon from 'icons/header/cli.svg';
import demosDarkIcon from 'icons/header/demos-dark.svg';
import demosIcon from 'icons/header/demos.svg';
import discordDarkIcon from 'icons/header/discord-dark.svg';
import discordIcon from 'icons/header/discord.svg';
import enterpriseDarkIcon from 'icons/header/enterprise-dark.svg';
import enterpriseIcon from 'icons/header/enterprise.svg';
import partnersDarkIcon from 'icons/header/partners-dark.svg';
import partnersIcon from 'icons/header/partners.svg';
import onDemandStorageDarkIcon from 'icons/header/storage-dark.svg';
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
          icon: {
            light: branchingIcon,
            dark: branchingDarkIcon,
          },
          text: 'Branching',
          description: 'Work with data like code',
          to: LINKS.branching,
        },
        {
          icon: {
            light: autoscalingIcon,
            dark: autoscalingDarkIcon,
          },
          text: 'Autoscaling',
          description: 'Scale compute on demand',
          to: LINKS.autoscaling,
        },
        {
          icon: {
            light: cliIcon,
            dark: cliDarkIcon,
          },
          text: 'CLI',
          description: 'Neon in your terminal',
          to: LINKS.cli,
        },
        {
          icon: {
            light: onDemandStorageIcon,
            dark: onDemandStorageDarkIcon,
          },
          text: 'On-demand storage',
          description: 'Custom-built for the cloud',
          to: LINKS.onDemandStorage,
        },
        {
          icon: {
            light: aiIcon,
            dark: aiDarkIcon,
          },
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
      text: 'Use cases',
      items: [
        {
          icon: {
            light: caseSaasIcon,
            dark: caseSaasDarkIcon,
          },
          text: 'Postgres for SaaS',
          description: 'Postgres for SaaS',
          to: `${LINKS.cases}/postgres-for-saas`,
        },
        {
          icon: {
            light: caseVariableIcon,
            dark: caseVariableDarkIcon,
          },
          text: 'Variable Workloads',
          description: 'Autoscale according to load',
          to: LINKS.variableLoad,
        },
        {
          icon: {
            light: caseDevIcon,
            dark: caseDevDarkIcon,
          },
          text: 'Dev/Stage/Test',
          description: 'Build and test on Neon',
          to: `${LINKS.cases}/dev-stage-test`,
        },
        {
          icon: {
            light: caseDatabaseIcon,
            dark: caseDatabaseDarkIcon,
          },
          text: 'Database-per-User',
          description: 'Database-per-User',
          to: `${LINKS.cases}/database-per-user`,
        },
        {
          icon: {
            light: caseVelocityIcon,
            dark: caseVelocityDarkIcon,
          },
          text: 'Development Velocity',
          description: 'Ship faster than ever',
          to: `${LINKS.cases}/development-velocity`,
        },
      ],
    },
    {
      text: 'Resources',
      items: [
        {
          icon: {
            light: blogIcon,
            dark: blogDarkIcon,
          },
          text: 'Blog',
          description: 'Learn from the experts',
          to: LINKS.blog,
        },
        {
          icon: {
            light: changelogIcon,
            dark: changelogDarkIcon,
          },
          text: 'Changelog',
          description: 'Explore product updates',
          to: LINKS.changelog,
        },
        {
          icon: {
            light: demosIcon,
            dark: demosDarkIcon,
          },
          text: 'Demos',
          description: 'Try interactive demos',
          to: LINKS.demos,
        },
        {
          icon: {
            light: discordIcon,
            dark: discordDarkIcon,
          },
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
          icon: {
            light: aboutUsIcon,
            dark: aboutUsDarkIcon,
          },
          text: 'About us',
          description: 'Meet the team',
          to: LINKS.aboutUs,
        },
        {
          icon: {
            light: careersIcon,
            dark: careersDarkIcon,
          },
          text: 'Careers',
          description: 'Join Neon',
          to: LINKS.careers,
        },
        {
          icon: {
            light: partnersIcon,
            dark: partnersDarkIcon,
          },
          text: 'Neon for platforms',
          description: 'Postgres for your users',
          to: LINKS.partners,
        },
        {
          icon: {
            light: caseStudiesIcon,
            dark: caseStudiesDarkIcon,
          },
          text: 'Case studies',
          description: 'Explore customer stories',
          to: LINKS.caseStudies,
        },
        {
          icon: {
            light: enterpriseIcon,
            dark: enterpriseDarkIcon,
          },
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
          text: 'Community Guides',
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
