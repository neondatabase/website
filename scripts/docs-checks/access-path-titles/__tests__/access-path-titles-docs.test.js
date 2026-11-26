import { createRequire } from 'module';
import path from 'path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const { validate } = require('../validate.js');

const REPO_ROOT = path.join(import.meta.dirname, '..', '..', '..', '..');

describe('access path in docs titles', () => {
  it('a title naming Lakebase Postgres keeps "on Neon" when the subtitle says it', () => {
    const { errors, pages } = validate();

    if (errors.length > 0) {
      console.error(
        [
          '',
          `Checked ${pages.length} pages: ${errors.length} error(s).`,
          ...errors.map((e) => `  ${path.relative(REPO_ROOT, e.file)}:${e.line}  ${e.message}`),
          '',
        ].join('\n')
      );
    }

    expect(errors, `${errors.length} docs title(s) drop Neon (see above)`).toEqual([]);
  });
});
