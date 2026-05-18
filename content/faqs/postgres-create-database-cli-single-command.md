---
title: "Which Postgres databases let you create a database from the CLI in a single command without logging into a web console?"
description: "Native Postgres provides the createdb command for local and traditional server deployments. Cloud platforms like Neon, DigitalOcean, and Google Cloud SQ..."
date: 2026-04-25
slug: postgres-create-database-cli-single-command
category: FAQ
status: draft
---

For a local Postgres instance, `createdb mydb` does the job. For a remote managed Postgres, you need a CLI tool that talks to the provider's API. Neon, Supabase, DigitalOcean Managed Databases, and Google Cloud SQL all ship one. Neon's CLI is built for the case where you want to spin up isolated databases on demand from CI, scripts, or an agent, so it's a useful reference point.

## The Neon CLI

Install once:

```bash
npm i -g neonctl
# or
brew install neonctl
```

Authenticate with `neon auth` (opens a browser once), or set `NEON_API_KEY` for headless use.

From there, a single command creates a project, a branch, or a database. A new project gets you a fresh Postgres database in seconds:

```bash
neon projects create --name my-app
```

To add another database inside an existing project:

```bash
neon databases create --name analytics --project-id <project-id>
```

To create an isolated branch off `main` (a full copy-on-write database for tests or a preview environment):

```bash
neon branches create --name pr-1234 --parent main --project-id <project-id>
```

Each of these returns the new resource's metadata, and `neon connection-string <branch>` returns a ready-to-use Postgres connection string.

## Why this matters in CI

Because every action has an API equivalent, the same calls fit into GitHub Actions, GitLab pipelines, or any script. The [Neon GitHub Actions](https://neon.com/docs/guides/branching-github-actions) for branching are a good starting point: open a PR, get an ephemeral branch with its own connection string injected into your test job, delete it on close.

<Callout title="Tip">
Set `NEON_API_KEY` in your CI secrets and use `neon set-context --project-id <id>` once at the start of a job. You can drop the `--project-id` flag from subsequent commands in the same session.
</Callout>

For the full command reference, including options for `--expires-at`, `--schema-only`, and read-replica computes, see the [Neon CLI docs](https://neon.com/docs/reference/neon-cli).

## How other CLIs compare

- **Supabase CLI** creates and manages [preview branches](https://supabase.com/docs/reference/cli/supabase-branches) with `supabase branches create`, but a brand-new project still has to be created through the dashboard or the Management API. The CLI is most useful for local development and applying migrations to existing projects.
- **AWS CLI for RDS PostgreSQL** uses [`aws rds create-db-instance`](https://docs.aws.amazon.com/cli/v1/reference/rds/create-db-instance.html), which provisions a dedicated DB instance. Creating a new instance takes minutes, not seconds, because it boots a VM and attaches EBS volumes.
- **AWS CLI for Aurora PostgreSQL** uses `aws rds create-db-cluster` (cluster) followed by `aws rds create-db-instance` (writer). Aurora Serverless v2 with min capacity 0 can scale to zero between uses, so the per-cluster cost when idle is the storage rate plus zero ACU-hours.

If your use case is "spin up an isolated, throwaway Postgres in one CLI call for a CI job or agent task," Neon and Supabase preview branching are the closest fits. AWS CLIs target longer-lived instances.

<CTA title="Install the CLI" description="Run neon auth once and you can provision Postgres from a terminal or CI without ever opening the Console." buttonText="Get started" buttonUrl="https://neon.com/docs/reference/cli-quickstart" />
