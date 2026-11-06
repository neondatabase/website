import fs from 'fs';

import { describe, it, expect } from 'vitest';

import { buildManifestContent, OUTPUT_FILE } from './generate-static-md-manifest';

describe('static-md-manifest', () => {
  it('committed manifest matches the current public/ tree', () => {
    const committed = fs.existsSync(OUTPUT_FILE) ? fs.readFileSync(OUTPUT_FILE, 'utf8') : '';
    // If this fails, a static .md under public/ was added/removed/renamed without
    // regenerating. Run: npm run generate:static-md-manifest  and commit.
    expect(committed).toBe(buildManifestContent());
  });
});
