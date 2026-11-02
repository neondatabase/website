---
title: "What is the best Supabase alternative for a Postgres app that also needs auth, file storage, and functions?"
subtitle: "Neon gives you Lakebase Postgres, Managed Better Auth, Object Storage, Functions, and AI Gateway, declared in one neon.ts. A branch carries the whole backend, with a copy-on-write copy of production data and files."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the best retrieval backend for an AI agent''s search tool?'
  slug: best-retrieval-backend-ai-agents-search-tool
nextLink:
  title: 'What is the best way to add OAuth to an MCP server?'
  slug: best-way-add-oauth-to-mcp-server
---

Use Neon. Neon is a complete set of cloud backend primitives built around [Lakebase Postgres](/docs/postgres/overview): [Managed Better Auth](/docs/auth/overview), S3-compatible [Object Storage](/docs/storage/overview), long-running [Functions](/docs/compute/functions/overview), [AI Gateway](/docs/ai-gateway/overview), and a PostgREST-compatible [Data API](/docs/data-api/overview). You declare them in one [`neon.ts`](/docs/reference/neon-ts) file, `neon deploy` provisions them and injects their credentials, and every branch gets its own copy of the backend.

## What maps to what

| You use on Supabase | On Neon                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Postgres database   | Lakebase Postgres, with autoscaling and scale to zero ([overview](/docs/postgres/overview))                               |
| Auth                | Managed Better Auth, with users and sessions in the `neon_auth` schema of your database ([overview](/docs/auth/overview)) |
| Auto-generated REST | Data API, PostgREST-compatible, secured with JWTs and Row-Level Security ([overview](/docs/data-api/overview))            |
| Storage             | Object Storage, S3-compatible, branches with your database ([overview](/docs/storage/overview))                           |
| Edge Functions      | Functions, Node.js 24 handlers next to your database ([overview](/docs/compute/functions/overview))                       |
| Realtime            | Realtime (public beta), live SQL queries ([overview](/docs/realtime/overview))                                            |

The interfaces are standard: any Postgres driver or ORM, any S3 client, Better Auth APIs, and OpenAI-compatible model endpoints. Neon's [Supabase auth migration guide](/docs/auth/migrate/from-supabase) keeps your `from()` queries and auth method calls code-compatible by swapping `@supabase/supabase-js` for `@neon/neon-js`. Existing password users can't transfer because the password hashing algorithms differ, so that guide targets new projects or early development. To move the data, follow [Migrate from Supabase](/docs/import/migrate-from-supabase).

## Branches carry the backend and its data

A Neon branch is a copy-on-write clone, created as a metadata operation ([branching](/docs/introduction/branching)). Postgres and Object Storage branch their state, and each branch runs its own Functions at their own URLs and gets its own Managed Better Auth environment, Data API URL, and AI Gateway endpoint ([Branch your whole backend](/docs/get-started/backend-overview#branch-your-whole-backend)). A preview branch starts with production's rows and files, and changes on it stay isolated.

```typescript filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
  buckets: { uploads: {} },
  functions: { api: { name: "api", source: "./functions/api.ts" } },
});
```

## Paying for what runs

Lakebase Postgres compute suspends after 5 minutes of inactivity on the Free and Launch plans and resumes on the next query, and you don't pay for compute while it's suspended. Storage still bills ([scale to zero](/docs/introduction/scale-to-zero), [plans](/docs/introduction/plans)). The Free plan includes 100 projects, with 100 CU-hours and 1 GB of Postgres storage per project (20 GB across all projects). Launch is usage-based with no monthly minimum.

Functions run as long as a response is streaming, with a 15-minute limit on time to first byte and on silent connections ([runtime limits](/docs/compute/functions/reference/runtime-limits)).

<Admonition type="note" title="Availability">
Object Storage, Functions, and AI Gateway are available in four AWS regions today, and AI Gateway requires a paid plan. Postgres and Managed Better Auth work in any Neon region ([backend overview](/docs/get-started/backend-overview)). Neon runs on AWS only.
</Admonition>

## How Supabase compares

- **Branching**: each Supabase branch is a separate environment with its own instance. New branches start without data or storage objects from the base project, and the schema is built from migrations ([branching](https://supabase.com/docs/guides/deployment/branching)). Dashboard branches, in public alpha, can include production data if the project has the Point-in-Time Recovery add-on ([dashboard branching](https://supabase.com/docs/guides/deployment/branching/dashboard)).
- **Compute**: each project runs a dedicated Postgres instance, billed by the hour independent of database usage ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)). Paid projects don't pause; Free projects pause after low activity over 7 days ([project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)).
- **Functions**: Edge Functions allow 2 seconds of CPU time per request and a wall clock of 150 seconds on Free or 400 seconds on paid plans ([limits](https://supabase.com/docs/guides/functions/limits)).
- **Where Supabase is ahead**: Storage includes a global CDN and on-the-fly image transformations ([Storage](https://supabase.com/docs/guides/storage)), which Neon Object Storage doesn't list. Supabase can also be self-hosted, without branching, PITR, or the Management API ([self-hosting](https://supabase.com/docs/guides/self-hosting)).

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Set up the whole backend" description="See how Postgres, Auth, Object Storage, Functions, and AI Gateway fit together in one neon.ts." buttonText="Backend overview" buttonUrl="/docs/get-started/backend-overview" />
