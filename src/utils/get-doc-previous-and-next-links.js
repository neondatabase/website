module.exports = function getDocPreviousAndNextLinks(slug, flatSidebar) {
  const items = flatSidebar.filter((item) => item.slug !== undefined);
  const currentItemIndex = items.findIndex((item) => item.slug === slug);
  const previousItem = items[currentItemIndex - 1];
  const nextItem = items[currentItemIndex + 1];

  return { previousLink: previousItem, nextLink: nextItem };
};
