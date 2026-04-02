const fs = require('fs');

const jsYaml = require('js-yaml');

const { DOCS_DIR_PATH, CHANGELOG_DIR_PATH } = require('../constants/content');
const { DOCS_VERSIONS, DOCS_DEFAULT_VERSION_ID } = require('../constants/docs-versions');

const { getPostSlugs, getPostBySlug } = require('./api-content');

const getAllPosts = async (docsContentPath = DOCS_DIR_PATH) => {
  const slugs = await getPostSlugs(docsContentPath);
  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, docsContentPath)) return;
      const data = getPostBySlug(slug, docsContentPath);

      const slugWithoutFirstSlash = slug.slice(1);
      const {
        data: { title, subtitle, isDraft, redirectFrom },
        content,
      } = data;
      // eslint-disable-next-line consistent-return
      return { slug: slugWithoutFirstSlash, title, subtitle, isDraft, content, redirectFrom };
    })
    .filter(Boolean)
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

const getNavigationFilePath = (docsContentPath = DOCS_DIR_PATH) => {
  const versionedPath = `${process.cwd()}/${docsContentPath}/navigation.yaml`;
  if (fs.existsSync(versionedPath)) return versionedPath;
  return `${process.cwd()}/${DOCS_DIR_PATH}/navigation.yaml`;
};

const getNavigation = (docsContentPath = DOCS_DIR_PATH) => {
  const navigationFilePath = getNavigationFilePath(docsContentPath);
  return jsYaml.load(fs.readFileSync(navigationFilePath, 'utf8'));
};

const getNavigationByDocsVersion = () =>
  DOCS_VERSIONS.reduce((acc, version) => {
    acc[version.id] = getNavigation(version.docsContentPath || DOCS_DIR_PATH);
    return acc;
  }, {});

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
    .filter(Boolean)
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

const getDualVersionSlugs = () => {
  const legacyVersion = DOCS_VERSIONS.find(
    (v) => v.id !== DOCS_DEFAULT_VERSION_ID && v.isContentReady
  );
  if (!legacyVersion) return [];

  const legacyDir = `${process.cwd()}/${legacyVersion.docsContentPath}`;
  const latestDir = `${process.cwd()}/${DOCS_DIR_PATH}`;
  const slugs = [];

  const scanDir = (dir, prefix = '') => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        scanDir(`${dir}/${entry.name}`, relPath);
      } else if (entry.name.endsWith('.md')) {
        const slug = relPath.replace(/\.md$/, '');
        if (fs.existsSync(`${latestDir}/${slug}.md`)) {
          slugs.push(slug);
        }
      }
    }
  };

  scanDir(legacyDir);
  return slugs;
};

module.exports = {
  getNavigation,
  getNavigationByDocsVersion,
  getSDKNavigation,
  getNavigationLinks,
  getAllChangelogs,
  getAllPosts,
  getDualVersionSlugs,
};
