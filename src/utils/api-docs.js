const fs = require('fs');

const jsYaml = require('js-yaml');

const { DOCS_DIR_PATH, CHANGELOG_DIR_PATH } = require('../constants/content');

const { getPostSlugs, getPostBySlug } = require('./api-content');
const getExcerpt = require('./get-excerpt');

const getAllPosts = async () => {
  const slugs = await getPostSlugs(DOCS_DIR_PATH);
  return slugs
    .map((slug) => {
      const data = getPostBySlug(slug, DOCS_DIR_PATH);
      if (!data) return;

      const slugWithoutFirstSlash = slug.slice(1);
      const {
        data: { title, subtitle, isDraft, redirectFrom },
        content,
      } = data;
      return { slug: slugWithoutFirstSlash, title, subtitle, isDraft, content, redirectFrom };
    })
    .filter(Boolean)
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

function mergeApiNavigation(mainNav, apiNavItems) {
  let replaced = false;
  function inject(nodes) {
    if (!Array.isArray(nodes)) return nodes;
    return nodes.map((node) => {
      if (node.section === 'API Reference') {
        replaced = true;
        return { ...node, items: apiNavItems };
      }
      const next = { ...node };
      if (node.items) next.items = inject(node.items);
      if (node.subnav) next.subnav = inject(node.subnav);
      return next;
    });
  }
  const result = inject(mainNav);
  if (!replaced) {
    console.warn(
      "[api-docs] 'API Reference' section not found in navigation.yaml — api-navigation.yaml was not merged"
    );
  }
  return result;
}

let _navigationCache = null;

const getNavigation = () => {
  if (_navigationCache) return _navigationCache;
  const mainNav = jsYaml.load(
    fs.readFileSync(`${process.cwd()}/${DOCS_DIR_PATH}/navigation.yaml`, 'utf8')
  );
  const apiNavPath = `${process.cwd()}/${DOCS_DIR_PATH}/api-navigation.yaml`;
  const result = fs.existsSync(apiNavPath)
    ? mergeApiNavigation(mainNav, jsYaml.load(fs.readFileSync(apiNavPath, 'utf8')))
    : mainNav;
  // Skip cache in development so navigation.yaml edits are visible on reload.
  if (process.env.NODE_ENV !== 'development') {
    _navigationCache = result;
  }
  return result;
};

const getSDKNavigation = () =>
  jsYaml.load(fs.readFileSync(`${process.cwd()}/${DOCS_DIR_PATH}/sdk-navigation.yaml`, 'utf8'));

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
      const post = getPostBySlug(slug, CHANGELOG_DIR_PATH);
      if (!post) return;

      const {
        data: { title, isDraft, redirectFrom },
        content,
      } = post;

      const slugWithoutFirstSlash = slug.slice(1);
      const date = slugWithoutFirstSlash;

      return {
        title: title || content.match(/# (.*)/)?.[1],
        slug: slugWithoutFirstSlash,
        subtitle: '',
        category: 'changelog',
        date,
        excerpt: getExcerpt(content, 280),
        content,
        isDraft,
        redirectFrom,
      };
    })
    .filter(Boolean)
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

module.exports = {
  getNavigation,
  getSDKNavigation,
  getNavigationLinks,
  getAllChangelogs,
  getAllPosts,
};
