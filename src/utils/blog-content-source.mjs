/* global Buffer, process */
/* eslint-disable import/no-unresolved */
import fs from 'fs/promises';
import path from 'path';

import { Octokit } from '@octokit/core';
import matter from 'gray-matter';

const BLOG_CONTENT_DIRNAME = 'content/blog';
const BLOG_AUTHORS_DATA_PATH = `${BLOG_CONTENT_DIRNAME}/authors/data.json`;
const BLOG_CATEGORIES_DATA_PATH = `${BLOG_CONTENT_DIRNAME}/categories/data.json`;
const BLOG_POSTS_DIRNAME = `${BLOG_CONTENT_DIRNAME}/posts`;
const GITHUB_CHANGED_FILE_FETCH_CONCURRENCY = 8;

class BlogContentBranchNotFoundError extends Error {
  constructor(branch) {
    super(`Blog content branch "${branch}" was not found`);
    this.name = 'BlogContentBranchNotFoundError';
    this.branch = branch;
  }
}

class BlogContentConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BlogContentConfigError';
  }
}

const readJsonWithRaw = async (filePath, fallback) => {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return {
      data: JSON.parse(raw),
      raw,
    };
  } catch (error) {
    void error;

    return {
      data: fallback,
      raw: JSON.stringify(fallback, null, 2),
    };
  }
};

const createSnapshot = ({
  source,
  branch = null,
  commitSha = null,
  rootDir = null,
  posts,
  authorsData,
  authorsRaw,
  categoriesData,
  categoriesRaw,
}) => ({
  source,
  branch,
  commitSha,
  rootDir,
  posts,
  authorsData,
  authorsRaw,
  categoriesData,
  categoriesRaw,
});

const readPostsFromDirectory = async (postsDir) => {
  try {
    const files = (await fs.readdir(postsDir))
      .filter((fileName) => fileName.endsWith('.md'))
      .sort();

    return Promise.all(
      files.map(async (fileName) => {
        const raw = await fs.readFile(path.join(postsDir, fileName), 'utf8');
        const { data, content } = matter(raw);

        return {
          slug: fileName.replace(/\.md$/u, ''),
          fileName,
          raw,
          data,
          content,
        };
      })
    );
  } catch (error) {
    void error;

    return [];
  }
};

const readBlogSnapshotFromDirectory = async ({
  rootDir,
  source,
  branch = null,
  commitSha = null,
}) => {
  const authorsResult = await readJsonWithRaw(path.join(rootDir, 'authors/data.json'), {});
  const categoriesResult = await readJsonWithRaw(path.join(rootDir, 'categories/data.json'), []);
  const posts = await readPostsFromDirectory(path.join(rootDir, 'posts'));

  return createSnapshot({
    source,
    branch,
    commitSha,
    rootDir,
    posts,
    authorsData: authorsResult.data,
    authorsRaw: authorsResult.raw,
    categoriesData: categoriesResult.data,
    categoriesRaw: categoriesResult.raw,
  });
};

const getOctokit = (token) =>
  new Octokit({
    auth: token,
  });

const getGitHubRequestHeaders = () => ({
  'X-GitHub-Api-Version': '2026-03-10',
});

const getGitHubBranchInfo = async ({ owner, repo, branch, token }) => {
  if (!owner || !repo || !token) {
    throw new BlogContentConfigError(
      'BLOG_REPO_OWNER, BLOG_REPO_NAME, and BLOG_GITHUB_TOKEN are required for blog preview content'
    );
  }

  try {
    const octokit = getOctokit(token);
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
      owner,
      repo,
      branch,
      headers: getGitHubRequestHeaders(),
    });

    return {
      commitSha: data.commit.sha,
    };
  } catch (error) {
    if (error.status === 404) {
      throw new BlogContentBranchNotFoundError(branch);
    }

    throw error;
  }
};

const getGitHubBranchComparison = async ({ owner, repo, branch, token, baseBranch, headRef }) => {
  try {
    const octokit = getOctokit(token);
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/compare/{basehead}', {
      owner,
      repo,
      basehead: `${baseBranch}...${headRef}`,
      headers: getGitHubRequestHeaders(),
    });

    return data.files || [];
  } catch (error) {
    if (error.status === 404) {
      throw new BlogContentBranchNotFoundError(branch);
    }

    throw error;
  }
};

