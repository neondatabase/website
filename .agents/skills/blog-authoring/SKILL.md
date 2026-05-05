---
name: blog-authoring
description: Use when creating, editing, previewing, or publishing blog posts through the local working-copy flow, especially when the task involves `content/blog`, `npm run blog:*` commands, or `/blog-preview/...` URLs.
---

# Neon Blog Authoring

Default editing workflow:

1. Work in the site repository.
2. Edit the local working copy under `content/blog/`.
3. Run the local site to visually inspect the result.
4. Publish the snapshot into the configured remote blog-content branch with the provided CLI.

Do not default to editing the remote source-of-truth repository directly unless the user explicitly asks for it.

## Required checks

Before changing content, verify the current state:

```bash
git branch --show-current
npm run blog:status
```

If `content/blog` is missing, initialize it:

```bash
npm run blog:bootstrap
```

If the user explicitly wants to refresh the working copy from remote state:

```bash
npm run blog:sync -- --force
```

## Core workflow

### 1. Edit locally

Edit only:

- `content/blog/posts/*.md`
- `content/blog/authors/data.json`
- `content/blog/categories/data.json`

Then run:

```bash
npm run dev
```

Use the local app to review:

- `/blog`
- `/blog/<slug>`

### 2. Publish to a branch in `blog`

Use the built-in CLI:

```bash
npm run blog:publish-branch -- --branch <branch-name>
```

Defaults:

- if `--branch` is omitted, the current git branch name is used
- the command pushes the current `content/blog` snapshot into the configured remote content repository
- the command prints preview URLs under `/blog-preview/...`

### 3. Review branch preview

Open the generated preview URL, for example:

```text
/blog-preview/<slug>?branch=<branch>&secret=<secret>
```

If the preview returns `404`, treat that as “access denied or missing branch/slug”. Do not assume the route is public.

## Guardrails

- Prefer `content/blog` in the current repository as the editing surface.
- Do not overwrite existing `content/blog` automatically; only use `blog:sync -- --force` when the user explicitly wants a refresh.
- Do not push to the main source-of-truth remote accidentally. If you must work in a separate source repo directly, inspect `git remote -v` first and confirm which remote is safe to push to.
- When credentials are missing, limit yourself to local editing and local preview; explain exactly which publish/preview actions are blocked.
- Do not touch unrelated local files such as `src/scripts/compare-sites.js`.

## References

Load only what you need:

- Commands and environment expectations: `references/commands.md`
