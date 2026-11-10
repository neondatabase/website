import fs from 'fs';

import { describe, expect, it } from 'vitest';

import toPromptGroups from './prompt-groups';

describe('toPromptGroups', () => {
  it('splits at blank lines and joins the opening sentence to the first group', () => {
    expect(toPromptGroups('Set me up.\n\n- One.\n\n- Two.\n- Three.')).toEqual([
      ['Set me up.', '- One.'],
      ['- Two.', '- Three.'],
    ]);
  });

  // Labels pair with groups by position, so a blank line added to or removed from
  // the prompt would silently shift the labels.
  it('has one SvelteKit guide label per prompt group', () => {
    const guide = fs.readFileSync('content/docs/guides/sveltekit.md', 'utf8');
    const labels = guide.match(/<PromptBlock[^>]*labels=\{\[([^\]]*)\]\}/)[1].match(/"[^"]*"/g);
    const prompt = fs.readFileSync('public/prompts/sveltekit-prompt.md', 'utf8');
    expect(labels).toHaveLength(toPromptGroups(prompt).length);
  });
});
