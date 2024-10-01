const fs = require('fs');

const { glob } = require('glob');
const matter = require('gray-matter');
const jsYaml = require('js-yaml');

const { CHANGELOG_DIR_PATH } = require('../constants/docs');

const getExcerpt = require('./get-excerpt');

const DOCS_DIR_PATH = 'content/docs';
const USE_CASES_DIR_PATH = 'content/use-cases';
const FLOW_DIR_PATH = 'content/flow';

const getPostSlugs = async (pathname) => {
  const files = await glob.sync(`${pathname}/**/*.md`, {
    ignore: [
      '**/RELEASE_NOTES_TEMPLATE.md',
      '**/README.md',
      '**/unused/**',
      '**/shared-content/**',
      '**/GUIDE_TEMPLATE.md',
    ],
  });
  return files.map((file) => file.replace(pathname, '').replace('.md', ''));
};

const getPostBySlug = (slug, pathname) => {
  try {
    const source = fs.readFileSync(`${process.cwd()}/${pathname}/${slug}.md`, 'utf-8');
    const { data, content } = matter(source);
    const excerpt = getExcerpt(content, 200);

    return { data, content, excerpt };
  } catch (e) {
    return null;
  }
};

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
      return { slug: slugWithoutFirstSlash, title, subtitle, isDraft, content, redirectFrom };
    })
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

const getSidebar = () =>
  jsYaml.load(fs.readFileSync(`${process.cwd()}/${DOCS_DIR_PATH}/sidebar.yaml`, 'utf8'));

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

const getAllChangelogPosts = async () => {
  const slugs = await getPostSlugs(CHANGELOG_DIR_PATH);

  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, CHANGELOG_DIR_PATH)) return;
      const post = getPostBySlug(slug, CHANGELOG_DIR_PATH);
      const { data, content } = post;

      return {
        slug: slug.replace('/', ''),
        isDraft: data?.isDraft,
        content,
        redirectFrom: data?.redirectFrom,
      };
    })
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

module.exports = {
  getPostSlugs,
  getPostBySlug,
  getSidebar,
  getNavigationLinks,
  getAllChangelogPosts,
  getAllPosts,
  DOCS_DIR_PATH,
  USE_CASES_DIR_PATH,
  FLOW_DIR_PATH,
  CHANGELOG_DIR_PATH,
};
