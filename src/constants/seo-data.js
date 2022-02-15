export default {
  jobs: {
    title: 'Jobs — Zenith',
  },
  team: {
    title: 'Our Team — Zenith',
  },
  blog: ({ canonicalUrl }) => ({
    title: 'Our Blog — Zenith',
    canonicalUrl,
  }),
  blogPost: ({ title, description }) => ({
    title: `${title} — Zenith`,
    description,
  }),
  static: ({ title }) => ({
    title: `${title} — Zenith`,
  }),
};
