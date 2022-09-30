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
  releaseNotes: {
    title: 'Release notes — Neon',
  },
  changelogPost: ({ title }) => ({
    title: `${title} — Neon`,
  }),
  404: {
    title: 'Page Not Found — Neon',
  },
};
