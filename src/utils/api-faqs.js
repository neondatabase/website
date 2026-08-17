const fs = require('fs');

const matter = require('gray-matter');

const { FAQS_DIR_PATH } = require('../constants/content');

const { getPostSlugs, getPostBySlug } = require('./api-content');

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

const getFaqFrontmatter = (slug) => {
  try {
    const source = fs.readFileSync(`${process.cwd()}/${FAQS_DIR_PATH}/${slug}.md`, 'utf-8');
    const { data } = matter(source);
    return data;
  } catch (_e) {
    return null;
  }
};

const getAllFaqSlugs = async () => {
  const slugs = await getPostSlugs(FAQS_DIR_PATH);
  if (!isProduction) {
    return slugs.map((slug) => slug.slice(1));
  }

  return slugs
    .map((slug) => {
      const data = getFaqFrontmatter(slug);
      if (!data || data.isDraft) return;
      return slug.slice(1);
    })
    .filter(Boolean);
};

const getAllFaqs = async () => {
  const slugs = await getPostSlugs(FAQS_DIR_PATH);
  return slugs
    .map((slug) => {
      const data = getPostBySlug(slug, FAQS_DIR_PATH);
      if (!data) return;

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
    .filter((item) => !isProduction || !item.isDraft)
    .sort((a, b) => (new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime() ? 1 : -1));
};

export { getAllFaqSlugs, getAllFaqs };
