import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const prompt = readFileSync(join(process.cwd(), 'public', 'get-started', 'prompt.md'), 'utf8');

// `neon login` completes only through a browser redirect to 127.0.0.1 on the CLI's machine.
describe('get-started prompt sign-in', () => {
  it('checks for an existing credential before starting a browser sign-in', () => {
    const check = prompt.indexOf('```bash\nneon me\n```');
    expect(check).toBeGreaterThan(-1);
    expect(check).toBeLessThan(prompt.indexOf('`neon login`'));
  });

  it('gives an API-key path when no browser on the CLI machine can finish sign-in', () => {
    expect(prompt).toContain('`NEON_API_KEY`');
    expect(prompt).toContain('https://neon.com/docs/manage/api-keys.md');
  });
});
