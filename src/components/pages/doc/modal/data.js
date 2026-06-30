/**
 * Link opened when a user clicks the thumbnail or CTA.
 *
 * Relative URLs open in the current tab. Absolute HTTP(S) URLs are treated as external and open in
 * a new tab.
 *
 * @typedef {Object} ModalDestination
 * @property {string} label CTA text displayed below the thumbnail.
 * @property {string} url Internal path or absolute external URL.
 */

/**
 * Controls where a modal can appear.
 *
 * Match priority is `pages`, then `folders`, then `all`. When several modals have the same
 * priority, the first one in `MODALS` is selected.
 *
 * Omit `targeting` entirely to preserve the default behavior of showing the modal on every page.
 *
 * @typedef {Object} ModalTargeting
 * @property {boolean} [all=false] Use the modal as a fallback on every page.
 * @property {string[]} [folders] Match a folder path and every page below it.
 * @property {string[]} [pages] Match exact page paths.
 */

/**
 * Docs video modal configuration.
 *
 * Closing a modal stores its `id` in `localStorage`, so the ID must remain unique and stable.
 * The YouTube `embedId` is used to build the thumbnail URL. Supporting text is optional.
 *
 * @typedef {Object} VideoModalConfig
 * @property {string} id Unique, stable modal identifier.
 * @property {string} embedId YouTube video ID used for the thumbnail.
 * @property {string} title Modal heading and thumbnail accessible label.
 * @property {string} [description] Optional supporting text.
 * @property {ModalTargeting} [targeting] Page targeting rules; omit to show on every page.
 * @property {ModalDestination} destination Thumbnail and CTA destination.
 */

/** @type {VideoModalConfig[]} */
const MODALS = [
  // Sitewide fallback. Shows on every docs page (and on /guides, /postgresql, /faqs, since the doc
  // layout is shared), except embed-home pages and pages won by a higher-priority modal below.
  {
    id: 'branching-getting-started',
    embedId: 'UuHnFlg66Io',
    title: 'Watch: Get started with branching',
    description: "See how Neon's database branching works in practice.",
    targeting: {
      all: true,
    },
    destination: {
      label: 'Explore branching',
      url: '/docs/introduction/branching',
    },
  },
  // Section: AI. Folder default across /docs/ai (suppressed on its own home, ai/agent-skills).
  {
    id: 'agent-skills',
    embedId: 'NN251KTjAo8',
    title: 'Watch: Neon Agent Skills',
    description: 'See how agent skills help AI tools follow Neon best practices.',
    targeting: {
      folders: ['docs/ai'],
    },
    destination: {
      label: 'Set up agent skills',
      url: '/docs/ai/agent-skills',
    },
  },
  // Section: Get started. Folder default — the high-level "what is Neon" intro.
  {
    id: 'what-is-neon',
    embedId: 'wLAeC-r4kfE',
    title: 'Watch: What is Neon?',
    description: 'A short look at serverless Postgres on Neon.',
    targeting: {
      folders: ['docs/get-started'],
    },
    destination: {
      label: 'Why Neon',
      url: '/docs/get-started/why-neon',
    },
  },
  // Section: Get started. Page targets (priority 3) put the hands-on console tour on the most
  // task-oriented onboarding pages, ahead of the what-is-neon folder default.
  {
    id: 'getting-started',
    embedId: 'XtMiMnX0hDg',
    title: 'Watch: Getting started with Neon',
    description: 'A guided tour of the Neon Console.',
    targeting: {
      pages: [
        '/docs/get-started/connect-neon',
        '/docs/get-started/query-with-neon-sql-editor',
        '/docs/get-started/workflow-primer',
      ],
    },
    destination: {
      label: 'Tour the console',
      url: '/docs/get-started/signing-up',
    },
  },
  // Intro: autoscaling explainer teaser on related compute pages.
  {
    id: 'autoscaling',
    embedId: 'dE0E7wALg8M',
    title: 'Watch: How autoscaling works',
    description: 'See how Neon scales compute up and down with load.',
    targeting: {
      pages: [
        '/docs/introduction/scale-to-zero',
        '/docs/introduction/serverless',
        '/docs/introduction/autoscaling-architecture',
      ],
    },
    destination: {
      label: 'About autoscaling',
      url: '/docs/introduction/autoscaling',
    },
  },
  // Plans: Free Plan video has no embed home, so link out to YouTube (opens in a new tab).
  {
    id: 'free-plan',
    embedId: 'b_jKP3fcrVY',
    title: 'Watch: Upgrades to the Neon Free Plan',
    description: 'A quick look at what you get on the Free Plan.',
    targeting: {
      pages: ['/docs/introduction/plans', '/docs/introduction/about-billing'],
    },
    destination: {
      label: 'Watch on YouTube',
      url: 'https://www.youtube.com/watch?v=b_jKP3fcrVY',
    },
  },
];

export default MODALS;
