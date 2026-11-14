// Agent prompts the docs show and copy, as Copybook definitions (https://copybook.dev).
// `npx copybook show <id>` prints one with where it's used and its history, and
// copybook/snapshots holds the rendered text, so every change shows up in review.
// ESM (.mjs) so the CommonJS build scripts can require it (Node.js 22.12+).

import { defineCommand, definePrompt, p } from '@copybook/core';

const AGENT_SETUP_URL = 'https://neon.com/prompts/agent-setup.md';

export const installSkills = defineCommand({
  id: 'website.cli.install-skills',
  title: 'Install Neon agent skills',
  template: (t) => t`npx neon@latest skills -y`,
});

// Copied by the docs "Set up agent" button, the docs home composer, and the setup card.
// The agent fetches the full setup prompt from the URL.
export const agentSetup = definePrompt({
  id: 'website.docs.agent-setup',
  title: 'Set me up for Neon',
  placements: ['docs/agent-setup-button', 'docs/home-composer', 'docs/setup-card'],
  params: {
    // A param so the docs home composer can highlight the URL it shows.
    url: p.url().default(AGENT_SETUP_URL),
    // A page-specific sentence from the `agentPrompt` frontmatter field.
    pageNote: p.string().optional(),
  },
  template: (t, { pageNote, url }) =>
    t`Set me up for Neon. Fetch ${url} and follow it.${pageNote ? ` ${pageNote}` : ''}`,
});

// The agent skills note under the location line of every generated .md docs page.
export const skillsNote = definePrompt({
  id: 'website.llms.skills-note',
  title: 'Agent skills note in Markdown docs pages',
  placements: ['docs/markdown-header'],
  template: (t) =>
    t`Agent skills: if you don't have Neon skills (such as \`neon-postgres\`), offer to add them to this project when you first need the user to do something in Neon: "Want me to add Neon's agent skills to this project? They help me with Neon setup, connections, and branching." Install: \`${t.cmd(installSkills)}\`. To also run Neon steps for the user (Neon CLI, sign-in, MCP), see ${AGENT_SETUP_URL}`,
});
