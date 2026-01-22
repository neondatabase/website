const fs = require('fs');

const jsYaml = require('js-yaml');

const { POSTGRESQL_DIR_PATH } = require('../constants/content');

const { getPostSlugs, getPostBySlug } = require('./api-content');

const getAllPosts = async () => {
  const slugs = await getPostSlugs(POSTGRESQL_DIR_PATH);
  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, POSTGRESQL_DIR_PATH)) return;
      const data = getPostBySlug(slug, POSTGRESQL_DIR_PATH);

      const slugWithoutFirstSlash = slug.slice(1);
      const {
        data: { title, subtitle, isDraft, redirectFrom },
        content,
      } = data;
      return { slug: slugWithoutFirstSlash, title, subtitle, isDraft, content, redirectFrom };
    })
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

const getNavigation = () =>
  jsYaml.load(fs.readFileSync(`${process.cwd()}/${POSTGRESQL_DIR_PATH}/navigation.yaml`, 'utf8'));

const getAllPostgresTutorials = async () => {
  const slugs = await getPostSlugs(POSTGRESQL_DIR_PATH);
  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, POSTGRESQL_DIR_PATH)) return;
      const data = getPostBySlug(slug, POSTGRESQL_DIR_PATH);

      const slugWithoutFirstSlash = slug.slice(1);
      const {
        data: { title, subtitle, isDraft, redirectFrom },
        content,
      } = data;
      return { slug: slugWithoutFirstSlash, title, subtitle, isDraft, content, redirectFrom };
    })
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

const getNavigationLinks = (slug) => {
  const post = getPostBySlug(slug, POSTGRESQL_DIR_PATH);
  if (!post) return null;

  const {
    data: { previousLink, nextLink },
  } = post;

  return {
    previousLink,
    nextLink,
  };
};

module.exports = {
  getAllPosts,
  getNavigation,
  getNavigationLinks,
  getAllPostgresTutorials,
};
