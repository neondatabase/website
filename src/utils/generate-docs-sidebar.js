const docsSidebarData = require('../constants/docs-sidebar-data');

function generateDocsSidebar(pagesBySlug) {
  const sidebar = [];

  Object.keys(docsSidebarData).forEach((dirName) => {
    const items = [];

    docsSidebarData[dirName].forEach((slug) => {
      if (!pagesBySlug[slug]) return;
      items.push(pagesBySlug[slug]);
    });

    sidebar.push({
      title: dirName,
      items,
    });
  });

  return sidebar;
}

module.exports = generateDocsSidebar;
