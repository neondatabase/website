import AiAgentsGradientIcon from 'icons/header/ai-agent-gradient.inline.svg';
import AiAgentsIcon from 'icons/header/ai-agent.inline.svg';
import AiGradientIcon from 'icons/header/ai-gradient.inline.svg';
import AiIcon from 'icons/header/ai.inline.svg';
import ApiGradientIcon from 'icons/header/api-gradient.inline.svg';
import ApiIcon from 'icons/header/api.inline.svg';
import AuthGradientIcon from 'icons/header/auth-gradient.inline.svg';
import AuthIcon from 'icons/header/auth.inline.svg';
import AutoscalingGradientIcon from 'icons/header/autoscaling-gradient.inline.svg';
import AutoscalingIcon from 'icons/header/autoscaling.inline.svg';
import BlogIcon from 'icons/header/blog.inline.svg';
import BranchingGradientIcon from 'icons/header/branching-gradient.inline.svg';
import BranchingIcon from 'icons/header/branching.inline.svg';
import BuildingGradientIcon from 'icons/header/building-gradient.inline.svg';
import BuildingIcon from 'icons/header/building.inline.svg';
import CareerIcon from 'icons/header/career.inline.svg';
import ChatIcon from 'icons/header/chat.inline.svg';
import CloudGradientIcon from 'icons/header/cloud-gradient.inline.svg';
import CloudIcon from 'icons/header/cloud.inline.svg';
import ConnectionGradientIcon from 'icons/header/connection-gradient.inline.svg';
import ConnectionIcon from 'icons/header/connection.inline.svg';
import DatabaseGradientIcon from 'icons/header/database-gradient.inline.svg';
import DatabaseIcon from 'icons/header/database.inline.svg';
import FolderGradientIcon from 'icons/header/folder-gradient.inline.svg';
import FolderIcon from 'icons/header/folder.inline.svg';
import GearGradientIcon from 'icons/header/gear-gradient.inline.svg';
import GearIcon from 'icons/header/gear.inline.svg';
import MigrationGradientIcon from 'icons/header/migration-gradient.inline.svg';
import MigrationIcon from 'icons/header/migration.inline.svg';
import PatternGradientIcon from 'icons/header/pattern-gradient.inline.svg';
import PatternIcon from 'icons/header/pattern.inline.svg';
import PeopleIcon from 'icons/header/people.inline.svg';
import RestoreGradientIcon from 'icons/header/restore-gradient.inline.svg';
import RestoreIcon from 'icons/header/restore.inline.svg';
import SaasGradientIcon from 'icons/header/saas-gradient.inline.svg';
import SaasIcon from 'icons/header/saas.inline.svg';
import SearchGradientIcon from 'icons/header/search-gradient.inline.svg';
import SearchIcon from 'icons/header/search.inline.svg';
import SecurityIcon from 'icons/header/security.inline.svg';
import ServerlessGradientIcon from 'icons/header/serverless-gradient.inline.svg';
import ServerlessIcon from 'icons/header/serverless.inline.svg';
import StarGradientIcon from 'icons/header/star-gradient.inline.svg';
import StarIcon from 'icons/header/star.inline.svg';

import LINKS from './links';

