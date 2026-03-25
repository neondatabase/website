import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { cache } from 'react';


import { BLOG_POSTS_FOR_PREVIEW, EXTRA_CATEGORIES } from 'constants/blog';
import { getAllChangelogs } from 'utils/api-docs';
import { getAllGuides } from 'utils/api-guides';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const POSTS_DIR = path.join(BLOG_DIR, 'posts');

const getAuthorsData = () => {
  try {
    return JSON.parse(fs.readFileSync(path.join(BLOG_DIR, 'authors/data.json'), 'utf-8'));
  } catch {
    return {};
  }
};

const getCategoriesData = () => {
  try {
    return JSON.parse(fs.readFileSync(path.join(BLOG_DIR, 'categories/data.json'), 'utf-8'));
  } catch {
    return [];
  }
};

const mapAuthor = (slug, authorsData) => {
  const author = authorsData[slug];
  if (!author) return null;
  return {
    author: {
      title: author.name,
      postAuthor: {
        role: author.role || null,
        url: author.url || null,
        image: {
          mediaItemUrl: author.photo,
          altText: author.photoAlt || author.name,
        },
      },
    },
  };
};

const mapPostToListShape = (slug, fm, authorsData, categoriesData) => {
  const categorySlugs = fm.categories || (fm.category ? [fm.category] : []);
  const categoryNodes = categorySlugs.map((catSlug) => {
    const cat = categoriesData.find((c) => c.slug === catSlug);
    return { slug: catSlug, name: cat?.name || catSlug };
  });

  const authors = (fm.authors || [])
    .map((authorSlug) => mapAuthor(authorSlug, authorsData))
    .filter(Boolean);

  return {
    slug,
    date: fm.date,
    modifiedGmt: fm.updatedOn || fm.date,
    title: fm.title,
    excerpt: fm.excerpt || fm.description || '',
    isFeatured: fm.isFeatured || false,
    categories: { nodes: categoryNodes },
    pageBlogPost: {
      isFeatured: fm.isFeatured || false,
      description: fm.description || '',
      largeCover: fm.cover?.image
        ? { mediaItemUrl: fm.cover.image, altText: fm.cover.alt || '' }
        : null,
      authors,
    },
  };
};

const getAllPostSlugs = () => {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
};

export const getAllBlogPosts = cache(() => {
  const authorsData = getAuthorsData();
  const categoriesData = getCategoriesData();
  const isProduction = process.env.VERCEL_ENV === 'production';

  const posts = getAllPostSlugs()
    .map((slug) => {
      try {
        const src = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), 'utf-8');
        const { data: fm } = matter(src);
        if (fm.draft && isProduction) return null;
        return mapPostToListShape(slug, fm, authorsData, categoriesData);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return isProduction ? posts : posts.slice(0, BLOG_POSTS_FOR_PREVIEW);
});

export const getAllBlogCategories = cache(() => {
  const posts = getAllBlogPosts();
  const categoriesData = getCategoriesData();

  const counts = {};
  posts.forEach((post) => {
    post.categories.nodes.forEach(({ slug }) => {
      counts[slug] = (counts[slug] || 0) + 1;
    });
  });

  return categoriesData
    .filter((cat) => counts[cat.slug] > 0)
    .map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      posts: { nodes: new Array(counts[cat.slug]).fill({}) },
    }));
});

export const getAllCategories = async () => {
  const blogCategories = getAllBlogCategories();
  return [...blogCategories, ...EXTRA_CATEGORIES];
};

export const getCategoryBySlug = async (slug) => {
  const extraCategory = EXTRA_CATEGORIES.find((cat) => cat.slug === slug);
  if (extraCategory) return extraCategory;
  return getAllBlogCategories().find((cat) => cat.slug === slug);
};

export const getPostsByCategorySlug = async (slug) => {
  if (slug === 'guides') return getAllGuides();
  if (slug === 'changelog') return getAllChangelogs();
  return getAllBlogPosts().filter((post) => post.categories.nodes.some((cat) => cat.slug === slug));
};

export const getAllPosts = async () => {
  const [blogPosts, guides, changelogs] = await Promise.all([
    Promise.resolve(getAllBlogPosts()),
    getAllGuides(),
    getAllChangelogs(),
  ]);

  const [featuredPosts, restBlogPosts] = blogPosts.reduce(
    ([featured, rest], post) => {
      if (post.isFeatured && featured.length < 2) {
        featured.push({ ...post, isFeatured: true });
      } else {
        rest.push(post);
      }
      return [featured, rest];
    },
    [[], []]
  );

  const restPosts = [...restBlogPosts, ...guides, ...changelogs];
  restPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return [...featuredPosts, ...restPosts];
};

export const getBlogPostBySlug = cache((slug) => {
  try {
    const src = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), 'utf-8');
    const { data: fm, content } = matter(src);
    const authorsData = getAuthorsData();
    const categoriesData = getCategoriesData();

    const post = {
      ...mapPostToListShape(slug, fm, authorsData, categoriesData),
      content,
      dateGmt: fm.date,
      seo: {
        title: fm.seo?.title || fm.title,
        metaDesc: fm.seo?.description || fm.description,
        metaKeywords: (fm.seo?.keywords || []).join(', '),
        metaRobotsNoindex: fm.seo?.noindex || false,
        opengraphTitle: fm.seo?.ogTitle || fm.seo?.title || fm.title,
        opengraphDescription: fm.seo?.ogDescription || fm.seo?.description || fm.description,
        twitterImage: fm.cover?.image ? { mediaItemUrl: fm.cover.image } : null,
      },
    };

    const relatedPosts = getAllBlogPosts()
      .filter((p) => p.slug !== slug)
      .slice(0, 3);

    return { post, relatedPosts };
  } catch {
    return { post: null, relatedPosts: [] };
  }
});
