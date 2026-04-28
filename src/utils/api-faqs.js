const { FAQS_DIR_PATH } = require('../constants/content');

const { getPostSlugs, getPostBySlug } = require('./api-content');

const getAllFaqs = async () => {
  const slugs = await getPostSlugs(FAQS_DIR_PATH);
  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, FAQS_DIR_PATH)) return;
      const data = getPostBySlug(slug, FAQS_DIR_PATH);

      const slugWithoutFirstSlash = slug.slice(1);
      const {
        data: { title, subtitle, createdAt, updatedOn, isDraft, redirectFrom },
        excerpt,
      } = data;

      return {
        title,
        subtitle,
        slug: slugWithoutFirstSlash,
        category: 'faqs',
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

export { getAllFaqs, getNavigationLinks };
