module.exports = function getChangelogCategoryFromSlug(slug) {
  let category = slug.slice(slug.lastIndexOf('-') + 1);
  let capitalisedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  if (slug === 'storage-and-compute' || category === 'compute') {
    category = 'storage-and-compute';
    capitalisedCategory = 'Storage and Compute';
  }

  return {
    category,
    capitalisedCategory,
  };
};
