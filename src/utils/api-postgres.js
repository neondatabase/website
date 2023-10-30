const fs = require('fs');

const { glob } = require('glob');

const getExcerpt = require('./get-excerpt');

const POSTGRES_DIR_PATH = 'content/postgresql';

const getPostSlugs = async (pathname) => {
  const files = await glob.sync(`${pathname}/**/*.md`, {
    ignore: ['**/RELEASE_NOTES_TEMPLATE.md', '**/README.md', '**/unused/**'],
  });
  return files.map((file) => file.replace(pathname, '').replace('.md', ''));
};

const findTitle = (sidebar, currentSlug) => {
  let title = '';
  sidebar.forEach((item) => {
    if (item.slug === 'index') {
      title = 'PostgreSQL 17devel Documentation';
    }
    if (item.slug === 'legalnotice') {
      title = 'Legal Notice';
    }
    if (item.slug === currentSlug) {
      title = item.title;
    } else if (item.items) {
      item.items.forEach((child) => {
        if (child.slug === currentSlug) {
          title = child.title;
        }
      });
    }
  });
  return title;
};

const getPostBySlug = async (path, basePath) => {
  try {
    const content = fs.readFileSync(`${basePath}${path}.md`, 'utf-8');
    const sidebar = fs.readFileSync('content/postgresql/sidebar/sidebar.json', 'utf8');

    const currentSlug = path.slice(1);
    const sidebarData = JSON.parse(sidebar);

    const title = findTitle(sidebarData, currentSlug);
    const excerpt = getExcerpt(content, 200);

    return { title, excerpt, content };
  } catch (e) {
    return null;
  }
};

const getAllPosts = async () => {
  const paths = await getPostSlugs(POSTGRES_DIR_PATH);

  return paths.map((path) => {
    if (!getPostBySlug(path, POSTGRES_DIR_PATH)) return;
    const data = getPostBySlug(path, POSTGRES_DIR_PATH);

    const slugWithoutFirstSlash = path.slice(1);

    return { slug: slugWithoutFirstSlash, ...data };
  });
};

const getDocPreviousAndNextLinks = (slug) => {
  const flatSidebarJson = fs.readFileSync('content/postgresql/sidebar/flat-sidebar.json', 'utf8');
  const flatSidebar = JSON.parse(flatSidebarJson);
  const currentIndex = flatSidebar.findIndex((item) => item.currentSlug === slug);

  // If the slug isn't found, return an empty object.
  if (currentIndex === -1) {
    return {};
  }

  const prevIndex = currentIndex - 1;
  const nextIndex = currentIndex + 1;

  // Calculate previous and next links based on the found index.
  const previousLink =
    currentIndex > 0
      ? {
          title: flatSidebar[prevIndex].title,
          slug: flatSidebar[prevIndex].currentSlug,
        }
      : null;

  const nextLink =
    currentIndex < flatSidebar.length - 1
      ? {
          title: flatSidebar[nextIndex].title,
          slug: flatSidebar[nextIndex].currentSlug,
        }
      : null;

  return {
    previousLink,
    nextLink,
  };
};

const getSidebar = () => {
  const sidebar = fs.readFileSync('content/postgresql/sidebar/sidebar.json', 'utf8');

  return JSON.parse(sidebar);
};

export {
  getAllPosts,
  getPostBySlug,
  getPostSlugs,
  getSidebar,
  getDocPreviousAndNextLinks,
  POSTGRES_DIR_PATH,
};