export default {
  header: [
    {
      text: 'Product',
      sections: [
        {
          title: 'Database',
          items: [
            {
              icon: AutoscalingIcon,
              iconGradient: AutoscalingGradientIcon,
              title: 'Autoscaling',
              description: 'Automatic instance sizing',
              to: LINKS.autoscaling,
            },
            {
              icon: ConnectionIcon,
              iconGradient: ConnectionGradientIcon,
              title: 'Connection pooler',
              description: 'Thousands of connections',
              to: LINKS.connectionPooling,
            },
            {
              icon: CloudIcon,
              iconGradient: CloudGradientIcon,
              title: 'Bottomless storage',
              description: 'With copy-on-write',
              to: LINKS.storage,
            },
            {
              icon: BranchingIcon,
              iconGradient: BranchingGradientIcon,
              title: 'Branching',
              description: '1-click environments',
              to: LINKS.flow,
            },
            {
              icon: RestoreIcon,
              iconGradient: RestoreGradientIcon,
              title: 'Instant restores',
              description: 'Copy-on-write storage',
              to: LINKS.branchRestore,
            },
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            {
              icon: AuthIcon,
              iconGradient: AuthGradientIcon,
              title: 'Auth',
              description: 'UI for data management',
              to: LINKS.auth,
            },
            {
              icon: SearchIcon,
              iconGradient: SearchGradientIcon,
              title: 'Search',
              description: 'Faster with pg_search',
              to: LINKS.pgSearch,
            },
            {
              icon: ApiIcon,
              iconGradient: ApiGradientIcon,
              title: 'API',
              description: 'Manage Neon at scale',
              to: LINKS.api,
            },
            {
              icon: AiIcon,
              iconGradient: AiGradientIcon,
              title: 'AI',
              description: 'Powered by pgvector',
              to: LINKS.ai,
            },
            {
              icon: MigrationIcon,
              iconGradient: MigrationGradientIcon,
              title: 'Migrations',
              description: 'Minimize downtime',
              to: LINKS.migration,
            },
          ],
        },
        {
          banner: {
            title: 'What is Neon?',
            description: 'Serverless Postgres',
            to: LINKS.whyNeon,
          },
        },
      ],
    },
    {
      text: 'Solutions',
      sections: [
        {
          title: 'Use cases',
          items: [
            {
              icon: SaasIcon,
              iconGradient: SaasGradientIcon,
              title: 'SaaS Apps',
              description: 'Build faster with Neon',
              to: `${LINKS.useCases}/postgres-for-saas`,
            },
            {
              icon: ServerlessIcon,
              iconGradient: ServerlessGradientIcon,
              title: 'Serverless Apps',
              description: 'Autoscale with traffic',
              to: `${LINKS.useCases}/serverless-apps`,
            },
            {
              icon: DatabaseIcon,
              iconGradient: DatabaseGradientIcon,
              title: 'Database per Tenant',
              description: 'Data isolation without overhead',
              to: `${LINKS.useCases}/database-per-tenant`,
            },
            {
              icon: PatternIcon,
              iconGradient: PatternGradientIcon,
              title: 'Platforms',
              description: 'Offer Postgres to your users',
              to: LINKS.platforms,
            },
            {
              icon: GearIcon,
              iconGradient: GearGradientIcon,
              title: 'Dev/Test',
              description: 'Production-like environments',
              to: `${LINKS.useCases}/dev-test`,
            },
            {
              icon: AiAgentsIcon,
              iconGradient: AiAgentsGradientIcon,
              title: 'Agents',
              description: 'Deploy Postgres via AI agents',
              to: `${LINKS.useCases}/ai-agents`,
            },
          ],
        },
        {
          title: 'For teams',
          items: [
            {
              icon: BuildingIcon,
              iconGradient: BuildingGradientIcon,
              title: 'Enterprise',
              description: 'Scale & grow',
              to: LINKS.enterprise,
            },
            {
              icon: StarIcon,
              iconGradient: StarGradientIcon,
              title: 'Partners',
              description: 'Add Neon to your platform',
              to: LINKS.partners,
            },
            {
              icon: FolderIcon,
              iconGradient: FolderGradientIcon,
              title: 'Case studies',
              description: 'Explore customer stories',
              to: LINKS.caseStudies,
            },
          ],
        },
      ],
    },
    {
      text: 'Docs',
      to: LINKS.docs,
    },
    {
      text: 'Pricing',
      to: LINKS.pricing,
    },
    {
      text: 'Company',
      sections: [
        {
          items: [
            {
              icon: BlogIcon,
              title: 'Blog',
              to: LINKS.blog,
            },
            {
              icon: PeopleIcon,
              title: 'About us',
              to: LINKS.aboutUs,
            },
            {
              icon: CareerIcon,
              title: 'Careers',
              to: LINKS.careers,
            },
            {
              icon: ChatIcon,
              title: 'Contact',
              to: LINKS.contactSales,
            },
            {
              icon: SecurityIcon,
              title: 'Security',
              to: LINKS.security,
            },
          ],
        },
      ],
    },
  ],
  footer: [
    {
      heading: 'Company',
      items: [
        {
          text: 'About',
          to: LINKS.aboutUs,
        },
        {
          text: 'Blog',
          to: LINKS.blog,
        },
        {
          text: 'Careers',
          to: LINKS.careers,
        },
        {
          text: 'Contact Sales',
          to: LINKS.contactSales,
        },
        {
          text: 'Partners',
          to: LINKS.partners,
        },
        {
          text: 'Security',
          to: LINKS.security,
        },
        {
          text: 'Legal',
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
    },
    {
      heading: 'Resources',
      items: [
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
          text: 'Community Guides',
          to: LINKS.guides,
        },
        {
          text: 'PostgreSQL Tutorial',
          to: LINKS.postgresqltutorial,
        },
        {
          text: 'Creators',
          to: LINKS.creators,
        },
      ],
    },
    {
      heading: 'Social',
      items: [
        {
          text: 'Discord',
          to: LINKS.discord,
          icon: 'discord-icon',
        },
        {
          text: 'GitHub',
          to: LINKS.github,
          icon: 'github-icon',
        },
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
          text: 'YouTube',
          to: LINKS.youtube,
          icon: 'youtube-icon',
        },
      ],
    },
    {
      heading: 'Compliance',
      items: [
        {
          text: 'CCPA',
          description: 'Compliant',
          icon: 'check-icon',
          to: LINKS.certCCPA,
        },
        {
          text: 'GDPR',
          description: 'Compliant',
          icon: 'check-icon',
          to: LINKS.certGDPR,
        },
        {
          text: 'ISO 27001',
          description: 'Certified',
          icon: 'check-icon',
          to: LINKS.certISO27001,
        },
        {
          text: 'ISO 27701',
          description: 'Certified',
          icon: 'check-icon',
          to: LINKS.certISO27701,
        },
        {
          text: 'SOC 2',
          description: 'Certified',
          icon: 'check-icon',
          to: LINKS.certSOC2,
        },
        {
          text: 'HIPAA',
          description: 'Compliant',
          icon: 'check-icon',
          to: LINKS.certHIPAA,
          links: [
            {
              text: 'Compliance Guide',
              to: LINKS.hipaaCompliance,
            },
            {
              text: 'Neon’s Sub Contractors',
              to: LINKS.hipaaContractors,
            },
            {
              text: 'Sensitive Data Terms',
              to: LINKS.sensitiveDataTerms,
            },
          ],
        },
        {
          text: 'Trust Center',
          to: LINKS.trust,
        },
      ],
    },
  ],
};
