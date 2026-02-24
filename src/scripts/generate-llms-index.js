#!/usr/bin/env node
/**
 * Generate llms.txt index file (Table of Contents)
 *
 * Scans content directories and generates an index linking to processed markdown files.
 * Section ordering, descriptions, exclusions, and collapses are controlled by llms-index-config.js.
 * New pages auto-include; the config only shapes the output.
 *
 * Usage:
 *   node generate-llms-index.js              # Write to public/docs/llms.txt
 *   node generate-llms-index.js --dry-run    # Print to console
 */

const fs = require('fs').promises;
const path = require('path');

const matter = require('gray-matter');

const { CONTENT_ROUTES } = require('../constants/content');

const config = require('./llms-index-config');

const BASE_URL = 'https://neon.com';
const OUTPUT_PATH = 'public/docs/llms.txt';

const EXCLUDED_DIRS = ['shared-content', 'unused'];
const EXCLUDED_FILES = ['README.md', 'index.md', '_index.md'];

const COLLAPSED_ROUTES = config.collapsedRoutes || {};

// Combine explicit excludePaths with sourcePaths from additionalResources
const ALL_EXCLUDE_PATHS = [
  ...config.excludePaths,
  ...(config.additionalResources || []).filter((r) => r.sourcePath).map((r) => r.sourcePath),
];

/** Display names for path segments and route keys */
const SECTION_DISPLAY_NAMES = {
  ai: 'AI',
  'data-api': 'Data API',
  postgresql: 'PostgreSQL',
  'use-cases': 'Solutions',
  programs: 'Solutions',
  'get-started': 'Get Started',
};

/**
 * Convert directory/file name to title case.
 * Uses SECTION_DISPLAY_NAMES for known casing/aliases.
 */
