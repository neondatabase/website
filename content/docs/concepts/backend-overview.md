---
title: The Neon backend
subtitle: The backend for apps and agents
summary: >-
  Neon is one backend for your apps and agents, and a branch is where that whole
  backend runs. A branch can include Lakebase Postgres, Managed Better Auth,
  Object Storage, Functions, and the AI Gateway, with the Data API riding on
  Postgres. Branches sit inside a project, and projects inside an organization.
  Each service has its own branching behavior: Postgres clones copy-on-write,
  Better Auth rides the database, Object Storage and Functions are branch-aware
  and isolated from their parent, and the AI Gateway gives each branch its own
  endpoint and credentials against one shared, global model catalog. Region and
  project access are project-scoped, while API keys are scoped to an account, an
  organization, or a project, never to a single branch.
enableTableOfContents: true
redirectFrom:
  - /docs/get-started/backend-overview
updatedOn: '2026-09-15T00:00:00.000Z'
---

Neon is the backend for your apps and agents. You get Lakebase Postgres, Managed Better Auth, Object Storage, Functions, and the AI Gateway, all running together on a single branch instead of separate services you wire together yourself.

Every branch belongs to a project, and every project belongs to an organization: organization > project > branch.

![How the Neon backend fits together](/docs/concepts/backend-overview.png 'no-border')

One branch holds every service your app needs.

## How the services work together

Take a notes app you can chat with: signed-in users write notes, attach files, and ask an AI about their own notes. One request can touch all of them:

```
Browser  --request + auth token-->  Function (chat)
                                      |  verifies the token .............. Auth
                                      |-> reads the user's notes ......... Postgres
                                      |-> pulls attached files ........... Object Storage
                                      |-> sends the context to an LLM .... AI Gateway

Function  --streams the answer-->  Browser
```

Postgres is the system of record for the notes. Object Storage holds files too big for a row. The Function handles the chat request. The AI Gateway provides a single credential for the model call. Managed Better Auth decides whose notes a request may read. Because every service lives on the same branch, this whole flow runs against one backend. The sections below describe each service in turn.

## Lakebase Postgres

