#!/usr/bin/env node

/**
 * Script to validate that all image references in markdown files exist in the repository
 *
 * Usage:
 *   node scripts/validate-images.js
 *   node scripts/validate-images.js --fix  # Attempts to find and suggest corrections
 */

const fs = require('fs');
const path = require('path');

const { glob } = require('glob');

const args = process.argv.slice(2);
const fixMode = args.includes('--fix');

// Directories to search for markdown files
const CONTENT_DIR = path.join(__dirname, '../content');
const PUBLIC_DIR = path.join(__dirname, '../public');

// Regular expressions to match image references
const IMAGE_PATTERNS = [
  // Markdown image syntax: ![alt text](/path/to/image.png)
  /!\[([^\]]*)\]\(([^)]+)\)/g,
  // HTML img tags: <img src="/path/to/image.png" />
  /<img[^>]+src=["']([^"']+)["']/gi,
];

/**
 * Find all markdown files in the content directory
 */
async function findMarkdownFiles() {
  const patterns = [`${CONTENT_DIR}/**/*.md`, `${CONTENT_DIR}/**/*.mdx`];

  const files = await glob(patterns, {
    ignore: ['**/node_modules/**'],
  });

  return files;
}

/**
 * Find all excluded ranges in the content (code blocks, details tags, inline code)
 * Returns array of {start, end} character positions to exclude
 */
function findExcludedRanges(content) {
  const ranges = [];

  // Find fenced code blocks (``` or ~~~)
  const fencePattern = /^(\s*)(```|~~~).*$/gm;
  let inCodeBlock = false;
  let codeBlockStart = -1;
  let fence = null;
  let match;

  // Reset regex
  fencePattern.lastIndex = 0;
  const lines = content.split('\n');
  let currentPos = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceMatch = line.match(/^(\s*)(```|~~~)/);

    if (fenceMatch) {
      if (!inCodeBlock) {
        // Starting a code block
        inCodeBlock = true;
        codeBlockStart = currentPos;
        fence = fenceMatch[2];
      } else if (fenceMatch[2] === fence) {
        // Ending a code block
        ranges.push({ start: codeBlockStart, end: currentPos + line.length });
        inCodeBlock = false;
        codeBlockStart = -1;
        fence = null;
      }
    }

    currentPos += line.length + 1; // +1 for newline
  }

  // If still in code block at end, close it
  if (inCodeBlock) {
    ranges.push({ start: codeBlockStart, end: content.length });
  }

  // Find <details> tags and their contents
  const detailsPattern = /<details[\s\S]*?<\/details>/gi;
  while ((match = detailsPattern.exec(content)) !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length });
  }

  // Find inline code (text between backticks, but not triple backticks)
  // This matches single backticks and double backticks, but not triple
  const inlineCodePattern = /(?<!`)`(?!`)((?:\\.|[^`\\])+)`(?!`)/g;
  while ((match = inlineCodePattern.exec(content)) !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length });
  }

  return ranges;
}

/**
 * Check if a character position is within any excluded range
 */
function isInExcludedRange(position, excludedRanges) {
  return excludedRanges.some((range) => position >= range.start && position <= range.end);
}

/**
 * Clean image path by removing query parameters and title attributes
 */
function cleanImagePath(imagePath) {
  // Remove query parameters (e.g., ?alignright, ?width=500)
  let cleaned = imagePath.split('?')[0];

  // Remove title attributes (e.g., 'no-border', "no-border")
  // These appear in markdown as: ![alt](/path/to/image.png 'title')
  cleaned = cleaned.split(' ')[0];

  // Remove quotes if present
  cleaned = cleaned.replace(/^['"]|['"]$/g, '');

  return cleaned.trim();
}

/**
 * Extract image references from markdown content
 */
function extractImageReferences(content) {
  const images = [];
  const excludedRanges = findExcludedRanges(content);

  for (const pattern of IMAGE_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      // Skip if this image reference is inside an excluded range (code block, details tag, inline code)
      if (isInExcludedRange(match.index, excludedRanges)) {
        continue;
      }

      const lineNumber = content.substring(0, match.index).split('\n').length;

      // For markdown syntax, image path is in capture group 2
      // For HTML img tags, it's in capture group 1
      const imagePath = match[2] || match[1];

      // Skip external URLs
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        continue;
      }

      // Skip data URLs
      if (imagePath.startsWith('data:')) {
        continue;
      }

      // Clean the path (remove query params and title attributes)
      const cleanedPath = cleanImagePath(imagePath);

      images.push({
        path: cleanedPath,
        originalPath: imagePath,
        line: lineNumber,
        fullMatch: match[0],
      });
    }
  }

  return images;
}

