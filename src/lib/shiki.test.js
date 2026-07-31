import { describe, expect, it } from 'vitest';

import highlight from './shiki';

// The shell-placeholders transformer: `<slug>`-style placeholders must
// render as a single token instead of being split by the bash grammar's
// redirection tokenization (`<slu` + `g>`).
describe('highlight shell placeholders', () => {
  it('renders a placeholder as one unsplit token in bash', async () => {
    const html = await highlight('neonctl functions deploy <slug> [options]', 'bash');
    expect(html).toContain('&#x3C;slug></span>');
    expect(html).not.toMatch(/&#x3C;slu</); // no split after "<slu"
  });

  it('handles multiple placeholders and pipes on one line', async () => {
    const html = await highlight('neonctl branches rename <id|name> <new-name>', 'bash');
    expect(html).toContain('&#x3C;id|name></span>');
    expect(html).toContain('&#x3C;new-name></span>');
  });

  it('leaves real redirections alone', async () => {
    const html = await highlight('echo hi > out.txt', 'bash');
    expect(html).toContain('out.txt');
  });

  it('does not touch non-shell languages', async () => {
    const html = await highlight('const a = 1;', 'js');
    expect(html).toContain('const');
  });
});
