---
title: Cursor Origin
subtitle: Give every Origin pull request its own database branch
summary: >-
  origin-neon is an open-source Cursor Origin app that creates a database branch
  on Neon for each Origin pull request and deletes it when the pull request
  closes. Stacked pull requests branch from their parent pull request's branch
  rather than from production. You deploy the app yourself as a Neon Function and
  register your own Origin app. Agents and CI read the branch credentials with
  `neon env pull`.
enableTableOfContents: true
updatedOn: '2026-08-18T08:55:00.000Z'
---

[Cursor Origin](https://cursor.com/docs/origin) hosts repositories and pull requests, including the ones Cursor agents open. [origin-neon](https://github.com/neon-solutions/origin-neon) is an Origin app that gives each of those pull requests an isolated database branch, so a pull request never runs against production data.

<Admonition type="note">
`origin-neon` is an open-source project, not a Neon-managed integration. You deploy it yourself and register your own Origin app.
</Admonition>

## How it works

Install the app on an Origin-hosted repository. It then acts on pull request events:

- Opening, reopening, or pushing to a pull request creates or reuses a branch named `origin-<repo>-pr-<number>`.
- A stacked pull request branches from its parent pull request's branch.
- Closing or merging a pull request deletes its branch, once no open pull request depends on it.

Each pull request receives a comment linking to its branch in the Neon Console. Agents and CI read that branch's credentials themselves:

```bash
neon env pull
```

Origin apps cannot reach repositories that Origin mirrors in from GitHub. Use the [Neon GitHub integration](/docs/guides/neon-github-integration) for those.

## Deploy the app

```bash
git clone https://github.com/neon-solutions/origin-neon
cd origin-neon
cp .env.example .env.production
neon link
neon deploy
```

Set `NEON_API_KEY`, `NEON_PROJECT_ID`, and `ORIGIN_REPO_ALLOWLIST` in `.env.production`. Use a project-scoped API key for the project that receives the pull request branches.

Then register an Origin app at [cursor.com/codebase/settings/apps](https://cursor.com/codebase/settings/apps), point its webhook at your deployed Function URL, and install it on the repository. The repository [README](https://github.com/neon-solutions/origin-neon#auth) covers the signing key and the required scopes.
