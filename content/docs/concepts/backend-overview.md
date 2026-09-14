---
title: The Neon backend
subtitle: The backend for apps and agents
summary: >-
  Neon is one backend for your apps and agents, and a branch is where that whole
  backend runs. A branch can include Lakebase Postgres, Managed Better Auth,
  Object Storage, Functions, and the AI Gateway, with the Data API riding on
  Postgres. Branches sit inside a project, and projects inside an organization.
  Each product branches through its own mechanism: Postgres clones copy-on-write,
  Better Auth rides the database, Object Storage and Functions are branch-aware
  and isolated from their parent, and the AI Gateway gives each branch its own
  endpoint and credentials against one shared, global model catalog. Region and
  project access are project-scoped, while API keys are scoped to an account, an
  organization, or a project, never to a single branch.
enableTableOfContents: true
redirectFrom:
  - /docs/get-started/backend-overview
updatedOn: '2026-09-14T00:00:00.000Z'
---

Neon is one backend for your apps and agents. A Postgres database, file storage, authentication, a compute runtime, and access to AI models come together as one backend, organized around a branch and reachable from one place.

**A branch is the whole backend.** A branch can run Lakebase Postgres, Managed Better Auth, Object Storage, Functions, and the AI Gateway together, all reachable from one place. A child branch gives you an isolated backend environment to build against, where each product branches through its own mechanism.

Every branch belongs to a **project**, and every project belongs to an **organization**: `organization` > `project` > `branch`.

![How the Neon backend fits together](/docs/concepts/backend-overview.png 'no-border')

These products are peers on a branch. Enable the products your app needs, and each is reachable from that branch.

## How the pieces compose

You declare a backend in one file, `neon.ts`. Postgres is on by default, and you add Managed Better Auth, Object Storage, Functions, and the AI Gateway as fields. The whole backend is one declaration you version alongside your app.

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  auth: true,
  aiGateway: true,
  buckets: { attachments: {} },
  functions: {
    chat: { name: 'notes chat', source: './functions/chat.ts' },
  },
});
```

Deploying that configuration provisions each product on the branch you are working on and writes its credentials into your app's environment. Your application code reads standard variables, so it targets a product and runs against whatever branch it connects to:

| Product                 | In `neon.ts`  | Injected into your app                                                            |
| ----------------------- | ------------- | --------------------------------------------------------------------------------- |
| **Lakebase Postgres**   | on by default | `DATABASE_URL`                                                                    |
| **Object Storage**      | `buckets`     | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION` |
| **Functions**           | `functions`   | `DATABASE_URL` at runtime                                                         |
| **AI Gateway**          | `aiGateway`   | `NEON_AI_GATEWAY_BASE_URL`, `NEON_AI_GATEWAY_TOKEN`                               |
| **Managed Better Auth** | `auth`        | `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`                                        |

The same code runs on every branch using the endpoints, credentials, and data for that branch. See the [`neon.ts` reference](/docs/reference/neon-ts) for the full configuration surface.

## Lakebase Postgres

