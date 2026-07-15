---
title: Tour the Neon backend
subtitle: A map of Neon's products and how they connect in a real project
summary: >-
  Orientation tour of the full Neon backend platform: how Postgres, Managed
  Better Auth, the Data API, Object Storage, Functions, and the AI Gateway fit
  together inside a single Neon project and branch together. Choose this page
  to understand what each product does and where it lives in your codebase
  before you connect an application stack, rather than following a single
  framework-specific quickstart.
enableTableOfContents: true
updatedOn: '2026-07-15T18:19:19.522Z'
---

Every Neon project starts from the same foundation: a serverless Postgres database. Auth, the Data API, Object Storage, Functions, and the AI Gateway are all built on top of that one database, and every branch you create gets its own isolated copy of all of them together. This page is a map of those pieces and how they connect, not a step-by-step build. If you want to build something end-to-end first, see [Build a full backend](/docs/get-started/full-backend-quickstart).

## Postgres: the foundation

Everything else in this tour sits on top of branchable Postgres: instant branching, autoscaling, scale to zero, and instant restore, with full standard Postgres compatibility. In your codebase, this is the connection string in your environment variables (`DATABASE_URL` or similar) that your driver, ORM, or framework uses to connect.

See the [Postgres overview](/docs/postgres/overview), or connect a [framework](/docs/get-started/frameworks), [language](/docs/get-started/languages), or [ORM](/docs/get-started/orms) directly.

## Auth: users that live in your database

Managed Better Auth stores users, sessions, and OAuth configuration in your Neon Postgres database, under a `neon_auth` schema alongside your own tables. Because auth data lives in the same database, it branches with everything else: a preview branch gets its own isolated set of test users instead of sharing production accounts. In your codebase, this shows up as an auth client SDK and a handful of environment variables for provider secrets.

See the [Auth overview](/docs/auth/overview).

## Data API: query over HTTPS

The Data API gives you a PostgREST-compatible HTTP interface to the same database, for callers that can't hold a persistent TCP connection, such as browsers, Cloudflare Workers, or Vercel Edge functions. It validates JWTs (including the ones Auth issues) and enforces your Postgres Row-Level Security policies, so access control lives in the database rather than in application code. In your codebase, this is typically a fetch call or a Supabase-compatible client pointed at your project's Data API endpoint.

See the [Data API overview](/docs/data-api/overview).

## Object Storage: files that branch with your data

<Admonition type="note">
Object Storage is in Private Preview.
</Admonition>

Object Storage is S3-compatible storage built into the same project. Every branch gets its own isolated storage namespace, so file uploads branch alongside your rows the same way Auth users do. In your codebase, this is any AWS S3 SDK pointed at your branch's storage endpoint instead of an AWS bucket.

See the [Object Storage overview](/docs/storage/overview).

## Functions: compute next to your database

<Admonition type="note">
Functions is in Private Preview.
</Admonition>

Functions let you deploy server-side code, an API route, an agent, a webhook handler, directly onto a Neon branch, with `DATABASE_URL` injected automatically. Instead of hosting your backend separately and connecting to Neon over the network, the backend code runs next to the data it queries.

See the [Functions overview](/docs/compute/functions/overview).

## AI Gateway: one API for models

<Admonition type="note">
AI Gateway is in Private Preview.
</Admonition>

The AI Gateway is an LLM inference layer built into the project, giving you access to models from Anthropic, OpenAI, Google, and other providers through one Neon credential. Existing OpenAI- or Anthropic-compatible SDKs work unchanged, just pointed at your branch's gateway endpoint. Combined with Postgres, it's what turns a Neon project into a backend for AI agents as well as apps.

See the [AI Gateway overview](/docs/ai-gateway/overview).

## All the pieces, at a glance

<DetailIconCards cols={3} theme="green-flat">

<a href="/docs/postgres/overview" description="Serverless Postgres with branching, autoscaling, scale to zero, and instant restore." icon="database">Postgres</a>

<a href="/docs/auth/overview" description="Managed Better Auth with sign-up, OAuth, and sessions. Users live in your Postgres and branch with it." icon="lock-landscape">Auth</a>

<a href="/docs/data-api/overview" description="HTTPS queries with no backend code. Drop-in compatible with Supabase." icon="network">Data API</a>

<a href="/docs/storage/overview" description="S3-compatible object storage that branches with your database." icon="data" tag="Private Preview" tagTheme="gray-filled">Object Storage</a>

<a href="/docs/compute/functions/overview" description="Long-running Node.js compute, deployed alongside your database." icon="code" tag="Private Preview" tagTheme="gray-filled">Functions</a>

<a href="/docs/ai-gateway/overview" description="One API for frontier and open-source models, built into your Neon project." icon="sparkle" tag="Private Preview" tagTheme="gray-filled">AI Gateway</a>

</DetailIconCards>

## Next steps

- [Build a full backend](/docs/get-started/full-backend-quickstart): wire Postgres, Auth, and Drizzle into a working Next.js app
- [Why Neon?](/docs/get-started/why-neon): the architecture behind branching, autoscaling, and scale to zero