const fetchGitHubTextFile = async ({ owner, repo, commitSha, token, filePath }) => {
  try {
    const octokit = getOctokit(token);
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: filePath,
      ref: commitSha,
      headers: getGitHubRequestHeaders(),
    });

    if (Array.isArray(data) || data.type !== 'file' || !data.content) {
      throw new Error(`GitHub path "${filePath}" is not a file`);
    }

    return Buffer.from(data.content, data.encoding === 'base64' ? 'base64' : 'utf8').toString(
      'utf8'
    );
  } catch (error) {
    if (error.status === 404) {
      return null;
    }

    throw error;
  }
};

const mapWithConcurrency = async (items, limit, mapper) => {
  const results = [];

  for (let index = 0; index < items.length; index += limit) {
    const batch = items.slice(index, index + limit);
    results.push(...(await Promise.all(batch.map(mapper))));
  }

  return results;
};

const readJsonFromGitHub = async ({ owner, repo, commitSha, token, filePath, fallback }) => {
  const raw = await fetchGitHubTextFile({ owner, repo, commitSha, token, filePath });

  if (!raw) {
    const fallbackRaw = JSON.stringify(fallback, null, 2);

    return {
      data: fallback,
      raw: fallbackRaw,
    };
  }

  return {
    data: JSON.parse(raw),
    raw,
  };
};

const parseJsonWithRaw = (raw, fallback) => {
  if (!raw) {
    const fallbackRaw = JSON.stringify(fallback, null, 2);

    return {
      data: fallback,
      raw: fallbackRaw,
    };
  }

  return {
    data: JSON.parse(raw),
    raw,
  };
};

const readPostFromGitHub = async ({ owner, repo, commitSha, token, filePath, fileName }) => {
  const raw = await fetchGitHubTextFile({
    owner,
    repo,
    commitSha,
    token,
    filePath,
  });

  if (!raw) {
    return null;
  }

  const { data, content } = matter(raw);

  return {
    slug: fileName.replace(/\.md$/u, ''),
    fileName,
    raw,
    data,
    content,
  };
};

const readPostsFromGitHub = async ({ owner, repo, commitSha, token, postSlug }) => {
  const fileName = `${postSlug}.md`;
  const post = await readPostFromGitHub({
    owner,
    repo,
    commitSha,
    token,
    filePath: `${BLOG_POSTS_DIRNAME}/${fileName}`,
    fileName,
  });

  return post ? [post] : [];
};

const isBlogPostPath = (filePath) =>
  filePath.startsWith(`${BLOG_POSTS_DIRNAME}/`) && filePath.endsWith('.md');

const getPostFileNameFromPath = (filePath) => path.basename(filePath);

const isBlogOverlayFile = (file) =>
  file.filename === BLOG_AUTHORS_DATA_PATH ||
  file.filename === BLOG_CATEGORIES_DATA_PATH ||
  isBlogPostPath(file.filename) ||
  (file.previous_filename && isBlogPostPath(file.previous_filename));

