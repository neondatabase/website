---
title: Get started
subtitle: Deploy your first Neon Function and call it over HTTP.
summary: >-
  Deploy your first Neon Function with neonctl: link a project, define the
  function in neon.ts, develop locally with neonctl dev, and deploy with
  neonctl deploy. The function gets a public HTTPS URL with DATABASE_URL
  injected from the branch's Postgres database.
enableTableOfContents: true
---

<Admonition type="note" title="Private Preview">
Neon Functions is currently in Private Preview, available for new projects in the AWS us-east-2 region only. To request access, sign up at [We're building backends](https://neon.com/blog/were-building-backends).
</Admonition>

<Steps>

## Prerequisites

- A Neon account with Functions preview access. See [Preview access](/docs/compute/functions/preview-access).
- The latest `neonctl`, installed and authenticated. Functions commands are new and change often during the preview, so upgrade before you start (`npm install -g neonctl@latest`).
- Node.js 18 or later. Deployed functions run on Node.js 24, so use 24 locally for the closest match.

Functions are available on new projects in AWS us-east-2 only. You can create the project during `neonctl link` below.

## Set up your project

Create a project directory and initialize it for the Functions preview:

```bash
mkdir my-function && cd my-function
neonctl init --preview
```

`init --preview` sets up the directory and installs the Neon preview packages.

## Link your project

Connect the directory to a Neon project (pick one or create it):

```bash
neonctl link
```

`link` also pulls the branch's Neon env vars into a local env file (`.env` if one exists, otherwise `.env.local`), so other tools can use them. You don't need the file for this guide; `neonctl dev` injects the vars itself. See [Environment variables](/docs/compute/functions/environment-variables#pull-variables-locally) for details.

To target a specific branch, use `neonctl checkout`. It switches the branch pointer, and creates the branch if it doesn't exist:

```bash
neonctl checkout feat/my-feature
```

## Define your function

Create `neon.ts` at your project root. It declares your functions and is what `neonctl dev` and `neonctl deploy` read:

```ts filename="neon.ts"
import { defineConfig } from "@neondatabase/config/v1";

export default defineConfig({
  preview: {
    functions: {
      hello: {
        name: "My first function",
        source: "./functions/hello.ts",
      },
    },
  },
});
```

The key (`hello`) is the function's slug: its permanent identifier in CLI commands and the function URL. `name` is only a display label. See the [neon.ts reference](/docs/compute/functions/reference/neon-ts) for all options.

Install dependencies:

```bash
npm install hono @neondatabase/serverless
```

Write the handler. `DATABASE_URL` is injected automatically from the linked branch's Postgres database:

```ts filename="functions/hello.ts"
import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const app = new Hono();

app.get('/', async (c) => {
  const [row] = await sql`SELECT version()`;
  return c.json(row);
});

export default app;
```

## Develop locally

`neonctl dev` serves all functions declared in `neon.ts` with hot reload. It injects `DATABASE_URL` and other Neon env vars from the linked branch.

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

The CLI bundles each function with esbuild, uploads it, and waits for the deployment to complete. To deploy a single function directly without `neon.ts`, or to deploy through the API, see [Deploy and manage functions](/docs/compute/functions/deploy).

## Invoke

Once the deployment reaches `completed`, retrieve the invocation URL:

```bash
neonctl functions get hello
```

The `invocation_url` field contains the public URL for your function:

```
https://<branch_id>-<slug>.compute.c-1.us-east-2.aws.neon.tech
```

Call it with curl:

```bash shouldWrap
curl https://<branch_id>-hello.compute.c-1.us-east-2.aws.neon.tech
```

You should see a JSON response with your branch's Postgres version:

```json
{ "version": "PostgreSQL 17.x on ..., compiled by gcc ..." }
```

</Steps>

<NeedHelp/>
