/* eslint-disable import/no-unresolved, max-classes-per-file */
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { createGunzip } from 'zlib';

import { Octokit } from '@octokit/core';
import matter from 'gray-matter';
import * as tar from 'tar';

const BLOG_CONTENT_DIRNAME = 'content/blog';
const BLOG_CONTENT_USER_AGENT = 'neon-next-blog-loader/1.0';

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

const normalizeBaseUrl = (baseUrl) => baseUrl.replace(/\/+$/u, '');

const joinUrl = (baseUrl, relativePath) =>
  `${normalizeBaseUrl(baseUrl)}/${relativePath.replace(/^\/+/u, '')}`;

const ensureDirectory = async (targetDir) => {
  await fs.mkdir(targetDir, { recursive: true });
};

const readJsonWithRaw = async (filePath, fallback) => {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return {
      data: JSON.parse(raw),
      raw,
    };
  } catch {
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
    const files = (await fs.readdir(postsDir)).filter((fileName) => fileName.endsWith('.md'));

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
  } catch {
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

const fetchText = async (url, init = {}) => {
  let response;

  try {
    response = await fetch(url, {
      ...init,
      headers: {
        'user-agent': BLOG_CONTENT_USER_AGENT,
        ...(init.headers || {}),
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
};

const fetchJson = async (url, init = {}) => {
  const raw = await fetchText(url, init);

  return {
    data: JSON.parse(raw),
    raw,
  };
};

const readBlogSnapshotFromCdn = async (baseUrl) => {
  const manifest = await fetchJson(joinUrl(baseUrl, 'manifest.json'), {
    next: { revalidate: 60 },
  });
  const slugs = manifest.data?.posts || [];

  const [authorsResult, categoriesResult, posts] = await Promise.all([
    fetchJson(joinUrl(baseUrl, 'authors/data.json'), { next: { revalidate: 60 } }),
    fetchJson(joinUrl(baseUrl, 'categories/data.json'), { next: { revalidate: 60 } }),
    Promise.all(
      slugs.map(async (slug) => {
        const raw = await fetchText(joinUrl(baseUrl, `posts/${slug}.md`), {
          next: { revalidate: 60 },
        });
        const { data, content } = matter(raw);

        return {
          slug,
          fileName: `${slug}.md`,
          raw,
          data,
          content,
        };
      })
    ),
  ]);

  return createSnapshot({
    source: 'cdn',
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

const getGitHubBranchInfo = async ({ owner, repo, branch, token }) => {
  if (!owner || !repo || !token) {
    throw new BlogContentConfigError(
      'BLOG_REPO_OWNER, BLOG_REPO_NAME, and BLOG_GITHUB_TOKEN are required for branch content'
    );
  }

  try {
    const octokit = getOctokit(token);
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
      owner,
      repo,
      branch,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
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

const extractTarballToDirectory = async (response, destinationDir) => {
  if (!response.body) {
    throw new Error('GitHub archive response did not include a body');
  }

  await pipeline(
    Readable.fromWeb(response.body),
    createGunzip(),
    tar.x({
      cwd: destinationDir,
      strip: 1,
    })
  );
};

const readBlogSnapshotFromGitHubBranch = async ({ owner, repo, branch, token }) => {
  const { commitSha } = await getGitHubBranchInfo({ owner, repo, branch, token });
  const archiveUrl = `https://api.github.com/repos/${owner}/${repo}/tarball/${commitSha}`;

  const response = await fetch(archiveUrl, {
    headers: {
      authorization: `Bearer ${token}`,
      'user-agent': BLOG_CONTENT_USER_AGENT,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new BlogContentBranchNotFoundError(branch);
    }

    throw new Error(
      `Failed to fetch GitHub archive for ${owner}/${repo}@${branch}: ${response.status}`
    );
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'neon-blog-archive-'));

  try {
    await extractTarballToDirectory(response, tempDir);

    return await readBlogSnapshotFromDirectory({
      rootDir: tempDir,
      source: 'branch',
      branch,
      commitSha,
    });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
};

const hasLocalBlogContent = async (rootDir = process.cwd()) => {
  const blogDir = path.join(rootDir, BLOG_CONTENT_DIRNAME);

  try {
    const stat = await fs.stat(blogDir);
    return stat.isDirectory();
  } catch {
    return false;
  }
};

const readLocalBlogSnapshot = async (rootDir = process.cwd()) =>
  readBlogSnapshotFromDirectory({
    rootDir: path.join(rootDir, BLOG_CONTENT_DIRNAME),
    source: 'local',
  });

const writeBlogSnapshotToDirectory = async ({ snapshot, destinationDir, force = false }) => {
  if (force) {
    await fs.rm(destinationDir, { recursive: true, force: true });
  } else {
    try {
      await fs.access(destinationDir);
      throw new Error(
        `${destinationDir} already exists. Re-run with --force to overwrite the local working copy.`
      );
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  await ensureDirectory(path.join(destinationDir, 'posts'));
  await ensureDirectory(path.join(destinationDir, 'authors'));
  await ensureDirectory(path.join(destinationDir, 'categories'));

  await Promise.all([
    fs.writeFile(path.join(destinationDir, 'authors/data.json'), snapshot.authorsRaw, 'utf8'),
    fs.writeFile(path.join(destinationDir, 'categories/data.json'), snapshot.categoriesRaw, 'utf8'),
    ...snapshot.posts.map((post) =>
      fs.writeFile(path.join(destinationDir, 'posts', post.fileName), post.raw, 'utf8')
    ),
  ]);
};

const createSnapshotFileMap = (snapshot) => {
  const fileMap = new Map();

  fileMap.set('authors/data.json', snapshot.authorsRaw);
  fileMap.set('categories/data.json', snapshot.categoriesRaw);

  snapshot.posts.forEach((post) => {
    fileMap.set(`posts/${post.fileName}`, post.raw);
  });

  return fileMap;
};

const compareSnapshots = (left, right) => {
  const leftMap = createSnapshotFileMap(left);
  const rightMap = createSnapshotFileMap(right);
  const allPaths = new Set([...leftMap.keys(), ...rightMap.keys()]);
  const changedPaths = [];

  allPaths.forEach((filePath) => {
    if (leftMap.get(filePath) !== rightMap.get(filePath)) {
      changedPaths.push(filePath);
    }
  });

  return {
    isEqual: changedPaths.length === 0,
    changedPaths: changedPaths.sort(),
  };
};

const resolveChangedPostSlugs = (changedPaths) =>
  changedPaths
    .filter((filePath) => filePath.startsWith('posts/') && filePath.endsWith('.md'))
    .map((filePath) => path.basename(filePath, '.md'));

export {
  BLOG_CONTENT_DIRNAME,
  BlogContentBranchNotFoundError,
  BlogContentConfigError,
  compareSnapshots,
  createSnapshotFileMap,
  hasLocalBlogContent,
  readBlogSnapshotFromCdn,
  readBlogSnapshotFromGitHubBranch,
  readLocalBlogSnapshot,
  resolveChangedPostSlugs,
  writeBlogSnapshotToDirectory,
};
