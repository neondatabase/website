const fs = require('fs');

const jsYaml = require('js-yaml');

const { FLOW_DIR_PATH } = require('../constants/content');

const { getPostSlugs, getPostBySlug } = require('./api-content');

const getAllFlows = async () => {
  const slugs = await getPostSlugs(FLOW_DIR_PATH);
  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, FLOW_DIR_PATH)) return;
      const data = getPostBySlug(slug, FLOW_DIR_PATH);

      const slugWithoutFirstSlash = slug.slice(1);
      const {
        data: { title, subtitle, updatedOn, isDraft },
        content,
      } = data;

      // eslint-disable-next-line consistent-return
      return {
        title,
        subtitle,
        slug: slugWithoutFirstSlash,
        updatedOn,
        content,
        isDraft,
      };
    })
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

const getIndexContent = () =>
  jsYaml.load(fs.readFileSync(`${process.cwd()}/${FLOW_DIR_PATH}/index.yaml`, 'utf8'));

const getFlattenedPages = () => {
  const indexContent = getIndexContent();

  const allPages = [];
  indexContent.forEach((section, sectionIndex) => {
    section.items.forEach((item, itemIndex) => {
      allPages.push({
        ...item,
        index: `${sectionIndex + 1}.${itemIndex + 1}`,
      });
    });
  });

  return allPages;
};

const getNavigationLinks = (slug) => {
  const allPages = getFlattenedPages();

  const currentPageIndex = allPages.findIndex((page) => page.slug === slug);
  if (currentPageIndex === -1) {
    return {
      previousLink: null,
      nextLink: null,
    };
  }

  const previousPage = allPages[currentPageIndex - 1];
  const nextPage = allPages[currentPageIndex + 1];

  return {
    previousLink: previousPage
      ? {
          title: previousPage.title,
          slug: previousPage.slug,
          index: previousPage.index,
        }
      : null,
    nextLink: nextPage
      ? {
          title: nextPage.title,
          slug: nextPage.slug,
          index: nextPage.index,
        }
      : null,
  };
};

export { getAllFlows, getIndexContent, getNavigationLinks };
