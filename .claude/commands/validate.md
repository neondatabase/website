---
description: 'Run pre-commit validation on changed documentation files. Checks frontmatter, headings, navigation, image paths, and style rules, then runs the auto-fixer.'
---

# Validate

Run before committing documentation changes. Checks the most common errors that break the build or violate style rules, then runs the auto-fixer.

## Step 1: Find changed files

```bash
git status --short
```

Collect all added or modified `.md` files under `content/docs/`, `content/guides/`, and `content/changelog/`. If no markdown files are changed, report that and stop.

## Step 2: Check each file

For every changed markdown file, run these checks:

### Frontmatter — title present

Read the frontmatter. If `title` is missing, flag it:

> **Error:** `[file]` — missing required `title` field. The build will fail.

### No h1 heading in the body

Check for any line starting with `# ` (a single `#`) below the frontmatter block. If found, flag it:

> **Error:** `[file]` line [N] — h1 heading found (`# ...`). Remove it. The page title is auto-generated from the `title` frontmatter field.

### New files: slug in navigation.yaml

If the file is newly added under `content/docs/`, derive its slug (path relative to `content/docs/`, without `.md`) and search `content/docs/navigation.yaml` for that slug. If not found, flag it:

> **Warning:** `[file]` — slug `[slug]` not found in `navigation.yaml`. Add an entry or the page will be unreachable.

(Skip this check for `content/guides/` and `content/changelog/` — those sections don't use `navigation.yaml`.)

### Image references exist

Find all `![...]( /docs/...)` image references in the file. For each, check that the file exists under `public/`. If not found, flag it:

> **Warning:** `[file]` — image `[path]` not found in `public/`. Add the file or fix the path.

### redirectFrom paths are well-formed

If the frontmatter includes `redirectFrom`, check that each entry starts and ends with `/`. Flag any that don't:

> **Error:** `[file]` — `redirectFrom` entry `[value]` must start and end with `/`.

### No em dashes in content

Scan the file body for em dash characters (—). If found, flag the line numbers:

> **Warning:** `[file]` lines [N, N] — em dash found. Rewrite using a comma, parentheses, or a new sentence.

## Step 3: Run the auto-fixer

```bash
npm run fix
```

Report any errors or files changed by the auto-fixer.

## Step 4: Report

Summarize findings:

- List all errors (must fix before committing)
- List all warnings (should fix; won't break the build)
- Confirm which checks passed cleanly
- If the auto-fixer changed files, list them

If there are no errors or warnings, say so clearly: "All checks passed. Ready to commit."
