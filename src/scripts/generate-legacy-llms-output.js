/**
 * Generate legacy LLMs output
 *
 * Processes content/docs/ to public/llms/ with the old flat .txt filenames
 * (e.g., guides-prisma.txt) for comparison with the previous system's output.
 *
 * Usage: node src/scripts/generate-legacy-llms-output.js
 *
 * This is a development tool, not used in production builds.
 */

const fs = require('fs').promises;
const path = require('path');

// Import from main processor
const {
  processFile,
  loadDependencies,
  clearState,
  printBuildSummary,
} = require('./process-md-for-llms.js');

/**
 * Exclusion rules matching Python's config.py
 * Python only processes content/docs/, not other content routes
 */
const LLMS_EXCLUDED_DIRS = ['shared-content', 'postgresql', 'unused', 'community', 'sdk'];
const LLMS_EXCLUDED_FILES = ['README.md', 'index.md', '_index.md', 'GUIDE_TEMPLATE.md'];
const LLMS_EXCLUDED_PATTERNS = ['guides/neon-rls*'];
const LLMS_INCLUDED_FILES = ['guides/neon-rls-drizzle.md']; // Override pattern exclusion

/**
 * Check if a file should be excluded based on Python's rules
 */
function shouldExcludeFile(relativePath, filename) {
  // Check excluded files
  if (LLMS_EXCLUDED_FILES.includes(filename)) {
    return true;
  }

  // Check excluded directories (any part of path)
  const parts = relativePath.split('/');
  if (parts.some((part) => LLMS_EXCLUDED_DIRS.includes(part))) {
    return true;
  }

  // Check if explicitly included (takes precedence over patterns)
  if (LLMS_INCLUDED_FILES.includes(relativePath)) {
    return false;
  }

  // Check excluded patterns (simple glob matching)
  for (const pattern of LLMS_EXCLUDED_PATTERNS) {
    // Convert glob pattern to regex
    const regex = new RegExp(`^${pattern.replace('*', '.*')}$`);
    if (regex.test(relativePath)) {
      return true;
    }
  }

  return false;
}

/**
 * Process all content to public/llms/ with Python-style flat filenames
 * e.g., content/docs/guides/prisma.md -> public/llms/guides-prisma.txt
 *
 * Matches Python behavior: only processes content/docs/ with same exclusions
 */
async function processToLlmsDir(rootDir) {
  clearState();

  const docsDir = path.join(rootDir, 'content', 'docs');
  const outputDir = path.join(rootDir, 'public/llms');

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  let totalFiles = 0;
  let skippedFiles = 0;
  let errorCount = 0;
  const processingErrors = [];

  console.log(`Processing content/docs/ (matching Python exclusion rules)...`);

  // Recursively find all .md files
  async function processDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(docsDir, fullPath);

      if (entry.isDirectory()) {
        // Skip excluded directories
        if (LLMS_EXCLUDED_DIRS.includes(entry.name)) {
          console.log(`  Skipping directory: ${entry.name}/`);
          continue;
        }
        await processDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        // Check exclusion rules
        if (shouldExcludeFile(relativePath, entry.name)) {
          skippedFiles++;
          continue;
        }

        // Build flat output filename like Python does
        const flatName = relativePath.replace(/\.md$/, '.txt').replace(/\//g, '-');
        const outputPath = path.join(outputDir, flatName);

        // Build page URL for this file
        const pageUrl = `https://neon.com/docs/${relativePath.replace(/\.md$/, '')}`;

        try {
          const result = await processFile(fullPath, pageUrl, rootDir);
          await fs.writeFile(outputPath, result);
          totalFiles++;
        } catch (error) {
          console.error(`  ✗ ${flatName}: ${error.message}`);
          processingErrors.push({ file: fullPath, error: error.message });
          errorCount++;
        }
      }
    }
  }

  await processDir(docsDir);

  // Build summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('Processing complete:');
  console.log(`- Files processed: ${totalFiles}`);
  console.log(`- Files skipped: ${skippedFiles} (excluded by rules)`);
  if (errorCount > 0) {
    console.log(`- Errors: ${errorCount}`);
  }

  printBuildSummary(rootDir);
  console.log('='.repeat(50));
}

/**
 * CLI
 */
async function main() {
  const rootDir = path.resolve(__dirname, '../..');

  console.log('Generating LLMs comparison output...\n');

  // Load dependencies first
  await loadDependencies();

  await processToLlmsDir(rootDir);

  console.log('\nDone! Run `git diff public/llms/` to compare with Python output.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
