---
title: Get started with Neon Functions
subtitle: Deploy your first Neon Function and call it over HTTP.
summary: >-
  Deploy your first Neon Function with neonctl: initialize a project, define
  the function in neon.ts, develop locally with neonctl dev, and deploy with
  neonctl deploy. The function gets a public HTTPS URL with DATABASE_URL
  injected from the branch's Postgres database.
enableTableOfContents: true
updatedOn: '2026-06-24T14:40:50.063Z'
---

<PrivatePreviewEnquire/>

A function takes a request and returns a web response, running on long-lived Node.js compute next to your database. This guide builds one by hand: define it in `neon.ts`, run it locally, deploy it, and call it over HTTP.

<Steps>

## Prerequisites

- A Neon account with Functions preview access. See [Preview access](/docs/compute/functions/preview-access).
- The latest `neonctl`, installed and authenticated. Functions commands are new and change often during the preview, so upgrade before you start (`npm install -g neonctl@latest`).
- Node.js 18 or later. Deployed functions run on Node.js 24, so use 24 locally for the closest match.

Functions are available on new projects in AWS us-east-2 only, created on or after June 15, 2026.

`neonctl init --preview` is designed to be run by your AI coding assistant. It outputs structured instructions that guide the agent through setup. To install skills separately:

```bash
npx skills add neondatabase/agent-skills -s neon -s neon-functions -y
```

## Set up your project

Create your project directory:

```bash
mkdir my-function && cd my-function
```

Then link the directory to your Neon project. There are two ways:

**With an AI coding assistant.** Ask it to run `neonctl init --preview`. The command returns structured JSON instructions for the full setup: MCP server and agent skills, optional template scaffolding, project linking, and env var pull. Sign-in opens a browser window, and the agent pauses while you complete the OAuth step.

**By hand.** Run `neonctl link` and select your project and branch when prompted (or pass `--project-id`). This writes a `.neon` file and pulls the branch's environment variables into a local `.env`.

```bash
neonctl link
```

To start from a working example instead, run `neonctl bootstrap`. It scaffolds a starter template and links it. Available templates: Hono API, AI SDK agent, Mastra agent, MCP server, Realtime chat (Next.js + WebSockets), and Realtime counter (TanStack Router + SSE), all on Neon Functions. This guide builds the function by hand.

## Define your function

Create `neon.ts` at your project root. It declares your functions and is what `neonctl dev` and `neonctl deploy` read:

```ts filename="neon.ts"
import { defineConfig } from "@neondatabase/config/v1";

export default defineConfig({
  // preview groups features still in beta: functions, AI Gateway, and object-storage buckets.
  preview: {
    functions: {
      // The key is the function's slug:
      // a permanent ID used in CLI commands and the URL.
      hello: {
        name: "My first function", // display label only
        source: "./functions/hello.ts", // path to the handler file
      },
    },
  },
});
```

The slug is permanent: it can't be renamed after the first deploy. See the [neon.ts reference](/docs/reference/neon-ts) for all options.

Install dependencies:

```bash
npm install @neondatabase/config hono pg
npm install --save-dev @types/pg
```

A function is any module whose default export has a `fetch(request)` method that returns a `Response`. That can be an object with a `fetch` method:

```ts
export default {
  fetch: (request: Request) => new Response('Hello World!'),
};
```

Or a bare async function:

```ts
export default async function handler(request: Request) {
  return new Response('Hello World!');
}
```

A Hono app exports the object shape, so `export default app` works directly. For this guide, write a handler that queries Postgres. `DATABASE_URL` is injected automatically from the linked branch's Postgres database:

```ts filename="functions/hello.ts"
import { Hono } from 'hono';
import { Pool } from 'pg';

// Create the pool once at module scope so it's reused across requests.
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
const app = new Hono();

app.get('/', async (c) => {
  const { rows } = await pool.query('SELECT version()');
  return c.json(rows[0]);
});

export default app;

// Close the pool cleanly when the isolate shuts down.
process.on('SIGINT', () => {
  pool.end().then(() => process.exit(0));
});
```

<a id="connect-to-postgres"></a>

<Admonition type="important" title="Use a connection pool, not the serverless driver">
A function keeps running across requests, so connect to Postgres with a long-lived `pg` `Pool` created once at module scope. Don't use `@neondatabase/serverless` here: it's built for short-lived, edge-style invocations that open a connection per request, which wastes the persistent runtime a function gives you. Use the pooled `DATABASE_URL` for queries; use `DATABASE_URL_UNPOOLED` only where you need a dedicated connection (such as `LISTEN`/`NOTIFY`).
</Admonition>

## Develop locally

`neonctl dev` serves all functions declared in `neon.ts` with hot reload. It injects `DATABASE_URL` and other Neon env vars from the linked branch. See [Environment variables](/docs/compute/functions/environment-variables) for the full list and how to pull them into a local `.env` file.

```bash
neonctl dev
```

The terminal prints the URL for each running function:

```text
  Neon Functions dev server

  hello                http://localhost:8787
```

## Deploy

`neonctl deploy` reads `neon.ts` and applies it to the linked branch, deploying every function it declares:

```bash
neonctl deploy
```

The CLI bundles each function with esbuild, uploads it, and waits for the deployment to complete.

To deploy a single file without a `neon.ts`, deploy it by slug instead:

```bash
neonctl functions deploy hello --src functions/hello.ts
```

For all deploy options, including the Neon API, see [Deploy and manage functions](/docs/compute/functions/deploy).

## Invoke

Once the deployment reaches `completed`, retrieve the invocation URL:

```bash
neonctl functions get hello
```

The `invocation_url` field contains the public URL for your function:

```
https://<branch_id>-<slug>.compute.<cell>.us-east-2.aws.neon.tech
```

Call it with curl:

```bash shouldWrap
curl https://<branch_id>-hello.compute.<cell>.us-east-2.aws.neon.tech
```

The response is a JSON object with your branch's Postgres version:

```json
{ "version": "PostgreSQL 17.x on ..., compiled by gcc ..." }
```

</Steps>

<NeedHelp/>
