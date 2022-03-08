const { sidebarData } = require('../constants/docs-sidebar');

// eslint-disable-next-line import/prefer-default-export
const generateSidebar = (pagesById) => {
  const docSidebar = [];
  Object.keys(sidebarData).forEach((dirName) => {
    const sidebarChildren = [];
    sidebarData[dirName].forEach((id) => {
      if (!pagesById[id]) {
        console.log('Missing page for id:', id);
        return;
      }
      sidebarChildren.push(pagesById[id]);
    });
    docSidebar.push({
      title: dirName,
      sidebarLabel: dirName,
      children: sidebarChildren,
      slug: null,
    });
  });
  return docSidebar;
};

const getPrevAndNextLinks = (slug, sidebar) => {
  let sectionIndex = 0;
  let linkIndex = 0;

  // find index of current page section in docSidebar
  sectionIndex = sidebar.findIndex(
    (item) => item.children.find((child) => child.slug === slug) !== undefined
  );

  // find index of current page in current section
  linkIndex = sidebar[sectionIndex].children.findIndex((item) => item.slug === slug);

  // check if linkIndex is last in section
  const isLastLinkInSection = linkIndex === sidebar[sectionIndex].children.length - 1;

  // get previous link
  let previousLink = null;
  if (linkIndex > 0) {
    previousLink = sidebar[sectionIndex].children[linkIndex - 1];
  } else if (sectionIndex > 0) {
    previousLink =
      sidebar[sectionIndex - 1].children[sidebar[sectionIndex - 1].children.length - 1];
  }

  let nextLink = null;
  if (isLastLinkInSection) {
    if (sectionIndex < sidebar.length - 1) {
      nextLink = sidebar[sectionIndex + 1].children[0];
    }
  } else {
    nextLink = sidebar[sectionIndex].children[linkIndex + 1];
  }

  return { previousLink, nextLink };
};

module.exports = { generateSidebar, getPrevAndNextLinks };
