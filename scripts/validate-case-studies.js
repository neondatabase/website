#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

let yaml;
try {
  yaml = require('js-yaml');
} catch (_error) {
  console.error(
    'Missing dependency "js-yaml". Install the repository dependencies before validation.'
  );
  process.exit(2);
}

const args = process.argv.slice(2);
let targetId = null;

for (let index = 0; index < args.length; index += 1) {
  if (args[index] === '--id' && args[index + 1]) {
    targetId = args[index + 1];
    index += 1;
  } else {
    console.error(`Usage: ${path.basename(process.argv[1])} [--id <case-study-id>]`);
    process.exit(2);
  }
}

const root = process.cwd();
const requiredPaths = [
  'content/data/case-studies.yaml',
  'content/data/case-study-categories.yaml',
  'content/data/use-cases.yaml',
  'scripts/validate-content-data.js',
];

const missingRootPaths = requiredPaths.filter(
  (relativePath) => !fs.existsSync(path.join(root, relativePath))
);

if (missingRootPaths.length > 0) {
  console.error('Run this validator from the neon-next repository root.');
  missingRootPaths.forEach((relativePath) => console.error(`- Missing ${relativePath}`));
  process.exit(2);
}

const readYaml = (relativePath) => {
  try {
    return yaml.load(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  } catch (error) {
    console.error(`Unable to read or parse ${relativePath}: ${error.message}`);
    process.exit(1);
  }
};
const caseStudies = readYaml('content/data/case-studies.yaml');
const categories = readYaml('content/data/case-study-categories.yaml');
const useCases = readYaml('content/data/use-cases.yaml');
const errors = [];

const addError = (location, message) => errors.push(`${location}: ${message}`);
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isPositiveNumber = (value) => Number.isFinite(value) && value > 0;
const kebabCasePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const absoluteHttpsUrlPattern = /^https:\/\/[^/?#]+(?:[/?#]|$)/i;
const blogPostsRoot = path.resolve(root, 'content/blog/posts');

const validateQuoteMarkup = (quote, location) => {
  if (typeof quote !== 'string') return;

  const textWithoutAllowedMarkup = quote.replace(/<\/?mark>/g, '');
  if (/[<>]/.test(textWithoutAllowedMarkup)) {
    addError(location, 'may only contain plain text and <mark>...</mark> markup');
    return;
  }

  let openMarks = 0;
  for (const tag of quote.match(/<\/?mark>/g) || []) {
    if (tag === '<mark>') {
      openMarks += 1;
    } else if (openMarks === 0) {
      addError(location, 'contains an unmatched </mark> tag');
      return;
    } else {
      openMarks -= 1;
    }
  }

  if (openMarks > 0) {
    addError(location, 'contains an unmatched <mark> tag');
  }
};

let schemaErrors;
try {
  const { validateContentData } = require(path.join(root, 'scripts/validate-content-data.js'));
  schemaErrors = validateContentData();
} catch (error) {
  console.error(`Repository schema validation crashed: ${error.message}`);
  process.exit(2);
}

schemaErrors.forEach((error) => addError('repository schema', error));

if (schemaErrors.length > 0) {
  console.error('Case-study validation failed:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  console.error(`\nTotal errors: ${errors.length}`);
  process.exit(1);
}

if (!Array.isArray(caseStudies) || !Array.isArray(categories) || !Array.isArray(useCases)) {
  addError('content/data', 'expected case studies, categories, and use cases to be arrays');
} else {
  const categoryNames = new Map(categories.map((category) => [category.slug, category.name]));
  const ids = new Map(caseStudies.map((item) => [item.id, item]));
  const testimonialOrders = new Map();

  const validateLogo = (logo, location) => {
    const mediaPath = logo?.mediaItemUrl;
    if (!isNonEmptyString(mediaPath)) return;

    if (!mediaPath.startsWith('/images/case-studies/') || !mediaPath.endsWith('.svg')) {
      addError(location, 'logo must be an SVG under /images/case-studies/');
      return;
    }
    if (mediaPath.split('/').includes('..') || mediaPath.includes('\\')) {
      addError(location, 'logo path must not contain traversal segments');
      return;
    }

    const relativeAssetPath = path.posix.join('public', mediaPath);
    const assetPath = path.resolve(root, relativeAssetPath);
    const publicRoot = path.resolve(root, 'public');
    if (!assetPath.startsWith(`${publicRoot}${path.sep}`)) {
      addError(location, 'logo path escapes public/');
      return;
    }
    if (!fs.existsSync(assetPath)) {
      addError(location, `missing asset ${relativeAssetPath}`);
      return;
    }
    const svg = fs.readFileSync(assetPath, 'utf8');
    if (!svg.includes('<svg')) {
      addError(location, `${relativeAssetPath} does not contain SVG markup`);
    }
    if (!isPositiveNumber(logo?.mediaDetails?.width)) {
      addError(`${location}.mediaDetails.width`, 'must be a positive number');
    }
    if (!isPositiveNumber(logo?.mediaDetails?.height)) {
      addError(`${location}.mediaDetails.height`, 'must be a positive number');
    }

    const viewBox = svg.match(/viewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
    if (
      viewBox &&
      isPositiveNumber(logo?.mediaDetails?.width) &&
      isPositiveNumber(logo?.mediaDetails?.height)
    ) {
      const svgRatio = Number(viewBox[1]) / Number(viewBox[2]);
      const configuredRatio = logo.mediaDetails.width / logo.mediaDetails.height;
      if (Math.abs(svgRatio - configuredRatio) / svgRatio > 0.02) {
        addError(location, 'configured dimensions must preserve the SVG viewBox aspect ratio');
      }
    }
  };

  caseStudies.forEach((item, index) => {
    const location = `case-studies[${index}] (${item.id || 'missing id'})`;

    if (isNonEmptyString(item.id) && !kebabCasePattern.test(item.id)) {
      addError(`${location}.id`, 'must be lowercase kebab-case');
    }

    validateLogo(item.logo, `${location}.logo`);
    validateQuoteMarkup(item.quote, `${location}.quote`);

    const memberships = new Set();
    (item.categories || []).forEach((category, categoryIndex) => {
      const categoryLocation = `${location}.categories[${categoryIndex}]`;
      if (memberships.has(category.slug)) {
        addError(categoryLocation, `duplicate category slug "${category.slug}"`);
      }
      memberships.add(category.slug);
      if (categoryNames.get(category.slug) !== category.name) {
        addError(categoryLocation, 'category name must match its canonical definition');
      }
    });

    if (item.isInternal) {
      if (isNonEmptyString(item.externalUrl)) {
        addError(`${location}.externalUrl`, 'must be empty for an internal case study');
      }
      if (isNonEmptyString(item.internalPostSlug)) {
        if (!kebabCasePattern.test(item.internalPostSlug)) {
          addError(
            `${location}.internalPostSlug`,
            'must be lowercase kebab-case without path segments'
          );
        } else {
          const markdownPath = path.resolve(blogPostsRoot, `${item.internalPostSlug}.md`);
          const mdxPath = path.resolve(blogPostsRoot, `${item.internalPostSlug}.mdx`);
          const resolvesDirectlyUnderPosts = [markdownPath, mdxPath].every(
            (candidatePath) => path.dirname(candidatePath) === blogPostsRoot
          );

          if (!resolvesDirectlyUnderPosts) {
            addError(
              `${location}.internalPostSlug`,
              'must resolve directly under content/blog/posts/'
            );
          } else if (!fs.existsSync(markdownPath) && !fs.existsSync(mdxPath)) {
            addError(`${location}.internalPostSlug`, 'does not resolve to an existing blog post');
          }
        }
      }
    } else {
      if (isNonEmptyString(item.internalPostSlug)) {
        addError(`${location}.internalPostSlug`, 'must be empty for an external case study');
      }
      if (isNonEmptyString(item.externalUrl)) {
        try {
          const parsed = new URL(item.externalUrl);
          if (
            !absoluteHttpsUrlPattern.test(item.externalUrl) ||
            parsed.protocol !== 'https:' ||
            !parsed.hostname
          ) {
            addError(`${location}.externalUrl`, 'must be a complete HTTPS URL with a hostname');
          }
        } catch (_error) {
          addError(`${location}.externalUrl`, 'must be a valid URL');
        }
      }
    }

    const testimonialOrder = item.caseStudiesPage?.testimonialOrder;
    if (item.caseStudiesPage !== undefined && !Number.isFinite(testimonialOrder)) {
      addError(`${location}.caseStudiesPage.testimonialOrder`, 'must be a finite number');
    }
    if (Number.isFinite(testimonialOrder)) {
      if (testimonialOrders.has(testimonialOrder)) {
        addError(
          `${location}.caseStudiesPage.testimonialOrder`,
          `duplicates ${testimonialOrders.get(testimonialOrder)}`
        );
      } else {
        testimonialOrders.set(testimonialOrder, item.id);
      }
      if (!isNonEmptyString(item.quote)) {
        addError(`${location}.quote`, 'must be non-empty for a testimonial');
      }
      if (!isNonEmptyString(item.author?.name)) {
        addError(`${location}.author.name`, 'must be non-empty for a testimonial');
      }
      if (item.caseStudiesPage.testimonialLogo) {
        validateLogo(
          item.caseStudiesPage.testimonialLogo,
          `${location}.caseStudiesPage.testimonialLogo`
        );
      }
    }
  });

  useCases.forEach((useCase, index) => {
    const linked = ids.get(useCase.linkedCaseStudy);
    if (!linked) return;
    if (!isNonEmptyString(linked.quote)) {
      addError(`use-cases[${index}].linkedCaseStudy`, `${linked.id} must have a quote`);
    }
    if (!isNonEmptyString(linked.author?.name)) {
      addError(`use-cases[${index}].linkedCaseStudy`, `${linked.id} must have an author name`);
    }
  });

  if (targetId) {
    const target = ids.get(targetId);
    if (!target) {
      addError('--id', `case study "${targetId}" was not found`);
    } else if (!Array.isArray(target.categories) || target.categories.length === 0) {
      addError(`case study "${targetId}"`, 'an added or edited case study needs a category');
    }
  }
}

if (errors.length > 0) {
  console.error('Case-study validation failed:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  console.error(`\nTotal errors: ${errors.length}`);
  process.exit(1);
}

console.log(
  targetId
    ? `Case-study validation passed for "${targetId}" and all shared data.`
    : 'Case-study validation passed for all shared data.'
);
