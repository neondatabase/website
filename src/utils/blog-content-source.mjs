/* global Buffer, process */
/* eslint-disable import/no-unresolved */
import fs from 'fs/promises';
import path from 'path';

import { Octokit } from '@octokit/core';
import matter from 'gray-matter';

const BLOG_CONTENT_DIRNAME = 'content/blog';
const GITHUB_CONTENT_FETCH_CONCURRENCY = 24;

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

const getGitHubDirectoryContents = async ({ owner, repo, branch, token, directoryPath }) => {
  try {
    const octokit = getOctokit(token);
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: directoryPath,
      ref: branch,
      headers: getGitHubRequestHeaders(),
    });

    if (!Array.isArray(data)) {
      throw new Error(`GitHub path "${directoryPath}" is not a directory`);
    }

    return data;
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

const readPostsFromGitHub = async ({ owner, repo, branch, commitSha, token, postSlug = null }) => {
  if (postSlug) {
    const fileName = `${postSlug}.md`;
    const post = await readPostFromGitHub({
      owner,
      repo,
      commitSha,
      token,
      filePath: `${BLOG_CONTENT_DIRNAME}/posts/${fileName}`,
      fileName,
    });

    return post ? [post] : [];
  }

  const posts = await getGitHubDirectoryContents({
    owner,
    repo,
    branch,
    token,
    directoryPath: `${BLOG_CONTENT_DIRNAME}/posts`,
  });
  const markdownFiles = posts
    .filter((entry) => entry.type === 'file' && entry.name.endsWith('.md'))
    .sort((left, right) => left.name.localeCompare(right.name));

  return mapWithConcurrency(markdownFiles, GITHUB_CONTENT_FETCH_CONCURRENCY, (entry) =>
    readPostFromGitHub({
      owner,
      repo,
      commitSha,
      token,
      filePath: entry.path,
      fileName: entry.name,
    })
  ).then((items) => items.filter(Boolean));
};

const readBlogBranchInfoFromGitHub = async ({ owner, repo, branch, token }) => {
  const { commitSha } = await getGitHubBranchInfo({ owner, repo, branch, token });

  return {
    source: 'branch',
    branch,
    commitSha,
  };
};

const readBlogSnapshotFromGitHubBranch = async ({ owner, repo, branch, token, postSlug = null }) => {
  const { commitSha } = await getGitHubBranchInfo({ owner, repo, branch, token });
  const [authorsResult, categoriesResult, posts] = await Promise.all([
    readJsonFromGitHub({
      owner,
      repo,
      commitSha,
      token,
      filePath: `${BLOG_CONTENT_DIRNAME}/authors/data.json`,
      fallback: {},
    }),
    readJsonFromGitHub({
      owner,
      repo,
      commitSha,
      token,
      filePath: `${BLOG_CONTENT_DIRNAME}/categories/data.json`,
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
