const fs = require('fs');
const path = require('path');

const jsYaml = require('js-yaml');

const { DOCS_VERSIONS } = require('../constants/docs-versions');

const isExternalSlug = (slug) => typeof slug === 'string' && /^https?:\/\//.test(slug);
const isWebsiteSlug = (slug) => typeof slug === 'string' && slug.startsWith('/');

/**
 * Recursively extract all `slug` values from a navigation tree node or array.
 */
const collectSlugs = (node, slugs = []) => {
  if (Array.isArray(node)) {
    node.forEach((item) => collectSlugs(item, slugs));
    return slugs;
  }

  if (node && typeof node === 'object') {
    if (typeof node.slug === 'string') {
      slugs.push(node.slug);
    }
    ['items', 'subnav'].forEach((key) => {
      if (node[key]) collectSlugs(node[key], slugs);
    });
  }

  return slugs;
};

const validateNavigationForVersion = (version) => {
  const contentDir = path.join(process.cwd(), version.docsContentPath);
  const navFile = path.join(contentDir, 'navigation.yaml');

  if (!fs.existsSync(navFile)) {
    console.warn(
      `[validate-docs-navigation] No navigation.yaml found for ${version.id} at ${navFile}, skipping.`
    );
    return { errors: [] };
  }

  const navigation = jsYaml.load(fs.readFileSync(navFile, 'utf8'));
  const slugs = collectSlugs(navigation);

  const errors = [];

  slugs.forEach((slug) => {
    if (isExternalSlug(slug) || isWebsiteSlug(slug)) return;

    const filePath = path.join(contentDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      errors.push({ version: version.id, slug, expected: filePath });
    }
  });

  return { errors };
};

const validate = () => {
  let totalErrors = 0;

  DOCS_VERSIONS.forEach((version) => {
    const { errors } = validateNavigationForVersion(version);

    if (errors.length > 0) {
      console.error(
        `\n[validate-docs-navigation] ${version.id} navigation has ${errors.length} invalid slug(s):`
      );
      errors.forEach(({ slug, expected }) => {
        console.error(`  - "${slug}" → file not found: ${expected}`);
      });
      totalErrors += errors.length;
    } else {
      console.log(`[validate-docs-navigation] ${version.id}: OK`);
    }
  });

  if (totalErrors > 0) {
    console.error(
      `\n[validate-docs-navigation] Failed: ${totalErrors} invalid slug(s) across all versions.\n`
    );
    process.exit(1);
  }
};

validate();
