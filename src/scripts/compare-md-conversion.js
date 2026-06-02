#!/usr/bin/env node
/**
 * Dev tool: Compare MDX conversion output
 *
 * Usage:
 *   node compare-md-conversion.js content/docs/guides/prisma.md
 *   node compare-md-conversion.js content/postgresql/postgresql-getting-started.md
 *   node compare-md-conversion.js prisma                    # shorthand for docs/guides/
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Usage: node compare-md-conversion.js <file-path>

Examples:
  node compare-md-conversion.js content/docs/guides/prisma.md
  node compare-md-conversion.js content/postgresql/postgresql-getting-started.md
  node compare-md-conversion.js prisma                    # shorthand for docs/guides/prisma.md
`);
    return;
  }

  const inputArg = args[0];

  const projectRoot = path.resolve(__dirname, '../..');

  let inputPath;
  if (inputArg.includes('/') || inputArg.endsWith('.md')) {
    inputPath = inputArg.startsWith('/') ? inputArg : path.join(projectRoot, inputArg);
  } else {
    inputPath = path.join(projectRoot, `content/docs/guides/${inputArg}.md`);
  }

  const relativePath = path.relative(path.join(projectRoot, 'content'), inputPath);
  const urlPath = relativePath.replace(/\.md$/, '');
  const pageUrl = `https://neon.com/${urlPath}`;

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: ${inputPath} not found`);
    process.exit(1);
  }

  const {
    processFile,
    buildNavigationMap,
    addNavigationContext,
  } = require('./process-md-for-llms.js');
  let converted = await processFile(inputPath, pageUrl);

  // Add breadcrumb header and navigation footer (same as processDirectory does)
  const navMap = buildNavigationMap(projectRoot);
  converted = addNavigationContext(converted, relativePath, navMap);

  const baseName = path.basename(inputPath, '.md');
  const tempFile = `/tmp/converted-${baseName}.txt`;
  fs.writeFileSync(tempFile, converted);

  console.log('='.repeat(60));
  console.log('DIFF: Original MDX vs Converted');
  console.log('='.repeat(60));
  try {
    execSync(`diff -u "${inputPath}" "${tempFile}"`, { stdio: 'inherit' });
    console.log('(no differences)');
  } catch (_e) {
    // diff returns exit code 1 when there are differences
  }

  console.log(`\nConverted output saved to: ${tempFile}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
