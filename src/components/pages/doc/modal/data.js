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
  {
    id: 'neon-database-video',
    embedId: 'llSTZMVrbx8',
    title: 'Watch: Neon Database',
    description: 'See Neon in action and learn how it simplifies working with Postgres.',
    targeting: {
      all: true,
      folders: [],
      pages: [],
    },
    destination: {
      label: 'Watch on YouTube',
      url: 'https://www.youtube.com/watch?v=llSTZMVrbx8',
    },
  },
  {
    id: 'branching-video',
    embedId: 'UuHnFlg66Io',
    title: 'Watch: Git for databases',
    description: 'See how Neon branching works in practice.',
    targeting: {
      all: true,
      folders: ['/docs/introduction', '/guides'],
      pages: ['/docs/introduction/branching', '/faqs/connection-errors'],
    },
    destination: {
      label: 'Watch the video',
      url: '/docs/introduction/branching',
    },
  },
];

export default MODALS;
