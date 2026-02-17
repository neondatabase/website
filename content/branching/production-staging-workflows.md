---
title: 'Manage production and staging as branches'
subtitle: 'Learn how to manage production and staging with database branching. Treat the production branch as the source, derive staging from it, and anonymize data for PII-safe workflows'
updatedOn: '2026-01-22T00:00:00.000Z'
---

## Production branch (source of truth)

![Production branch as source of truth diagram](/images/pages/branching/branch-per-pull-request-diagram.png)

In a branching model, production is just a branch, typically the root branch in the project. It is the source of truth for your application: the database your users depend on, and in many cases, the baseline from which other environments derive. Most other branches in your project will either be created directly from production or indirectly from a branch that ultimately traces back to it.

**Production branch best practices**

- Treat production as a [protected branch](https://neon.com/docs/guides/protected-branches) to prevent accidental deletion or resets
- Avoid manual experimentation on production
- Use branches for all schema changes, debugging, and data inspection

There’s also an important security behavior to be aware of. When production is protected and you create a child branch from it, Neon automatically generates new database credentials for that branch. This means development, staging, and preview environments cannot reuse production credentials, and connections are physically isolated by default.

## Staging from production (no PII)

![Diagram showing staging branch created from production](/images/pages/branching/refreshing-dev-from-prod-diagram.png)

If your production data does not contain PII, the simplest staging setup is to create a staging branch directly from production. This branch:

- Captures the exact schema and data of production at the moment you branch
- Is fully isolated, with its own compute endpoint
- Can be sized smaller than production and scales to zero when idle

Staging branches are typically long-lived, but they still need to stay in sync with production. As production evolves, staging can be periodically refreshed by resetting it to its parent. In Neon, this is a single operation.

## Staging via anonymized branches (with PII)

![Diagram showing anonymized branch workflow for staging with PII](/images/pages/branching/branch-per-developer-pii-diagram.png)

When production data does contain PII or regulated information, branching directly from production isn’t appropriate. In this case, teams introduce an intermediate layer using [anonymized branches](https://neon.com/docs/workflows/data-anonymization).

The workflow looks like this:

- Create an anonymized branch from production, with sensitive fields masked based on defined rules
- Use this anonymized branch as a safe, production-like baseline
- Derive staging (and later development and preview) branches from it
