import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

import {
  AGENTS,
  CAPABILITY_CARDS,
  FOUNDATION_CARD,
  FRAMEWORKS,
  GUIDED_PATHS,
  HERO_LINKS,
  fallbackPrompt,
  markdownUrl,
  promptProps,
} from './docs-home-links';

const DOCS_DIR = path.resolve(process.cwd(), 'content/docs');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

const readPage = (to) => {
  const slug = to.split('#')[0].replace(/^\/docs\//, '');
  const candidates = [path.join(DOCS_DIR, `${slug}.md`), path.join(DOCS_DIR, slug, 'index.md')];
  const file = candidates.find((candidate) => fs.existsSync(candidate));
  return file ? fs.readFileSync(file, 'utf8') : null;
};

// The prompt file the page shows in its own <AgentPrompt> or <CopyPrompt>.
const pagePromptSrc = (markdown) => {
  const match = markdown.match(/<(?:AgentPrompt|CopyPrompt)\b[^>]*?\bsrc="([^"]+)"/);
  return match ? match[1] : undefined;
};

const ITEMS = [
  ...HERO_LINKS,
  FOUNDATION_CARD,
  ...CAPABILITY_CARDS,
  ...FRAMEWORKS,
  ...AGENTS,
  ...GUIDED_PATHS,
].map((item) => ({ ...item, label: item.title || item.name }));

describe('docs home copy prompts', () => {
  it.each(ITEMS.map((item) => [item.label, item]))(
    '%s uses the prompt from its linked page',
    (_label, item) => {
      const markdown = readPage(item.to);
      expect(markdown, `No docs page for ${item.to}`).not.toBeNull();
      expect(item.promptSrc).toBe(pagePromptSrc(markdown));
      if (item.promptSrc) {
        expect(fs.existsSync(path.join(PUBLIC_DIR, item.promptSrc))).toBe(true);
      }
    }
  );

  it('builds the fallback from the markdown URL without the anchor', () => {
    const to = '/docs/ai/ai-cursor-plugin#install-the-plugin-in-cursor';
    expect(markdownUrl(to)).toBe('https://neon.com/docs/ai/ai-cursor-plugin.md');
    expect(fallbackPrompt(to)).toBe(
      'Fetch https://neon.com/docs/ai/ai-cursor-plugin.md and follow the setup in this guide.'
    );
  });

  it('prefers the page prompt over the fallback', () => {
    expect(
      promptProps({ to: '/docs/guides/nextjs', promptSrc: '/prompts/nextjs-prompt.md' })
    ).toEqual({ src: '/prompts/nextjs-prompt.md' });
    expect(promptProps({ to: '/docs/guides/react-router' })).toEqual({
      text: fallbackPrompt('/docs/guides/react-router'),
    });
  });
});
