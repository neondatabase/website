const fs = require('fs');

const jsYaml = require('js-yaml');

const { BRANCHING_DIR_PATH } = require('../constants/content');

const { getPostSlugs, getPostBySlug } = require('./api-content');

const getAllPosts = async () => {
  const slugs = await getPostSlugs(BRANCHING_DIR_PATH);
  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, BRANCHING_DIR_PATH)) return;
      const data = getPostBySlug(slug, BRANCHING_DIR_PATH);

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
  jsYaml.load(fs.readFileSync(`${process.cwd()}/${BRANCHING_DIR_PATH}/index.yaml`, 'utf8'));

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

const getLatestUpdateDate = async () => {
  const allPosts = await getAllPosts();

  return allPosts.reduce((latest, post) => {
    if (!latest) return post.updatedOn;
    return post.updatedOn > latest ? post.updatedOn : latest;
  }, null);
};

export { getAllPosts, getIndexContent, getNavigationLinks, getLatestUpdateDate };