/**
 * Resolve image path to actual file system path
 */
function resolveImagePath(imagePath) {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  // Image paths in markdown are relative to /public
  return path.join(PUBLIC_DIR, cleanPath);
}

/**
 * Find similar files that might be the intended target
 */
function findSimilarFiles(imagePath) {
  const dir = path.dirname(resolveImagePath(imagePath));
  const filename = path.basename(imagePath);
  const nameWithoutExt = path.parse(filename).name.toLowerCase();

  if (!fs.existsSync(dir)) {
    return [];
  }

  try {
    const filesInDir = fs.readdirSync(dir);
    const similarFiles = filesInDir.filter((file) => {
      const fileNameWithoutExt = path.parse(file).name.toLowerCase();
      // Check if the filename contains the search term or vice versa
      return (
        fileNameWithoutExt.includes(nameWithoutExt) || nameWithoutExt.includes(fileNameWithoutExt)
      );
    });

    return similarFiles.map((file) => path.join(dir, file));
  } catch (err) {
    return [];
  }
}

/**
 * Main validation function
 */
async function validateImages() {
  console.log('🔍 Scanning markdown files for image references...\n');

  const markdownFiles = await findMarkdownFiles();
  console.log(`Found ${markdownFiles.length} markdown files to check\n`);

  let totalImages = 0;
  let missingImages = 0;
  const errors = [];

  for (const mdFile of markdownFiles) {
    const content = fs.readFileSync(mdFile, 'utf-8');
    const images = extractImageReferences(content, mdFile);

    if (images.length === 0) continue;

    totalImages += images.length;

    for (const image of images) {
      const fullPath = resolveImagePath(image.path);

      if (!fs.existsSync(fullPath)) {
        missingImages++;

        const error = {
          file: path.relative(process.cwd(), mdFile),
          line: image.line,
          imagePath: image.path,
          originalPath: image.originalPath !== image.path ? image.originalPath : undefined,
          fullMatch: image.fullMatch,
          expectedPath: path.relative(process.cwd(), fullPath),
        };

        if (fixMode) {
          const similarFiles = findSimilarFiles(image.path);
          if (similarFiles.length > 0) {
            error.suggestions = similarFiles.map((f) => path.relative(PUBLIC_DIR, f));
          }
        }

        errors.push(error);
      }
    }
  }

  // Print results
  console.log('═'.repeat(80));
  console.log('VALIDATION RESULTS');
  console.log('═'.repeat(80));
  console.log(`Total images referenced: ${totalImages}`);
  console.log(`Missing images: ${missingImages}`);
  console.log(`Valid images: ${totalImages - missingImages}`);
  console.log('═'.repeat(80));

  if (errors.length > 0) {
    console.log('\n❌ MISSING IMAGES:\n');

    for (const error of errors) {
      console.log(`📄 File: ${error.file}:${error.line}`);
      console.log(`   Image reference: ${error.imagePath}`);
      if (error.originalPath) {
        console.log(`   Original reference: ${error.originalPath}`);
      }
      console.log(`   Expected at: ${error.expectedPath}`);
      console.log(`   Markdown: ${error.fullMatch}`);

      if (error.suggestions && error.suggestions.length > 0) {
        console.log(`   💡 Similar files found:`);
        error.suggestions.forEach((s) => console.log(`      - /${s}`));
      }

      console.log('');
    }

    console.log('─'.repeat(80));
    console.log(`Total: ${errors.length} broken image reference(s) found`);
    console.log('─'.repeat(80));

    process.exit(1);
  } else {
    console.log('\n✅ All image references are valid!\n');
    process.exit(0);
  }
}

// Run the validation
validateImages().catch((err) => {
  console.error('Error running validation:', err);
  process.exit(1);
});
