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
            },
            {
              title: 'Branching',
              to: LINKS.branching,
            },
            {
              title: 'Bottomless storage',
              to: LINKS.storage,
            },
            {
              title: 'Instant restores',
              to: LINKS.branchRestore,
            },
            {
              title: 'Connection pooler',
              to: LINKS.connectionPooling,
            },
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            {
              title: 'Neon API',
              to: LINKS.api,
            },
            {
              title: 'Auth',
              to: LINKS.auth,
            },
            {
              title: 'Data API',
              to: LINKS.dataApi,
            },

            {
              title: 'Instagres',
              to: LINKS.instagres,
              isExternal: true,
            },
            {
              title: 'Migration guides',
              to: LINKS.migrationIntro,
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
            },
            {
              title: 'Multi-TB',
              to: `${LINKS.useCases}/multi-tb`,
            },
            {
              title: 'Database per tenant',
              to: `${LINKS.useCases}/database-per-tenant`,
            },
            {
              title: 'Platforms',
              to: LINKS.platforms,
            },
            {
              title: 'Development and testing',
              to: `${LINKS.useCases}/dev-test`,
            },
            {
              title: 'AI Agent Platforms',
              to: `${LINKS.useCases}/ai-agents`,
            },
          ],
        },
        {
          title: 'For teams',
          items: [
            {
              title: 'Startups',
              to: LINKS.startups,
            },
            {
              title: 'Security',
              to: LINKS.security,
            },
            {
              title: 'Case studies',
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
          title: 'Company',
          items: [
            {
              title: 'Blog',
              to: LINKS.blog,
            },
            {
              title: 'About us',
              to: LINKS.aboutUs,
            },
            {
              title: 'Careers',
              to: LINKS.careers,
            },
            {
              title: 'Contact',
              to: LINKS.contactSales,
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              title: 'Support',
              to: LINKS.support,
            },
            {
              title: 'Community guides',
              to: LINKS.guides,
            },
            {
              title: 'Changelog',
              to: LINKS.changelog,
            },
            {
              title: 'Creators',
              to: LINKS.creators,
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
