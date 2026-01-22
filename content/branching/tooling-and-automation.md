---
title: 'Tooling and automation'
subtitle: 'Automate branch management with Neon API, CLI, and CI/CD integrations for efficient workflows'
updatedOn: '2025-07-08T12:47:21.296Z'
---

## Neon API

Neon offers the most feature-complete [API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) on the market for developers and agents that need to create, manage, and scale thousands of branches programmatically. An example of what you can do via the Neon API:

- Create a branch per PR, test run, or user/agent session
- Reset or delete branches
- Tracking compute time, data written, and storage usage at the branch level.
- Connect compute endpoints on demand
- Combine it with Neon’s hosted MCP server to manage branches in real time

```
POST /projects/{project_id}/branches
{
  "branch": {
    "name": "preview-pr-142",
    "parent_id": "main"
  }
}
```

## Neon CLI

The [Neon CLI](/docs/reference/neon-cli) lets you create, reset, and delete branches from the terminal or in scripts. deal for integrating into Git hooks, dev onboarding scripts, or CI setup steps.

```
# Create a new branch from main
neon branch create preview-pr-101 --parent main

# Reset a branch to match its parent
neon branch reset dev-bob

# Delete a branch
neon branch delete preview-pr-101
```

## CI/CD

- [GitHub integration](/docs/guides/neon-github-integration). Automatically creates, resets, and deletes Neon branches in response to pull request actions using ready‑made GitHub Actions workflows.
- [Vercel integration](/docs/guides/vercel-managed-integration). Every Vercel preview deploy triggers a matching Neon branch, with DATABASE_URL injected automatically and seamless cleanup when previews end.
- Terraform [Community]. Manage branches with IaC.
