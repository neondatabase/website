import aboutUsDarkIcon from 'icons/header/about-us-dark.svg';
import aboutUsIcon from 'icons/header/about-us.svg';
import aiAgentsDarkIcon from 'icons/header/ai-agents-dark.svg';
import aiAgentsIcon from 'icons/header/ai-agents.svg';
import aiDarkIcon from 'icons/header/ai-dark.svg';
import aiIcon from 'icons/header/ai.svg';
import apiDarkIcon from 'icons/header/api-dark.svg';
import apiIcon from 'icons/header/api.svg';
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
import connectionPoolerDarkIcon from 'icons/header/connection-pooler-dark.svg';
import connectionPoolerIcon from 'icons/header/connection-pooler.svg';
import consoleDarkIcon from 'icons/header/console-dark.svg';
import consoleIcon from 'icons/header/console.svg';
import enterpriseDarkIcon from 'icons/header/enterprise-dark.svg';
import enterpriseIcon from 'icons/header/enterprise.svg';
import partnersDarkIcon from 'icons/header/partners-dark.svg';
import partnersIcon from 'icons/header/partners.svg';
import scaleToZeroDarkIcon from 'icons/header/scale-to-zero-dark.svg';
import scaleToZeroIcon from 'icons/header/scale-to-zero.svg';

import LINKS from './links';

export default {
  header: [
    {
      text: 'Product',
      sections: [
        {
          title: 'Database',
          theme: 'cards',
          items: [
            {
              icon: {
                light: autoscalingIcon,
                dark: autoscalingDarkIcon,
              },
              text: 'Autoscaling',
              description: 'Automatic instance sizing',
              to: LINKS.autoscaling,
            },
            {
              icon: {
                light: connectionPoolerIcon,
                dark: connectionPoolerDarkIcon,
              },
              text: 'Connection pooler',
              description: 'Thousands of connections',
              to: LINKS.connectionPooling,
            },
            {
              icon: {
                light: aiIcon,
                dark: aiDarkIcon,
              },
              text: 'AI',
              description: 'Powered by pgvector',
              to: LINKS.ai,
            },
          ],
        },
        {
          banner: {
            title: 'What is Neon?',
            description: 'Serverless explainer updated',
            theme: 'banner',
            to: LINKS.serverless,
          },
        },
        {
          title: 'Workflow',
          theme: 'cards',
          items: [
            {
              icon: {
                light: branchingIcon,
                dark: branchingDarkIcon,
              },
              text: 'Dev environments',
              description: 'Copy schema + data',
              to: LINKS.flow,
            },
            {
              icon: {
                light: scaleToZeroIcon,
                dark: scaleToZeroDarkIcon,
              },
              text: 'Scale-to-zero',
              description: 'Lower costs for dev/test',
              to: LINKS.scaleToZero,
            },
          ],
        },
        {
          title: 'Backend',
          theme: 'cards',
          items: [
            {
              icon: {
                light: consoleIcon,
                dark: consoleDarkIcon,
              },
              text: 'Authorize',
              description: 'Row-level security',
              to: LINKS.authorize,
            },
            {
              icon: {
                light: apiIcon,
                dark: apiDarkIcon,
              },
              text: 'API',
              description: 'Less management work',
              to: LINKS.api,
            },
          ],
        },
      ],
    },
    {
      text: 'Solutions',
      section: [
        {
          title: 'Use cases',
          theme: 'list',
          items: [
            {
              icon: {
                light: caseSaasIcon,
                dark: caseSaasDarkIcon,
              },
              text: 'SaaS Apps',
              to: `${LINKS.useCases}/postgres-for-saas`,
            },
            {
              icon: {
                light: caseVariableIcon,
                dark: caseVariableDarkIcon,
              },
              text: 'Variable Traffic',
              to: LINKS.variableLoad,
            },
            {
              icon: {
                light: caseDatabaseIcon,
                dark: caseDatabaseDarkIcon,
              },
              text: 'Database per Tenant',
              to: `${LINKS.useCases}/database-per-tenant`,
            },
            {
              icon: {
                light: caseDevIcon,
                dark: caseDevDarkIcon,
              },
              text: 'Dev/Test',
              to: `${LINKS.useCases}/dev-test`,
            },
            {
              icon: {
                light: aiAgentsIcon,
                dark: aiAgentsDarkIcon,
              },
              text: 'Agents',
              to: `${LINKS.useCases}/ai-agents`,
            },
          ],
        },
        {
          title: 'For teams',
          theme: 'cards',
          items: [
            {
              icon: {
                light: enterpriseIcon,
                dark: enterpriseDarkIcon,
              },
              text: 'Enterprise',
              description: 'Scale & grow',
              to: LINKS.enterprise,
            },
            {
              icon: {
                light: partnersIcon,
                dark: partnersDarkIcon,
              },
              text: 'Partners',
              description: 'Add Neon to your platform',
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
          theme: 'list',
          items: [
            {
              icon: {
                light: blogIcon,
                dark: blogDarkIcon,
              },
              text: 'Blog',
              to: LINKS.blog,
            },
            {
              icon: {
                light: aboutUsIcon,
                dark: aboutUsDarkIcon,
              },
              text: 'About us',
              to: LINKS.aboutUs,
            },
            {
              icon: {
                light: careersIcon,
                dark: careersDarkIcon,
              },
              text: 'Careers',
              to: LINKS.careers,
            },
            {
              icon: {
                light: careersIcon,
                dark: careersDarkIcon,
              },
              text: 'Contact',
              to: LINKS.contactSales,
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
          description: 'In progress',
          icon: 'wip-icon',
          to: LINKS.certHIPAA,
        },
        {
          text: 'Trust Center',
          to: LINKS.trust,
        },
      ],
    },
  ],
};
