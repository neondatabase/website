export default function getReleaseNotesCategoryFromSlug(slug) {
  const category = slug.slice(slug.lastIndexOf('-') + 1);
  const capitalisedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    category,
    capitalisedCategory,
  };
}
