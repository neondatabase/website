import { DOCS_BASE_PATH } from 'constants/docs';

export default function getDocPreviousAndNextLinks(slug, sidebar) {
  let sectionIndex = 0;
  let linkIndex = 0;

  // find index of current page section in docSidebar
  sectionIndex = sidebar.findIndex(
    (item) => item.items.find((child) => child.slug === slug) !== undefined
  );

  // find index of current page in current section
  linkIndex = sidebar[sectionIndex].items.findIndex((item) => item.slug === slug);

  // check if linkIndex is last in section
  const isLastLinkInSection = linkIndex === sidebar[sectionIndex].items.length - 1;

  // get previous link
  let previousLink = null;
  if (linkIndex > 0) {
    previousLink = {
      title: sidebar[sectionIndex].items[linkIndex - 1].title,
      slug: `${DOCS_BASE_PATH}${sidebar[sectionIndex].items[linkIndex - 1].slug}/`,
    };
  } else if (sectionIndex > 0) {
    previousLink = {
      title: sidebar[sectionIndex - 1].items[sidebar[sectionIndex - 1].items.length - 1].title,
      slug: `${DOCS_BASE_PATH}${
        sidebar[sectionIndex - 1].items[sidebar[sectionIndex - 1].items.length - 1].slug
      }/`,
    };
  }

  let nextLink = null;
  if (isLastLinkInSection) {
    if (sectionIndex < sidebar.length - 1) {
      nextLink = {
        title: sidebar[sectionIndex + 1].items[0].title,
        slug: `${DOCS_BASE_PATH}${sidebar[sectionIndex + 1].items[0].slug}/`,
      };
    }
  } else {
    nextLink = {
      title: sidebar[sectionIndex].items[linkIndex + 1].title,
      slug: `${DOCS_BASE_PATH}${sidebar[sectionIndex].items[linkIndex + 1].slug}/`,
    };
  }

  return { previousLink, nextLink };
}
