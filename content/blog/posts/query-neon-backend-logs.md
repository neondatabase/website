---
title: Query Neon backend logs
description: >-
  You can now inspect Functions and Object Storage logs via CLI, MCP, API, and
  Loki
excerpt: >-
  We keep expanding our backend observability - the most recent addition: you
  can now query backend logs outside the Console! neon logs reads what Neon
  Functions and Object Storage emit on a branch, with filters for source,
  severity, and message text.
date: '2026-08-18T12:00:00'
updatedOn: '2026-08-18T14:21:00'
category: product
categories:
  - product
authors:
  - andre-landgraf
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/query-neon-backend-logs/cover.jpg
  alt: Query Neon backend logs
isFeatured: false
seo:
  title: Query Neon backend logs - Neon
  description: >-
    You can now inspect Functions and Object Storage logs via CLI, MCP, API, and
    Loki
  keywords: []
  noindex: false
  ogTitle: Query Neon backend logs - Neon
  ogDescription: >-
    You can now inspect Functions and Object Storage logs via CLI, MCP, API, and
    Loki
  image: null
---

We keep expanding our [backend](https://neon.com/blog/neon-backend-is-beta) observability. The most recent addition: you can now query backend logs outside the Console!

`neon logs` reads what Neon Functions and Object Storage emit on a branch, with filters for source, severity, and message text. The same log stream is also available through the [Neon MCP server](https://neon.com/docs/ai/neon-mcp-server), the [Logs API](https://opentelemetry.io/docs/specs/otel/logs/api/), [@neon/sdk](https://neon.com/docs/reference/sdk), and raw [Loki](https://grafana.com/docs/loki/latest/) endpoints.

## A quick recap: Functions and Object Storage

`neon logs` is in beta, and it currently covers Neon Functions and Object Storage on a branch. If you haven’t been following the progress of the [Neon backend beta](https://neon.com/blog/neon-backend-is-beta), these are the newer primitives sitting next to [Lakebase Postgres](https://neon.com/docs/postgres/overview) (the Neon database):

- [Neon Functions](https://neon.com/docs/compute/functions/overview) are serverless Node.js compute you deploy onto your Neon branch, so your backend code runs next to your database. They’re long-running enough for streaming agents and realtime work.
- [Neon Object Storage](https://neon.com/docs/storage/overview) is S3-compatible object storage built into a Neon branch, so you can deploy buckets that branch with your data. Point a standard S3 SDK or tool at your branch endpoint, authenticate with a Neon credential, and you’re done.

<Admonition type="note" title="Logs coming soon for Postgres compute, Managed Better Auth, and AI Gateway">
These don’t show up in `neon logs` yet - working on it.
</Admonition>

## Inspect Functions and Object Storage logs from the CLI

The Neon Console already had a Logs tab for [Functions](https://neon.com/docs/compute/functions/logs) and [Object Storage](https://neon.com/docs/storage/logs). What’s new is a branch-scoped CLI surface for the same log stream.

That matters when you’re debugging across the stack. A failed upload and a function error often show up in different places. With `neon logs`, you query them the same way, from the same branch context the rest of the CLI already uses.

```
# Function lines that mention a timeout
neon logs query --since 1h --logql '{entity_type="function"} |= "timeout"'

# Object Storage errors from the last 30 minutes
neon logs query --source storage --minimum-severity error --since 30m

# Discover which services have been logging lately
neon logs fields
neon logs field-values service_name --since 6h
```

There’s three key subcommands:

- `neon logs query`: returns log records over a time window (defaults to the last hour, newest first)
- `neon logs fields`: lists the fields a branch reports for filtering
- `neon logs field-values <field>`: lists distinct values for a field (defaults to the last six hours)

Plus,

- You can filter by `--source function|storage`, service or scope name, severity, body text, or trace ID. Or pass `--logql` for a raw LogQL expression when the structured filters aren’t enough.
- Project and branch resolve from your CLI context, same as other branch-scoped commands. Pass `--project-id` and `--branch` when you need to target something else.
- Table output is the default. Use `--output json` or `--output yaml` when you want the full records (and the pagination cursor) for scripts or an agent.

[Review our docs](http://neon.com/docs/cli/logs) for all the info.

## Same logs in MCP, the API, and Loki

The CLI isn’t the only surface: the same log stream is also available for your agents / programmatic tooling.

- The [Neon MCP server](https://neon.com/docs/ai/neon-mcp-server) exposes the same log workflow as read-only tools in the `observability` category. Once MCP is connected, you can ask your agent something like, “Why did my function error in the last hour? Check the logs.”
- For scripts and apps, the same operations are in the [Logs API](https://neon.com/docs/reference/api/logs) (OpenAPI) and [`@neon/sdk`](https://neon.com/docs/reference/typescript-sdk)
- We’re also exposing [raw Loki endpoints](https://grafana.com/docs/loki/latest/), for Grafana users - you can query Neon backend logs with tooling that already speaks LogQL

## Try it

If you haven’t spun up the [Neon backend beta](https://neon.com/blog/neon-backend-is-beta) yet, this is a good moment! Create a project in AWS US East (Ohio), deploy a function and a bucket, then pull the logs from your terminal — or even better: [**ask your agent over MCP**](https://grafana.com/docs/loki/latest/).
