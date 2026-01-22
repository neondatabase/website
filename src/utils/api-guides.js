import fs from 'fs';

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
      ...authorData,
      photo: authorPhoto,
    };

    if (author) {
      return author;
    }

    throw new Error(`Author with ID '${id}' not found.`);
  } catch (e) {
    return null;
  }
};

const getAllGuides = async () => {
  const slugs = await getPostSlugs(GUIDES_DIR_PATH);
  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, GUIDES_DIR_PATH)) return;
      const data = getPostBySlug(slug, GUIDES_DIR_PATH);

      const slugWithoutFirstSlash = slug.slice(1);
      const {
        data: { title, subtitle, createdAt, updatedOn, isDraft, redirectFrom, author },
        excerpt,
      } = data;

      const authorData = getAuthor(author);

      // eslint-disable-next-line consistent-return
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
      };
    })
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

export { getAuthors, getAuthor, getNavigationLinks, getAllGuides };
