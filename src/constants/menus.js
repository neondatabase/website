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
              title: 'Bottomless storage',
              to: LINKS.storage,
              description: 'With copy-on-write',
            },
            {
              title: 'Instant restores',
              to: LINKS.branchRestore,
              description: 'Recover TBs in seconds',
            },
            {
              title: 'Connection pooler',
              to: LINKS.connectionPooling,
              description: 'Built-in with pgBouncer',
            },
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            {
              title: 'Neon API',
              to: LINKS.api,
              description: 'Manage infra, billing, quotas',
            },
            {
              title: 'Auth',
              to: LINKS.auth,
              description: 'Add authentication',
            },
            {
              title: 'Data API',
              to: LINKS.dataApi,
              description: 'PostgREST-compatible',
            },

            {
              title: 'Instagres',
              to: LINKS.instagres,
              description: 'No-signup flow',
              isExternal: true,
            },
            {
              title: 'Migration guides',
              to: LINKS.migrationIntro,
              description: 'Step-by-step',
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
              title: 'Serverless apps',
              to: `${LINKS.useCases}/serverless-apps`,
              description: 'Autoscale with traffic',
            },
            {
              title: 'Multi-TB',
              to: `${LINKS.useCases}/multi-tb`,
              description: 'Scale & restore instantly',
            },
            {
              title: 'Database per tenant',
              to: `${LINKS.useCases}/database-per-tenant`,
              description: 'Data isolation without overhead',
            },
            {
              title: 'Platforms',
              to: LINKS.platforms,
              description: 'Offer Postgres to your users',
            },
            {
              title: 'Dev/Test',
              to: `${LINKS.useCases}/dev-test`,
              description: 'Production-like environments',
            },
            {
              title: 'Agents',
              to: `${LINKS.useCases}/ai-agents`,
              description: 'Build full-stack AI agents',
            },
          ],
        },
        {
          title: 'For teams',
          items: [
            {
              title: 'Startups',
              to: LINKS.startups,
              description: 'Build with Neon',
            },
            {
              title: 'Security',
              to: LINKS.security,
              description: 'Compliance & privacy',
            },
            {
              title: 'Case studies',
              to: LINKS.caseStudies,
              description: 'Explore customer stories',
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
          title: 'Company',
          items: [
            {
              title: 'Blog',
              to: LINKS.blog,
              description: 'Technical posts & product updates',
            },
            {
              title: 'About us',
              to: LINKS.aboutUs,
              description: 'The company and the mission',
            },
            {
              title: 'Careers',
              to: LINKS.careers,
              description: 'Data isolation without overhead',
            },
            {
              title: 'Contact',
              to: LINKS.contactSales,
              description: 'Offer Postgres to your users',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              title: 'Support',
              to: LINKS.support,
              description: 'Build with Neon',
            },
            {
              title: 'Community guides',
              to: LINKS.guides,
              description: 'Compliance & privacy',
            },
            {
              title: 'Changelog',
              to: LINKS.changelog,
              description: 'Explore customer stories',
            },
            {
              title: 'Creators',
              to: LINKS.creators,
              description: 'Explore customer stories',
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
          text: 'Startups',
          to: LINKS.startups,
        },
        {
          text: 'Creators',
          to: LINKS.creators,
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
