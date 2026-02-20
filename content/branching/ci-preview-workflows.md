---
title: 'Create one branch per preview and per test run'
subtitle: 'Build branching workflows for CI and previews: spin up isolated branches per preview or test run, automate cleanup, and avoid shared test databases'
updatedOn: '2026-01-22T00:00:00.000Z'
---

Once teams are comfortable creating branches on demand, the next step is to let automation take over. Branching works particularly well for short-lived environments that exist only for validation, previews, or test execution.These branches are created automatically, used briefly, and then discarded.

## One branch per preview

Preview environments are meant to show what a change looks like before it reaches production. With branching, each preview can get its own database branch. In this setup:

- A branch is created when a preview is generated (for example, for a PR or feature branch)
- The application preview connects to that branch
- Schema changes and test data stay isolated to the preview

Because the branch starts from production or staging, previews reflect real data shapes and constraints instead of synthetic fixtures. When the preview is no longer needed, the branch can be deleted immediately. This process can be automated via integrations with [Vercel](https://neon.com/docs/guides/vercel-overview) or [Netlify](https://neon.com/docs/guides/netlify-functions).

![Diagram showing one branch per preview workflow with branches created from staging](/images/pages/branching/branch-per-pull-request-staging-diagram.png)

## One branch per test run

Instead of reusing a shared test database or running destructive cleanup scripts, teams can create a fresh branch for each run:

- Spin up a branch at the start of the pipeline
- Run migrations and tests
- Delete the branch at the end

This makes test runs deterministic and isolated. Every run starts from the same baseline, without leftover data or schema drift from previous runs. Because branches are instant and cheap, this approach scales even when pipelines run frequently or in parallel.

### Ephemeral branches with automatic cleanup

Most preview and CI branches are ephemeral by design. They exist for minutes or hours, not days. Neon supports this pattern in two ways:

- Branches automatically scale compute down to zero when idle
- Branches can be deleted programmatically when they’re no longer needed

Teams often combine this with automation:

- Delete branches when a PR is merged or closed via [Github integration](https://neon.com/docs/guides/neon-github-integration)
- Assign [expiration times](https://neon.com/docs/guides/branch-expiration) so branches clean themselves up
- Periodically remove unused branches to keep history and costs under control

This is general good practice when working with branches. If branches are left around too long, they can fall outside the history retention window and start contributing to storage costs. Automated cleanup keeps environments lightweight, predictable, and inexpensive.