function toTitleCase(str) {
  const key = str.toLowerCase();
  if (SECTION_DISPLAY_NAMES[key]) return SECTION_DISPLAY_NAMES[key];
  return str
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Scan a directory recursively and collect document metadata.
 * @param {string} dirPath - absolute path to content directory
 * @param {string} baseContentPath - absolute path to content/ root (for URL generation)
 * @param {string} routeKey - the route key from CONTENT_ROUTES (used as fallback section name)
 */
async function scanDirectory(dirPath, baseContentPath, routeKey) {
  const docs = [];
  const excludeMatchCounts = new Map();
  for (const prefix of ALL_EXCLUDE_PATHS) {
    excludeMatchCounts.set(prefix, 0);
  }

  const collapsedSections = new Set(config.sections.filter((s) => s.collapse).map((s) => s.name));

  async function scan(currentPath, relativePath = '') {
    let entries;
    try {
      entries = await fs.readdir(currentPath, { withFileTypes: true });
    } catch (err) {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        if (EXCLUDED_DIRS.includes(entry.name)) continue;
        if (!relativePath && collapsedSections.has(toTitleCase(entry.name))) continue;
        await scan(fullPath, relPath);
      } else if (entry.name.endsWith('.md')) {
        if (EXCLUDED_FILES.includes(entry.name)) continue;

        // Check config excludePaths
        const excluded = ALL_EXCLUDE_PATHS.find((prefix) => relPath.startsWith(prefix));
        if (excluded) {
          excludeMatchCounts.set(excluded, (excludeMatchCounts.get(excluded) || 0) + 1);
          continue;
        }

        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          const { data: frontmatter } = matter(content);

          const pathParts = relPath.split('/');
          // Use route key as section name for flat routes (files at root of scanned dir)
          const section = pathParts.length > 1 ? toTitleCase(pathParts[0]) : toTitleCase(routeKey);
          const subSection = pathParts.length > 2 ? toTitleCase(pathParts[1]) : null;

          const title = frontmatter.title || toTitleCase(path.basename(entry.name, '.md'));
          const subtitle = frontmatter.subtitle || '';

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
  return { docs, excludeMatchCounts };
}

/**
 * Apply reclassification rules from config
 */
function applyReclassifications(allDocs) {
  const reclassifyKeys = new Set(Object.keys(config.reclassify));
  const matched = new Set();
  const prefixRules = config.reclassifyPrefixes || [];
  const prefixMatchCounts = new Map(prefixRules.map((r) => [r.pathPrefix, 0]));

  for (const doc of allDocs) {
    // Exact-path rules take priority
    const rule = config.reclassify[doc.path];
    if (rule) {
      matched.add(doc.path);
      if (rule.subsection) doc.subSection = rule.subsection;
      if (rule.section) doc.section = rule.section;
      continue;
    }

    // Prefix rules (first match wins)
    for (const prefixRule of prefixRules) {
      if (doc.path.startsWith(prefixRule.pathPrefix)) {
        prefixMatchCounts.set(
          prefixRule.pathPrefix,
          prefixMatchCounts.get(prefixRule.pathPrefix) + 1
        );
        if (prefixRule.section) doc.section = prefixRule.section;
        if (prefixRule.subsection) doc.subSection = prefixRule.subsection;
        break;
      }
    }
  }

  // Warn about prefix rules that didn't match anything
  for (const [prefix, count] of prefixMatchCounts) {
    if (count === 0) {
      console.warn(`Warning: reclassifyPrefixes "${prefix}" matched no documents`);
    }
  }

  // Warn about reclassify targets that didn't match
  for (const key of reclassifyKeys) {
    if (!matched.has(key)) {
      console.warn(`Warning: reclassify target "${key}" not found in scanned docs`);
    }
  }
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
 * Build section order: configured sections first, then remaining alphabetically
 */
function getSectionOrder(organized) {
  const configuredNames = config.sections.map((s) => s.name);
  const allSections = Object.keys(organized);
  const ordered = [];

  // Configured sections in order (if they have entries or are collapsed)
  for (const sectionConf of config.sections) {
    if (organized[sectionConf.name] || sectionConf.collapse) {
      ordered.push(sectionConf.name);
    }
  }

  // Remaining sections alphabetically
  const remaining = allSections.filter((s) => !configuredNames.includes(s)).sort();
  ordered.push(...remaining);

  return ordered;
}

/**
 * Get config entry for a section by name
 */
function getSectionConfig(sectionName) {
  return config.sections.find((s) => s.name === sectionName);
}

/**
 * Generate the index text
 */
function generateIndexText(organized, tagline, collapsedEntries = []) {
  const lines = [];

  lines.push('# Neon Postgres');
  lines.push('');
  if (tagline) {
    lines.push(`> ${tagline}`);
    lines.push('');
  }
  if (config.intro) {
    lines.push(config.intro);
    lines.push('');
  }

  const sections = getSectionOrder(organized);

  for (const section of sections) {
    const sectionConf = getSectionConfig(section);

    // Handle collapsed sections
    if (sectionConf && sectionConf.collapse) {
      const { title, url, description } = sectionConf.collapse;
      lines.push(`## ${section}`);
      lines.push('');
      if (sectionConf.description) {
        lines.push(sectionConf.description);
        lines.push('');
      }
      const desc = description ? `: ${description}` : '';
      lines.push(`- [${title}](${url})${desc}`);
      lines.push('');
      continue;
    }

    const sectionData = organized[section];

    lines.push(`## ${section}`);
    lines.push('');

    if (sectionConf && sectionConf.description) {
      lines.push(sectionConf.description);
      lines.push('');
    }

    const directFiles = sectionData._files.sort((a, b) => a.title.localeCompare(b.title));
    for (const doc of directFiles) {
      const description = doc.subtitle ? `: ${doc.subtitle}` : '';
      lines.push(`- [${doc.title}](${doc.url})${description}`);
    }

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

  const extras = config.additionalResources || [];
  if (collapsedEntries.length > 0 || extras.length > 0) {
    lines.push('## Additional Resources');
    lines.push('');
    for (const entry of [...collapsedEntries, ...extras]) {
      const desc = entry.description ? `: ${entry.description}` : '';
      lines.push(`- [${entry.title}](${entry.url})${desc}`);
    }
    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

/**
 * Extract intro paragraph from introduction.md (used as the > tagline)
 */
async function getIntroText(contentPath) {
  try {
    const introPath = path.join(contentPath, 'docs/introduction.md');
    const content = await fs.readFile(introPath, 'utf-8');
    const { content: body } = matter(content);

    const paragraphs = body.split('\n\n');
    for (const p of paragraphs) {
      const trimmed = p.trim();
      if (trimmed && !trimmed.startsWith('<') && !trimmed.startsWith('#')) {
        return trimmed.replace(/<[^>]+>/g, '').trim();
      }
    }
  } catch (err) {
    console.warn('Could not read introduction.md for intro text');
  }
  return null;
}

/**
 * Validate config against scanned results and emit warnings
 */
function validateConfig(organized, allExcludeMatchCounts) {
  // Warn about excludePaths that matched nothing across all routes
  for (const [prefix, count] of allExcludeMatchCounts) {
    if (count === 0) {
      console.warn(`Warning: excludePath "${prefix}" matched no files`);
    }
  }

  // Warn about configured sections with zero entries (excluding collapsed ones)
  for (const sectionConf of config.sections) {
    if (sectionConf.collapse) continue;
    if (!organized[sectionConf.name]) {
      console.warn(`Warning: configured section "${sectionConf.name}" has no entries`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const projectRoot = path.resolve(__dirname, '../..');
  const contentPath = path.join(projectRoot, 'content');

  console.log('Scanning content directories...\n');

  const allDocs = [];
  const collapsedEntries = [];
  const allExcludeMatchCounts = new Map();
  for (const prefix of ALL_EXCLUDE_PATHS) {
    allExcludeMatchCounts.set(prefix, 0);
  }

  for (const [route, srcPath] of Object.entries(CONTENT_ROUTES)) {
    if (COLLAPSED_ROUTES[route]) {
      const collapsed = COLLAPSED_ROUTES[route];
      collapsedEntries.push({
        title: collapsed.title,
        description: collapsed.description,
        url: collapsed.url,
      });
      console.log(`  ${route}: (collapsed to single entry)`);
      continue;
    }

    const fullPath = path.join(projectRoot, srcPath);
    const { docs, excludeMatchCounts } = await scanDirectory(fullPath, contentPath, route);

    // Merge exclude match counts
    for (const [prefix, count] of excludeMatchCounts) {
      allExcludeMatchCounts.set(prefix, (allExcludeMatchCounts.get(prefix) || 0) + count);
    }

    allDocs.push(...docs);
    console.log(`  ${route}: ${docs.length} files`);
  }

  console.log(
    `\nTotal: ${allDocs.length} documents + ${collapsedEntries.length} collapsed entries\n`
  );

  applyReclassifications(allDocs);

  const organized = organizeDocs(allDocs);
  const tagline = await getIntroText(contentPath);
  const indexContent = generateIndexText(organized, tagline, collapsedEntries);

  validateConfig(organized, allExcludeMatchCounts);

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
