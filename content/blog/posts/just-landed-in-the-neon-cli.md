---
title: Just landed in the Neon CLI
description: >-
  New commands for branch-first workflows, Postgres diagnostics, schema diffs,
  and a lot more
excerpt: >-
  The Neon CLI moved fast over the last couple of months. It is a key tool for
  agents, who do all the work without ever opening the Console - let’s take a
  look at some of recent changes.
date: '2026-08-25T12:00:00'
updatedOn: '2026-08-25T15:57:00'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/just-landed-in-the-neon-cli/neon-just-landed.jpg
  alt: null
isFeatured: false
seo:
  title: Just landed in the Neon CLI - Neon
  description: >-
    New commands for branch-first workflows, Postgres diagnostics, schema diffs,
    and a lot more
  keywords: []
  noindex: false
  ogTitle: Just landed in the Neon CLI - Neon
  ogDescription: >-
    New commands for branch-first workflows, Postgres diagnostics, schema diffs,
    and a lot more
  image: null
---

The [Neon CLI](https://neon.com/docs/cli) moved fast over the last couple of months. It is a key tool for agents, who do all the work without ever opening the Console - let’s take a look at some of recent changes:

## The CLI is now neon

First things first, the npm package and docs use neon instead of neonctl. Same binary, shorter name.

So, to [install it](https://neon.com/docs/cli/install),

```
npm i -g neon@latest
neon auth
```

For agents, set up skills and the MCP server in one shot:

```
npx neon@latest init
```

neonctl still works as an alias - no re-auth is required if you already used the old name.

## New commands for branch-first workflows: link, checkout, env pull

These three commands are the [core loop for local (and agent) development](https://neon.com/blog/branch-first-dev-loop):

```
neon link                 # bind this directory to a Neon project (.neon context)
neon checkout my-feature  # create or pin a branch; env pull runs by default
neon env pull             # refresh Neon-managed vars into .env / .env.local
```

[neon link](https://neon.com/docs/cli/link) writes a local .neon context (orgId, projectId, branchId). You can use --agent for non-interactive JSON mode. Once linked, you can drop --project-id / --branch on most commands. The CLI walks up parent folders to find .neon, and adds it to .gitignore on first write.

[neon checkout](https://neon.com/docs/cli/checkout) pins the active branch in that context, the same way you'd switch a git branch.

[neon env pull](https://neon.com/docs/cli/env) writes branch-scoped Neon variables (DATABASE_URL, unpooled URL, and credentials for enabled services). Only Neon-managed keys are rewritten; the rest of your [env](https://neon.com/docs/cli/env) file is left alone.

A recent refinement - pull only the services you name (postgres, auth, data-api, object-storage, or ai-gateway):

```
neon env pull --service ai-gateway --service postgres
```

## Jump to the Console: neon open

A cool trick: run

```
neon open
```

To [open](https://neon.com/docs/cli/open) the linked project's dashboard in your browser.

## See the pinned branch: neon status

This command [prints the branch](https://neon.com/docs/cli/config#current-branch) in .neon with no network call, so it's safe for shell prompts:

```
neon status
```

## Credentials: api-keys and profile

We shipped these two command groups together, useful for CI and multi-account work:

### Mint scoped keys with neon api-keys

```
neon api-keys create --name ci                                        # account key
neon api-keys create --name ci --org-id org-example-12345678          # organization key
neon api-keys create --name agent --project-id green-breeze-12345678  # one project only
```

A [project-scoped key](https://neon.com/docs/cli/api-keys) cannot create projects, mint more keys, or see other projects (i.e. what you’d want for an agent or a CI job).

### Switch accounts with neon profile

A profile is a named credentials set. Select it per command with [--profile](https://neon.com/docs/cli/profile):

```
neon auth --profile work
neon deploy --profile work
neon profile create ci --mint --project-id green-breeze-12345678
```

--mint signs in once, stores only the minted key, and leaves no browser session behind.

## Print schema diffs with neon diff

[neon diff](https://neon.com/docs/cli/diff) prints a git-style unified schema diff between the branch under review and a compare branch (by default, the reviewed branch's parent)

- For a machine-readable output, run --output json or --output yaml
- For a historical point in time (timestamp or LSN), use neon branches schema-diff instead

```
neon link
neon checkout feature/checkout
# ... change schema ...
neon diff main
```

## Call any Neon API route with neon api

When you need a route that does not have a CLI command yet, use the [authenticated passthrough](https://neon.com/docs/cli/api) - this command uses your existing CLI login:

```
neon api --list
neon api /projects -Q org_id=org-cool-darkness-12345678
neon api /projects/late-frost-12345678/branches -X POST -F branch.name=dev
```

-F branch.name=dev builds nested JSON. Bodies can also come from -d @file.

## Debug Postgres via neon inspect db

This [diagnostics tool](https://neon.com/docs/cli/inspect) bundles 14 read-only diagnostics against Postgres stats and catalogs, with connection resolution handled by the CLI:

```
neon link
neon inspect db bloat
neon inspect db outliers
neon inspect db unused-indexes
```

Examples of what you get:

- table/index sizes
- bloat estimates
- unused indexes
- sequential scans
- long-running queries
- Locks
- pg_stat_statements outliers/calls
- vacuum stats
- replication slots/subscriptions
- and Neon Local File Cache hit rate / working set ([inspect](https://neon.com/docs/cli/inspect), [deep dive](https://neon.com/blog/neon-inspect-db), [changelog](https://neon.com/docs/changelog/2026-07-24#debug-postgres-from-the-terminal-with-neon-inspect-db)).

It works against a linked branch, or any Postgres URL via --db-url. Same checks are also available on the Neon MCP server as inspect_database.

## Snapshots from the terminal: neon snapshots

[Point-in-time branch backups](https://neon.com/docs/cli/snapshots) are now first-class in the CLI:

```
neon snapshots create --branch main --name pre-migration
neon snapshots list
neon snapshots restore pre-migration --name recovered
```

You can restore un-finalized (inspect first), then neon snapshots finalize, or pass --finalize to swap immediately. For schedules: neon snapshots schedule get / set.

## What’s new in Auth, Data API, and psql

### Enable Managed Better Auth via neon neon-auth

You can now directly enable Auth, configure OAuth providers and domains, tweak email/webhook settings, and manage users [from the terminal](https://neon.com/docs/cli/neon-auth):

```
neon neon-auth enable
neon neon-auth oauth-provider add --provider-id google
neon neon-auth domain add https://myapp.com
```

### Manage the Data API via neon data-api

You can also [provision and manage](https://neon.com/docs/cli/data-api) the Data API (create, get, update, refresh-schema, delete).

### neon psql without a local psql install

[neon psql](https://neon.com/docs/cli/psql) connects as a top-level command. If no native psql is on $PATH, the CLI falls back to a built-in client.

## Project create flags and declarative config

[neon projects create](https://neon.com/docs/cli/projects) now accepts more up-front control - e.g. you can specify Postgres version, protected branches, logical replication:

```
neon projects create --name my-app --pg-version 17
```

For declarative branch policy, neon config init scaffolds a starter [neon.ts](https://neon.com/docs/reference/neon-ts) and installs @neon/config / @neon/env. neon link can offer this as a final step.

[Backend service commands](https://neon.com/docs/cli) such as neon functions and neon buckets are part of the same CLI surface as Object Storage, Functions, and AI Gateway roll out.

## The latest commands at a glance

| Goal | Command | Docs |
| --- | --- | --- |
| Install / upgrade | `npm i -g neon@latest` | [install](https://neon.com/docs/cli/install) |
| Sign in | `neon auth` | [auth](https://neon.com/docs/cli/auth) |
| Link a project | `neon link` | [link](https://neon.com/docs/cli/link) |
| Switch branch + env | `neon checkout <name>` | [checkout](https://neon.com/docs/cli/checkout) |
| Pull env (optionally by service) | `neon env pull [--service …]` | [env](https://neon.com/docs/cli/env) |
| Open Console | `neon open` | [open](https://neon.com/docs/cli/open) |
| Mint / revoke API keys | `neon api-keys …` | [api-keys](https://neon.com/docs/cli/api-keys) |
| Multi-account credentials | `neon profile …` | [profile](https://neon.com/docs/cli/profile) |
| Schema diff | `neon diff [branch]` | [diff](https://neon.com/docs/cli/diff) |
| Any API route | `neon api <path>` | [api](https://neon.com/docs/cli/api) |
| Postgres diagnostics | `neon inspect db <check>` | [inspect](https://neon.com/docs/cli/inspect) |
| Snapshots | `neon snapshots …` | [snapshots](https://neon.com/docs/cli/snapshots) |
| Auth management | `neon neon-auth …` | [neon-auth](https://neon.com/docs/cli/neon-auth) |
| Data API | `neon data-api …` | [data-api](https://neon.com/docs/cli/data-api) |
| SQL shell | `neon psql` | [psql](https://neon.com/docs/cli/psql) |
| Agent / MCP setup | `npx neon@latest init` | [init](https://neon.com/docs/cli/init) |

## What to put in AGENTS.md

If you want coding agents to use the branch-first loop by default, a short rule is enough:

When starting a feature, run `neon checkout <branch-name>` alongside `git checkout -b`.

Prefer project-scoped API keys (`neon api-keys create --project-id …`) for automation.

Use `neon diff` before merging schema changes, and `neon inspect db` for read-only Postgres diagnostics.

Install current Neon skills so the agent knows the new commands:

```
npx neon@latest init
```
