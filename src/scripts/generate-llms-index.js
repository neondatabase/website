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

const { DOCS_VERSIONS } = require('../constants/docs-versions');
const {
  resolveLatestDocsVersionId,
  resolveLegacyDocsVersionId,
} = require('../utils/docs-versioning');

const config = require('./llms-index-config');

const BASE_URL = 'https://neon.com';
const OUTPUT_PATH = 'public/docs/llms.txt';

const EXCLUDED_DIRS = ['shared-content', 'unused'];
const EXCLUDED_FILES = ['README.md', 'index.md', '_index.md'];

// Combine explicit excludePaths with sourcePaths from additionalResources
const ALL_EXCLUDE_PATHS = [
  ...config.excludePaths,
  ...(config.additionalResources || []).filter((r) => r.sourcePath).map((r) => r.sourcePath),
].filter((prefix) => prefix !== 'introduction.md');

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
 * @param {string} routeKey - route key used as fallback section name
 * @param {object} options
 * @param {string} options.urlBasePath - URL base path for generated links (e.g. /docs, /docs/v1)
 */
async function scanDirectory(dirPath, baseContentPath, routeKey, options = {}) {
  const docs = [];
  const { urlBasePath = `/${routeKey}` } = options;
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
          let section = toTitleCase(routeKey);
          if (pathParts.length > 1) {
            section = toTitleCase(pathParts[0]);
          } else if (relPath === 'introduction.md') {
            section = 'Introduction';
          }
          const subSection = pathParts.length > 2 ? toTitleCase(pathParts[1]) : null;

          const title = frontmatter.title || toTitleCase(path.basename(entry.name, '.md'));
          const subtitle = frontmatter.subtitle || '';

          const url = `${BASE_URL}${urlBasePath}/${relPath}`;

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
function getSectionOrder(organized, options = {}) {
  const { includeConfiguredSections = true } = options;
  if (!includeConfiguredSections) {
    return Object.keys(organized).sort();
  }

  const configuredNames = config.sections.map((s) => s.name);
  const allSections = Object.keys(organized);
  const ordered = [];

  // Configured sections in order (if they have entries, are collapsed, or have a sub-index)
  for (const sectionConf of config.sections) {
    if (organized[sectionConf.name] || sectionConf.collapse || sectionConf.subIndex) {
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
 * Order subsection names: explicit order from config first, then remaining alphabetically
 */
function orderSubsections(sectionName, subsectionNames) {
  const explicit = getSectionConfig(sectionName)?.subsectionOrder || [];
  const named = new Set(subsectionNames);
  const rest = subsectionNames.filter((n) => !explicit.includes(n)).sort();
  return [...explicit.filter((n) => named.has(n)), ...rest];
}

function findDocsByPaths(paths, sectionData) {
  const allDocs = [
    ...sectionData._files,
    ...Object.values(sectionData._subsections).flat(),
  ];
  const byPath = new Map(allDocs.map((doc) => [doc.path, doc]));

  return paths.map((p) => byPath.get(p)).filter(Boolean);
}

/**
 * Generate the index text
 */
function sortDocsVersionsByPriority(versions, latestVersionId) {
  return [...versions].sort((a, b) => {
    if (a.id === latestVersionId) return -1;
    if (b.id === latestVersionId) return 1;

    const aReleaseParts = `${a.release || ''}`
      .split('.')
      .map((part) => Number.parseInt(part, 10))
      .map((part) => (Number.isNaN(part) ? 0 : part));
    const bReleaseParts = `${b.release || ''}`
      .split('.')
      .map((part) => Number.parseInt(part, 10))
      .map((part) => (Number.isNaN(part) ? 0 : part));

    const maxLen = Math.max(aReleaseParts.length, bReleaseParts.length);
    for (let i = 0; i < maxLen; i += 1) {
      const diff = (bReleaseParts[i] || 0) - (aReleaseParts[i] || 0);
      if (diff !== 0) return diff;
    }
    return b.id.localeCompare(a.id);
  });
}

function renderVersionPages(lines, organized, options = {}) {
  const { includeConfiguredSections = true, includeCollapsedSections = true } = options;
  const sections = getSectionOrder(organized, { includeConfiguredSections });
  for (const section of sections) {
    const sectionConfig = getSectionConfig(section);
    const sectionData = organized[section];
    if (!sectionData && (!includeCollapsedSections || !sectionConfig?.collapse)) continue;

    lines.push(`#### ${section}`);
    lines.push('');

    if (sectionConfig?.description) {
      lines.push(sectionConfig.description);
      lines.push('');
    }

    if (includeCollapsedSections && sectionConfig?.collapse) {
      const collapsed = sectionConfig.collapse;
      const description = collapsed.description ? `: ${collapsed.description}` : '';
      lines.push(`- [${collapsed.title}](${collapsed.url})${description}`);
      lines.push('');
      continue;
    }

    if (sectionConfig?.subIndex?.highlights?.length) {
      const highlightedDocs = findDocsByPaths(sectionConfig.subIndex.highlights, sectionData).sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      for (const doc of highlightedDocs) {
        const description = doc.subtitle ? `: ${doc.subtitle}` : '';
        lines.push(`- [${doc.title}](${doc.url})${description}`);
      }

      if (sectionConfig.subIndex.url) {
        lines.push(
          `- [View all ${section.toLowerCase()} pages](${sectionConfig.subIndex.url})`
        );
      }
      lines.push('');
      continue;
    }

    const directFiles = sectionData._files.sort((a, b) => a.title.localeCompare(b.title));
    for (const doc of directFiles) {
      const description = doc.subtitle ? `: ${doc.subtitle}` : '';
      lines.push(`- [${doc.title}](${doc.url})${description}`);
    }

    const subsections = orderSubsections(section, Object.keys(sectionData._subsections));
    for (const subsection of subsections) {
      lines.push('');
      lines.push(`##### ${subsection}`);
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
}

function generateIndexText(versionedOrganizedDocs, canonicalOrganized = null) {
  const lines = [];

  lines.push('# Neon Postgres');
  lines.push('');
  if (config.tagline) {
    lines.push(`> ${config.tagline}`);
    lines.push('');
  }
  if (config.intro) {
    lines.push(config.intro);
    lines.push('');
  }

  if (versionedOrganizedDocs.length > 0) {
    lines.push('## Documentation');
    lines.push('');
    lines.push(`- [Documentation Index](${BASE_URL}/docs/llms.txt): Primary Neon documentation index`);
    lines.push(
      `- [Full Documentation](${BASE_URL}/docs/llms-full.txt): Complete Neon documentation text`
    );
    lines.push('');

    lines.push('### Versioned Documentation');
    lines.push('');
    lines.push('Documentation for previous Neon docs versions is available at `/docs/{version}/`.');
    lines.push('For example:');
    lines.push('');
    for (const { version, isLatest } of versionedOrganizedDocs) {
      if (isLatest) continue;
      lines.push(
        `- \`/docs/${version.id}/introduction\` - ${version.label} documentation (${version.release})`
      );
    }
    lines.push('');
    lines.push('LLM-optimized documentation for specific versions:');
    lines.push('');
    lines.push('| Version | Index | Full Content |');
    lines.push('| --- | --- | --- |');
    for (const { version, isLatest } of versionedOrganizedDocs) {
      const cleanVersionId = version.id.replace(/^v/i, '');
      const versionLabel = isLatest ? `Current (${cleanVersionId}.x)` : `${cleanVersionId}.x`;
      const indexLink = isLatest
        ? `[${BASE_URL}/docs/llms.txt](${BASE_URL}/docs/llms.txt)`
        : `[${BASE_URL}/docs/${version.id}/llms.txt](${BASE_URL}/docs/${version.id}/llms.txt)`;
      const fullContentLink = isLatest
        ? `[${BASE_URL}/docs/llms-full.txt](${BASE_URL}/docs/llms-full.txt)`
        : '-';
      lines.push(`| ${versionLabel} | ${indexLink} | ${fullContentLink} |`);
    }
    lines.push('');

    if (canonicalOrganized) {
      lines.push('## Documentation pages');
      lines.push('');
      renderVersionPages(lines, canonicalOrganized);
    }
  }

  return `${lines.join('\n').trim()}\n`;
}

function generateVersionIndexText({ version, organized }) {
  const lines = [];
  const versionTitle = version.label;

  lines.push('# Neon Postgres');
  lines.push('');
  lines.push(`Version-specific documentation index for ${versionTitle}.`);
  lines.push('');
  lines.push(`- Canonical docs index: ${BASE_URL}/docs/llms.txt`);
  lines.push(`- Versioned docs base path: ${BASE_URL}/docs/${version.id}/`);
  lines.push('');
  lines.push(`## ${version.id} versioned documentation pages`);
  lines.push('');

  if (!organized || Object.keys(organized).length === 0) {
    lines.push('No versioned pages are currently available for this docs version.');
    lines.push('');
  } else {
    renderVersionPages(lines, organized, {
      includeConfiguredSections: false,
      includeCollapsedSections: false,
    });
  }

  return `${lines.join('\n').trim()}\n`;
}

function selectCanonicalDoc({ latestDoc, legacyDoc }) {
  return latestDoc || legacyDoc || null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const projectRoot = path.resolve(__dirname, '../..');
  const contentPath = path.join(projectRoot, 'content');
  const latestVersionId = resolveLatestDocsVersionId();
  const legacyVersionId = resolveLegacyDocsVersionId();
  const docsVersions = sortDocsVersionsByPriority(
    DOCS_VERSIONS.filter((version) => version.isContentReady),
    latestVersionId
  );

  console.log('Scanning docs by version...\n');

  const versionedOrganizedDocs = [];

  for (const version of docsVersions) {
    const isLatest = version.id === latestVersionId;
    const versionBasePath = isLatest ? '/docs' : `/docs/${version.id}`;
    const sourceDir = path.join(projectRoot, version.docsContentPath);
    const { docs } = await scanDirectory(sourceDir, contentPath, 'docs', {
      urlBasePath: versionBasePath,
    });
    applyReclassifications(docs);
    const organized = organizeDocs(docs);
    versionedOrganizedDocs.push({
      version,
      isLatest,
      docs,
      organized,
      docsCount: docs.length,
    });
    console.log(`  ${version.label} (${version.docsContentPath}): ${docs.length} files`);
  }

  const latestEntry = versionedOrganizedDocs.find((entry) => entry.version.id === latestVersionId);
  const legacyEntry = versionedOrganizedDocs.find((entry) => entry.version.id === legacyVersionId);

  const latestDocsByPath = new Map((latestEntry?.docs || []).map((doc) => [doc.path, doc]));
  const legacyDocsByPath = new Map((legacyEntry?.docs || []).map((doc) => [doc.path, doc]));
  const allPaths = new Set([...legacyDocsByPath.keys(), ...latestDocsByPath.keys()]);

  const canonicalDocs = [];
  for (const docPath of allPaths) {
    const latestDoc = latestDocsByPath.get(docPath);
    const legacyDoc = legacyDocsByPath.get(docPath);
    const chosenDoc = selectCanonicalDoc({ latestDoc, legacyDoc });
    if (!chosenDoc) continue;
    canonicalDocs.push({
      ...chosenDoc,
      url: `${BASE_URL}/docs/${chosenDoc.path}`,
    });
  }

  applyReclassifications(canonicalDocs);
  const canonicalOrganized = organizeDocs(canonicalDocs);
  console.log(`  Canonical (/docs): ${canonicalDocs.length} files`);

  // Versioned routes are pages that exist in both latest and legacy content.
  const versionedRoutePaths = new Set(
    (latestEntry?.docs || [])
      .filter((doc) => legacyDocsByPath.has(doc.path) && latestDocsByPath.has(doc.path))
      .map((doc) => doc.path)
  );
  console.log(`  Versioned routes (/docs/{version}/): ${versionedRoutePaths.size} files`);

  const totalVersionedDocs = versionedOrganizedDocs.reduce((acc, item) => acc + item.docsCount, 0);
  console.log(
    `\nTotal: ${totalVersionedDocs} documents across ${versionedOrganizedDocs.length} versions`
  );
  console.log(`Canonical docs count: ${canonicalDocs.length}\n`);

  const indexContent = generateIndexText(versionedOrganizedDocs, canonicalOrganized);
  const versionedIndexes = versionedOrganizedDocs.map((entry) => ({
    versionId: entry.version.id,
    isLatest: entry.isLatest,
    content: generateVersionIndexText((() => {
      const versionedDocsForEntry = (entry.docs || [])
        .filter((doc) => versionedRoutePaths.has(doc.path))
        .map((doc) => ({
          ...doc,
          url: `${BASE_URL}/docs/${entry.version.id}/${doc.path}`,
        }));
      applyReclassifications(versionedDocsForEntry);
      return {
        ...entry,
        organized: organizeDocs(versionedDocsForEntry),
      };
    })()),
  }));

  if (dryRun) {
    console.log('--- Generated llms.txt ---\n');
    console.log(indexContent);
    console.log('--- Versioned llms.txt files to generate ---\n');
    for (const entry of versionedIndexes) {
      console.log(`  /docs/${entry.versionId}/llms.txt`);
    }
  } else {
    const outputPath = path.join(projectRoot, OUTPUT_PATH);
    await fs.writeFile(outputPath, indexContent);
    console.log(`Written to ${outputPath}`);

    for (const entry of versionedIndexes) {
      const versionDir = path.join(projectRoot, 'public', 'docs', entry.versionId);
      const versionOutputPath = path.join(versionDir, 'llms.txt');
      await fs.mkdir(versionDir, { recursive: true });
      await fs.writeFile(versionOutputPath, entry.content);
      console.log(`Written to ${versionOutputPath}`);
    }
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