const applyGitHubBranchOverlay = async ({
  baseSnapshot,
  changedFiles,
  owner,
  repo,
  branch,
  commitSha,
  token,
}) => {
  const postsByFileName = new Map(baseSnapshot.posts.map((post) => [post.fileName, post]));
  let authorsRaw = baseSnapshot.authorsRaw;
  let authorsData = baseSnapshot.authorsData;
  let categoriesRaw = baseSnapshot.categoriesRaw;
  let categoriesData = baseSnapshot.categoriesData;

  await mapWithConcurrency(
    changedFiles.filter(isBlogOverlayFile),
    GITHUB_CHANGED_FILE_FETCH_CONCURRENCY,
    async (file) => {
      if (file.previous_filename && isBlogPostPath(file.previous_filename)) {
        postsByFileName.delete(getPostFileNameFromPath(file.previous_filename));
      }

      if (file.status === 'removed') {
        if (isBlogPostPath(file.filename)) {
          postsByFileName.delete(getPostFileNameFromPath(file.filename));
        } else if (file.filename === BLOG_AUTHORS_DATA_PATH) {
          ({ data: authorsData, raw: authorsRaw } = parseJsonWithRaw(null, {}));
        } else if (file.filename === BLOG_CATEGORIES_DATA_PATH) {
          ({ data: categoriesData, raw: categoriesRaw } = parseJsonWithRaw(null, []));
        }

        return;
      }

      if (
        file.filename !== BLOG_AUTHORS_DATA_PATH &&
        file.filename !== BLOG_CATEGORIES_DATA_PATH &&
        !isBlogPostPath(file.filename)
      ) {
        return;
      }

      const raw = await fetchGitHubTextFile({
        owner,
        repo,
        commitSha,
        token,
        filePath: file.filename,
      });

      if (isBlogPostPath(file.filename)) {
        if (!raw) return;

        const fileName = getPostFileNameFromPath(file.filename);
        const { data, content } = matter(raw);

        postsByFileName.set(fileName, {
          slug: fileName.replace(/\.md$/u, ''),
          fileName,
          raw,
          data,
          content,
        });
      } else if (file.filename === BLOG_AUTHORS_DATA_PATH) {
        ({ data: authorsData, raw: authorsRaw } = parseJsonWithRaw(raw, {}));
      } else if (file.filename === BLOG_CATEGORIES_DATA_PATH) {
        ({ data: categoriesData, raw: categoriesRaw } = parseJsonWithRaw(raw, []));
      }
    }
  );

  const posts = [...postsByFileName.values()].sort((left, right) =>
    left.fileName.localeCompare(right.fileName)
  );

  return createSnapshot({
    source: 'branch',
    branch,
    commitSha,
    rootDir: baseSnapshot.rootDir,
    posts,
    authorsData,
    authorsRaw,
    categoriesData,
    categoriesRaw,
  });
};

const readBlogBranchInfoFromGitHub = async ({ owner, repo, branch, token }) => {
  const { commitSha } = await getGitHubBranchInfo({ owner, repo, branch, token });

  return {
    source: 'branch',
    branch,
    commitSha,
  };
};

const readBlogSnapshotFromGitHubBranch = async ({
  owner,
  repo,
  branch,
  token,
  postSlug = null,
  rootDir = process.cwd(),
  baseBranch = 'main',
}) => {
  const { commitSha } = await getGitHubBranchInfo({ owner, repo, branch, token });

  if (!postSlug) {
    const [baseSnapshot, changedFiles] = await Promise.all([
      readLocalBlogSnapshot(rootDir),
      getGitHubBranchComparison({ owner, repo, branch, token, baseBranch, headRef: commitSha }),
    ]);

    return applyGitHubBranchOverlay({
      baseSnapshot,
      changedFiles,
      owner,
      repo,
      branch,
      commitSha,
      token,
    });
  }

  const [authorsResult, categoriesResult, posts] = await Promise.all([
    readJsonFromGitHub({
      owner,
      repo,
      commitSha,
      token,
      filePath: BLOG_AUTHORS_DATA_PATH,
      fallback: {},
    }),
    readJsonFromGitHub({
      owner,
      repo,
      commitSha,
      token,
      filePath: BLOG_CATEGORIES_DATA_PATH,
      fallback: [],
    }),
    readPostsFromGitHub({ owner, repo, branch, commitSha, token, postSlug }),
  ]);

  return createSnapshot({
    source: 'branch',
    branch,
    commitSha,
    posts,
    authorsData: authorsResult.data,
    authorsRaw: authorsResult.raw,
    categoriesData: categoriesResult.data,
    categoriesRaw: categoriesResult.raw,
  });
};

const readLocalBlogSnapshot = async (rootDir = process.cwd()) =>
  readBlogSnapshotFromDirectory({
    rootDir: path.join(rootDir, BLOG_CONTENT_DIRNAME),
    source: 'local',
  });

export {
  BLOG_CONTENT_DIRNAME,
  BlogContentBranchNotFoundError,
  BlogContentConfigError,
  readBlogSnapshotFromDirectory,
  readBlogBranchInfoFromGitHub,
  readBlogSnapshotFromGitHubBranch,
  readLocalBlogSnapshot,
};
