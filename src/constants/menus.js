import LINKS from './links';

export default {
  header: [
    {
      text: 'Product',
      sections: [
        {
          title: 'Core Primitives',
          items: [
            {
              title: 'Lakebase Postgres',
              to: LINKS.postgresOverview,
              description: 'Serverless Postgres database',
            },
            {
              title: 'Auth',
              to: LINKS.auth,
              description: 'Authentication built into your database',
            },
            {
              title: 'Functions',
              to: LINKS.functionsOverview,
              description: 'Serverless compute next to your data',
            },
            {
              title: 'Object Storage',
              to: LINKS.objectStorageOverview,
              description: 'S3-compatible storage that branches',
            },
            {
              title: 'AI Gateway',
              to: LINKS.aiGatewayOverview,
              description: 'One API for frontier and open-source models',
            },
          ],
        },
        {
          title: 'Features',
          items: [
            {
              title: 'Lakebase Architecture',
              to: LINKS.architecture,
              description: 'Storage-compute separation',
            },
            {
              title: 'Autoscaling',
              to: LINKS.autoscaling,
              description: 'Automatic instance sizing',
            },
            {
              title: 'Branching',
              to: LINKS.branching,
              description: 'Faster Postgres workflows',
            },
            {
              title: 'Search',
              to: LINKS.lakebaseSearch,
              description: 'Vector, keyword, and hybrid search',
            },
            {
              title: 'Instant Restore',
              to: LINKS.instantRestore,
              description: 'Instant recovery when mistakes happen',
            },
          ],
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
              title: 'Full-stack apps',
              to: `${LINKS.useCases}/full-stack-apps`,
              description: 'Deploy backends via your agent',
            },
            {
              title: 'Branching workflows',
              to: `${LINKS.useCases}/branching-workflows`,
              description: 'Simplify DB ops to ship faster & safer',
            },
            {
              title: 'Bursty workloads',
              to: `${LINKS.useCases}/bursty-workloads`,
              description: 'Avoid overprovisioning & optimize performance',
            },
            {
              title: 'Instant restores',
              to: `${LINKS.useCases}/large-databases#restore-postgres-in-seconds-even-at-multi-tb-scale`,
              description: 'Recover TBs in seconds',
            },
            {
              title: 'Large databases',
              to: `${LINKS.useCases}/large-databases`,
              description: 'Restore & replicate your DB in seconds',
            },
          ],
        },
        {
          title: 'Deploy at scale',
          variant: 'cards',
          items: [
            {
              title: 'Agents',
              to: `${LINKS.useCases}/ai-agents`,
              description: 'Infra for app-generation agents like Replit & v0',
              graphic: 'agents',
            },
            {
              title: 'Platforms',
              to: LINKS.platforms,
              description: 'Deploy isolated backends for your end users',
              graphic: 'platforms',
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
      text: 'Resources',
      sections: [
        {
          title: 'Learn',
          items: [
            {
              title: 'Blog',
              to: LINKS.blog,
              description: 'Technical posts & product updates',
            },
            {
              title: 'Case studies',
              to: LINKS.caseStudies,
              description: 'Explore customer stories',
            },
            {
              title: 'Changelog',
              to: LINKS.changelog,
              description: 'Product updates',
            },
            {
              title: 'Community',
              to: LINKS.discord,
              description: 'Connect on Discord',
            },
            {
              title: 'Startups',
              to: LINKS.startups,
              description: 'Build with Neon',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              title: 'About us',
              to: LINKS.aboutUs,
              description: 'The company and the mission',
            },
            {
              title: 'Careers',
              to: LINKS.careers,
              description: 'Join the team',
            },
            {
              title: 'Contact sales',
              to: LINKS.contactSales,
              description: 'Contact sales team',
            },
            {
              title: 'Security',
              to: LINKS.security,
              description: 'Compliance & privacy',
            },
            {
              title: 'Status',
              to: LINKS.status,
              description: 'Service status',
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
          text: 'Security',
          to: LINKS.security,
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
          text: 'FAQs',
          to: LINKS.faqs,
        },
        {
          text: 'PostgreSQL Tutorial',
          to: LINKS.postgresqltutorial,
        },
        {
          text: 'Startups',
          to: LINKS.startups,
        },
      ],
    },
    {
      heading: 'Community',
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
          text: 'X.com',
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
          to: LINKS.certCCPA,
        },
        {
          text: 'GDPR',
          description: 'Compliant',
          to: LINKS.certGDPR,
        },
        {
          text: 'ISO 27001',
          description: 'Certified',
          to: LINKS.certISO27001,
        },
        {
          text: 'ISO 27701',
          description: 'Certified',
          to: LINKS.certISO27701,
        },
        {
          text: 'SOC 2',
          description: 'Certified',
          to: LINKS.certSOC2,
        },
        {
          text: 'HIPAA',
          description: 'Compliant',
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