**What it is:** serverless Postgres, generally available. **When to use it:** your system of record, anything relational. **When not:** large binary files, keep the bytes in [Object Storage](#object-storage) and store the key in a column.

The [Data API](/docs/data-api/overview) is a child of Postgres. It provides an HTTP interface to the same database for callers such as browsers and edge runtimes.

```typescript filename="lib/db.ts"
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const notes = await sql`select id, title, body from notes order by created_at desc limit 20`;
```

See the [Lakebase Postgres overview](/docs/postgres/overview), [serverless driver](/docs/serverless/serverless-driver), and [framework guides](/docs/get-started/frameworks).

## Managed Better Auth

**What it is:** authentication with per-user data, plus a way to secure your functions by verifying tokens in your own code. **When to use it:** making the app multi-user. **When not:** a single-user tool or internal script, where you can skip the toggle and the per-row `user_id`.

Managed Better Auth gives you a signed-in session on the server. Scope each query to `session.user.id` so a caller sees only their own rows:

```typescript filename="lib/notes.ts"
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const session = await auth.getSession();

const notes = await sql`
  select id, title, body from notes
  where user_id = ${session.user.id}
`;
```

See the [Managed Better Auth overview](/docs/auth/overview) and [Neon Functions authentication](/docs/compute/functions/authentication) for token verification inside a Function.

## Object Storage

**What it is:** S3-compatible object storage with isolated buckets and objects on each branch. **When to use it:** attachments, uploads, user files, anything too large for a column. **When not:** small structured values that belong in a row, where `text`, `jsonb`, or `bytea` is simpler and transactional.

```typescript filename="lib/storage.ts"
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon"; // reads the injected AWS_* vars

const files = new Files({ adapter: neon({ bucket: "attachments" }) });

await files.upload(key, bytes, { contentType });      // save an attachment
const url = await files.url(key, { expiresIn: 3600 }); // short-lived download URL
```

See the [Object Storage overview](/docs/storage/overview) and [get-started guide](/docs/storage/get-started).

## Functions

**What it is:** long-running serverless compute that runs next to your database and gets a public URL. **When to use it:** work that outlasts a short serverless or edge request, streaming responses, background jobs, or an AI agent that makes several model calls. **When not:** a quick query that fits in a Next.js route handler, which serverless and edge hosts serve fine.

```typescript filename="functions/chat.ts"
import { Hono } from "hono";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // reused across requests
const app = new Hono();

app.post("/chat", async (c) => {
  const notes = await pool.query("select title, body from notes order by created_at desc limit 20");
  // ...next: send these notes to an LLM through the AI Gateway
  return c.json({ count: notes.rowCount });
});

export default app;
```

See the [Functions overview](/docs/compute/functions/overview) and [get-started guide](/docs/compute/functions/get-started).

## AI Gateway

**What it is:** one Neon credential to reach many LLM providers and models, with no separate provider keys to manage. **When to use it:** adding AI without wiring up per-provider keys and billing, or swapping models by changing one string. **When not:** a single provider you'll never switch away from, where calling its SDK directly is simpler.

Each branch has its own endpoint, credentials, access, and usage metering. The model catalog is shared and global, and your application chooses a model with each request.

```typescript filename="functions/chat.ts"
import { neon } from "@neon/ai-sdk-provider";
import { streamText } from "ai";

const result = streamText({
  model: neon("gpt-5-mini"), // or "claude-sonnet-4-6", "gemini-3-flash", ...
  system: "Answer using only the user's notes.",
  prompt: `${question}\n\nNotes:\n${notesText}`,
});
return result.toTextStreamResponse();
```

See the [AI Gateway overview](/docs/ai-gateway/overview), [get-started guide](/docs/ai-gateway/get-started), and [model catalog](/docs/ai-gateway/models).

## Platform and management is per project

Some things apply to the whole project:

- The **region** is chosen when you create a project and is fixed for its life. Every branch in the project inherits it.
- **Project access, IP Allow rules, and the instant-restore history window** apply to every branch in the project.
- **API keys** are scoped to an account, an organization, or a project. One key can reach every branch in its scope.
- **Billing and membership** live at the organization level.

Use a separate project for a different region or a fully separated tenant.

## Branching

Each product on a branch branches through its own mechanism.

- **Your database branches instantly, copy-on-write.** A child starts as a clone of the parent's data at the moment you branch, and writes on each side stay separate.
- **Better Auth data lives in your Postgres database, in the `neon_auth` schema, so it branches and restores with your database.**
- **Object Storage and Functions are branch-aware.** Each branch is isolated from its parent, so a child's file changes and redeploys stay private to that branch. Availability varies by product and region, so check [product availability](/docs/introduction/regions#product-availability) before you rely on it.
- **Different branches can call different AI models.** The AI Gateway gives each branch its own endpoint, credentials, and access, with usage metered per branch, and you choose a model per request. The model catalog is shared and global across your branches.

**Restore covers the Postgres timeline, plus the Better Auth data that lives in `neon_auth`.** Object Storage and Functions keep their current state when you reset or restore a branch.

For the full branching story, including how each product behaves as you branch, reset, and restore, see [Branch your backend](/docs/concepts/branch-your-backend).

## Where to go next

<DetailIconCards>

<a href="/docs/concepts/the-object-model" description="How organizations, projects, branches, and services contain one another" icon="database">The object model</a>

<a href="/docs/concepts/branch-your-backend" description="How each product branches, resets, and restores" icon="split-branch">Branch your backend</a>

<a href="/docs/connect/connect-hub" description="Wire your app up to a branch and its services" icon="setup">Connect your app</a>

</DetailIconCards>

<NeedHelp/>
