import { execFileSync } from 'child_process';

import { EXTRA_CATEGORIES } from 'constants/blog';
import { getAllChangelogs } from 'utils/api-docs';
import { getAllGuides } from 'utils/api-guides';
import {
  BlogContentBranchNotFoundError,
  BlogContentConfigError,
  hasLocalBlogContent,
  readBlogSnapshotFromCdn,
  readBlogSnapshotFromGitHubBranch,
  readLocalBlogSnapshot,
} from 'utils/blog-content-source.mjs';
import getExcerpt from 'utils/get-excerpt';

const DEFAULT_CDN_BASE = 'https://blog.neonapi.io/blog';
const REMOTE_BRANCH_CACHE_TTL_MS = 30 * 1000;
const REMOTE_CDN_CACHE_TTL_MS = 60 * 1000;
const remoteSnapshotCache = new Map();

const getCurrentWebsiteBranch = async () => {
  const branchFromEnv =
    process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || process.env.GITHUB_HEAD_REF;

  if (branchFromEnv) {
    return branchFromEnv;
  }

  try {
    return execFileSync('git', ['branch', '--show-current'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    }).trim();
  } catch {
    return 'main';
  }
};

const getCdnBaseUrl = () => process.env.BLOG_CDN_URL || DEFAULT_CDN_BASE;

const isLocalDevelopment = () => process.env.NODE_ENV === 'development';

const isProductionWebsite = () => process.env.VERCEL_ENV === 'production';

const getRemoteSnapshot = async (cacheKey, ttlMs, loader) => {
  const now = Date.now();
  const cachedValue = remoteSnapshotCache.get(cacheKey);

  if (cachedValue && cachedValue.expiresAt > now) {
    return cachedValue.promise;
  }

  const promise = loader().catch((error) => {
    remoteSnapshotCache.delete(cacheKey);
    throw error;
  });

  remoteSnapshotCache.set(cacheKey, {
    expiresAt: now + ttlMs,
    promise,
  });

  return promise;
};

const getCdnSnapshot = async () =>
  getRemoteSnapshot(`cdn:${getCdnBaseUrl()}`, REMOTE_CDN_CACHE_TTL_MS, () =>
    readBlogSnapshotFromCdn(getCdnBaseUrl())
  );

const getBranchSnapshot = async (branch) => {
  const owner = process.env.BLOG_REPO_OWNER;
  const repo = process.env.BLOG_REPO_NAME;
  const token = process.env.BLOG_GITHUB_TOKEN;

  return getRemoteSnapshot(`branch:${owner}:${repo}:${branch}`, REMOTE_BRANCH_CACHE_TTL_MS, () =>
    readBlogSnapshotFromGitHubBranch({
      owner,
      repo,
      branch,
      token,
    })
  );
};

