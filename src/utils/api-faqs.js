const { FAQS_DIR_PATH, DOCS_FAQS_DIR_PATH } = require('../constants/content');

const { getPostSlugs, getPostBySlug } = require('./api-content');

const buildFaqs = async (dirPath) => {
  const slugs = await getPostSlugs(dirPath);
  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, dirPath)) return;
      const data = getPostBySlug(slug, dirPath);

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
    .filter(Boolean)
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft)
    .sort((a, b) => {
      // Established FAQs carry no createdAt; fall back to title order so results are stable.
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (at !== bt) return bt - at;
      return a.title.localeCompare(b.title);
    });
};

const getAllFaqs = () => buildFaqs(FAQS_DIR_PATH);
const getAllDocsFaqs = () => buildFaqs(DOCS_FAQS_DIR_PATH);

const getNavigationLinks = (slug, posts) => {
  const currentItemIndex = posts.findIndex((item) => item.slug === slug);

  const previousItem = posts[currentItemIndex - 1];
  const nextItem = posts[currentItemIndex + 1];

  return {
    previousLink: { title: previousItem?.title, slug: previousItem?.slug },
    nextLink: { title: nextItem?.title, slug: nextItem?.slug },
  };
};

export { getAllFaqs, getAllDocsFaqs, getNavigationLinks };
