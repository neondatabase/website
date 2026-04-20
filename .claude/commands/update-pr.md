---
description: 'Draft or update a PR title and description from changed files and commits. Run /add-preview-links separately to add Vercel preview links.'
---

# Update PR

Draft a clear PR title and description based on what changed in the PR. Works on the current branch or a PR URL you provide.

## Usage

```
/update-pr                                              # uses current branch
/update-pr https://github.com/neondatabase/website/pull/1234
```

## Steps

### 1. Identify the PR

If a URL was provided, extract the PR number. Otherwise, find the PR for the current branch:

```bash
gh pr view --json number,title,body,headRefName,files
```

If no PR exists yet, tell the user to open one first (`gh pr create` or via GitHub), then run this command again.

### 2. Get changed files and commits

```bash
gh pr view <number> --repo neondatabase/website --json files,commits,title,body,headRefName
```

Filter changed files to content only (`content/**/*.md`). Also read recent commit messages for context.

### 3. Draft the title

- One sentence, sentence case, no trailing period
- Lead with the type of change: "Add", "Update", "Fix", "Remove", "Reorganize"
- Be specific: name the feature or page area, not just "docs update"

Examples:
- "Add guide for connecting Neon with Prisma Accelerate"
- "Update autoscaling documentation for new CU limits"
- "Fix broken links in the branching overview"

If a title already exists and is good, keep it. Suggest a replacement only if it's vague.

### 4. Draft the description

Include these sections as applicable:

```
## Summary

[2-4 sentences describing what changed and why. What feature does this document?
What was wrong or missing? What did you add, update, or fix?]

## Pages changed

[Bullet list of the content files modified, as plain paths — e.g.
- content/docs/guides/autoscaling.md
- content/changelog/2026-04-25.md]

## Notes for reviewers

[Optional. Flag anything that needs a specific eye — technical accuracy,
tone, a new component being used for the first time, etc.]
```

Omit "Notes for reviewers" if there's nothing to flag.

### 5. Preserve existing content

If the PR already has a description:
- Keep any content the author wrote
- Add or update sections that are missing or thin
- Do not delete content, only improve or supplement it
- Do not replace a detailed description with a generic one

### 6. Update the PR

Call `mcp__github__github_write_api_call` with endpoint `pull_requests.update` to set the new title and body.

### 7. Confirm and suggest next step

Print the PR URL and add:

> "Run `/add-preview-links <PR URL>` to add Vercel preview links for the changed pages."
