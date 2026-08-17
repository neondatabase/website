import fs from 'fs';

import matter from 'gray-matter';

const { GUIDES_DIR_PATH } = require('../constants/content');

const { getPostSlugs, getPostBySlug } = require('./api-content');

const getAuthors = () => {
  const authors = fs.readFileSync(`${process.cwd()}/${GUIDES_DIR_PATH}/authors/data.json`, 'utf8');
  return JSON.parse(authors);
};

const getAuthor = (id) => {
  try {
    const authorsData = getAuthors();
    const authorData = authorsData[id];
    const authorPhoto = `/guides/authors/${id}.jpg`;
    const author = {
      slug: id,
      ...authorData,
      photo: authorPhoto,
    };

    if (author) {
      return author;
    }

    throw new Error(`Author with ID '${id}' not found.`);
  } catch (_e) {
    return null;
  }
};

const getGuideFrontmatter = (slug) => {
  try {
    const source = fs.readFileSync(`${process.cwd()}/${GUIDES_DIR_PATH}/${slug}.md`, 'utf-8');
    const { data } = matter(source);
    return data;
  } catch (_e) {
    return null;
  }
};

const getGuideNavigationItems = async () => {
  const slugs = await getPostSlugs(GUIDES_DIR_PATH);
  return slugs
    .map((slug) => {
      const data = getGuideFrontmatter(slug);
      if (!data) return;

      const { title, createdAt, isDraft } = data;

      return {
        title,
        slug: slug.slice(1),
        createdAt,
        isDraft,
      };
    })
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft)
    .sort((a, b) => (new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime() ? 1 : -1));
};

const getAllGuides = async () => {
  const slugs = await getPostSlugs(GUIDES_DIR_PATH);
  return slugs
    .map((slug) => {
      const data = getPostBySlug(slug, GUIDES_DIR_PATH);
      if (!data) return;

      const slugWithoutFirstSlash = slug.slice(1);
      const {
        data: {
          title,
          subtitle,
          createdAt,
          updatedOn,
          isDraft,
          redirectFrom,
          author,
          excludeFromBlog,
        },
        excerpt,
      } = data;
      const authorData = getAuthor(author);

      return {
        title,
        subtitle,
        slug: slugWithoutFirstSlash,
        category: 'guides',
        author: authorData,
        createdAt,
        updatedOn,
        date: createdAt,
        excerpt,
        isDraft,
        redirectFrom,
        excludeFromBlog,
      };
    })
    .filter(Boolean)
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft)
    .sort((a, b) => (new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime() ? 1 : -1));
};

const getNavigationLinks = (slug, posts) => {
  const currentItemIndex = posts.findIndex((item) => item.slug === slug);

  const previousItem = posts[currentItemIndex - 1];
  const nextItem = posts[currentItemIndex + 1];

  return {
    previousLink: { title: previousItem?.title, slug: previousItem?.slug },
    nextLink: { title: nextItem?.title, slug: nextItem?.slug },
  };
};

export { getAllGuides, getAuthor, getAuthors, getGuideNavigationItems, getNavigationLinks };
