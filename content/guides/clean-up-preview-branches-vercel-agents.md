---
title: How to clean up preview branches from Vercel and agents automatically
subtitle: Neon gives every Vercel preview deployment, pull request, and AI agent run its own database branch. Delete those branches automatically with a GitHub Action, branch expiration, or a TTL policy, so you stay under your branch limit.
author: carlota-soto
enableTableOfContents: true
isDraft: false
createdAt: '2026-11-20T00:00:00.000Z'
updatedOn: '2026-11-20T15:30:56.018Z'
---

<Admonition type="note" title="A Neon branch is more than a database">
This guide focuses on Postgres, but a Neon branch branches your whole backend, not just the database. [Object Storage](/docs/storage/overview) branches copy-on-write alongside your data, and each branch gets its own [Auth](/docs/auth/overview) environment, [Functions](/docs/compute/functions/overview), [Data API](/docs/data-api/overview) endpoint, and [AI Gateway](/docs/ai-gateway/overview) endpoint. See [Branch your whole backend](/docs/get-started/backend-overview#branch-your-whole-backend).
</Admonition>

Deploying a database branch for every pull request, preview deployment, or agent run is one of the best parts of building on Neon. Each branch is an isolated copy of your data that's ready in about a second and only stores what changes. But branches you create automatically also need to be deleted automatically. This guide covers three ways to make them clean up after themselves: a GitHub Action, branch expiration, and a TTL policy in `neon.ts`.

## Why preview branches pile up

Branches pile up when whatever created them never deletes them. The most common case is the Vercel-Managed integration.

### The Vercel retention gap

If you use the [Vercel-Managed integration](/docs/guides/vercel-managed-integration), merging a PR or deleting its Git branch doesn't delete the Neon branch. Neon only deletes it once Vercel deletes the last preview deployment that uses it.

That can take a long time. By default, Vercel keeps preview deployments for 180 days on Pro and Enterprise, and 30 days on Hobby, counted from when each deployment was created. On top of that, Vercel never deletes your project's 10 most recent deployments or its 20 most recent working (Ready) preview deployments, whatever your retention setting says. So if your project has fewer than about 20 preview deployments, its preview branches may never be deleted. For the details, see [Managing Vercel preview branch cleanup](/docs/guides/vercel-branch-cleanup).

The [Neon-Managed integration](/docs/guides/neon-managed-vercel-integration#branch-cleanup) works differently. Once a Git branch is deleted, Neon removes its preview branch the next time any preview deployment is created.

## Option 1: Delete the branch when the PR closes

The most reliable fix for preview branches is to delete them when the PR closes. Neon's [`delete-branch-action`](https://github.com/neondatabase/delete-branch-action) deletes a branch by name. The Vercel integration names branches `preview/<git-branch>`, so this workflow targets exactly the branches it creates:

```yaml filename=".github/workflows/cleanup-neon-preview-branch.yml"
name: Cleanup Neon preview branch
on:
  pull_request:
    types: [closed]
jobs:
  delete-branch:
    runs-on: ubuntu-latest
    steps:
      - uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch: preview/${{ github.head_ref }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

Add `NEON_PROJECT_ID` as a repository variable and `NEON_API_KEY` as a repository secret. The action works with both Vercel integrations, and it's safe to use alongside Vercel's own cleanup: if the branch is already gone when Vercel's webhook fires, Neon handles it.

## Option 2: Give every branch an expiration date

If branches come from somewhere other than a PR, like a CI run, a demo, or a script, set an expiration date when you create them. Neon deletes the branch, its computes, and its data automatically at that time ([branch expiration](/docs/guides/branch-expiration)).

From the CLI:

```bash
neon branches create \
  --project-id <project-id> \
  --name ci-test \
  --expires-at "$(date -u -d '+2 hours' +%Y-%m-%dT%H:%M:%SZ)"
```

From the API, pass `expires_at` in the create request:

```json
{
  "branch": {
    "name": "ci-test",
    "expires_at": "2026-11-25T18:02:16Z"
  }
}
```

A few rules:

- Expiration can be up to 30 days from now, as an RFC 3339 timestamp
- The CLI and API have no default expiration, so you need to set it. The Console checks **Automatically delete branch after** by default, with 1 day selected
- You can't set expiration on the default branch, a protected branch, or a branch that has children
- If you reset a branch from its parent, the countdown starts over

As a guideline for your defaults, we suggest setting 2 to 4 hours for CI branches, 1 to 2 days for demos, and up to 7 days for feature work.

## Option 3: Set a TTL policy for agent branches

AI coding agents and app builders create branches far more often than people do. If you don't trust your agents to remember to set a timestamp, set the rule once in your project config.

With [`neon.ts`](/docs/reference/neon-ts), a branch policy applies to every new branch created through [`neon checkout`](/docs/cli/checkout). This example gives new branches a 7-day TTL and the smallest compute:

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  branch: (branch) => {
    if (branch.isDefault) return {};
    if (!branch.exists) {
      return {
        ttl: '7d',
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25,
            autoscalingLimitMaxCu: 0.25,
          },
        },
      };
    }
    return {};
  },
});
```

TTLs can be written like `"7d"` or `"2h"`, up to 30 days. The policy only applies when a branch is created. It doesn't change branches that already exist.

If your agent creates branches through the API or the [Neon MCP server](/docs/ai/neon-mcp-server) instead, set an expiration timestamp too: pass `expires_at` when you create the branch through the API, or call the MCP server's `update_branch` tool with `expires_at` right after `create_branch`.

## Which option to use

| Where branches come from           | Best cleanup                                              |
| ---------------------------------- | --------------------------------------------------------- |
| Vercel preview deployments         | GitHub Action on PR close                                 |
| GitHub PRs with your own CI        | GitHub Action on PR close, plus an expiration as a backup |
| CI test runs                       | Expiration of a few hours, set on create                  |
| AI agents and `neon checkout`      | TTL policy in `neon.ts`                                   |
| Agents using the API or MCP server | `expires_at` on every new branch                          |

Most teams combine two of these, e.g. delete on PR close for the normal path, and an expiration so anything that slips through deletes itself anyway.

## Summary

Neon branches are built to be deployed often and thrown away. They work at their best when they're short-lived and tied to a task, so to keep things clean, make deletion part of creation - delete preview branches when PRs close, put an expiration on every branch a script or CI job creates, and give agents a TTL policy.

<NeedHelp/>
