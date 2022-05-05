export default {
  jobs: {
    title: 'Jobs — Neon',
  },
  team: {
    title: 'Our Team — Neon',
  },
  signUp: {
    title: 'Get Early Access — Neon',
  },
  blog: ({ canonicalUrl }) => ({
    title: 'Our Blog — Neon',
    canonicalUrl,
  }),
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
};
