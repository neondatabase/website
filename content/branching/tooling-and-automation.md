---
title: 'Tooling and resources to implement branching'
subtitle: 'A collection of tools and resources to implement branching workflows, snapshot-based promotion, automation via APIs, and integrations with GitHub, Vercel, and agents'
updatedOn: '2026-01-22T00:00:00.000Z'
---

## Conceptual blog posts

- [Practical Guide to Database Branching](https://neon.com/blog/practical-guide-to-database-branching) \- a walkthrough of common workflows and patterns.
- [Promoting Postgres Changes Safely From Multiple Environments to Production](https://neon.com/blog/promoting-postgres-changes-safely-production) \- your guide to the snapshot-based promotion workflow.
- [Instantly Copy TB-Size Datasets: The Magic of Copy-On-Write](https://neon.com/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write) \- an introduction to the storage architecture that enables fast branches and snapshots.
- [I Dropped a Table in Production, Now What?](https://neon.com/blog/recover-production-database) \- a recovery workflow based on branches and PITR

## Branching & snapshot docs

- [Branching overview](https://neon.com/docs/introduction/branching?utm_source=chatgpt.com) \- on branching, time travel, and restore windows.
- [Get started with branching](https://neon.com/docs/guides/branching-intro?utm_source=chatgpt.com) \- how to build branching workflows via the API, CLI, GitHub Actions, and Vercel integrations.
- [Anonymized branches](https://api-docs.neon.tech/reference/createprojectbranchanonymized?utm_source=chatgpt.com) \- If you have PII, use this API endpoint for creating anonymized branches with masking rules.

## Automation & integration

- [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) \- use the API to automate branching, snapshots, restores, credentials, and more.
- [Vercel integration](https://neon.com/docs/guides/vercel-overview) \- create Neon branches for every Vercel preview environment.
- [Github integration](https://neon.com/docs/guides/neon-github-integration) \- Link your Neon project to a repository and create branches via Github Actions

## Agents & platform builders

- [Database versioning with snapshots](https://neon.com/docs/ai/ai-database-versioning) \- how codegen platforms implement database version control using snapshots and preview branches
- [Agent Plan](https://neon.com/use-cases/ai-agents) \- get special pricing and feature support

## Other useful docs

- [Branch expiration](https://neon.com/docs/guides/branch-expiration) \- automatically expire and clean up old branches.
- [Neon Auth with branchable identity](https://neon.com/docs/auth/overview) \- work with a branchable auth state, enabling full-stack preview testing including users and sessions.

## Try it yourself

- [Start branching on the Free Plan](https://neon.com/signup) \- create a free Neon account and build your first branching workflows.
- [Join the community](https://neon.com/discord) \- ask us questions and get help from other Neon users on Discord.
