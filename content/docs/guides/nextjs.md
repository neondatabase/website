---
title: Connect a Next.js application to Neon
subtitle: Connect a Next.js app to Lakebase Postgres on Neon, query it from a Server Component, a Server Action, and a Route Handler, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a Next.js app to Lakebase Postgres on Neon: create the app with
  create-next-app (App Router with Cache Components), optionally add Neon's
  agent skills, create a Neon project (Neon CLI, API, or Console), link it with
  the Neon CLI to pull DATABASE_URL into .env.local, optionally develop on a
  Neon branch, and query it with node-postgres, postgres.js, or the Neon
  serverless driver from a Server Component, a Server Action, a Route Handler,
  and a Pages Router page. Covers Next.js 16, notes for Next.js 15, deployment,
  troubleshooting, and Neon's other backend services from Next.js.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/vercel
  - /docs/integrations/vercel
updatedOn: '2026-11-19T01:52:43.726Z'
---

<PromptBlock src="/prompts/nextjs-prompt.md" labels={["Set up your agent and follow this guide", "Look up Next.js's docs", "Connect your Next.js app"]} />

<Steps>

## Create a Next.js app

Install [Node.js](https://nodejs.org/en/download) 22.20 or later if you don't have it. That covers every step in this guide: Next.js needs 20.9, the Neon CLI needs 20.19, and the optional `npx neon@latest skills` step needs 22.20. Then create an app. The `--yes` flag takes the recommended defaults without prompting: TypeScript, the App Router, Tailwind CSS, ESLint, and Cache Components.

```bash filename="Terminal"
npx create-next-app@latest my-app --yes --use-npm
cd my-app
```

This guide targets Next.js 16. The scaffold enables [Cache Components](https://nextjs.org/docs/app/getting-started/caching) in `next.config.ts`. With Cache Components, Next.js prerenders a page at build time unless a component asks for request-time data, and the examples below ask for it with `connection()`. To check whether Cache Components is on, look for `cacheComponents: true` in `next.config.ts`, `next.config.mts`, `next.config.js`, or `next.config.mjs`. The scaffold also writes an `AGENTS.md` that points coding agents to the Next.js docs bundled in `node_modules/next/dist/docs/`, which match the installed version. Its `.gitignore` already excludes `.env*`, so your connection string stays out of git. If your project uses a `src/` folder, put `app/` and `pages/` under `src/`, and the paths below move with them.

On Next.js 15.5, the examples below build with all three drivers. The node-postgres and postgres.js examples also ran against Postgres. The Neon serverless driver example hasn't been run on 15.5. Pages Router apps are covered in [Query the database from the Pages Router](#query-the-database-from-the-pages-router).

<Admonition type="warning">
Don't add `export const dynamic = 'force-dynamic';` to an app with Cache Components on. The build fails. See [Troubleshooting](#troubleshooting).
</Admonition>

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`. Next.js also publishes skills. `next-dev-loop` checks a change against the running app, and you can install it with `npx skills add vercel/next.js --skill next-dev-loop`.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and Managed Better Auth run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), sign in, and create the project:

```bash filename="Terminal"
npm i -g neon@latest
neon login
neon projects create --name my-app --region-id aws-us-east-2 --no-secrets
```

`--region-id` sets the region. `--no-secrets` keeps the connection string out of the output, since the next step pulls it into your env file. Pass `--org-id` to choose the organization (find IDs with `neon orgs list`).

</TabItem>

<TabItem>

Create an [API key](https://console.neon.tech/app/settings/api-keys), export it, then create the project in your organization:

```bash filename="Terminal"
export NEON_API_KEY=napi_...

curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "my-app", "region_id": "aws-us-east-2", "org_id": "<org-id>"}}'
```

The response includes the project's connection string in `connection_uris[0].connection_uri`. See [Create a project with the API](/docs/manage/projects#create-a-project-with-the-api) for the other options.

</TabItem>

<TabItem>

Go to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console, click **New Project**, and pick one of the regions above.

</TabItem>

</Tabs>

## Connect your app to the project

Get a `DATABASE_URL` into an env file. Next.js loads `.env.local` and `.env` itself, so you don't need `dotenv`.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link
```

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's `DATABASE_URL` into `.env.local`, or into `.env` if your project already has one;
- offers to create a [`neon.ts`](/docs/reference/neon-ts) file, which is optional and covered in [Add more of your backend](#add-more-of-your-backend).

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response, and add it to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The optional development branch step and [Add more of your backend](#add-more-of-your-backend) use the Neon CLI. To use them, run `neon link` in this directory.

</TabItem>

</Tabs>

Keep `DATABASE_URL` in only one env file: if `.env` and `.env.local` both have it, `.env.local` wins.

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into your env file: `.env` if it exists, otherwise `.env.local`. Restart `npm run dev` so your app uses the branch, since Next.js reads env files at startup. If you added a `.env` after linking, checkout writes there, but `.env.local` still wins, so the app keeps the old URL. Keep `DATABASE_URL` in one env file only, and make sure it's the `dev` branch's connection string. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

[node-postgres](https://node-postgres.com) (`pg`) suits a long-running Node.js server, and [postgres.js](https://github.com/porsager/postgres) works there too. The [Neon serverless driver](/docs/serverless/serverless-driver) queries over HTTP, which suits hosts without TCP connections, and needs no extra SSL configuration. If you're not sure which to use, use the Neon serverless driver. See [Choosing your connection method](/docs/connect/choose-connection).

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```bash
npm install pg
npm install -D @types/pg
```

```bash
npm install postgres
```

```bash
npm install @neondatabase/serverless
```

</CodeTabs>

If you use node-postgres, current `pg` versions print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` in your env file to keep the same behavior without the warning. `neon link`, `neon checkout`, `neon env pull`, and `neon deploy` write `sslmode=require` again, so repeat the change after you run them.

## Create the database client

Create the client once, in `lib/db.ts` at the project root, so every page and route shares it. The scaffold's `@/*` import alias points at the project root, so the examples below import it as `@/lib/db`. In a project with a `src/` folder, put the file in `src/lib/db.ts` instead.

The module logs a warning when it loads and `DATABASE_URL` is missing; it doesn't throw. Next.js loads these modules during `next build`, so a throw would fail the build. Without the warning, node-postgres quietly connects to `localhost:5432` instead. The [Troubleshooting](#troubleshooting) section lists the errors each driver shows.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="lib/db.ts"
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) console.warn('DATABASE_URL is not set: add it to your env file (.env, or .env.local if there is no .env)');

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// An idle connection can drop, for example when the compute scales to zero.
// Without a listener, the pool's error event stops the server.
pool.on('error', (error) => console.error('Postgres pool error:', error.message));
```

```typescript filename="lib/db.ts"
import postgres from 'postgres';

if (!process.env.DATABASE_URL) console.warn('DATABASE_URL is not set: add it to your env file (.env, or .env.local if there is no .env)');

export const sql = postgres(process.env.DATABASE_URL!);
```

```typescript filename="lib/db.ts"
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) console.warn('DATABASE_URL is not set: add it to your env file (.env, or .env.local if there is no .env)');

export const sql = neon(process.env.DATABASE_URL!);
```

</CodeTabs>

<Admonition type="warning">
Import this module only from server code: Server Components, Server Actions, Route Handlers, and Pages Router data functions. Don't import it into a Client Component (a file with `'use client'`).
</Admonition>

## Query the database from a Server Component

Replace the starter page in `app/page.tsx` with this code. For an app that already has a home page, create `app/neon/page.tsx` instead.

The query runs inside a component wrapped in `<Suspense>`, and `connection()` marks it as request-time work, so the database is queried on every request. Without `connection()`, Next.js 16 with Cache Components fails `next build` for this page, with the error listed in [Troubleshooting](#troubleshooting). On Next.js 15.5, without `connection()`, the page is prerendered at build time, because there are no Cache Components. That needs the database reachable during `next build`, and the page keeps the version from that build.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```tsx filename="app/page.tsx"
import { Suspense } from 'react';
import { connection } from 'next/server';
import { pool } from '@/lib/db';

async function DbVersion() {
  await connection();
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return <p>PostgreSQL Version: {rows[0].version}</p>;
  } finally {
    client.release();
  }
}

export default function Home() {
  return (
    <main>
      <h1>Next.js + Neon</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <DbVersion />
      </Suspense>
    </main>
  );
}
```

```tsx filename="app/page.tsx"
import { Suspense } from 'react';
import { connection } from 'next/server';
import { sql } from '@/lib/db';

async function DbVersion() {
  await connection();
  const rows = await sql`SELECT version()`;
  return <p>PostgreSQL Version: {rows[0].version}</p>;
}

export default function Home() {
  return (
    <main>
      <h1>Next.js + Neon</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <DbVersion />
      </Suspense>
    </main>
  );
}
```

```tsx filename="app/page.tsx"
import { Suspense } from 'react';
import { connection } from 'next/server';
import { sql } from '@/lib/db';

async function DbVersion() {
  await connection();
  const rows = await sql`SELECT version()`;
  return <p>PostgreSQL Version: {rows[0].version}</p>;
}

export default function Home() {
  return (
    <main>
      <h1>Next.js + Neon</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <DbVersion />
      </Suspense>
    </main>
  );
}
```

</CodeTabs>

## Add a Server Action

To insert data from a form, create `app/comments/page.tsx`. The Server Action inserts a row and calls `revalidatePath` so the list refreshes. The code creates the table if it doesn't exist. A real app would manage its schema with migrations (see [Next steps](#next-steps)).

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```tsx filename="app/comments/page.tsx"
import { Suspense } from 'react';
import { connection } from 'next/server';
import { revalidatePath } from 'next/cache';
import { pool } from '@/lib/db';

async function createComment(formData: FormData) {
  'use server';
  const comment = String(formData.get('comment'));
  const client = await pool.connect();
  try {
    await client.query('CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, comment TEXT)');
    await client.query('INSERT INTO comments (comment) VALUES ($1)', [comment]);
  } finally {
    client.release();
  }
  revalidatePath('/comments');
}

async function Comments() {
  await connection();
  const client = await pool.connect();
  try {
    await client.query('CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, comment TEXT)');
    const { rows } = await client.query('SELECT id, comment FROM comments ORDER BY id');
    return (
      <ul>
        {rows.map((row) => (
          <li key={row.id}>{row.comment}</li>
        ))}
      </ul>
    );
  } finally {
    client.release();
  }
}

export default function CommentsPage() {
  return (
    <div>
      <h2>Server Action Example</h2>
      <form action={createComment}>
        <input type="text" name="comment" placeholder="Add a comment" />
        <button type="submit">Submit</button>
      </form>
      <Suspense fallback={<p>Loading...</p>}>
        <Comments />
      </Suspense>
    </div>
  );
}
```

```tsx filename="app/comments/page.tsx"
import { Suspense } from 'react';
import { connection } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';

async function createComment(formData: FormData) {
  'use server';
  const comment = String(formData.get('comment'));
  await sql`CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, comment TEXT)`;
  await sql`INSERT INTO comments (comment) VALUES (${comment})`;
  revalidatePath('/comments');
}

async function Comments() {
  await connection();
  await sql`CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, comment TEXT)`;
  const rows = await sql`SELECT id, comment FROM comments ORDER BY id`;
  return (
    <ul>
      {rows.map((row) => (
        <li key={row.id}>{row.comment}</li>
      ))}
    </ul>
  );
}

export default function CommentsPage() {
  return (
    <div>
      <h2>Server Action Example</h2>
      <form action={createComment}>
        <input type="text" name="comment" placeholder="Add a comment" />
        <button type="submit">Submit</button>
      </form>
      <Suspense fallback={<p>Loading...</p>}>
        <Comments />
      </Suspense>
    </div>
  );
}
```

```tsx filename="app/comments/page.tsx"
import { Suspense } from 'react';
import { connection } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';

async function createComment(formData: FormData) {
  'use server';
  const comment = String(formData.get('comment'));
  await sql`CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, comment TEXT)`;
  await sql`INSERT INTO comments (comment) VALUES (${comment})`;
  revalidatePath('/comments');
}

async function Comments() {
  await connection();
  await sql`CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, comment TEXT)`;
  const rows = await sql`SELECT id, comment FROM comments ORDER BY id`;
  return (
    <ul>
      {rows.map((row) => (
        <li key={row.id}>{row.comment}</li>
      ))}
    </ul>
  );
}

export default function CommentsPage() {
  return (
    <div>
      <h2>Server Action Example</h2>
      <form action={createComment}>
        <input type="text" name="comment" placeholder="Add a comment" />
        <button type="submit">Submit</button>
      </form>
      <Suspense fallback={<p>Loading...</p>}>
        <Comments />
      </Suspense>
    </div>
  );
}
```

</CodeTabs>

## Query the database from a Route Handler

Create `app/api/version/route.ts`, which returns the version as JSON. Route Handlers run on the Node.js runtime. `connection()` keeps the route dynamic, so Next.js doesn't prerender it at build time. Setting `runtime = 'edge'` on a route is deprecated, and Cache Components doesn't support it, so these routes use the Node.js runtime.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```ts filename="app/api/version/route.ts"
import { connection, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  await connection();
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return NextResponse.json(rows[0]);
  } finally {
    client.release();
  }
}
```

```ts filename="app/api/version/route.ts"
import { connection, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  await connection();
  const rows = await sql`SELECT version()`;
  return NextResponse.json(rows[0]);
}
```

```ts filename="app/api/version/route.ts"
import { connection, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  await connection();
  const rows = await sql`SELECT version()`;
  return NextResponse.json(rows[0]);
}
```

</CodeTabs>

## Query the database from the Pages Router

If your app uses the `pages/` directory, query the database from `getServerSideProps`. This section covers `getServerSideProps` only; Pages Router API routes in `pages/api` aren't covered, and the Route Handler above is the App Router equivalent. The example is `pages/version.tsx`, and it runs on every request. In a project with a `src/` folder, use `src/pages/version.tsx`.

<Admonition type="warning">
Don't use `getStaticProps` for this. It runs at build time, so `next build` needs a reachable database and fails without one.
</Admonition>

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```tsx filename="pages/version.tsx"
import type { GetServerSideProps } from 'next';
import { pool } from '@/lib/db';

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return { props: { data: rows[0].version } };
  } finally {
    client.release();
  }
};

export default function Page({ data }: { data: string }) {
  return <p>PostgreSQL Version: {data}</p>;
}
```

```tsx filename="pages/version.tsx"
import type { GetServerSideProps } from 'next';
import { sql } from '@/lib/db';

export const getServerSideProps: GetServerSideProps = async () => {
  const rows = await sql`SELECT version()`;
  return { props: { data: rows[0].version } };
};

export default function Page({ data }: { data: string }) {
  return <p>PostgreSQL Version: {data}</p>;
}
```

```tsx filename="pages/version.tsx"
import type { GetServerSideProps } from 'next';
import { sql } from '@/lib/db';

export const getServerSideProps: GetServerSideProps = async () => {
  const rows = await sql`SELECT version()`;
  return { props: { data: rows[0].version } };
};

export default function Page({ data }: { data: string }) {
  return <p>PostgreSQL Version: {data}</p>;
}
```

</CodeTabs>

## Run the app

Start the development server with `npm run dev`, which loads `.env.local`. Open [localhost:3000](http://localhost:3000) to see the Server Component (or [localhost:3000/neon](http://localhost:3000/neon) if you created `app/neon/page.tsx`). The Server Action form is at `/comments`, the Route Handler at `/api/version`, and, if you added the Pages Router page, `/version`. The page shows your Postgres version:

```shell shouldWrap
PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu, compiled by gcc ...
```

</Steps>

## Deploy

Set `DATABASE_URL` in your host's environment. `.env.local` is for local development, since it's git-ignored and not deployed.

- Use your default branch for production. Get its pooled connection string, which goes through Neon's connection pooler and suits many short-lived connections, with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Neon Console.
- Run `next build` and `next start`. The examples above don't need the database at build time; a page that uses `getStaticProps` does.
- On Vercel, the [Neon integration](/docs/guides/vercel-overview) sets `DATABASE_URL` for you and can create a Neon branch for each preview deployment.
- Pick the driver for your host. node-postgres and postgres.js suit long-running Node.js servers and [Vercel Fluid compute](https://vercel.com/docs/functions/fluid-compute). On a host without TCP connections, use the Neon serverless driver. See [Choosing your connection method](/docs/connect/choose-connection).

## Add more of your backend

Add a Neon backend service to your Next.js app with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). Each service branches with your database, so a `dev` branch gets its own data for each service. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it and writes its variables to your env file (`.env` if it exists, otherwise `.env.local`). Read them from `process.env` in server code, and set them on your host too.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. In Next.js, use it from Route Handlers and Server Actions. See [Object Storage](/docs/storage/overview). To use an external provider instead, see [File storage](/docs/guides/file-storage).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In Next.js, call models from a Route Handler or Server Action. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your Next.js host, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In a Next.js Route Handler, [seal](/docs/realtime/guides/queries#sealing-queries) the live query with `@neon/realtime/server` and `NEON_REALTIME_SECRET`: sealing signs the query so the browser can subscribe to it but can't change it. Return the sealed query from the route. Pass `NEON_REALTIME_URL` to the browser as a prop from a Server Component; the browser subscribes with `@neon/realtime/client`. Keep the secret on the server. See [Realtime](/docs/realtime/overview) and [Realtime with Next.js](/docs/realtime/examples/nextjs).

</DefinitionList>

To declare several services at once before you have a `neon.ts`, run `neon config init --services auth,functions,realtime`, or edit the file directly. With every service declared, it looks like this. The comments list the variables each service adds:

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  auth: true, // NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL
  buckets: {
    uploads: {}, // AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT_URL_S3, AWS_REGION
  },
  aiGateway: true, // NEON_AI_GATEWAY_TOKEN, NEON_AI_GATEWAY_BASE_URL
  functions: {
    jobs: { name: 'Jobs', source: './functions/jobs.ts' }, // NEON_FUNCTION_HOST_SUFFIX
  },
  preview: {
    realtime: true, // NEON_REALTIME_URL, NEON_REALTIME_SECRET
  },
});
```

To skip `neon.ts`, use each service's own CLI commands, such as [`neon buckets create`](/docs/cli/buckets) or [`neon realtime enable`](/docs/cli/realtime).

## Troubleshooting

<DefinitionList>

`Error [NeonDbError]: Wrong URL scheme or missing user, host or database in connection parameters`
: The Neon serverless driver got no connection string, so `DATABASE_URL` isn't set where the server reads it. Put it in `.env.local` and restart `npm run dev`, or set it in your host's environment.

`connect ECONNREFUSED 127.0.0.1:5432`
: node-postgres connected to its default address because `DATABASE_URL` is missing or empty. Check the env file, then restart the dev server, since Next.js reads env files at startup.

``Route segment config "dynamic" is not compatible with `nextConfig.cacheComponents`. Please remove it.``
: The app has Cache Components on, which doesn't allow `export const dynamic`. Remove the export and use `connection()` with `<Suspense>` instead. Use `export const dynamic = 'force-dynamic'` only in apps without Cache Components.

`Route "/": Next.js encountered uncached or runtime data during prerendering.`
: On an app with Cache Components on (Next.js 16), a page queries the database during `next build` without `connection()`. Add `await connection()` before the query, inside `<Suspense>`, as in the Server Component example.

`Endpoint ID is not specified`
: The client doesn't send Server Name Indication (SNI), which Neon uses to route connections. Current node-postgres and postgres.js send SNI, so this usually means an older client or a libpq older than Postgres 14. If upgrading doesn't fix it, append `&options=endpoint%3D<endpoint-id>` to `DATABASE_URL` (use `?` instead of `&` if the URL has no query string). The endpoint ID is the first part of the host name without `-pooler`, for example `ep-cool-darkness-123456`. See [The endpoint ID is not specified](/docs/connect/connection-errors#the-endpoint-id-is-not-specified).

`SSL SYSCALL error: EOF detected`, or a similar connection-reset error
: The app reused a connection after the Neon compute was suspended for inactivity. This mainly affects node-postgres and postgres.js, which hold a connection pool open. In the node-postgres example, the `pool.on('error')` listener in `lib/db.ts` keeps it from stopping the server. The request that hits the closed connection can fail; the next request opens a new connection, so retrying the request resolves it. `@neondatabase/serverless` isn't affected, since it opens a new HTTP connection per query.

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Build a full backend](/docs/get-started/full-backend-quickstart): Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Set up Managed Better Auth](/docs/auth/quick-start/nextjs-api-only): Add managed authentication that branches with your database.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.
- Watch [Getting started with Neon](https://www.youtube.com/watch?v=XtMiMnX0hDg), an end-to-end setup with Next.js and Drizzle.

<NeedHelp/>
