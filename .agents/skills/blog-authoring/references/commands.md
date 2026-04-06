# Commands

## Blog CLI

Run these from the site repository:

```bash
npm run blog:bootstrap
npm run blog:sync -- --force
npm run blog:status
npm run blog:publish-branch -- --branch <branch-name>
npm run dev
npm run build
```

Behavior:

- `blog:bootstrap`: materializes `content/blog` only if it is missing
- `blog:sync -- --force`: replaces the local working copy from the branch source or CDN
- `blog:status`: shows current branch, whether a matching branch exists in the configured `blog` repo, whether local content exists, and whether local content differs from remote
- `blog:publish-branch`: publishes the current `content/blog` snapshot into the configured `blog` repo branch and prints preview URLs

## Environment needed for publish / branch preview

Expected in env:

```bash
BLOG_CDN_URL=...
BLOG_REPO_OWNER=...
BLOG_REPO_NAME=...
BLOG_GITHUB_TOKEN=...
BLOG_PREVIEW_SECRET=...
```

Notes:

- `BLOG_GITHUB_TOKEN` is currently used for both branch fetches and `blog:publish-branch`, so it needs write access to the configured remote content repo.
- Without the repo credentials, local editing still works, but publishing and branch-aware remote fetches do not.

## Useful git checks

Current branch in `website`:

```bash
git branch --show-current
```

Remotes in a separate source repo:

```bash
git remote -v
```

Use this before pushing directly from a separate source repo. Prefer a personal/fork remote over the source-of-truth remote unless the user explicitly asks otherwise.

## Preview routes

Examples:

```text
/blog-preview/<slug>?branch=<branch>&secret=<secret>
```

Expected behavior:

- valid branch + valid secret -> preview page
- missing/invalid secret -> `404`
- missing branch or missing slug -> `404`

## Editing targets

Only edit these blog-content working copy files unless the user explicitly asks otherwise:

- `content/blog/posts/*.md`
- `content/blog/authors/data.json`
- `content/blog/categories/data.json`
