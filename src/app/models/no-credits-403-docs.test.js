import fs from 'fs';
import path from 'path';

import { describe, it, expect } from 'vitest';

// The gateway's no-credits 403 says the plan is the problem, so the docs are where readers learn
// that buying credits fixes it. The status tables are prose, so nothing keeps them in step.
const docsDir = path.resolve(__dirname, '../../../content/docs/ai-gateway');
const read = (file) => fs.readFileSync(path.join(docsDir, file), 'utf-8');
const anchor = '403-no-ai-gateway-credits';

describe('the no-credits 403 in the AI Gateway docs', () => {
  it('has a troubleshooting entry that names the reason code readers search for', () => {
    const doc = read('troubleshooting.md');
    const heading = doc.match(new RegExp(`^### .*\\(#${anchor}\\)$`, 'm'));
    expect(heading).not.toBeNull();
    const rest = doc.slice(heading.index + heading[0].length);
    const entry = rest.slice(0, rest.search(/^##/m));

    expect(entry).toContain('paid_plan_required');
  });

  it('is linked from every status table that lists 403 causes', () => {
    const pages = fs
      .readdirSync(docsDir)
      .filter((file) => file.endsWith('.md') && /^\|\s*`403\b/m.test(read(file)));
    expect(pages.length).toBeGreaterThan(0);

    for (const file of pages) {
      expect(read(file), file).toContain(`/docs/ai-gateway/troubleshooting#${anchor}`);
    }
  });
});
