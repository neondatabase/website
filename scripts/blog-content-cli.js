#!/usr/bin/env node

require('dotenv').config({ path: '.env' });

const { execFileSync } = require('child_process');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const WEBSITE_DEFAULT_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'http://localhost:3000';

function printUsage() {
  console.log(`
Usage:
  npm run blog:bootstrap
  npm run blog:sync -- [--force]
  npm run blog:status
  npm run blog:publish-branch -- [--branch <branch-name>]
`);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {
    command,
    force: false,
    branch: null,
  };

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];

    if (arg === '--force') {
      options.force = true;
      continue;
    }

    if (arg === '--branch') {
      options.branch = rest[index + 1];
      index += 1;
      continue;
    }

    throw new Error(`Unsupported argument "${arg}"`);
  }

  return options;
}

async function loadBlogContentModule() {
  const moduleUrl = pathToFileURL(
    path.join(process.cwd(), 'src/utils/blog-content-source.mjs')
  ).href;

  return import(moduleUrl);
}

function runGit(args, cwd) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function tryRunGit(args, cwd) {
  try {
    return runGit(args, cwd);
  } catch {
    return null;
  }
}

function getCurrentWebsiteBranch() {
  const branch = tryRunGit(['branch', '--show-current'], process.cwd());

  return branch || 'main';
}

function getBlogRepoConfig() {
  return {
    owner: process.env.BLOG_REPO_OWNER,
    repo: process.env.BLOG_REPO_NAME,
    token: process.env.BLOG_GITHUB_TOKEN,
  };
}

