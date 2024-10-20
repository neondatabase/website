const fs = require('fs');

const { glob } = require('glob');
const jsYaml = require('js-yaml');

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

  if (currentSlug === 'index') {
    title = 'PostgreSQL 16.0 Documentation';
  }
  if (currentSlug === 'legalnotice') {
    title = 'Legal Notice';
  }
  sidebar.forEach((item) => {
    if (item.slug === currentSlug) {
      title = item.title;
    }

    if (!title && item.items) {
      title = findTitle(item.items, currentSlug);
    }
  });

  return title;
};

const getPostBySlug = async (path, basePath) => {
  try {
    const content = fs.readFileSync(`${process.cwd()}/${basePath}${path}.md`, 'utf-8');
    const sidebar = fs.readFileSync(`${process.cwd()}/${POSTGRES_DIR_PATH}/sidebar.yaml`, 'utf8');

    const currentSlug = path.slice(1);
    const sidebarData = jsYaml.load(sidebar);

    const title = findTitle(sidebarData, currentSlug);

    const excerpt = getExcerpt(content, 200);

    return { title, excerpt, content, sidebar: sidebarData };
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

const getTitleWithInlineCode = (title) => title.replace(/`([^`]+)`/g, '<code>$1</code>');

const getNavigationLinks = (slug) => {
  const flatSidebarJson = fs.readFileSync(
    `${process.cwd()}/${POSTGRES_DIR_PATH}/sidebar/flat-sidebar.json`,
    'utf8'
  );
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
          title: getTitleWithInlineCode(flatSidebar[prevIndex].title),
          slug: flatSidebar[prevIndex].currentSlug,
        }
      : null;

  const nextLink =
    currentIndex < flatSidebar.length - 1
      ? {
          title: getTitleWithInlineCode(flatSidebar[nextIndex].title),
          slug: flatSidebar[nextIndex].currentSlug,
        }
      : null;

  return {
    previousLink,
    nextLink,
  };
};

const getSideBarWithInlineCode = (sidebar) => {
  // recursively iterate over the sidebar
  // if title has inline code, replace it with html inline code
  // if items, recursively iterate over the items
  sidebar.forEach((item) => {
    if (item.title) {
      item.title = getTitleWithInlineCode(item.title);
    }
    if (item.items) {
      getSideBarWithInlineCode(item.items);
    }
  });

  return sidebar;
};

const getSidebar = () =>
  getSideBarWithInlineCode(
    jsYaml.load(fs.readFileSync(`${process.cwd()}/${POSTGRES_DIR_PATH}/sidebar.yaml`, 'utf8'))
  );

export {
  getAllPosts,
  getPostBySlug,
  getPostSlugs,
  getSidebar,
  getNavigationLinks,
  POSTGRES_DIR_PATH,
};