- **What it is:** a fully managed, serverless Postgres database.
- **When to use it:** relational application data you query and update with SQL and transactions.
- **When not:** uploaded files or other large binary objects; store those in [Object Storage](#object-storage) and keep the key and metadata in a Postgres column.

The [Data API](/docs/data-api/overview) is a child of Postgres, an HTTP interface to the same database for callers such as browsers and edge runtimes.

Query your branch with the [serverless driver](/docs/serverless/serverless-driver), which talks to the branch over HTTP and suits serverless and edge runtimes. Use it directly or behind an ORM like Drizzle:

```typescript filename="lib/db.ts"
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const notes = await sql`select id, title, body from notes order by created_at desc limit 20`;
```

See the [Lakebase Postgres overview](/docs/postgres/overview), [serverless driver](/docs/serverless/serverless-driver), and [framework guides](/docs/get-started/frameworks).

## Managed Better Auth

- **What it is:** managed authentication that stores users and sessions in your Postgres database; its tokens can also be verified inside a Function to authenticate callers.
- **When to use it:** your app needs sign-up, sign-in, sessions, OAuth, or tenant membership.
- **When not:** there are no user identities or sessions; protect machine-to-machine endpoints with an API key or service credential instead.

Managed Better Auth gives you a signed-in session on the server. Scope each query to `session.user.id` so a caller sees only their own rows:

```typescript filename="lib/notes.ts"
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const { data: session } = await auth.getSession();

if (!session?.user) throw new Error('Unauthorized');

const notes = await sql`
  select id, title, body from notes
  where user_id = ${session.user.id}
`;
```

Inside a Function, verify the caller's token before reading data. See the [Managed Better Auth overview](/docs/auth/overview) and [Neon Functions authentication](/docs/compute/functions/authentication) for token verification.

## Object Storage

- **What it is:** S3-compatible object storage with a separate storage view per branch. A child inherits the parent's buckets and objects at branch time, and later changes stay isolated to that branch.
- **When to use it:** uploads and files, attachments, images, documents, generated media.
- **When not:** values that must be read and updated transactionally with the rest of a row; keep those in Postgres.

Store the object key on a row in Postgres and generate a short-lived URL on read, so a record and its file never drift. Any S3 client works against the injected credentials; with the [Files SDK](https://files-sdk.dev):

```typescript filename="lib/storage.ts"
import { Files } from 'files-sdk';
import { neon } from 'files-sdk/neon'; // reads the injected AWS_* vars

const files = new Files({ adapter: neon({ bucket: 'attachments' }) });

await files.upload(key, bytes, { contentType }); // save an attachment
const url = await files.url(key, { expiresIn: 3600 }); // short-lived download URL
```

See the [Object Storage overview](/docs/storage/overview) and [get-started guide](/docs/storage/get-started).

## Functions

- **What it is:** long-running serverless JavaScript or TypeScript that runs in the same region as your branch, reached through a public HTTPS URL.
- **When to use it:** request/response work that needs long HTTP streams, SSE, WebSockets, or multi-step AI agents.
- **When not:** short handlers your web framework already serves, or durable background jobs; use a queue or workflow system for those.

Because a Function keeps running across requests, it can open a `pg` connection once and reuse it, rather than the per-request serverless driver. A Function is a normal [Hono](https://hono.dev) app:

```typescript filename="functions/chat.ts"
import { Hono } from 'hono';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // reused across requests
const app = new Hono();

app.post('/chat', async (c) => {
  const notes = await pool.query('select title, body from notes order by created_at desc limit 20');
  // ...next: send these notes to an LLM through the AI Gateway
  return c.json({ count: notes.rowCount });
});

export default app;
```

See the [Functions overview](/docs/compute/functions/overview) and [get-started guide](/docs/compute/functions/get-started).

## AI Gateway

- **What it is:** an LLM gateway that uses one Neon credential to call models from multiple providers, with no separate provider accounts or keys.
- **When to use it:** you want one credential and billing path across providers, or want to switch models by changing the request's `model` value.
- **When not:** you specifically need provider features the gateway doesn't expose; using a single provider alone doesn't make the gateway unnecessary.

Each branch has its own endpoint, credentials, access, and usage metering. The model catalog is shared and global, and your application chooses a model with each request. The [`@neon/ai-sdk-provider`](https://www.npmjs.com/package/@neon/ai-sdk-provider) discovers the gateway from the injected variables, so `neon(model)` needs no base URL or key and routes each model family to the right upstream:

```typescript filename="functions/chat.ts"
import { neon } from '@neon/ai-sdk-provider';
import { streamText } from 'ai';

const result = streamText({
  model: neon('gpt-5-mini'), // or 'claude-sonnet-4-6', 'gemini-3-flash', ...
  system: "Answer using only the user's notes.",
  prompt: `${question}\n\nNotes:\n${notesText}`,
});
return result.toTextStreamResponse();
```

See the [AI Gateway overview](/docs/ai-gateway/overview), [get-started guide](/docs/ai-gateway/get-started), and [model catalog](/docs/ai-gateway/models).

## Define your backend in one file

You define your backend in code, in one file, `neon.ts`. Lakebase Postgres is included by default, so you do not declare it. You add the other services, Managed Better Auth, Object Storage, Functions, and the AI Gateway, as fields. The whole backend is one declaration you version alongside your app.

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

Deploying this configuration provisions each service on the branch you are working on and writes its credentials into your app's environment as ordinary environment variables. Your code reads those variables, so it targets a service and runs against whatever branch it connects to:

| Service                 | In `neon.ts`        | Injected into your app                                                            |
| ----------------------- | ------------------- | --------------------------------------------------------------------------------- |
| **Lakebase Postgres**   | included by default | `DATABASE_URL`                                                                    |
| **Managed Better Auth** | `auth`              | `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`                                        |
| **Object Storage**      | `buckets`           | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION` |
| **Functions**           | `functions`         | `DATABASE_URL` at runtime                                                         |
| **AI Gateway**          | `aiGateway`         | `NEON_AI_GATEWAY_BASE_URL`, `NEON_AI_GATEWAY_TOKEN`                               |

The same code runs on every branch, using the endpoints, credentials, and data for that branch. See the [`neon.ts` reference](/docs/reference/neon-ts) for the full configuration surface and the exact variables each service injects.

## Platform and management is per project

Some things apply to the whole project, not to a single branch:

- The **region** is chosen when you create a project and is fixed for its life. Every branch in the project inherits it.
- **Project access, IP Allow rules, and the instant-restore history window** apply to every branch in the project.
- **API keys** are scoped to an account, an organization, or a project. One key can reach every branch in its scope, never a single branch alone.
- **Billing and membership** live at the organization level.

Use a separate project for a different region or a fully separated tenant.

## Branch the whole backend

Branching forks the whole backend at once. Each service gets its own branch-scoped state, copy-on-write where it can. To work on a change in isolation, check out a branch and reconcile `neon.ts` against it:

```bash
neon checkout my-feature   # switch branches; run interactively to create a new one
neon deploy                # apply neon.ts to the current branch
```

`neon deploy` (an alias for `neon config apply`) reconciles `neon.ts` against the branch and writes that branch's credentials into your env file, so the same code now runs against isolated infrastructure: a different database, its own buckets, its own function URLs. A note you write on the branch never appears on `main`.

Set per-branch policy in `neon.ts`, for example auto-expiring new branches:

```typescript filename="neon.ts"
branch: (branch) => {
  if (!branch.exists) return { ttl: '7d' }; // new branches auto-expire
  return {};
},
```

Restore covers the Postgres timeline plus the Better Auth data in `neon_auth`; Object Storage and Functions keep their current state. For how each service branches, resets, and restores, see [Branch your backend](/docs/concepts/branch-your-backend).

## Where to go next

<DetailIconCards>

<a href="/docs/concepts/the-object-model" description="How organizations, projects, branches, and services contain one another" icon="database">The object model</a>

<a href="/docs/concepts/branch-your-backend" description="How each service branches, resets, and restores" icon="split-branch">Branch your backend</a>

<a href="/docs/connect/connect-hub" description="Wire your app up to a branch and its services" icon="setup">Connect your app</a>

</DetailIconCards>

<NeedHelp/>
