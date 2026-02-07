#!/usr/bin/env node
/**
 * Generate llms.txt index file (Table of Contents)
 *
 * Scans content directories and generates an index linking to processed markdown files.
 * Sections are derived from directory structure, not hardcoded.
 *
 * Usage:
 *   node generate-llms-index.js              # Write to public/docs/llms.txt
 *   node generate-llms-index.js --dry-run    # Print to console
 */

const fs = require('fs').promises;
const path = require('path');

const matter = require('gray-matter');

const { CONTENT_ROUTES } = require('../constants/content');

const BASE_URL = 'https://neon.com';
const OUTPUT_PATH = 'public/docs/llms.txt';

// Files/dirs to exclude from individual listing
const EXCLUDED_DIRS = ['shared-content', 'unused'];
const EXCLUDED_FILES = ['README.md', 'index.md', '_index.md'];

// Routes to collapse to a single entry (instead of listing all files)
// These link to the HTML page, not individual markdown files
const COLLAPSED_ROUTES = {
  'docs/changelog': {
    title: 'Changelog',
    url: 'https://neon.com/docs/changelog',
    description: 'Latest updates and releases',
  },
  postgresql: {
    title: 'PostgreSQL Tutorial',
    url: 'https://neon.com/postgresql',
    description: 'Comprehensive PostgreSQL tutorial and reference',
  },
  guides: {
    title: 'Community Guides',
    url: 'https://neon.com/guides',
    description: 'Step-by-step tutorials for frameworks and tools',
  },
};

/**
 * Convert directory/file name to title case
 * e.g., "connect-intro" -> "Connect Intro"
 */
function toTitleCase(str) {
  return str
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Scan a directory recursively and collect document metadata
 */
// eslint-disable-next-line no-unused-vars
async function scanDirectory(dirPath, baseContentPath, _routePrefix) {
  const docs = [];

  async function scan(currentPath, relativePath = '') {
    let entries;
    try {
      entries = await fs.readdir(currentPath, { withFileTypes: true });
    } catch (err) {
      return; // Directory doesn't exist
    }

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        // Skip excluded directories
        if (EXCLUDED_DIRS.includes(entry.name)) continue;
        await scan(fullPath, relPath);
      } else if (entry.name.endsWith('.md')) {
        // Skip excluded files
        if (EXCLUDED_FILES.includes(entry.name)) continue;

        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          const { data: frontmatter } = matter(content);

          // Derive section from first directory level
          const pathParts = relPath.split('/');
          const section = pathParts.length > 1 ? toTitleCase(pathParts[0]) : 'General';
          const subSection = pathParts.length > 2 ? toTitleCase(pathParts[1]) : null;

          // Get title and subtitle from frontmatter
          const title = frontmatter.title || toTitleCase(path.basename(entry.name, '.md'));
          const subtitle = frontmatter.subtitle || '';

          // Build URL to markdown file (canonical path, without /md/ prefix)
          // e.g., https://neon.com/docs/guides/prisma.md
          // The server rewrite handles mapping to internal /md/ directory
          const mdPath = path.relative(baseContentPath, fullPath);
          const url = `${BASE_URL}/${mdPath}`;

          docs.push({
            section,
            subSection,
            title,
            subtitle,
            url,
            path: relPath,
          });
        } catch (err) {
          console.error(`Error reading ${fullPath}: ${err.message}`);
        }
      }
    }
  }

  await scan(dirPath);
  return docs;
}

/**
 * Organize docs into sections and subsections
 */
function organizeDocs(docs) {
  const organized = {};

  for (const doc of docs) {
    if (!organized[doc.section]) {
      organized[doc.section] = { _files: [], _subsections: {} };
    }

    if (doc.subSection) {
      if (!organized[doc.section]._subsections[doc.subSection]) {
        organized[doc.section]._subsections[doc.subSection] = [];
      }
      organized[doc.section]._subsections[doc.subSection].push(doc);
    } else {
      organized[doc.section]._files.push(doc);
    }
  }

  return organized;
}

/**
 * Generate the index text
 */
