import fs from 'fs';
import path from 'path';

import { describe, it, expect } from 'vitest';

// Readers paste these handlers into their own repos, and eslint-config-next (what
// create-next-app generates) warns on anonymous default exports through
// import/no-anonymous-default-export.
const FUNCTIONS_DOCS = path.resolve(__dirname, '../content/docs/compute/functions');
const ANONYMOUS_DEFAULT_EXPORT =
  /^\s*export default (?:\{|(?:async\s*)?\(|(?:async\s+)?function\s*\*?\s*\(|(?:async\s+)?[\w$]+\s*=>)/;

const markdownFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });

const anonymousDefaultExports = (file) => {
  const hits = [];
  let inFence = false;
  fs.readFileSync(file, 'utf-8')
    .split('\n')
    .forEach((line, index) => {
      if (line.trimStart().startsWith('```')) inFence = !inFence;
      else if (inFence && ANONYMOUS_DEFAULT_EXPORT.test(line)) {
        hits.push(`${path.relative(FUNCTIONS_DOCS, file)}:${index + 1}: ${line.trim()}`);
      }
    });
  return hits;
};

describe('Neon Functions docs code samples', () => {
  it('name the default export', () => {
    expect(markdownFiles(FUNCTIONS_DOCS).flatMap(anonymousDefaultExports)).toEqual([]);
  });
});
