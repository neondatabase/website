module.exports = function getDocPreviousAndNextLinks(slug, flatSidebar) {
  const currentItemIndex = flatSidebar.findIndex((item) => item.slug === slug);
  const previousItem = flatSidebar[currentItemIndex - 1];
  const nextItem = flatSidebar[currentItemIndex + 1];

  return { previousLink: previousItem, nextLink: nextItem };
};
