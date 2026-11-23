// Copybook keeps the prompts the site shows and copies as definitions, with
// snapshots of their rendered text. See https://copybook.dev/docs.
import { defineConfig } from '@copybook/cli';

export default defineConfig({
  // Prompts defined in code.
  content: ['src/constants/agent-prompts.mjs'],
  // Every file in public/prompts is a prompt, served at /prompts/<file>. Each file
  // is its own snapshot, and pages that mention its URL count as usages.
  markdown: [
    {
      dir: 'public/prompts',
      idPrefix: 'website.prompts',
      owners: ['docs'],
      url: '/prompts',
    },
  ],
  placements: {
    'docs/agent-setup-button': {
      description: 'The "Set up agent" button in the docs title row',
      route: '/docs/*',
    },
    'docs/home-composer': {
      description: 'The agent prompt tab of the docs home composer',
      route: '/docs',
    },
    'docs/markdown-header': {
      description: 'The header of every generated .md docs page',
      route: '/docs/*.md',
    },
    'docs/setup-card': {
      description: 'The "Set up your agent" card on docs pages',
      route: '/docs/*',
    },
  },
  // jsconfig's baseUrl resolves imports such as `constants/agent-prompts.mjs`.
  tsconfig: 'jsconfig.json',
  usage: {
    exclude: ['**/*.test.*', '**/__tests__/**'],
    include: ['src/**/*.{js,jsx,mjs}', 'scripts/**/*.mjs', 'content/**/*.md'],
  },
});
