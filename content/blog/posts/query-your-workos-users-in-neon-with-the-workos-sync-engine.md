---
title: "Query your WorkOS users in Neon with the WorkOS Sync Engine"
description: >-
  WorkOS open-sourced a sync engine that mirrors identity data into your
  database. On Neon, it runs as a Function on your branch
excerpt: >-
  If your auth data lives in WorkOS but your product data lives in Postgres,
  answering questions like "which enterprise customers have admins who never set
  up SSO" meant paging through the WorkOS API and stitching the results together
  in application code. To fix this, WorkOS has built WorkOS Sync Engine, which
  mirrors that data into a workos schema in your own database and keeps it
  current...
date: "2026-11-19T09:00:00"
category: community
categories:
  - community
  - product
authors:
  - carlota-soto
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/query-your-workos-users-in-neon-with-the-workos-sync-engine/cover.jpg
  alt: Query your WorkOS users in Neon with the WorkOS Sync Engine
isFeatured: false
seo:
  title: "Query your WorkOS users in Neon with the WorkOS Sync Engine - Neon"
  description: >-
    WorkOS Sync Engine mirrors identity data into a workos schema in Postgres.
    On Neon, the engine runs as a Function on your branch with Function Triggers.
  keywords: []
  noindex: false
  ogTitle: "Query your WorkOS users in Neon with the WorkOS Sync Engine - Neon"
  ogDescription: >-
    WorkOS Sync Engine mirrors identity data into a workos schema in Postgres.
    On Neon, the engine runs as a Function on your branch with Function Triggers.
  image: https://cdn.neonapi.io/public/images/pages/blog/query-your-workos-users-in-neon-with-the-workos-sync-engine/social.png
updatedOn: '2026-11-19T04:02:27.347Z'
---