function generateIndexText(organized, introText, collapsedEntries = []) {
  const lines = [];

  // Header
  lines.push('# Neon Postgres');
  lines.push('');
  if (introText) {
    lines.push(`> ${introText}`);
    lines.push('');
  }

  // Sort sections alphabetically
  const sections = Object.keys(organized).sort();

  for (const section of sections) {
    const sectionData = organized[section];

    lines.push(`## ${section}`);
    lines.push('');

    // Direct files in section (sorted by title)
    const directFiles = sectionData._files.sort((a, b) => a.title.localeCompare(b.title));
    for (const doc of directFiles) {
      const description = doc.subtitle ? `: ${doc.subtitle}` : '';
      lines.push(`- [${doc.title}](${doc.url})${description}`);
    }

    // Subsections (sorted alphabetically)
    const subsections = Object.keys(sectionData._subsections).sort();
    for (const subsection of subsections) {
      if (directFiles.length > 0 || subsections.indexOf(subsection) > 0) {
        lines.push('');
      }
      lines.push(`### ${subsection}`);
      lines.push('');

      const subDocs = sectionData._subsections[subsection].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      for (const doc of subDocs) {
        const description = doc.subtitle ? `: ${doc.subtitle}` : '';
        lines.push(`- [${doc.title}](${doc.url})${description}`);
      }
    }

    lines.push('');
  }

  // Add collapsed entries at the end
  if (collapsedEntries.length > 0) {
    lines.push('## Additional Resources');
    lines.push('');
    for (const entry of collapsedEntries) {
      const description = entry.subtitle ? `: ${entry.subtitle}` : '';
      lines.push(`- [${entry.title}](${entry.url})${description}`);
    }
    lines.push('');
  }

  return `${lines.join('\n').trim()  }\n`;
}

/**
 * Extract intro paragraph from introduction.md
 */
async function getIntroText(contentPath) {
  try {
    const introPath = path.join(contentPath, 'docs/introduction.md');
    const content = await fs.readFile(introPath, 'utf-8');
    const { content: body } = matter(content);

    // Get first paragraph (skip MDX components)
    const paragraphs = body.split('\n\n');
    for (const p of paragraphs) {
      const trimmed = p.trim();
      // Skip MDX components and empty lines
      if (trimmed && !trimmed.startsWith('<') && !trimmed.startsWith('#')) {
        // Clean up any remaining MDX
        return trimmed.replace(/<[^>]+>/g, '').trim();
      }
    }
  } catch (err) {
    console.warn('Could not read introduction.md for intro text');
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const projectRoot = path.resolve(__dirname, '../..');
  const contentPath = path.join(projectRoot, 'content');

  console.log('Scanning content directories...\n');

  // Collect all docs from content routes
  const allDocs = [];
  const collapsedEntries = [];

  for (const [route, srcPath] of Object.entries(CONTENT_ROUTES)) {
    // Check if this route should be collapsed to a single entry
    if (COLLAPSED_ROUTES[route]) {
      const collapsed = COLLAPSED_ROUTES[route];
      collapsedEntries.push({
        section: 'Collapsed',
        title: collapsed.title,
        subtitle: collapsed.description,
        url: collapsed.url,
      });
      console.log(`  ${route}: (collapsed to single entry)`);
      continue;
    }

    const fullPath = path.join(projectRoot, srcPath);
    const docs = await scanDirectory(fullPath, contentPath, route);
    allDocs.push(...docs);
    console.log(`  ${route}: ${docs.length} files`);
  }

  console.log(
    `\nTotal: ${allDocs.length} documents + ${collapsedEntries.length} collapsed entries\n`
  );

  // Organize and generate
  const organized = organizeDocs(allDocs);
  const introText = await getIntroText(contentPath);
  const indexContent = generateIndexText(organized, introText, collapsedEntries);

  if (dryRun) {
    console.log('--- Generated llms.txt ---\n');
    console.log(indexContent);
  } else {
    const outputPath = path.join(projectRoot, OUTPUT_PATH);
    await fs.writeFile(outputPath, indexContent);
    console.log(`Written to ${outputPath}`);
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
