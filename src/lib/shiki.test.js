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

// The collapsible-sections transformer: `collapse={1-2}` wraps the lines in a
// <details> whose <summary> shows how many lines are hidden.
describe('highlight collapsible sections', () => {
  const code = 'const a = 1;\nconst b = 2;\nconst c = a + b;';

  it('wraps a collapsed range in details with a line count summary', async () => {
    const html = await highlight(code, 'js', 'collapse={1-2}');
    expect(html).toContain('<details class="collapsed-lines">');
    expect(html).toContain('2 collapsed lines</summary>');
    expect(html.match(/<details/g)).toHaveLength(1);
  });

  it('keeps line highlighting separate from collapse ranges', async () => {
    const html = await highlight(code, 'js', 'collapse={1} {3}');
    expect(html).toContain('1 collapsed line</summary>');
    expect(html).toMatch(/data-line="3" data-highlighted-line/);
    expect(html).not.toMatch(/data-line="1" data-highlighted-line/);
  });

  it('leaves code without collapse meta unchanged', async () => {
    const html = await highlight(code, 'js', '{2}');
    expect(html).not.toContain('<details');
  });
});