If your auth data lives in WorkOS but your product data lives in Postgres, answering questions like "which enterprise customers have admins who never set up SSO" meant paging through the WorkOS API and stitching the results together in application code. To fix this, WorkOS has built [WorkOS Sync Engine](https://github.com/workos/sync-engine), which mirrors that data into a workos schema in your own database and keeps it current.

You can use it right away if you're using Neon + WorkOS. You don't even need a separate server to run the sync - WorkOS built a [Neon Functions template](https://neon.com/functions/templates/workos-sync) that runs the engine on your branch, next to your database, on a schedule set by Function Triggers. To get it going, run `neon functions new workos-sync`, add your WorkOS keys and the schedule triggers to `neon.ts`, and deploy.

```
# Prompt your agent

Set up the WorkOS Sync Engine on my Neon project using the workos-sync Function template. Follow the template README: https://github.com/neondatabase/examples/tree/main/registry/workos-sync

1. Install the latest Neon CLI (npm install -g neon@latest), then run neon login, neon link, and neon functions new workos-sync --slug workossync.
2. Add these to .env.local, keeping the Neon values already there: WORKOS_API_KEY (remind me to add WORKOS_API_KEY to .env.local myself from the WorkOS Dashboard), WORKOS_WEBHOOK_SECRET=placeholder, and WORKOS_SYNC_STATUS_TOKEN set to the output of openssl rand -hex 32.
3. Add the four schedule triggers from the README (workos-tick, workos-backfill, workos-reconcile, workos-reconcile-fresh) to neon.ts, next to functions.
4. Test locally with neon dev, then deploy with neon deploy --env .env.local.
5. Give me the function's invocation URL so I can add a WorkOS webhook pointing at <invocation_url>/webhook. When I share the signing secret, set it as WORKOS_WEBHOOK_SECRET and redeploy.
6. Confirm the sync is working: call GET /status with the status token, then run a query that joins workos.organization_memberships_live, workos.users_live, and workos.organizations_live.
```

<Admonition type="tip" title="Example: Build a Slack bot on top of your WorkOS data">
[This guide](https://neon.com/guides/workos-slack-bot-neon) walks through deploying the Sync Engine on Neon, then adding a Neon Function that answers support, sales, and security questions in Slack with read-only SQL through Neon AI Gateway.
</Admonition>

<video autoPlay muted loop playsInline width="708" height="398" aria-label="Slack bot powered by WorkOS data on Neon">
<source src="https://cdn.neonapi.io/public/images/pages/blog/query-your-workos-users-in-neon-with-the-workos-sync-engine/workos-slack-bot.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/query-your-workos-users-in-neon-with-the-workos-sync-engine/workos-slack-bot.mp4" type="video/mp4" />
</video>

## How the Sync Engine works

Once the sync is running, your database has a new workos schema with one table for each kind of WorkOS object. You query it like any other schema and join it to your own tables:

### The WorkOS schema

| Table                           | What's in it                                                   |
| ------------------------------- | -------------------------------------------------------------- |
| workos.users                    | Your WorkOS users, with their email, external ID, and metadata |
| workos.organizations            | Your customers' organizations                                  |
| workos.organization_memberships | Who belongs to which organization, and with which role         |
| workos.sessions                 | Active or revoked sessions                                     |
| workos.auth_attempts            | Every sign-in attempt, successful or not                       |
| workos.events                   | Every WorkOS event, as it was received                         |

There are also tables for invitations, directory users and groups, SSO connections, roles, permissions, and feature flags.

Most tables have a matching `_live` view, such as `workos.users_live`, that leaves out deleted objects. That's the one you'll query most of the time. Deleted objects stay in the base table with a deletion timestamp, so you keep a record of what was removed.

Common fields like `id` and `email` are regular columns. Each row also keeps the full object WorkOS returned in a `_raw` JSON column, so you can query any field, including ones WorkOS adds later:

```sql
SELECT _raw->'custom_attributes'->>'department'
  FROM workos.directory_users;
```

Every row also has an `_env` column with the WorkOS environment it came from, so one database can hold both staging and production.

<video autoPlay muted loop playsInline width="708" height="521" aria-label="WorkOS Sync Engine diagram">
<source src="https://cdn.neonapi.io/public/images/pages/blog/query-your-workos-users-in-neon-with-the-workos-sync-engine/workos-sync.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/query-your-workos-users-in-neon-with-the-workos-sync-engine/workos-sync.mp4" type="video/mp4" />
</video>

### How it stays in sync

The engine keeps your tables current in three steps:

1. First, it makes a full copy, paging through WorkOS and writing everything that exists today.
2. Then it follows the WorkOS Events API and applies each change in order. On Neon, a Function Trigger runs this every minute, and a WorkOS webhook can make it check right away.
3. Every so often, it compares your tables against WorkOS to catch anything the event stream can't show, such as an object that was deleted.

Changes usually show up within seconds. Duplicate or out-of-order events can't corrupt the data, and a sync that crashes picks up where it left off.

Also, the sync only goes one way. To change a user or an organization, you call the WorkOS API, and the change flows back into your tables.

## What you can do with it

Once your WorkOS data is in Postgres, you can use it like any other table in your database, and many things get much simpler:

- **Join identity to product data in SQL.** Organizations, users, and roles become tables, so questions that cross the two systems are one query:

```sql
SELECT o.name AS organization, u.email, m.role_slug
  FROM workos.organization_memberships_live m
  JOIN workos.users_live u ON u.id = m.user_id AND u._env = m._env
  JOIN workos.organizations_live o ON o.id = m.organization_id AND o._env = m._env;
```

- **Keep sign-in history.** Every sign-in attempt, successful or failed, lands in `workos.auth_attempts`. You can audit access, track failed logins, and spot unusual activity with plain SQL. History starts when you start syncing
- **Build dashboards and reports** on top of identity data with the Postgres tools you already use
- **Give agents read access** to identity data through a read-only Postgres role, instead of handing them a WorkOS API key
- **Get real identity data on every branch.** Preview and dev branches inherit the mirror, so you can test features against real organizations and roles
- **Skip the sync infrastructure.** On Neon, the engine runs as a Function next to your database. There's no worker to host and no cron server to maintain

<Admonition type="info" title="Another way to get auth data next to your database">
Neon also offers [Managed Better Auth](https://neon.com/docs/auth/overview), which keeps users, sessions, and auth configuration in your database and branches them with your data.
</Admonition>

## Running it on Neon

There are [two ways to run the engine against Neon](https://workos.com/docs/events/data-syncing/database/neon): as a Neon Function on your branch, or from a host you already operate.

<Admonition type="note" title="About Neon Functions">
[Neon Functions](https://neon.com/docs/compute/functions/overview) are long-running serverless functions that run on your Neon branch, next to your Postgres data. [Function Triggers](https://neon.com/docs/compute/functions/triggers/overview) run them on a cron schedule, which is how this template keeps your WorkOS data in sync.
</Admonition>

### As a Neon Function

The workos-sync [template](https://neon.com/functions/templates/workos-sync) is one function with a route for each job. Function Triggers call the scheduled routes, and WorkOS calls the webhook.

| Route                 | Called by                         | What it does                                                                 |
| --------------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| POST /tick            | Schedule trigger, every minute    | Polls the Events API once and applies new events                             |
| POST /backfill        | Schedule trigger, every 5 minutes | Loads one slice of existing data; does nothing once every stream is complete |
| POST /reconcile       | Schedule trigger, hourly          | Continues the reconcile pass in progress and repairs drift                   |
| POST /reconcile/fresh | Schedule trigger, weekly          | Starts a new reconcile pass                                                  |
| POST /webhook         | WorkOS                            | Verifies the signature, then polls immediately                               |
| GET /status           | You, with a bearer token          | Reports per-stream row counts, poll age, and lag                             |

Setting it up takes four steps:

1. Scaffold the function from the Function Registry:

```sh
neon functions new workos-sync --slug workossync
```

2. Add `WORKOS_API_KEY`, `WORKOS_WEBHOOK_SECRET`, and `WORKOS_SYNC_STATUS_TOKEN` to `.env.local`. The webhook secret can be a placeholder until the endpoint exists. The status token is any long random string; it protects `GET /status`, because function URLs are public. `DATABASE_URL` is injected automatically.

3. Add the four schedule triggers to `neon.ts`:

```ts
triggers: {
  "workos-tick":            { type: "schedule", function: "workossync", cron: "* * * * *",   functionPath: "/tick" },
  "workos-backfill":        { type: "schedule", function: "workossync", cron: "*/5 * * * *", functionPath: "/backfill" },
  "workos-reconcile":       { type: "schedule", function: "workossync", cron: "30 * * * *",  functionPath: "/reconcile" },
  "workos-reconcile-fresh": { type: "schedule", function: "workossync", cron: "0 3 * * 0",   functionPath: "/reconcile/fresh" },
},
```

4. Deploy, then point a WorkOS webhook at the function's invocation URL plus `/webhook`:

```sh
neon deploy --env .env.local
```

The first backfill run creates the workos schema and starts loading data. You can run the whole thing locally first with `neon dev`, which injects `DATABASE_URL` from your linked branch.

**The [template README](https://neon.com/functions/templates/workos-sync) walks through each step.**

### From your own host

If you'd rather run the engine as a library, a CLI, or a container on infrastructure you already have, [point it at your Neon connection string](https://workos.com/docs/events/data-syncing/database/neon) as `DATABASE_URL`. Pooled and direct connections both work. Use `sslmode=verify-full`.

## Get started

Run `neon functions new workos-sync` in a linked Neon project, or open the [template](https://neon.com/functions/templates/workos-sync) in the Function Registry. The [Sync Engine docs](https://workos.com/docs/events/data-syncing/database) cover the schema, the consistency model, and operations, and the [repo](https://github.com/workos/sync-engine) is open source.

Thanks to the WorkOS team for building the template. If you have questions, find us on [Discord](https://neon.com/discord).
