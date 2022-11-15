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
  launchWeek1: {
    title: 'Neon Launch Week — Neon',
    description:
      'Register to Neon Launch Week at 5th of December and be the first who will see the latest updates from our team',
  },
};
