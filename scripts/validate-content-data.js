#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');

const DATA_DIR = path.join(process.cwd(), 'content/data');

const CASE_STUDIES_FILE = path.join(DATA_DIR, 'case-studies.yaml');
const CASE_STUDY_CATEGORIES_FILE = path.join(DATA_DIR, 'case-study-categories.yaml');
const USE_CASES_FILE = path.join(DATA_DIR, 'use-cases.yaml');

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function pushError(errors, location, message) {
  errors.push(`${location}: ${message}`);
}

function expectString(errors, location, value, { allowEmpty = false } = {}) {
  if (typeof value !== 'string') {
    pushError(errors, location, `expected string, got ${typeof value}`);
    return false;
  }
  if (!allowEmpty && value.trim().length === 0) {
    pushError(errors, location, 'expected non-empty string');
    return false;
  }
  return true;
}

function expectBoolean(errors, location, value) {
  if (typeof value !== 'boolean') {
    pushError(errors, location, `expected boolean, got ${typeof value}`);
    return false;
  }
  return true;
}

function expectNumber(errors, location, value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    pushError(errors, location, `expected number, got ${typeof value}`);
    return false;
  }
  return true;
}

function expectObject(errors, location, value) {
  if (!isPlainObject(value)) {
    pushError(errors, location, 'expected object');
    return false;
  }
  return true;
}

function expectArray(errors, location, value) {
  if (!Array.isArray(value)) {
    pushError(errors, location, 'expected array');
    return false;
  }
  return true;
}

function parseYamlFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(raw);
}

function validateCategories(categories) {
  const errors = [];
  const slugs = new Set();

  if (!expectArray(errors, 'case-study-categories', categories)) {
    return { errors, categorySlugs: slugs };
  }

  categories.forEach((category, index) => {
    const base = `case-study-categories[${index}]`;
    if (!expectObject(errors, base, category)) return;

    if (expectString(errors, `${base}.slug`, category.slug)) {
      if (slugs.has(category.slug)) {
        pushError(errors, `${base}.slug`, `duplicate slug "${category.slug}"`);
      }
      slugs.add(category.slug);
    }
    expectString(errors, `${base}.name`, category.name);
  });

  return { errors, categorySlugs: slugs };
}

function validateCaseStudies(caseStudies, categorySlugs) {
  const errors = [];
  const ids = new Set();

  if (!expectArray(errors, 'case-studies', caseStudies)) {
    return { errors, caseStudyIds: ids };
  }

  caseStudies.forEach((item, index) => {
    const base = `case-studies[${index}]`;
    if (!expectObject(errors, base, item)) return;

    if (expectString(errors, `${base}.id`, item.id)) {
      if (ids.has(item.id)) {
        pushError(errors, `${base}.id`, `duplicate id "${item.id}"`);
      }
      ids.add(item.id);
    }

    expectString(errors, `${base}.title`, item.title);
    expectBoolean(errors, `${base}.isFeatured`, item.isFeatured);
    expectString(errors, `${base}.quote`, item.quote, { allowEmpty: true });

    if (expectObject(errors, `${base}.author`, item.author)) {
      expectString(errors, `${base}.author.name`, item.author.name, { allowEmpty: true });
      expectString(errors, `${base}.author.post`, item.author.post, { allowEmpty: true });
    }

    if (expectObject(errors, `${base}.logo`, item.logo)) {
      expectString(errors, `${base}.logo.mediaItemUrl`, item.logo.mediaItemUrl);
      if (expectObject(errors, `${base}.logo.mediaDetails`, item.logo.mediaDetails)) {
        expectNumber(errors, `${base}.logo.mediaDetails.width`, item.logo.mediaDetails.width);
        expectNumber(errors, `${base}.logo.mediaDetails.height`, item.logo.mediaDetails.height);
      }
    }

    const isInternalOk = expectBoolean(errors, `${base}.isInternal`, item.isInternal);
    const internalSlugOk = expectString(errors, `${base}.internalPostSlug`, item.internalPostSlug, {
      allowEmpty: true,
    });
    const externalUrlOk = expectString(errors, `${base}.externalUrl`, item.externalUrl, {
      allowEmpty: true,
    });

    if (isInternalOk && internalSlugOk && externalUrlOk) {
      if (item.isInternal && item.internalPostSlug.trim().length === 0) {
        pushError(errors, `${base}.internalPostSlug`, 'must be non-empty when isInternal=true');
      }
      if (!item.isInternal && item.externalUrl.trim().length === 0) {
        pushError(errors, `${base}.externalUrl`, 'must be non-empty when isInternal=false');
      }
    }

    if (expectArray(errors, `${base}.categories`, item.categories)) {
      item.categories.forEach((category, catIndex) => {
        const categoryBase = `${base}.categories[${catIndex}]`;
        if (!expectObject(errors, categoryBase, category)) return;

        if (expectString(errors, `${categoryBase}.slug`, category.slug)) {
          if (!categorySlugs.has(category.slug)) {
            pushError(
              errors,
              `${categoryBase}.slug`,
              `unknown category slug "${category.slug}" (not found in case-study-categories.yaml)`
            );
          }
        }
        expectString(errors, `${categoryBase}.name`, category.name);
      });
    }
  });

  return { errors, caseStudyIds: ids };
}

function validateUseCases(useCases, caseStudyIds) {
  const errors = [];

  if (!expectArray(errors, 'use-cases', useCases)) {
    return errors;
  }

  useCases.forEach((item, index) => {
    const base = `use-cases[${index}]`;
    if (!expectObject(errors, base, item)) return;

    expectString(errors, `${base}.icon`, item.icon);
    expectString(errors, `${base}.title`, item.title);
    expectString(errors, `${base}.description`, item.description);
    expectString(errors, `${base}.link`, item.link);

    if (expectString(errors, `${base}.linkedCaseStudy`, item.linkedCaseStudy)) {
      if (!caseStudyIds.has(item.linkedCaseStudy)) {
        pushError(
          errors,
          `${base}.linkedCaseStudy`,
          `unknown case study id "${item.linkedCaseStudy}" (not found in case-studies.yaml)`
        );
      }
    }

    if (expectArray(errors, `${base}.tags`, item.tags)) {
      item.tags.forEach((tag, tagIndex) => {
        const tagBase = `${base}.tags[${tagIndex}]`;
        if (!expectObject(errors, tagBase, tag)) return;

        expectString(errors, `${tagBase}.slug`, tag.slug);
        expectString(errors, `${tagBase}.name`, tag.name);
      });
    }
  });

  return errors;
}

function validateContentData() {
  const categories = parseYamlFile(CASE_STUDY_CATEGORIES_FILE);
  const caseStudies = parseYamlFile(CASE_STUDIES_FILE);
  const useCases = parseYamlFile(USE_CASES_FILE);

  const categoriesResult = validateCategories(categories);
  const caseStudiesResult = validateCaseStudies(caseStudies, categoriesResult.categorySlugs);
  const useCasesErrors = validateUseCases(useCases, caseStudiesResult.caseStudyIds);

  return [...categoriesResult.errors, ...caseStudiesResult.errors, ...useCasesErrors];
}

function run() {
  try {
    const errors = validateContentData();

    if (errors.length > 0) {
      console.error('Content data validation failed:\n');
      errors.forEach((error) => console.error(`- ${error}`));
      console.error(`\nTotal errors: ${errors.length}`);
      process.exit(1);
    }

    console.log('Content data validation passed.');
  } catch (error) {
    console.error('Content data validation crashed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  run();
}

module.exports = {
  validateContentData,
};
