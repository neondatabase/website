---
title: How a Neon backend fits together
subtitle: Postgres, Object Storage, Functions, the AI Gateway, and Auth, declared in one neon.ts and branched together
summary: >-
  A tour of the Neon backend, using one example app, a notes app you can chat
  with, to show how the pieces fit. A single neon.ts declares Postgres, Object
  Storage, Functions, the AI Gateway, and Auth; each is a toggle (Postgres is
  on by default) plus neon deploy, which injects standard environment
  variables. Branch your project and the database, buckets, and functions fork
  copy-on-write together. Each section covers what a capability is, when to use
  it, and the Neon-specific part you write, and links to that capability's own
  quickstart for the full setup.
enableTableOfContents: true
---

On Neon, a single [`neon.ts`](/docs/reference/neon-ts) file declares your whole backend: a **Postgres database**, S3-compatible **Object Storage**, long-running **Functions**, an **AI Gateway** for calling LLMs through one credential, and managed **Auth**. Each capability is a toggle, or on by default for Postgres, plus [`neon deploy`](/docs/cli/deploy), which provisions it and injects standard environment variables into your app. Branch your project and the whole backend forks with your data.

<Admonition type="note" title="This is an orientation page">
This page shows how the pieces fit, not how to build step by step, so the snippets are illustrative. To build now, copy the prompt below or jump to [Where to build it](#where-to-build-it). For one capability's full setup, follow its Reference link.
</Admonition>

<CopyPrompt src="/prompts/neon-backend.md" description="Hand this to your AI assistant to set up Neon: skills, project, and all capabilities. Then tell it what to build." buttonText="Copy prompt" />

## What you'll build

The running example is a **notes app you can chat with**. Signed-in users write notes, attach files to them, and ask an AI questions about their own notes. That one app touches all five capabilities:

```
Browser  ──request + auth token──▶  Function (chat)
                                      │  verifies the token .............. Auth
                                      ├─▶ reads the user's notes ......... Postgres
                                      ├─▶ pulls attached files ........... Object Storage
                                      └─▶ sends the context to an LLM .... AI Gateway

Function  ──streams the answer──▶  Browser
```

So when you see a `notes` table, an `attachments` bucket, or a `chat` function below, they're all parts of this same app. Postgres is the system of record for notes; Storage holds the files that are too big for a row; the Function is the long-running piece that handles a chat request; the AI Gateway is the single credential for the model call; and Auth decides whose notes a request may read.

<Admonition type="info" title="Region and access requirements">
Object Storage, Functions, and the AI Gateway are in beta and available only in **AWS US East (Ohio) (`aws-us-east-2`)**, on new or existing projects in that region, so use a project there to try them. Postgres and Managed Better Auth work in any region. The three new beta services are free to use during beta, subject to usage limits. The AI Gateway is only available on paid plans; the other two are on any plan.
</Admonition>

## The shape of a Neon backend

The setup is a few commands; the [CLI quickstart](/docs/cli/quickstart) is the full how-to. Install the CLI, link a project, scaffold one `neon.ts`.

Install the [`neon` CLI](/docs/cli/install) (requires **Node.js 20.19 or higher**) and sign in with [`neon auth`](/docs/cli/auth):

```bash
npm i -g neon
neon auth
```

Then create the project. Create it in `aws-us-east-2` so the beta services are available:

```bash
neon link --project-name notes-app --region-id aws-us-east-2
```

[`neon link`](/docs/cli/link) writes your project context to a `.neon` file and pulls the branch's `DATABASE_URL` into a local `.env`. Then scaffold a `neon.ts` to declare the rest of your backend:

```bash
neon config init
```

<details>
<summary>The generated `neon.ts`</summary>

```typescript filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Declare your Neon services here
  auth: false,
  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      // Default branch: no overrides, uses project defaults
      return {};
    }
    if (!branch.exists) {
      // New non-default branches: auto-expire
      // Run `neon checkout <name>` to create a new branch with these settings
      return { ttl: "7d" };
    }
    // Existing branch: no changes
    return {};
  },
});
```

</details>

This creates `neon.ts` and installs the `@neon/config` and `@neon/env` packages. Each section below adds one capability to it.

## How it works

Every capability follows the same three steps: **enable it in `neon.ts`, [`neon deploy`](/docs/cli/deploy), then read the injected environment variables.** The same steps apply to all five.

- **`neon.ts` is your backend as code.** One file declares Auth and any beta services; Postgres is on by default.
- **`neon deploy` reconciles that file** against your branch, provisions each service, and writes its credentials to your env file.
- **Branching forks the whole backend together.** A new branch gets its own database, bucket, and function, copy-on-write from the parent. See [Branch your whole backend](#branch-your-whole-backend).

| Capability              | Enable in `neon.ts`  | Injected env vars                                                                 | You use it with                                   |
| ----------------------- | -------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Postgres**            | on by default        | `DATABASE_URL`                                                                    | `@neondatabase/serverless`, or `pg` in a Function |
| **Object Storage**      | `buckets: { ... }`   | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION` | `files-sdk` (or any S3 client)                    |
| **Functions**           | `functions: { ... }` | `DATABASE_URL` and more, inside the function                                      | Hono (any web framework)                          |
| **AI Gateway**          | `aiGateway: true`    | `NEON_AI_GATEWAY_BASE_URL`, `NEON_AI_GATEWAY_TOKEN`                               | `@neon/ai-sdk-provider`                           |
| **Managed Better Auth** | `auth: true`         | `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`                                        | `@neondatabase/auth`                              |

<Admonition type="note" title="Reading the snippets">
The `neon.ts` fragments below show only the key being added. `auth` goes at the top level of `defineConfig({ ... })`; the beta features marked `// inside preview` all go inside a single `preview` block. The [complete file](#where-to-build-it) shows them assembled. Credentials are written to `.env` if you have one, otherwise `.env.local`; this page writes `.env` for whichever is yours.
</Admonition>

## Postgres: the notes

**What it is:** serverless Postgres, generally available. **When to use it:** your system of record, anything relational. In the notes app, it holds the notes themselves. **When not:** large binary files, keep the bytes in [Object Storage](#object-storage-the-attachments) and store the key in a column.

There's nothing to enable, since `neon link` already wrote `DATABASE_URL`. Create a `notes` table, then query it with the [serverless driver](/docs/serverless/serverless-driver), which talks to your branch over HTTP and suits serverless and edge runtimes:

```typescript filename="lib/db.ts"
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const notes = await sql`select id, title, body from notes order by created_at desc limit 20`;
```

Use it directly or behind an ORM like Drizzle. Schema, migrations, and route handlers are standard application code.

**Reference:** [Serverless driver](/docs/serverless/serverless-driver) · [Connect from any framework](/docs/get-started/frameworks)

## Object Storage: the attachments

**What it is:** S3-compatible object storage that branches together with your database, so files and rows stay in sync on every branch. In the notes app, it stores the files a user attaches to a note. **When to use it:** attachments, uploads, user files, anything too large for a column. **When not:** small structured values that belong in a row, where `text`, `jsonb`, or `bytea` is simpler and transactional.

Declare an `attachments` bucket (private by default) and deploy. `neon deploy` provisions it and injects AWS-standard credentials, so any S3 client works unchanged:

```typescript filename="neon.ts"
// inside preview
buckets: { attachments: {} },
```

Store the object **key** on the note row in Postgres and generate a short-lived URL on read, so the note and its file never drift. With the [Files SDK](https://files-sdk.dev):

```typescript filename="lib/storage.ts"
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon"; // reads the injected AWS_* vars

const files = new Files({ adapter: neon({ bucket: "attachments" }) });

await files.upload(key, bytes, { contentType });      // save an attachment
const url = await files.url(key, { expiresIn: 3600 }); // short-lived download URL
```

**Reference:** [Storage get-started](/docs/storage/get-started) (credentials, S3/Python/CLI clients, public buckets) · [Overview](/docs/storage/overview)

## Functions: the chat endpoint

**What it is:** long-running serverless compute that runs next to your database and gets a public URL. In the notes app, it's the `chat` endpoint the browser calls. **When to use it:** work that outlasts a short serverless or edge request, streaming responses, background jobs, or an AI agent that makes several model calls. **When not:** a quick query that fits in a Next.js route handler, which serverless and edge hosts serve fine.

Declare the `chat` function and deploy. `neon deploy` bundles it, deploys it, prints its URL, and injects `DATABASE_URL` at runtime (plus the AI Gateway vars once you enable it below):

```typescript filename="neon.ts"
// inside preview
functions: {
  chat: { name: "notes chat", source: "./functions/chat.ts" },
},
```

The function is a normal [Hono](https://hono.dev) app. Because it keeps running across requests, it can open a `pg` connection once at module scope and reuse it, rather than the per-request serverless driver from the [Postgres](#postgres-the-notes) section. You extend this same file in the next two sections, adding the AI call and the auth check:

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

Run it locally with [`neon dev`](/docs/cli/dev), which serves the function with the same injected Neon variables it gets in production.

**Reference:** [Functions get-started](/docs/compute/functions/get-started) (local dev, deploy, invoke, connection-pool guidance) · [Overview](/docs/compute/functions/overview)

## AI Gateway: the model call

**What it is:** one Neon credential to reach many LLM providers and models, with no separate provider keys to manage. In the notes app, the `chat` function uses it to answer questions grounded in the user's notes. **When to use it:** adding AI without wiring up per-provider keys and billing, or swapping models by changing one string. **When not:** a single provider you'll never switch away from, where calling its SDK directly is simpler.

Enable it and deploy; `neon deploy` and `neon dev` inject the gateway URL and token:

```typescript filename="neon.ts"
// inside preview
aiGateway: true,
```

The [`@neon/ai-sdk-provider`](https://www.npmjs.com/package/@neon/ai-sdk-provider) discovers the gateway from those variables, so `neon(model)` needs no base URL or key, and it routes each model family to the right upstream for you. Back in the `chat` function, stream an answer from the notes you just read:

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

Output isn't only text. The same credential reaches other modalities through model-specific options; for example, OpenAI models can generate images via the `image_generation` tool on the Responses API. See the [model catalog](/docs/ai-gateway/models) for which models support what.

<Admonition type="note" title="First call after a deploy">
Right after `neon deploy` on a new branch, the first gateway call can return a `403` (`credential not authorized for this branch`) while the credential propagates. It clears within a few seconds, so retry.
</Admonition>

**Reference:** [AI Gateway get-started](/docs/ai-gateway/get-started) (streaming, troubleshooting) · [Model catalog](/docs/ai-gateway/models) (per-modality snippets) · [Overview](/docs/ai-gateway/overview)

## Managed Better Auth: per-user access

**What it is:** authentication with per-user data, plus a way to secure your functions by verifying tokens in your own code. In the notes app, it makes notes private, so each user chats only with their own. **When to use it:** making the app multi-user. **When not:** a single-user tool or internal script, where you can skip the toggle and the per-row `user_id`.

Enable it and deploy; `neon deploy` injects the auth base URL and JWKS URL:

```typescript filename="neon.ts"
auth: true,
```

Managed Better Auth needs a session cookie secret that you provide; it isn't injected. Generate one and add it as `NEON_AUTH_COOKIE_SECRET` in the same env file as your other credentials:

```bash
openssl rand -base64 32   # paste the output as NEON_AUTH_COOKIE_SECRET
```

On the server, gate data with `auth.getSession()` and store `session.user.id` on each note. Inside the `chat` function, verify the caller's JWT against the injected JWKS before reading any notes, and scope the query to that user:

```typescript filename="functions/chat.ts"
import { createRemoteJWKSet, jwtVerify } from "jose";

const jwks = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!));
const token = c.req.header("authorization")?.replace(/^Bearer /i, "") ?? "";
const { payload } = await jwtVerify(token, jwks); // throws if invalid
const userId = String(payload.sub);
// now: select ... from notes where user_id = $1
```

**Reference:** [Authentication flow](/docs/auth/authentication-flow) (JWT, JWKS, verifying the caller) · [Auth quickstart](/docs/auth/quick-start/nextjs-api-only) (SDK wiring, prebuilt UI) · [Overview](/docs/auth/overview)

## Branch your whole backend

A branch forks the whole backend, its own database, buckets, and functions, copy-on-write from the parent. To try a change to the notes app safely, switch to a new branch with [`neon checkout`](/docs/cli/checkout), which offers to create the branch if it doesn't exist:

```bash
neon checkout my-feature      # switch to my-feature (offers to create it if new)
neon deploy                   # provisions that branch's services
```

`neon deploy` writes the new branch's credentials into `.env`, so the same code now runs against isolated infrastructure, a different database, an isolated `attachments` bucket, its own `chat` URL. A note you write on the branch never appears on `main`.

The `branch` function in `neon.ts` sets per-branch policy, for example auto-expiring non-default branches:

```typescript filename="neon.ts"
branch: (branch) => {
  if (branch.isDefault) return {};            // production: no TTL
  if (!branch.exists) return { ttl: "7d" };   // new branches auto-expire
  return {};
},
```

**Reference:** [Branching](/docs/introduction/branching)

## Where to build it

Here is the complete `neon.ts` for the notes app, every capability the sections above added, in one file:

```typescript filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  preview: {
    // groups today's beta features: Object Storage, Functions, and the AI Gateway
    aiGateway: true,
    buckets: { attachments: {} },
    functions: {
      chat: { name: "notes chat", source: "./functions/chat.ts" },
    },
  },
  branch: (branch) => {
    if (branch.isDefault) return {};
    if (!branch.exists) return { ttl: "7d" };
    return {};
  },
});
```

The beta services live under `preview` while they're in beta; that key goes away as they reach GA. `auth` is already top-level.

Two ways to get it running:

**Let your AI editor build it.** Copy the prompt at the top of this page and hand it to your assistant. It runs `neon init` to configure the MCP server and install the core skill, adds the Object Storage, Functions, and AI Gateway skills with `npx skills add neondatabase/agent-skills`, then builds against each capability's current API.

**Start from a template.** `neon bootstrap` scaffolds a ready-to-run starter, installs dependencies, and links a project:

```bash
neon bootstrap notes-app --template ai-sdk   # Postgres + Storage + Functions + AI Gateway
```

Run `neon bootstrap --list-templates` for the full list, or browse them in the [examples repo](https://github.com/neondatabase/examples).

## Verify

A fast sanity check after deploy; each capability's get-started has the real testing guidance. Run one check per capability:

| Capability     | Quick check                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Postgres       | `grep DATABASE_URL .env` returns a value and a `select` from `notes` returns rows                                                                    |
| Object Storage | `AWS_ENDPOINT_URL_S3` is in `.env` and a short-lived URL opens an attachment                                                                         |
| Functions      | `neon dev`'s local URL and the deployed `chat` URL both respond                                                                                      |
| AI Gateway     | a `chat` call returns a streamed answer; a `401` means a bad token, and a `403` right after deploy means the credential is still propagating (retry) |
| Auth           | a new sign-up appears in `neon_auth."user"` on your branch                                                                                           |
| Branching      | the new branch has its own `DATABASE_URL` and `chat` URL                                                                                             |

## Next steps

**Reference for each capability:** [Storage](/docs/storage/get-started) · [Functions](/docs/compute/functions/get-started) · [AI Gateway](/docs/ai-gateway/get-started) · [Auth](/docs/auth/quick-start/nextjs-api-only) · [Postgres](/docs/serverless/serverless-driver)

<NeedHelp/>
