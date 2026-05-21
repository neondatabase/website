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
const GITHUB_BLOB_FETCH_BATCH_SIZE = 120;
const GITHUB_BLOB_FETCH_BATCH_CONCURRENCY = 4;

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

    const commitSha = data.commit && data.commit.sha;
    const treeSha =
      data.commit && data.commit.commit && data.commit.commit.tree && data.commit.commit.tree.sha;

    if (!commitSha || !treeSha) {
      throw new BlogContentConfigError(
        `GitHub branch "${branch}" response does not include commit and tree SHAs`
      );
    }

    return {
      commitSha,
      treeSha,
    };
  } catch (error) {
    if (error.status === 404) {
      throw new BlogContentBranchNotFoundError(branch);
    }

    throw error;
  }
};

const getGitHubTreeEntries = async ({ owner, repo, branch, treeSha, token }) => {
  try {
    const octokit = getOctokit(token);
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
      owner,
      repo,
      tree_sha: treeSha,
      recursive: '1',
      headers: getGitHubRequestHeaders(),
    });

    if (data.truncated) {
      throw new BlogContentConfigError(
        `GitHub tree for blog preview branch "${branch}" is too large to load safely`
      );
    }

    return data.tree || [];
  } catch (error) {
    if (error.status === 404) {
      throw new BlogContentBranchNotFoundError(branch);
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

const readJsonFromGitHub = async ({ owner, repo, commitSha, token, filePath, fallback }) => {
  const raw = await fetchGitHubTextFile({ owner, repo, commitSha, token, filePath });

  return parseJsonWithRaw(raw, fallback);
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

const isBlogSnapshotPath = (filePath) =>
  filePath === BLOG_AUTHORS_DATA_PATH ||
  filePath === BLOG_CATEGORIES_DATA_PATH ||
  isBlogPostPath(filePath);

const fetchGitHubTextFiles = async ({ owner, repo, commitSha, token, filePaths }) => {
  const filesByPath = new Map();
  const batches = [];

  for (let index = 0; index < filePaths.length; index += GITHUB_BLOB_FETCH_BATCH_SIZE) {
    batches.push(filePaths.slice(index, index + GITHUB_BLOB_FETCH_BATCH_SIZE));
  }

  await mapWithConcurrency(batches, GITHUB_BLOB_FETCH_BATCH_CONCURRENCY, async (batchFilePaths) => {
    const octokit = getOctokit(token);
    const queryFields = batchFilePaths
      .map((filePath, index) => {
        const expression = JSON.stringify(`${commitSha}:${filePath}`);

        return `file${index}: object(expression: ${expression}) { ... on Blob { text isBinary } }`;
      })
      .join('\n');
    const { data } = await octokit.request('POST /graphql', {
      query: `
        query BlogPreviewFiles($owner: String!, $repo: String!) {
          repository(owner: $owner, name: $repo) {
            ${queryFields}
          }
        }
      `,
      variables: { owner, repo },
      headers: getGitHubRequestHeaders(),
    });
    const repository = (data.data && data.data.repository) || data.repository || {};

    batchFilePaths.forEach((filePath, index) => {
      const blob = repository[`file${index}`];

      if (!blob || blob.isBinary || typeof blob.text !== 'string') {
        throw new Error(`GitHub path "${filePath}" is not a readable text file`);
      }

      filesByPath.set(filePath, blob.text);
    });
  });

  return filesByPath;
};

const readBlogSnapshotFromGitHubTree = async ({ owner, repo, branch, commitSha, treeSha, token }) => {
  const treeEntries = await getGitHubTreeEntries({ owner, repo, branch, treeSha, token });
  const filePaths = treeEntries
    .filter((entry) => entry.type === 'blob' && isBlogSnapshotPath(entry.path))
    .map((entry) => entry.path)
    .sort((left, right) => left.localeCompare(right));
  const filesByPath = await fetchGitHubTextFiles({ owner, repo, commitSha, token, filePaths });
  const authorsResult = parseJsonWithRaw(filesByPath.get(BLOG_AUTHORS_DATA_PATH), {});
  const categoriesResult = parseJsonWithRaw(filesByPath.get(BLOG_CATEGORIES_DATA_PATH), []);
  const posts = filePaths
    .filter(isBlogPostPath)
    .map((filePath) => {
      const raw = filesByPath.get(filePath);
      const fileName = getPostFileNameFromPath(filePath);
      const { data, content } = matter(raw);

      return {
        slug: fileName.replace(/\.md$/u, ''),
        fileName,
        raw,
        data,
        content,
      };
    });

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
}) => {
  const { commitSha, treeSha } = await getGitHubBranchInfo({ owner, repo, branch, token });

  if (!postSlug) {
    return readBlogSnapshotFromGitHubTree({
      owner,
      repo,
      branch,
      commitSha,
      treeSha,
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
