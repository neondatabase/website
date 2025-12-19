const fs = require('fs');

const jsYaml = require('js-yaml');

const {
  DOCS_DIR_PATH,
  CHANGELOG_DIR_PATH,
  SDK_NAVIGATION_DIR_PATH,
} = require('../constants/content');

const { getPostSlugs, getPostBySlug } = require('./api-content');

const getAllPosts = async () => {
  const slugs = await getPostSlugs(DOCS_DIR_PATH);
  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, DOCS_DIR_PATH)) return;
      const data = getPostBySlug(slug, DOCS_DIR_PATH);

      const slugWithoutFirstSlash = slug.slice(1);
      const {
        data: { title, subtitle, isDraft, redirectFrom },
        content,
      } = data;
      // eslint-disable-next-line consistent-return
      return { slug: slugWithoutFirstSlash, title, subtitle, isDraft, content, redirectFrom };
    })
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

const getNavigation = () =>
  jsYaml.load(fs.readFileSync(`${process.cwd()}/${DOCS_DIR_PATH}/navigation.yaml`, 'utf8'));

const getSDKNavigation = () => {
  const sdkNavigation = {};

  try {
    const files = fs.readdirSync(`${process.cwd()}/${SDK_NAVIGATION_DIR_PATH}`);

    files.forEach((file) => {
      if (!file.endsWith('.json')) return;

      const sdkName = file.replace('.json', '');
      const slug = `reference/${sdkName}`;
      const filePath = `${process.cwd()}/${SDK_NAVIGATION_DIR_PATH}/${file}`;

      try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const sdkNav = JSON.parse(fileContents);

        sdkNavigation[slug] = {
          title: sdkNav.title || 'SDK Reference',
          sections: sdkNav.sections || [],
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to load SDK navigation from ${file}:`, error);
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to read SDK navigation directory:', error);
  }

  return sdkNavigation;
};

const getNavigationLinks = (slug, flatSidebar) => {
  const posts = [
    ...new Map(flatSidebar.filter((item) => item.slug).map((item) => [item.slug, item])).values(),
  ];
  const currentItemIndex = posts.findIndex((item) => item.slug === slug);

  const previousItem = posts[currentItemIndex - 1];
  const nextItem = posts[currentItemIndex + 1];

  return {
    previousLink: { title: previousItem?.title, slug: previousItem?.slug },
    nextLink: { title: nextItem?.title, slug: nextItem?.slug },
  };
};

const getAllChangelogs = async () => {
  const slugs = await getPostSlugs(CHANGELOG_DIR_PATH);

  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, CHANGELOG_DIR_PATH)) return;
      const {
        data: { title, isDraft, redirectFrom },
        content,
      } = getPostBySlug(slug, CHANGELOG_DIR_PATH);
      const slugWithoutFirstSlash = slug.slice(1);
      const date = slugWithoutFirstSlash;

      // eslint-disable-next-line consistent-return
      return {
        title: title || content.match(/# (.*)/)?.[1],
        slug: slugWithoutFirstSlash,
        category: 'changelog',
        date,
        content,
        isDraft,
        redirectFrom,
      };
    })
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

module.exports = {
  getNavigation,
  getSDKNavigation,
  getNavigationLinks,
  getAllChangelogs,
  getAllPosts,
};