function getBlogRepoHttpsUrl() {
  const { owner, repo, token } = getBlogRepoConfig();

  if (!owner || !repo || !token) {
    throw new Error('BLOG_REPO_OWNER, BLOG_REPO_NAME, and BLOG_GITHUB_TOKEN are required');
  }

  return `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;
}

async function resolveRemoteSnapshotForBranch(moduleApi, branch) {
  const {
    BlogContentBranchNotFoundError,
    BlogContentConfigError,
    readBlogSnapshotFromCdn,
    readBlogSnapshotFromGitHubBranch,
  } = moduleApi;
  const { owner, repo, token } = getBlogRepoConfig();
  const cdnUrl = process.env.BLOG_CDN_URL || 'https://blog.neonapi.io/blog';

  if (branch && branch !== 'main') {
    try {
      const snapshot = await readBlogSnapshotFromGitHubBranch({
        owner,
        repo,
        branch,
        token,
      });

      return snapshot;
    } catch (error) {
      if (
        error instanceof BlogContentBranchNotFoundError ||
        error instanceof BlogContentConfigError
      ) {
        try {
          return await readBlogSnapshotFromCdn(cdnUrl);
        } catch (cdnError) {
          const fallbackReason =
            error instanceof BlogContentBranchNotFoundError
              ? `matching blog branch "${branch}" was not found in ${owner}/${repo}`
              : 'blog repo credentials are incomplete for branch-based bootstrap';

          throw new Error(
            `Failed to load blog content for website branch "${branch}": ${fallbackReason}, then CDN fallback ${cdnUrl} failed. ${cdnError.message}`
          );
        }
      }

      throw error;
    }
  }

  try {
    return await readBlogSnapshotFromCdn(cdnUrl);
  } catch (error) {
    throw new Error(`Failed to load blog content from CDN ${cdnUrl}. ${error.message}`);
  }
}

async function handleSync(options) {
  const moduleApi = await loadBlogContentModule();
  const { writeBlogSnapshotToDirectory } = moduleApi;
  const branch = getCurrentWebsiteBranch();
  const snapshot = await resolveRemoteSnapshotForBranch(moduleApi, branch);

  await writeBlogSnapshotToDirectory({
    snapshot,
    destinationDir: BLOG_DIR,
    force: options.force,
  });

  console.log(
    `Synced ${snapshot.posts.length} posts from ${snapshot.source}${
      snapshot.branch ? ` (${snapshot.branch})` : ''
    } into ${BLOG_DIR}`
  );
}

async function handleBootstrap() {
  const moduleApi = await loadBlogContentModule();
  const { hasLocalBlogContent, writeBlogSnapshotToDirectory } = moduleApi;

  if (await hasLocalBlogContent(process.cwd())) {
    console.log(`Blog content already present at ${BLOG_DIR}, skipping bootstrap`);
    return;
  }

  const branch = getCurrentWebsiteBranch();
  const snapshot = await resolveRemoteSnapshotForBranch(moduleApi, branch);

  await writeBlogSnapshotToDirectory({
    snapshot,
    destinationDir: BLOG_DIR,
    force: false,
  });

  console.log(
    `Bootstrapped ${snapshot.posts.length} posts from ${snapshot.source}${
      snapshot.branch ? ` (${snapshot.branch})` : ''
    } into ${BLOG_DIR}`
  );
}

function formatStatusLine(label, value) {
  console.log(`${label.padEnd(22)} ${value}`);
}

async function handleStatus() {
  const moduleApi = await loadBlogContentModule();
  const { compareSnapshots, hasLocalBlogContent, readLocalBlogSnapshot } = moduleApi;
  const branch = getCurrentWebsiteBranch();
  const localExists = await hasLocalBlogContent(process.cwd());
  const remoteSnapshot = await resolveRemoteSnapshotForBranch(moduleApi, branch);
  const branchExists = remoteSnapshot.source === 'branch' && remoteSnapshot.branch === branch;

  formatStatusLine('Website branch', branch);
  formatStatusLine('Matching blog branch', branchExists ? 'yes' : 'no');
  formatStatusLine('Remote source', branchExists ? `branch:${branch}` : 'cdn');
  formatStatusLine('Local content/blog', localExists ? 'present' : 'missing');

  if (!localExists) {
    return;
  }

  const localSnapshot = await readLocalBlogSnapshot(process.cwd());
  const comparison = compareSnapshots(localSnapshot, remoteSnapshot);

  formatStatusLine('Local dirty vs remote', comparison.isEqual ? 'no' : 'yes');

  if (!comparison.isEqual) {
    console.log('\nChanged paths:');
    comparison.changedPaths.slice(0, 20).forEach((filePath) => {
      console.log(`- ${filePath}`);
    });

    if (comparison.changedPaths.length > 20) {
      console.log(`- ... and ${comparison.changedPaths.length - 20} more`);
    }
  }
}

async function writeSnapshotIntoBlogRepo(snapshot, repoRoot, createSnapshotFileMap) {
  const snapshotFileMap = createSnapshotFileMap(snapshot);

  await Promise.all(
    ['posts', 'authors', 'categories'].map((dirName) =>
      fs.rm(path.join(repoRoot, dirName), { recursive: true, force: true })
    )
  );

  for (const [relativePath, contents] of snapshotFileMap.entries()) {
    const targetPath = path.join(repoRoot, relativePath);

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, contents, 'utf8');
  }
}

function getCommitIdentity() {
  return {
    name: tryRunGit(['config', '--get', 'user.name'], process.cwd()) || 'Codex',
    email:
      tryRunGit(['config', '--get', 'user.email'], process.cwd()) || 'codex@localhost.localdomain',
  };
}

async function handlePublishBranch(options) {
  const moduleApi = await loadBlogContentModule();
  const {
    compareSnapshots,
    createSnapshotFileMap,
    hasLocalBlogContent,
    readLocalBlogSnapshot,
    resolveChangedPostSlugs,
  } = moduleApi;
  const localExists = await hasLocalBlogContent(process.cwd());

  if (!localExists) {
    throw new Error(
      'Local content/blog is missing. Run `npm run blog:sync -- --force` or create the working copy first.'
    );
  }

  const targetBranch = options.branch || getCurrentWebsiteBranch();
  const localSnapshot = await readLocalBlogSnapshot(process.cwd());
  const baselineSnapshot = await resolveRemoteSnapshotForBranch(moduleApi, targetBranch);
  const comparison = compareSnapshots(localSnapshot, baselineSnapshot);
  const previewSecret = process.env.BLOG_PREVIEW_SECRET || '<set BLOG_PREVIEW_SECRET>';
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'neon-blog-publish-'));
  const repoUrl = getBlogRepoHttpsUrl();
  const { name, email } = getCommitIdentity();
  let branchExists = false;

  try {
    runGit(['clone', '--depth', '1', '--branch', 'main', repoUrl, tmpDir], process.cwd());

    branchExists = Boolean(tryRunGit(['ls-remote', '--heads', 'origin', targetBranch], tmpDir));

    if (branchExists) {
      runGit(['fetch', 'origin', `${targetBranch}:${targetBranch}`], tmpDir);
      runGit(['checkout', targetBranch], tmpDir);
    } else {
      runGit(['checkout', '-b', targetBranch], tmpDir);
    }

    await writeSnapshotIntoBlogRepo(localSnapshot, tmpDir, createSnapshotFileMap);

    runGit(['add', 'posts', 'authors', 'categories'], tmpDir);

    const hasStagedDiff = Boolean(tryRunGit(['status', '--porcelain'], tmpDir));

    if (hasStagedDiff) {
      runGit(['config', 'user.name', name], tmpDir);
      runGit(['config', 'user.email', email], tmpDir);
      runGit(['commit', '-m', `chore: sync website content for ${targetBranch}`], tmpDir);
    }

    if (!branchExists || hasStagedDiff) {
      runGit(['push', 'origin', `HEAD:${targetBranch}`], tmpDir);
    }

    console.log(
      branchExists ? `Updated blog branch ${targetBranch}` : `Created blog branch ${targetBranch}`
    );

    const changedSlugs = resolveChangedPostSlugs(comparison.changedPaths);

    if (changedSlugs.length > 0) {
      console.log('\nPreview URLs:');
      changedSlugs.slice(0, 10).forEach((slug) => {
        console.log(
          `${WEBSITE_DEFAULT_URL}/blog-preview/${slug}?branch=${encodeURIComponent(
            targetBranch
          )}&secret=${encodeURIComponent(previewSecret)}`
        );
      });
    } else {
      console.log('\nPreview entrypoint:');
      console.log(
        `${WEBSITE_DEFAULT_URL}/blog-preview?branch=${encodeURIComponent(
          targetBranch
        )}&secret=${encodeURIComponent(previewSecret)}`
      );
    }
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options.command || options.command === '--help') {
    printUsage();
    return;
  }

  switch (options.command) {
    case 'sync':
      await handleSync(options);
      return;
    case 'bootstrap':
      await handleBootstrap(options);
      return;
    case 'status':
      await handleStatus(options);
      return;
    case 'publish-branch':
      await handlePublishBranch(options);
      return;
    default:
      throw new Error(`Unsupported command "${options.command}"`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
