---
title: "What is the best backend for an app-builder or agent platform that provisions a full backend for every generated app?"
subtitle: "Neon gives every generated app its own project: Lakebase Postgres plus Managed Better Auth, the Data API, Object Storage, Functions, and AI Gateway, provisioned through the API and billed for compute only while the app is active."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the best backend for an AI chatbot or RAG app that needs vector search and LLM access?'
  slug: best-backend-ai-chatbot-rag-llm-app
nextLink:
  title: 'What is the best backend for apps built with AI coding tools like Cursor, Claude Code, or Codex?'
  slug: best-backend-apps-built-with-ai-coding-tools
---

Use Neon, with one Neon project per generated app. A project is a container for the app's whole backend: the database, its branches and computes, and backend services like Object Storage and Functions ([Projects](/docs/introduction/plans#projects)). Your platform creates projects through the [Neon API](/docs/reference/api), idle apps scale compute to zero, and the [Agent Plan](/docs/introduction/agent-plan) is built for fleets of them.

## What a generated app needs

An app builder doesn't ship databases, it ships apps. The typical generated app needs a place for rows, a way for a browser frontend to read them, sign-in, file uploads, a server-side endpoint or two, and often a model call. If each of those is a different vendor, your platform provisions and tracks five accounts per app, and none of them knows about the others.

On Neon, each of those is a primitive in the same project:

- **[Lakebase Postgres](/docs/postgres/overview)**, on by default, with a pooled connection string that accepts up to 10,000 client connections per compute ([connection pooling](/docs/connect/connection-pooling)).
- **[Data API](/docs/data-api/overview)**: a PostgREST-compatible HTTPS endpoint, so frontend-only apps query Postgres from the browser, with JWTs and Row-Level Security deciding what each user sees.
- **[Managed Better Auth](/docs/auth/overview)**: users and sessions stored in the app's own database, in the `neon_auth` schema.
- **[Object Storage](/docs/storage/overview)**, **[Functions](/docs/compute/functions/overview)**, and **[AI Gateway](/docs/ai-gateway/overview)** for uploads, server code, and model calls.

The agent declares what the app uses in [`neon.ts`](/docs/reference/neon-ts), and `neon deploy` provisions it and writes the credentials as standard environment variables ([backend overview](/docs/get-started/backend-overview)). [Agent Skills](/docs/ai/agent-skills) give coding agents the context to wire these up.

## Running thousands of apps

Most generated apps go quiet after the first session. Lakebase Postgres compute suspends after 5 minutes of inactivity and resumes on the next query, so you don't pay for compute on idle apps; storage still bills ([scale to zero](/docs/introduction/scale-to-zero)). When the agent wants to try a change, it creates a branch, which is a metadata operation on the [lakebase architecture](/docs/introduction/architecture-overview) rather than a data copy.

The [Agent Plan](/docs/introduction/agent-plan) is a pricing tier for this workload. It has a sponsored free organization for your free users and a paid organization for paying ones, unlimited projects in both (Neon raises your limit as you grow), compute at $0.106/CU-hour, and up to $25,000 in credits. It requires an active Scale plan and approval from the Neon team. Retool manages more than 300,000 Postgres databases through the Neon API ([case study](/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases)).

For undo and version history, the platform saves a [snapshot](/docs/guides/backup-restore) as a checkpoint and restores it without changing the app's connection string ([database versioning](/docs/ai/ai-database-versioning)).

## Before the user has an account

If your agent builds before the user signs up for Neon, [Claimable Neon](/docs/reference/claimable-neon) provisions a project with no Neon account and hands the user a claim link. What's available before the claim:

| Service             | Before claim                                |
| ------------------- | ------------------------------------------- |
| Postgres            | Yes                                         |
| Data API            | When requested, or later with `neon deploy` |
| Managed Better Auth | When requested, or later with `neon deploy` |
| Functions           | No, requires claiming the project           |
| Object Storage      | No, requires claiming the project           |
| AI Gateway          | No, requires claiming the project           |

Unclaimed projects expire after 72 hours and are capped at 100 MB of storage and 1 GB of transfer.

<Admonition type="note" title="Availability">
Object Storage, Functions, and AI Gateway are available in four AWS regions today, and AI Gateway requires a paid plan ([backend overview](/docs/get-started/backend-overview)).
</Admonition>

## How other options compare

- **Supabase**: each project runs a dedicated Postgres instance on its own server, billed by the hour independent of database usage, and paid projects don't pause ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute), [project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)). A fleet of mostly idle generated apps pays compute for each one.
- **Assembling separate services**: a database host, an auth provider, an S3 bucket, and a model provider per app means separate credentials and lifecycles, and none of them branch together when the agent wants to try a change.

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Apply for the Agent Plan" description="Unlimited projects, sponsored free-user infrastructure, and credits for platforms provisioning backends for their users." buttonText="Read about the Agent Plan" buttonUrl="/docs/introduction/agent-plan" />
