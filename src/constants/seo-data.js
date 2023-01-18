export default {
  careers: {
    title: 'Careers — Neon',
  },
  aboutUs: {
    title: 'About Us — Neon',
  },
  earlyAccess: {
    title: 'Get Early Access — Neon',
  },
  blog: {
    title: 'Our Blog — Neon',
  },
  blogPost: ({ title, description }) => ({
    title: `${title} — Neon`,
    description,
  }),
  static: ({ title }) => ({
    title: `${title} — Neon`,
  }),
  doc: ({ title, description }) => ({
    title: `${title} — Neon Docs`,
    description,
  }),
  releaseNotePost: ({ title }) => ({
    title: `${title} — Neon`,
  }),
  404: {
    title: 'Page Not Found — Neon',
  },
  developerDays1: {
    title: 'Neon Developer Days — Neon',
    description:
      'Join us virtually on December 6th, 7th, and 8th to learn about Neon and how to build better with Serverless Postgres.',
  },
  branching: {
    title: 'Instant branching for Postgres — Neon',
    description:
      'Neon allows you to instantly branch your data the same way that you branch your code.',
  },
  contactSales: {
    title: 'Contact Sales — Neon',
    description: 'Neon is a Serverless Postgres database that scales with your business.',
  },
};
