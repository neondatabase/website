/**
 * One-time script to generate a redirect map from old /llms/*.txt URLs
 * to new canonical .md URLs.
 *
 * Approach:
 * 1. List all .md files in content/docs/ and content/pages/use-cases/
 * 2. For each, compute what its old flat .txt filename would have been
 * 3. Check if that .txt file actually exists in public/llms/
 * 4. If yes, record the mapping: oldFilename -> newCanonicalUrl
 *
 * This cross-referencing approach guarantees zero ambiguity (no need to
 * reverse the flat naming convention) and only includes files that actually
 * had .txt counterparts.
 *
 * Usage: node src/scripts/generate-llms-redirect-map.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const DOCS_DIR = path.join(ROOT, 'content/docs');
const USE_CASES_DIR = path.join(ROOT, 'content/pages/use-cases');
const LLMS_DIR = path.join(ROOT, 'public/llms');
const OUTPUT_FILE = path.join(ROOT, 'src/utils/llms-redirect-map.json');

// Collect all existing .txt filenames from public/llms/
const existingTxtFiles = new Set(fs.readdirSync(LLMS_DIR).filter((f) => f.endsWith('.txt')));

console.log(`Found ${existingTxtFiles.size} .txt files in public/llms/`);

const redirectMap = {};
let matchCount = 0;

/**
 * Recursively find all .md files in a directory.
 * Returns paths relative to the given base directory.
 */
function findMdFiles(dir, base = dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdFiles(fullPath, base));
    } else if (entry.name.endsWith('.md')) {
      results.push(path.relative(base, fullPath));
    }
  }
  return results;
}

// --- Process content/docs/ ---
// Flat name: relative path with / -> - and .md -> .txt
// Canonical URL: /docs/<relative path with .md extension>
const docFiles = findMdFiles(DOCS_DIR);
for (const relPath of docFiles) {
  const flatName = relPath.replace(/\.md$/, '.txt').replace(/\//g, '-');
  if (existingTxtFiles.has(flatName)) {
    const canonicalUrl = `/docs/${relPath.replace(/\.md$/, '.md')}`;
    redirectMap[flatName] = canonicalUrl;
    existingTxtFiles.delete(flatName); // Mark as matched
    matchCount++;
  }
}

// --- Process content/pages/use-cases/ ---
// Flat name: use-cases-<filename>.txt
// Canonical URL: /use-cases/<filename>.md
const useCaseFiles = findMdFiles(USE_CASES_DIR);
for (const relPath of useCaseFiles) {
  const flatName = `use-cases-${relPath.replace(/\.md$/, '.txt').replace(/\//g, '-')}`;
  if (existingTxtFiles.has(flatName)) {
    const canonicalUrl = `/use-cases/${relPath.replace(/\.md$/, '.md')}`;
    redirectMap[flatName] = canonicalUrl;
    existingTxtFiles.delete(flatName);
    matchCount++;
  }
}

// Report results
console.log(`Matched ${matchCount} files to redirect entries`);

if (existingTxtFiles.size > 0) {
  console.log(`\nUnmatched .txt files (${existingTxtFiles.size}):`);
  for (const f of [...existingTxtFiles].sort()) {
    console.log(`  - ${f}`);
  }
}

// Sort keys for readability and write
const sorted = {};
for (const key of Object.keys(redirectMap).sort()) {
  sorted[key] = redirectMap[key];
}

fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(sorted, null, 2)  }\n`);
console.log(`\nWrote ${Object.keys(sorted).length} entries to ${path.relative(ROOT, OUTPUT_FILE)}`);
