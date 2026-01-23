---
title: 'Branching workflows for development'
subtitle: 'Build branching workflows for development: create one branch per developer, shared dev branches, or per-PR databases for safe, isolated, production-like testing'
updatedOn: '2026-01-22T00:00:00.000Z'
---

Development environments are where branching tends to click for most teams. Instead of sharing a single mutable database, each workflow gives developers isolation by default while keeping environments closely aligned with production.

Teams often combine more than one of the patterns below, depending on team size and how much parallel work is happening.

## One branch per developer

![Diagram showing one branch per developer workflow with anonymized staging branch](/images/pages/branching/staging-with-pii-diagram.png)

This is one of the most common workflows. Each engineer gets their own development branch, typically created directly from production, or from an anonymized version of production if PII is involved. This gives you:

- Isolation: no stepping on each other’s changes
- Production-like data: the branch starts from real state
- Low overhead: no storage duplication, and compute can be very small

Because branches are lightweight and scale to zero when idle, this pattern remains affordable even as the team grows.

If production contains PII, the flow stays the same \- you simply derive developer branches from an anonymized branch instead of production.

![Diagram showing developers working on isolated branches with changes](/images/pages/branching/working-on-dev-changes-diagram.png)

### Shared development branch

![Diagram showing shared development branch workflow](/images/pages/branching/recovery-dropped-tables-diagram.png)

A variation of the above is to maintain a single shared development branch. This works well for smaller teams or projects where changes are more sequential than parallel. The dev branch is typically derived from production (or from an anonymized production branch) and used as the main environment for ongoing work.

Like staging, this branch is relatively long-lived, but it still needs to stay in sync with production. Teams periodically reset it to the parent branch to avoid drift. This approach:

- Reduces the number of active branches to manage
- Works well when coordination is easy
- Still avoids touching production directly

### One branch per pull request

![Diagram showing one branch per pull request workflow with independent computes](/images/pages/branching/independent-computes-diagram.png)

In this setup, every pull request automatically gets its own database branch. The branch is created when the PR opens and deleted when the PR is merged or closed. This gives you:

- Fully isolated environments for each change
- A safe place to run migrations specific to the PR
- End-to-end testing against realistic data

If you already have a staging branch, PR branches are often derived from staging. If not, they can be derived directly from production or from an anonymized production branch.

![Diagram showing pull request branches derived from production or staging](/images/pages/branching/production-branch-diagram.png)