const getResolvedBlogSnapshot = async ({ previewBranch = null, strictBranch = false } = {}) => {
  if (previewBranch) {
    return getBranchSnapshot(previewBranch);
  }

  if (isLocalDevelopment() && (await hasLocalBlogContent())) {
    return readLocalBlogSnapshot();
  }

  const websiteBranch = await getCurrentWebsiteBranch();

  if (isProductionWebsite() || websiteBranch === 'main') {
    return getCdnSnapshot();
  }

  if (websiteBranch) {
    try {
      return await getBranchSnapshot(websiteBranch);
    } catch (error) {
      if (
        error instanceof BlogContentBranchNotFoundError ||
        error instanceof BlogContentConfigError
      ) {
        if (strictBranch) {
          throw error;
        }

        return getCdnSnapshot();
      }

      throw error;
    }
  }

  return getCdnSnapshot();
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

const mapPostToListShape = (postEntry, authorsData, categoriesData) => {
  const { slug, data: frontmatter } = postEntry;
  const excerpt =
    frontmatter.excerpt || frontmatter.description || getExcerpt(postEntry.content, 280);
  const categorySlugs =
    frontmatter.categories || (frontmatter.category ? [frontmatter.category] : []);
  const categoryNodes = categorySlugs.map((categorySlug) => {
    const category = categoriesData.find((item) => item.slug === categorySlug);

    return { slug: categorySlug, name: category?.name || categorySlug };
  });

  const authors = (frontmatter.authors || [])
    .map((authorSlug) => mapAuthor(authorSlug, authorsData))
    .filter(Boolean);

  return {
    slug,
    date: frontmatter.date,
    modifiedGmt: frontmatter.updatedOn || frontmatter.date,
    title: frontmatter.title,
    subtitle: frontmatter.subtitle || '',
    excerpt,
    isFeatured: frontmatter.isFeatured || false,
    categories: { nodes: categoryNodes },
    pageBlogPost: {
      isFeatured: frontmatter.isFeatured || false,
      description: frontmatter.description || '',
      largeCover: frontmatter.cover?.image
        ? { mediaItemUrl: frontmatter.cover.image, altText: frontmatter.cover.alt || '' }
        : null,
      authors,
    },
  };
};

const getMappedBlogPostsFromSnapshot = (snapshot) => {
  const isProduction = isProductionWebsite();

  const posts = snapshot.posts
    .map((postEntry) => {
      if (postEntry.data?.draft && isProduction) {
        return null;
      }

      return mapPostToListShape(postEntry, snapshot.authorsData, snapshot.categoriesData);
    })
    .filter(Boolean);

  posts.sort((left, right) => new Date(right.date) - new Date(left.date));

  return posts;
};

const getMappedBlogPosts = async ({ previewBranch = null, strictBranch = false } = {}) =>
  getMappedBlogPostsFromSnapshot(await getResolvedBlogSnapshot({ previewBranch, strictBranch }));

export const getBlogSnapshot = async (options = {}) => getResolvedBlogSnapshot(options);

export const getAllBlogPosts = async (options = {}) => getMappedBlogPosts(options);

export const getAllBlogCategories = async (options = {}) => {
  const snapshot = await getResolvedBlogSnapshot(options);
  const posts = getMappedBlogPostsFromSnapshot(snapshot);
  const counts = {};

  posts.forEach((post) => {
    post.categories.nodes.forEach(({ slug }) => {
      counts[slug] = (counts[slug] || 0) + 1;
    });
  });

  return snapshot.categoriesData
    .filter((category) => category.slug !== 'uncategorized' && counts[category.slug] > 0)
    .map((category) => ({
      name: category.name,
      slug: category.slug,
      posts: { nodes: new Array(counts[category.slug]).fill({}) },
    }));
};

export const getAllCategories = async (options = {}) => {
  const blogCategories = await getAllBlogCategories(options);

  return [...blogCategories, ...EXTRA_CATEGORIES];
};

export const getCategoryBySlug = async (slug, options = {}) => {
  const extraCategory = EXTRA_CATEGORIES.find((category) => category.slug === slug);

  if (extraCategory) return extraCategory;

  const categories = await getAllBlogCategories(options);

  return categories.find((category) => category.slug === slug);
};

export const getPostsByCategorySlug = async (slug, options = {}) => {
  if (!options.previewBranch) {
    if (slug === 'guides') return (await getAllGuides()).filter((guide) => !guide.excludeFromBlog);
    if (slug === 'changelog') return getAllChangelogs();
  }

  const posts = await getMappedBlogPosts(options);

  return posts.filter((post) => post.categories.nodes.some((category) => category.slug === slug));
};

export const getAllPosts = async (options = {}) => {
  const [blogPosts, guides, changelogs] = await Promise.all([
    getAllBlogPosts(options),
    options.previewBranch
      ? Promise.resolve([])
      : getAllGuides().then((items) => items.filter((guide) => !guide.excludeFromBlog)),
    options.previewBranch ? Promise.resolve([]) : getAllChangelogs(),
  ]);

  const [featuredPosts, restBlogPosts] = blogPosts.reduce(
    ([featured, rest], post) => {
      const isFeaturedPost = post.pageBlogPost?.isFeatured || post.isFeatured;

      if (isFeaturedPost && featured.length < 2) {
        featured.push({ ...post, isFeatured: true });
      } else {
        rest.push({ ...post, isFeatured: false });
      }

      return [featured, rest];
    },
    [[], []]
  );

  const restPosts = [...restBlogPosts, ...guides, ...changelogs];
  restPosts.sort((left, right) => new Date(right.date) - new Date(left.date));

  return [...featuredPosts, ...restPosts];
};

export const getBlogPostBySlug = async (slug, options = {}) => {
  const snapshot = await getResolvedBlogSnapshot(options);
  const postEntry = snapshot.posts.find((entry) => entry.slug === slug);

  if (!postEntry || (postEntry.data?.draft && isProductionWebsite())) {
    return { post: null, relatedPosts: [] };
  }

  const post = {
    ...mapPostToListShape(postEntry, snapshot.authorsData, snapshot.categoriesData),
    content: postEntry.content,
    dateGmt: postEntry.data.date,
    seo: {
      title: postEntry.data.seo?.title || postEntry.data.title,
      metaDesc: postEntry.data.seo?.description || postEntry.data.description,
      metaKeywords: (postEntry.data.seo?.keywords || []).join(', '),
      metaRobotsNoindex: postEntry.data.seo?.noindex || false,
      opengraphTitle:
        postEntry.data.seo?.ogTitle || postEntry.data.seo?.title || postEntry.data.title,
      opengraphDescription:
        postEntry.data.seo?.ogDescription ||
        postEntry.data.seo?.description ||
        postEntry.data.description,
      twitterImage: postEntry.data.cover?.image
        ? { mediaItemUrl: postEntry.data.cover.image }
        : null,
    },
  };

  const relatedPosts = getMappedBlogPostsFromSnapshot(snapshot)
    .filter((relatedPost) => relatedPost.slug !== slug)
    .slice(0, 3);

  return { post, relatedPosts };
};
