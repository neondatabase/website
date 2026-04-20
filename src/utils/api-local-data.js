import fs from 'fs';
import path from 'path';

import yaml from 'js-yaml';

const readYaml = (filePath) => yaml.load(fs.readFileSync(filePath, 'utf-8'));

// Strips legacy <p> wrappers from WP-migrated quotes.
const formatQuote = (quote) => {
  if (!quote) return '';
  return String(quote)
    .replace(/<\/?p>/g, '')
    .trim();
};

export const getUseCasesData = () => {
  try {
    const useCases = readYaml(path.join(process.cwd(), 'content/data/use-cases.yaml'));
    const caseStudies = readYaml(path.join(process.cwd(), 'content/data/case-studies.yaml'));

    if (!Array.isArray(useCases)) return [];

    const caseStudiesById = Array.isArray(caseStudies)
      ? Object.fromEntries(caseStudies.map((cs) => [cs.id, cs]))
      : {};

    return useCases
      .map((useCase) => {
        const caseStudy = useCase.linkedCaseStudy ? caseStudiesById[useCase.linkedCaseStudy] : null;
        if (!caseStudy) return null;

        return {
          icon: useCase.icon,
          title: useCase.title,
          description: useCase.description,
          link: useCase.link,
          logo: caseStudy.logo,
          testimonial: {
            quote: formatQuote(caseStudy.quote),
            author: `${caseStudy.author?.name}${caseStudy.author?.post ? ` – ${caseStudy.author.post}` : ''}`,
            caseStudyLink: caseStudy.isInternal
              ? `/blog/${caseStudy.internalPostSlug}`
              : caseStudy.externalUrl,
          },
          tags: (useCase.tags || []).map((t) => ({ title: t.name, slug: t.slug })),
        };
      })
      .filter(Boolean);
  } catch (_e) {
    return [];
  }
};

export const getCaseStudiesData = () => {
  try {
    const items = readYaml(path.join(process.cwd(), 'content/data/case-studies.yaml'));

    if (!Array.isArray(items)) return [];

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      caseStudyPost: {
        isFeatured: item.isFeatured,
        logo: item.logo,
        quote: formatQuote(item.quote),
        author: item.author,
        isInternal: item.isInternal,
        externalUrl: item.externalUrl,
        post: item.isInternal && item.internalPostSlug ? { slug: item.internalPostSlug } : null,
      },
      caseStudiesCategories: {
        nodes: item.categories || [],
      },
    }));
  } catch (_e) {
    return [];
  }
};

export const getCaseStudiesCategories = () => {
  try {
    const categories = readYaml(
      path.join(process.cwd(), 'content/data/case-study-categories.yaml')
    );

    if (!Array.isArray(categories)) return [{ name: 'All', slug: 'all' }];

    return [
      { name: 'All', slug: 'all' },
      ...categories.map((cat) => ({ name: cat.name, slug: cat.slug })),
    ];
  } catch (_e) {
    return [{ name: 'All', slug: 'all' }];
  }
};

export const getTopbarData = () => {
  try {
    const topbar = readYaml(path.join(process.cwd(), 'content/config/topbar.yaml'));

    if (!topbar || typeof topbar !== 'object') return null;

    return topbar;
  } catch (_e) {
    return null;
  }
};
