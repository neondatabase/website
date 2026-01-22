const fs = require('fs');

const { glob } = require('glob');
const matter = require('gray-matter');

const getExcerpt = require('./get-excerpt');

const getPostSlugs = async (pathname) => {
  const files = await glob.sync(`${pathname}/**/*.md`, {
    ignore: ['**/README.md', '**/unused/**', '**/shared-content/**', '**/GUIDE_TEMPLATE.md'],
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

module.exports = {
  getPostSlugs,
  getPostBySlug,
};
