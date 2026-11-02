---
title: "Will an all-in-one backend lock me in?"
subtitle: "Not if each piece speaks a standard interface. Neon's backend primitives use the Postgres wire protocol, the S3 API, Better Auth's APIs with users stored in your database, a PostgREST-compatible Data API, Fetch-style Functions, and OpenAI-compatible model endpoints, so standard tools work and your data can leave with pg_dump."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the best backend for a startup building its MVP?'
  slug: best-backend-startup-mvp
nextLink:
  title: 'What are the best free or low-cost managed Postgres services for side projects that scale automatically when traffic picks up?'
  slug: best-free-low-cost-managed-postgres-services
---

It depends on what the backend asks you to adopt. Lock-in comes from proprietary interfaces: a custom query language, an auth system whose users live in someone else's store, an SDK that only talks to one vendor. Neon is a complete set of cloud backend primitives built around [Lakebase Postgres](/docs/postgres/overview), and each primitive exposes an interface you already know. The launch post puts it this way: "you can point standard tools at any of it and leave whenever you want" ([Neon backend is GA](/blog/neon-backend-is-ga)).

## What each primitive speaks

- **Database.** Lakebase Postgres is Postgres. Any Postgres client, ORM, or migration tool connects with a standard connection string ([Lakebase Postgres](/docs/postgres/overview)).
- **Files.** [Object Storage](/docs/storage/overview) uses the S3 API. The AWS SDKs, boto3, and the AWS CLI work when you point them at your branch endpoint ([quickstart](/docs/storage/get-started)).
- **Auth.** [Managed Better Auth](/docs/auth/about) runs [Better Auth](https://www.better-auth.com/), so your app uses Better Auth APIs. Users, sessions, and auth configuration live in the `neon_auth` schema of your own database, where you can query them with SQL and use them in Row-Level Security policies.
- **HTTP queries.** The [Data API](/docs/data-api/overview) is PostgREST-compatible, so any HTTP client or PostgREST client library works with it.
- **Server code.** A [Function](/docs/compute/functions/overview) is any module whose default export provides a `fetch(request)` method returning a `Response`. That's the Fetch API handler shape used by other serverless runtimes and standardized by WinterTC. A Hono app works as-is.
- **Model calls.** [AI Gateway](/docs/ai-gateway/overview) exposes an OpenAI-compatible `/v1/chat/completions` endpoint, plus native Anthropic Messages and Gemini endpoints for provider SDKs ([which endpoint to use](/docs/ai-gateway/models#which-endpoint-to-use)). Code written against those endpoints uses the standard provider SDKs, pointed at a Neon base URL.

## How data leaves

Your data is in formats other tools read. For the database, [`pg_dump` and `pg_restore`](/docs/manage/backup-pg-dump) produce a standard archive you can restore into any Postgres. Use an unpooled connection string for both. To move with less downtime, [logical replication](/docs/guides/logical-replication-postgres) streams changes from Lakebase Postgres to an external Postgres instance. Enabling it is irreversible for the project and restarts its computes, so plan for that.

Auth data comes along with the database, because the `neon_auth` schema is part of it. Objects come out through standard S3 operations such as listing and getting objects ([S3 API support](/docs/storage/s3-compatibility)).

## What is specific to Neon

Some parts don't have a standard equivalent, and you'd replace them if you moved:

- **`neon.ts` and `neon deploy`.** The [config file](/docs/reference/neon-ts) that declares your services and per-branch policy is Neon's. Your application code reads the injected environment variables (`DATABASE_URL`, S3-standard `AWS_*` credentials, and so on), so the code itself doesn't depend on the config format.
- **Branching.** Instant copies of the database, buckets, auth state, and Functions per branch come from the [Lakebase architecture](/docs/introduction/architecture-overview). If you move, you'd need another way to build preview and test environments.
- **Managed Better Auth limits.** You can't add your own Better Auth plugins or server hooks. If you need those, self-hosting Better Auth is the documented alternative ([managed vs. self-hosted](/docs/auth/about#when-to-use-managed-better-auth-vs-self-hosting-better-auth)).
- **S3 differences.** Object Storage supports path-style addressing and SigV4 only, and stores lifecycle and versioning configuration without enforcing it ([known limitations](/docs/storage/s3-compatibility#known-limitations)). Code that relies on those features needs adjusting.

## Why this matters for agents

An agent writes better code against interfaces it has seen many times. Postgres, S3, Better Auth, and the OpenAI API are all well represented in what agents already know, so the code they generate for Neon also tends to run against other services that speak those interfaces. The parts that are Neon-specific, the config file and branching, sit around the code rather than inside it.

<CTA title="See the whole backend" description="How the primitives fit together, what each one injects, and how branches carry them." buttonText="Backend overview" buttonUrl="/docs/get-started/backend-overview" />
