export default function getDocPreviousAndNextLinks(slug, sidebar) {
  const flatSidebar = sidebar.map(({ items }) => items).flat();
  const currentItemIndex = flatSidebar.findIndex((item) => item.slug === slug);
  const previousItem = flatSidebar[currentItemIndex - 1];
  const nextItem = flatSidebar[currentItemIndex + 1];

  return { previousLink: previousItem, nextLink: nextItem };
}
