const fs = require('fs');

const { glob } = require('glob');
const matter = require('gray-matter');

const getExcerpt = require('./get-excerpt');

const POSTGRESQL_DIR_PATH = 'content/postgresql';

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

const getAllPostgresTutorials = async () => {
  const slugs = await getPostSlugs(POSTGRESQL_DIR_PATH);
  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, POSTGRESQL_DIR_PATH)) return;
      const data = getPostBySlug(slug, POSTGRESQL_DIR_PATH);

      const slugWithoutFirstSlash = slug.slice(1);
      const {
        data: { title, subtitle, isDraft, redirectFrom },
        content,
      } = data;
      return { slug: slugWithoutFirstSlash, title, subtitle, isDraft, content, redirectFrom };
    })
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

const getNavigationLinks = (slug) => {
  const post = getPostBySlug(slug, POSTGRESQL_DIR_PATH);
  if (!post) return null;

  const {
    data: { previousLink, nextLink },
  } = post;

  return {
    previousLink,
    nextLink,
  };
};

module.exports = {
  getPostSlugs,
  getPostBySlug,
  getNavigationLinks,
  getAllPostgresTutorials,
  POSTGRESQL_DIR_PATH,
};
