---
title: 'You’re using Neon for dev/test'
subtitle: 'Adopt Neon branching gradually by starting with development and testing environments while keeping production elsewhere'
updatedOn: '2025-07-08T12:47:21.296Z'
---

Not every team is ready to move production infrastructure overnight. Migrating a large or regulated production database (especially one deeply integrated with legacy systems or vendor-specific tooling) can be complex and time-consuming. But that doesn’t mean you need to wait to take advantage of Neon’s speed, flexibility, and branching workflows.
Some teams choose to adopt Neon first for development, testing, CI/CD, or preview environments, while keeping production on platforms like AWS RDS. This approach allows developers to instantly spin up isolated Postgres environments, test against production-like data, and iterate faster, without the overhead or risk of a full migration.
Neon’s Neon Twin workflow makes this easy to adopt without changing your production pipeline.

![Branching diagram 4](/images/pages/branching/diagram-4.png)

1. **Create a Neon project for dev/test**. Use the `main` branch as the baseline for development and test environments.
2. **Import production data into `main`**. Keep your Neon environment in sync with production using `pg_dump` / `pg_restore` or logical replication.
3. **Derive child branches from `main` as needed**. Examples (see [Common branching workflows](/branching#workflows)):
   - `dev-alice`, `dev-bob` (per developer)
   - `preview-pr-42` (per PR)
   - `qa-metrics-test` (for load or feature testing)
4. **[Integrate with GitHub Actions](/docs/guides/neon-twin-partial-pg-dump-restore)** or similar CI pipelines to automatically:
   - Create branches at the start of a workflow
   - Run tests or deploy previews
   - Clean up by deleting branches after work is complete
