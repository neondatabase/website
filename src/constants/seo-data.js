export default {
  jobs: {
    title: 'Jobs — Zenith',
  },
  team: {
    title: 'Our Team — Zenith',
  },
  blog: ({ canonicalUrl }) => ({
    title: 'Our Bog — Zenith',
    canonicalUrl,
  }),
  blogPost: ({ title, description }) => ({
    title: `${title} — Zenith`,
    description,
  }),
};
