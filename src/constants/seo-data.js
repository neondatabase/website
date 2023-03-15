export default {
  contactSales: {
    title: 'Contact Sales — Neon',
  },
  careers: {
    title: 'Careers — Neon',
    imagePath: '/images/social-previews/careers.jpg',
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
    title,
    description,
  }),
  static: ({ title }) => ({
    title,
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
    imagePath: '/images/social-previews/developer-days-1.jpg',
  },
  branching: {
    title: 'Instant branching for Postgres — Neon',
    description:
      'Neon allows you to instantly branch your data the same way that you branch your code.',
    imagePath: '/images/social-previews/branching.jpg',
  },
  pricing: {
    title: 'Pricing — Neon',
    description:
      'Neon brings serverless architecture to PostgreSQL, which allows us to offer flexible usage and volume-based plans.',
  },
};
