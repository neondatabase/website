---
title: "Which Postgres databases let you create a database from the CLI in a single command without logging into a web console?"
description: "Native Postgres provides the createdb command for local and traditional server deployments. Cloud providers like Neon, DigitalOcean, and Google Cloud SQL ship CLIs that create a managed database without opening a web console."
date: 2026-04-25
slug: postgres-create-database-cli-single-command
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres services handle thousands of short-lived connections from serverless functions without exhausting the pool?'
  slug: managed-postgres-services-serverless-connections
nextLink:
  title: 'Which Postgres databases let you branch off a specific moment in time from a production database to debug an incident?'
  slug: postgres-database-branching-time-travel-debugging
---

For a local Postgres instance, `createdb mydb` does the job. For managed Postgres, you need the provider's CLI, which calls its API. Neon, Supabase, AWS, DigitalOcean, and Google Cloud all have one. On Neon, one command creates a project with a ready-to-use Postgres database, and another creates a copy-on-write branch for a CI job, script, or agent task.

## The Neon CLI

Install it with npm or Homebrew (the Homebrew formula is named `neonctl`, but you run the CLI as `neon`).

```bash
npm i -g neon
# or
brew install neonctl
```

Authenticate with `neon login`, which opens a browser the first time, or set `NEON_API_KEY` for non-interactive use in CI and scripts.

After that, a single command creates a project, a branch, or a database. A new project comes with a Postgres database on its default branch.

```bash
neon projects create --name my-app
```

To add another database inside an existing project, run this.

```bash
neon databases create --name analytics --project-id <project-id>
```

To create an isolated copy-on-write branch off the project's default branch for tests or a preview environment, run this.

```bash
neon branches create --name pr-1234 --project-id <project-id>
```

Each command prints the new resource's details, and `neon connection-string <branch>` prints a Postgres connection string for the branch. Add `--output json` to any command for machine-readable output.

## Using the CLI in CI

The same commands run in GitHub Actions, GitLab pipelines, or any script. For GitHub, the [Neon GitHub Actions](/docs/guides/branching-github-actions) create a branch when a PR opens, pass its connection string to your test job, and delete the branch when the PR closes.

<Callout title="Tip">
For local work, run `neon link` once to save org and project context. In CI, set `NEON_API_KEY` in secrets and run `neon link --org-id ... --project-id ... --branch ...` at the start of a job so you can drop the `--project-id` flag from later commands. `neon link` writes a complete context, so pin a branch with `--branch` (or pass `-y` to pin the default branch).
</Callout>

For the full command reference, including `--expires-at`, `--schema-only`, and read replica computes, see the [Neon CLI docs](/docs/cli).

## How other CLIs compare

- **Supabase CLI** creates a hosted project with [`supabase projects create`](https://supabase.com/docs/reference/cli/supabase-projects-create) and manages [preview branches](https://supabase.com/docs/reference/cli/supabase-branches) with `supabase branches create`. It also runs the full Supabase stack locally in Docker for development.
- **AWS CLI for RDS for Postgres** uses [`aws rds create-db-instance`](https://docs.aws.amazon.com/cli/v1/reference/rds/create-db-instance.html), which provisions a dedicated DB instance of the class you choose. The command returns right away, and the instance takes several minutes to become available.
- **AWS CLI for Aurora Postgres** takes two commands: `aws rds create-db-cluster` for the cluster, then `aws rds create-db-instance` for the writer. With Aurora Serverless v2 and a minimum capacity of 0 ACUs, the instance [auto-pauses](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) when idle, so you pay for storage but not instance capacity while it's paused.
- **DigitalOcean** creates a managed Postgres cluster with [`doctl databases create <name>`](https://docs.digitalocean.com/reference/doctl/reference/databases/create/). Postgres is the default engine, and `--wait` blocks until provisioning finishes.
- **Google Cloud SQL** creates an instance with [`gcloud sql instances create`](https://docs.cloud.google.com/sdk/gcloud/reference/sql/instances/create). You then add databases to the instance with `gcloud sql databases create`.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Install the CLI" description="Install the CLI, run neon login once, and create projects, branches, and databases from a terminal or CI." buttonText="Get started" buttonUrl="/docs/cli/quickstart" />
