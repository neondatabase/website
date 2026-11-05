import { BASE_AGENT_PROMPT } from 'components/pages/doc/agent-setup-button';

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
 * A/B test on a modal. Each device is assigned one variant at random and keeps it (see
 * `utils/experiments`). A variant's fields override the modal's own fields (for example `title`).
 * Keep `id` and the variant keys stable while the test runs, or devices get reassigned.
 *
 * @typedef {Object} ModalExperiment
 * @property {string} id Unique, stable experiment identifier sent with every experiment event.
 * @property {Object<string, Object>} variants Variant ID → field overrides. Use `{}` for control.
 */

/**
 * Docs video modal configuration.
 *
 * Closing a modal stores its `id` in `localStorage`, so the ID must remain unique and stable.
 * The YouTube `embedId` is used to build the thumbnail URL. Supporting text is optional.
 *
 * @typedef {Object} VideoModalConfig
 * @property {string} id Unique, stable modal identifier.
 * @property {string} [embedId] YouTube video ID used for the thumbnail.
 * @property {string} title Modal heading and thumbnail accessible label.
 * @property {string} [description] Optional supporting text.
 * @property {ModalTargeting} [targeting] Page targeting rules; omit to show on every page.
 * @property {ModalDestination} [destination] Thumbnail and CTA destination. Required unless
 *   `copyPrompt` is set.
 * @property {string} [copyPrompt] When set, the card renders a single-line prompt field and a
 *   "Copy prompt" button instead of a video thumbnail and destination link. Copying the prompt
 *   (button or manual) dismisses the card for good, like closing it.
 * @property {ModalExperiment} [experiment] Optional A/B test on this modal's fields.
 */

/**
 * Video modals are temporarily disabled: no videos pop up on doc pages for now.
 *
 * The modal capability is fully intact. To re-enable, move the entries below back into the
 * `MODALS` array (or add new ones).
 *
 * @type {VideoModalConfig[]}
 */
const MODALS = [
  {
    id: 'docs-agent-setup',
    title: 'Set up your agent',
    description:
      'Neon users who install MCP and skills get to production 3x faster. It only takes 2 minutes!',
    targeting: { all: true },
    copyPrompt: BASE_AGENT_PROMPT,
    experiment: {
      id: 'docs-agent-setup-title',
      variants: {
        control: {},
        'onboard-your-agent': { title: 'Onboard your agent' },
        'neon-superpowers': { title: 'Give your agent Neon superpowers' },
      },
    },
  },
];

/**
 * Disabled modal configurations, kept for easy re-enabling.
 *
 * @type {VideoModalConfig[]}
 */
// eslint-disable-next-line no-unused-vars
const DISABLED_MODALS = [
  {
    id: 'serverless-video',
    embedId: 'llSTZMVrbx8',
    title: 'Watch: Neon Database',
    description: 'See Neon in action and learn how it simplifies working with Postgres.',
    targeting: {
      pages: ['/docs/introduction/serverless'],
    },
    destination: {
      label: 'Learn about autoscaling',
      url: '/docs/introduction/autoscaling',
    },
  },
  {
    id: 'autoscaling-video',
    embedId: 'ZnxLCOkb_R0',
    title: 'Watch: Autoscaling in action',
    description: 'See how Neon adjusts compute resources to match your workload.',
    targeting: {
      pages: ['/docs/introduction/autoscaling'],
    },
    destination: {
      label: 'Watch on YouTube',
      url: 'https://www.youtube.com/watch?v=ZnxLCOkb_R0',
    },
  },
];

export default MODALS;
