const docsSidebarData = require('../constants/docs-sidebar-data');

function generateDocsSidebar(pagesById) {
  const sidebar = [];

  Object.keys(docsSidebarData).forEach((dirName) => {
    const children = [];

    docsSidebarData[dirName].forEach((id) => {
      if (!pagesById[id]) return;
      children.push(pagesById[id]);
    });

    sidebar.push({
      title: dirName,
      sidebarLabel: dirName,
      children,
      slug: null,
    });
  });

  return sidebar;
}

module.exports = generateDocsSidebar;
