import { createRequire } from 'module';
import path from 'path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const { loadSchema } = require('../schema.js');
const { validate } = require('../validate.js');

const REPO_ROOT = path.join(import.meta.dirname, '..', '..', '..', '..');

function relPath(file) {
  return path.relative(REPO_ROOT, file) || file;
}

describe('neonctl docs validation', () => {
  it('every neonctl/neon example in content/**/*.md uses real commands and options', () => {
    const schema = loadSchema();
    const { errors, invocations } = validate({ schema });

    if (errors.length > 0) {
      const lines = [
        '',
        `Checked ${invocations.length} invocations against neonctl ${schema.neonctlVersion}: ${errors.length} error(s).`,
        'Fix the listed invocations, or refresh the schema:',
        '  node scripts/docs-checks/neonctl/generate-schema.js --src <path-to-neonctl-clone>',
        '',
        ...errors.map((e) => `  ${relPath(e.file)}:${e.line}  ${e.message}`),
        '',
      ];

      console.error(lines.join('\n'));
    }

    expect(errors, `${errors.length} doc example(s) failed validation (see above)`).toEqual([]);
  });
});
