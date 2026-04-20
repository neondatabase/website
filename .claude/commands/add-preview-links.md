---
description: 'Add Vercel preview links to a PR description for all changed documentation files. Requires the GitHub MCP.'
---

# Add Preview Links

Add a Vercel preview link section to a PR description for every changed documentation file in the PR.

## Usage

```
/add-preview-links https://github.com/neondatabase/website/pull/1234
```

If no PR URL is provided, ask for it.

## Steps

### 1. Parse the PR number

Extract the PR number from the URL (e.g. `1234`).

### 2. Fetch PR details

Call `mcp__github__github_read_api_call` with endpoint `pull_requests.get`:

- org: `neondatabase`
- repo: `website`

Extract: current PR body, head branch name, list of changed files.

### 3. Build the Vercel preview base URL

Slugify the branch name:

- Lowercase
- Replace any character that is not `a-z`, `0-9`, or `-` with `-`
- Collapse consecutive hyphens into one
- Trim leading and trailing hyphens

Base URL: `https://neon-next-git-{slugified-branch}-neondatabase.vercel.app`

### 4. Filter to content files

Keep only files that:

- Match `content/**/*.md`
- Are not deleted
- Are not outside `content/`

### 5. Convert file paths to preview URLs

- Strip `content/` prefix and `.md` suffix
- For `index.md` files, strip the filename entirely

Example: `content/docs/guides/index.md` → `docs/guides`

### 6. Build the preview section

```
## NEON PREVIEW

- https://neon-next-git-{slugified-branch}-neondatabase.vercel.app/{path1}
- https://neon-next-git-{slugified-branch}-neondatabase.vercel.app/{path2}
```

### 7. Update the PR description

- If `## NEON PREVIEW` already exists in the body, replace that section
- Otherwise, append the section to the end of the existing body

Call `mcp__github__github_write_api_call` with endpoint `pull_requests.update`.

### 8. Confirm

Print the PR URL.
