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
Usage: node compare-md-conversion.js <file-path> [options]

Examples:
  node compare-md-conversion.js content/docs/guides/prisma.md
  node compare-md-conversion.js content/postgresql/postgresql-getting-started.md
  node compare-md-conversion.js prisma                    # shorthand for docs/guides/prisma.md

Options:
  --python  Compare with Python output (public/llms/) instead of original
  --both    Show both comparisons
`);
    return;
  }

  const inputArg = args[0];
  const showPython = args.includes('--python');
  const showBoth = args.includes('--both');
  const showOriginal = !showPython || showBoth;

  const projectRoot = path.resolve(__dirname, '../..');

  // Resolve input path - support full path or shorthand for guides
  let inputPath;
  if (inputArg.includes('/') || inputArg.endsWith('.md')) {
    // Full or partial path provided
    inputPath = inputArg.startsWith('/') ? inputArg : path.join(projectRoot, inputArg);
  } else {
    // Shorthand: just the guide name (e.g., "prisma")
    inputPath = path.join(projectRoot, `content/docs/guides/${inputArg}.md`);
  }

  // Calculate page URL from path
  const relativePath = path.relative(path.join(projectRoot, 'content'), inputPath);
  const urlPath = relativePath.replace(/\.md$/, '');
  const pageUrl = `https://neon.com/${urlPath}`;

  // Calculate Python output path (flat filename)
  const pythonFileName = relativePath.replace(/\.md$/, '.txt').replace(/\//g, '-');
  const pythonPath = path.join(projectRoot, `public/llms/${pythonFileName}`);

  // Check files exist
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: ${inputPath} not found`);
    process.exit(1);
  }

  // Load and process
  const { processFile } = require('./process-md-for-llms.js');
  const converted = await processFile(inputPath, pageUrl);

  // Write converted to temp file
  const baseName = path.basename(inputPath, '.md');
  const tempFile = `/tmp/converted-${baseName}.txt`;
  fs.writeFileSync(tempFile, converted);

  if (showOriginal || showBoth) {
    console.log('='.repeat(60));
    console.log('DIFF: Original MDX vs Converted');
    console.log('='.repeat(60));
    try {
      execSync(`diff -u "${inputPath}" "${tempFile}"`, { stdio: 'inherit' });
      console.log('(no differences)');
    } catch (e) {
      // diff returns exit code 1 when there are differences
    }
  }

  if (showPython || showBoth) {
    if (showBoth) console.log('\n');
    console.log('='.repeat(60));
    console.log('DIFF: Python Output vs Converted');
    console.log('='.repeat(60));

    if (!fs.existsSync(pythonPath)) {
      console.log(`(Python output not found: ${pythonPath})`);
    } else {
      try {
        execSync(`diff -u "${pythonPath}" "${tempFile}"`, { stdio: 'inherit' });
        console.log('(no differences)');
      } catch (e) {
        // diff returns exit code 1 when there are differences
      }
    }
  }

  console.log(`\nConverted output saved to: ${tempFile}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
