import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

import { MODEL_CATALOG_NOTE } from '../components/pages/doc/ai-gateway-model-index/model-rows';
import LINKS from '../constants/links';

import { renderAiGatewayMarkdown } from './generate-backend-platform-page-markdown';

// content/docs/ai-gateway/prepaid-credits.md is the source of truth: AI Gateway works on every
// plan, including Free, and inference draws down prepaid credits.
const STALE_CLAIMS = [
  /free during the (?:private )?preview/i,
  /launch and scale plans/i,
  /requires a paid plan/i,
  /any paid account/i,
];

const aiGatewayLines = (text) => text.split('\n').filter((line) => /AI Gateway/.test(line));

const expectNoStaleClaims = (lines) => {
  for (const line of lines) {
    for (const claim of STALE_CLAIMS) expect(line).not.toMatch(claim);
  }
};

const readRepoFile = (file) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');

describe('AI Gateway plan and pricing copy', () => {
  it('says the model catalog draws down prepaid credits', () => {
    expectNoStaleClaims([MODEL_CATALOG_NOTE]);
    expect(MODEL_CATALOG_NOTE).toMatch(/prepaid/i);
  });

  it('says on the product page that every plan, including Free, can use it', () => {
    const lines = aiGatewayLines(renderAiGatewayMarkdown(LINKS));

    expectNoStaleClaims(lines);
    expect(lines.some((line) => /every Neon plan, including Free/i.test(line))).toBe(true);
  });

  it.each(['public/index.md', 'content/blog/posts/generate-embeddings-with-neon-ai-gateway.md'])(
    'says in %s that any plan, including Free, can use it',
    (file) => {
      const lines = aiGatewayLines(readRepoFile(file));

      expectNoStaleClaims(lines);
      expect(lines.some((line) => /(?:any|every Neon) plan, including Free/i.test(line))).toBe(
        true
      );
    }
  );
});
