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

  // Labels pair with groups by position, so a blank line added to or removed from a
  // prompt would silently shift the labels. Check every guide that uses PromptBlock.
  const usages = fs
    .readdirSync('content/docs/guides')
    .filter((file) => file.endsWith('.md'))
    .flatMap((file) => {
      const guide = fs.readFileSync(`content/docs/guides/${file}`, 'utf8');
      const match = guide.match(/<PromptBlock\s+src="([^"]+)"[^>]*labels=\{\[([^\]]*)\]\}/);
      return match ? [{ file, src: match[1], labels: match[2].match(/"[^"]*"/g) }] : [];
    });

  it.each(usages)('$file has one label per prompt group', ({ src, labels }) => {
    const prompt = fs.readFileSync(`public${src}`, 'utf8');
    expect(labels).toHaveLength(toPromptGroups(prompt).length);
  });
});
