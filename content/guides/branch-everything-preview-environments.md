---
title: 'Branch everything: fully isolated preview environments on Neon'
subtitle: 'Give every pull request its own production-like copy of your entire backend: Lakebase Postgres, Auth, Functions, AI Gateway, and Object Storage'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-09-07T00:00:00.000Z'
---

Say you're building an application with a real backend: a database, authentication, serverless functions, AI, and file storage. A preview deployment that only deploys your code doesn't tell you much about how the change will behave in production. The preview runs your new code, but everything behind that code is still shared with production. So every time you click through a feature to review it, your test actions land in the same systems your real users depend on:

1. **Database**: A test write during review ends up in your production tables, right next to your real data.
2. **Auth**: A test signup during review creates a real user in your production user base.
3. **Functions**: The preview invokes your production serverless functions.
4. **AI**: Preview AI requests consume the same rate limits as production.
5. **Storage**: A file you upload in a preview lands in a production bucket.

Each of these collisions is a problem on its own, but together they make preview deployment unsafe for anything beyond visual review. You can't test a feature that touches the backend without risking production data, and you can't test a feature that touches production without risking your users.

The usual fix is a shared staging environment. But if you've maintained one, you know the problems: it drifts out of sync with production the moment someone deploys to it manually, everyone's tests collide on the same data, and someone has to keep every single staging service in sync with production.

[Neon](/docs/introduction) takes a different approach. On Neon, you can branch your database the same way you branch your code, and everything Neon offers (Lakebase Postgres, Auth, Functions, AI Gateway, and Object Storage) branches with it. In this guide, you'll build a small document summarization app and wire it so every pull request gets its own complete isolated environment, including its own database, its own auth, its own function deployments, its own AI spend, and its own storage.

<CopyPrompt
  src="/prompts/branch-everything-preview-environments-prompt.md"
  description="Use this prompt to customize the guide and build it with your AI agent."
  buttonText="Copy prompt"
/>

## What is branching?

If you've used Git, [database branching](/docs/introduction/branching) will feel familiar. A Neon branch starts identical to your database and then diverges as you make changes. Branches are built on **copy-on-write**: instead of duplicating data, the branch shares storage with its parent and only records the changes made after the branch was created. Creating one takes about a second and costs almost nothing. And because the branch starts from production itself, you're reviewing against your real data, not sanitized fixtures. Branches can also be **ephemeral**: give one a TTL (time to live) and Neon deletes it automatically when the time is up.

Database branching solves the data problem, but most applications also have an auth provider, serverless functions, AI calls, and file storage. On Neon, everything branches together: every branch gets its own copy of every service, isolated from the parent and from other branches:

| Service                                                | What the branch gets                                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **[Lakebase Postgres](/docs/introduction/branching)**  | A copy-on-write clone of your data, isolated from the parent branch                                    |
| **[Managed Better Auth](/docs/auth/overview)**         | Its own auth tenant: users, sessions, and config in the `neon_auth` schema, with a unique Auth API URL |
| **[Neon Functions](/docs/compute/functions/overview)** | Its own function deployments at branch-scoped URLs, with branch-scoped env vars                        |
| **[Neon AI Gateway](/docs/ai-gateway/overview)**       | Its own gateway endpoint, with credentials bound to the branch and its descendants                     |
| **[Neon Object Storage](/docs/storage/overview)**      | Its own storage namespace: buckets and objects cloned copy-on-write at branch creation                 |

Every service in the table inherits from the parent branch at creation and is scoped to that branch. Auth tokens issued on one branch are invalid on another. Function URLs contain the branch ID. Storage credentials point at the branch's endpoint. A branch has your production schema, rows, users, and files. It's production-like because it _is_ production, isolated at a point in time.

<Admonition type="warning" title="Previews contain real production data">
That inheritance cuts both ways. Anyone who can open a preview can see your real users, documents, and uploads. Limit preview access to people who may see production data, and if that's not acceptable for your application, use [schema-only branches](/docs/guides/branching-schema-only) so sensitive data never leaves the parent.
</Admonition>

## What you'll build

You'll build **DocNotes**, a small document summarization tool, and wire it so every pull request gets a complete isolated environment. The app has one core flow: a signed-in user uploads a text document, an AI model summarizes it, the file is stored, and the summary is saved with the document.

The backend pieces:

1. **Managed Better Auth** for sign-in, with user data in the database's `neon_auth` schema.
2. **A Neon Function** exposing `POST /documents` (upload, summarize, store) and `GET /documents` (list the caller's documents). The function verifies the caller's JSON Web Token (JWT), calls the AI Gateway, uploads to Object Storage, and writes to Postgres.
3. **A React frontend** that signs users in and calls the function with their session token.

The workflow pieces:

1. A single `neon.ts` file declaring the backend and branch policy, which every branch inherits automatically.
2. The [Neon-Vercel integration](/docs/guides/neon-managed-vercel-integration) creating a branch per preview deployment, automatically.
3. A pull request that adds a feature, and verification that the preview has its own data, its own schema, its own users, its own function URL, its own gateway endpoint, and its own storage, none of which touches production.

```mermaid
flowchart TD
  A["Open a pull request"] --> B["Vercel creates a<br/>preview deployment"]
  B --> C["Neon forks the production<br/>branch: Postgres, Auth, Functions,<br/>AI Gateway, Object Storage"]
  C --> D["Preview build runs<br/>migrations on the branch"]
  D --> E["Review the feature against<br/>a full copy of production"]
  E --> F{Merge?}
  F -- Yes --> G["Migrate production,<br/>deploy, expire the branch"]
  F -- No --> H["Branch expires on its TTL"]
```

## Prerequisites

Before starting, make sure you have:

1. **Node.js**: Version 20 or later. Download from [nodejs.org](https://nodejs.org/).
2. **Neon Account**: Sign up for an account at [console.neon.tech](https://console.neon.tech/signup). **Neon AI Gateway requires a paid plan.** You can still follow the guide using a free plan by using your own OpenAI API key for AI calls instead of Neon AI Gateway.
3. **Neon CLI**: Installed globally (`npm i -g neon@latest`) and authenticated (`neon auth`). See the [Neon CLI Quickstart](/docs/cli/quickstart) for details.
4. **Vercel and GitHub accounts**: Sign up at [vercel.com](https://vercel.com) and [github.com](https://github.com).

<Admonition type="note" title="Beta regions">
Functions, AI Gateway, and Object Storage are in beta and currently available in AWS US East (Ohio) (`aws-us-east-2`) and AWS Europe (Frankfurt) (`aws-eu-central-1`). Support is expanding toward all regions. Create your project in one of these regions to follow along.
</Admonition>

<Steps>

## Set up the project and declare the backend

The branch-everything workflow is driven by a single file: [neon.ts](/docs/reference/neon-ts), Neon's config-as-code file. It declares the backend services you want on every branch and the policy for new branches. The Neon CLI reads this file and provisions everything it declares.

Create a new directory for the project and initialize a Vite React TypeScript app:

```bash
mkdir doc-notes && cd doc-notes
npm create vite@latest . -- --template react-ts
```

When prompted:

- Select "ESLint" for "Which linter to use?"
- Select "No" for "Install with npm and start now?"

Then install the dependencies:

```bash
npm install
```

Link the directory to your Neon project. If you don't have a project yet, `neon link` creates one:

```bash
neon link
```

You'll be prompted to select your organization, then a project. **Create a new project** named `doc-notes`. Next, select a region. Choose **AWS US East (Ohio)** (`aws-us-east-2`) or **AWS Europe (Frankfurt)** (`aws-eu-central-1`); this guide uses US East (Ohio). When asked whether to manage this project's Neon setup as code, answer **yes**. This generates a `neon.ts` file in your project root. When asked which services to declare, select all four: **Managed Better Auth, Functions, Object Storage, and AI Gateway** (press space to toggle each on, then enter to confirm):

```text
$ neon link
✔ Which organization would you like to link? › MyOrg (org-example-12345678)
✔ Which project would you like to link? › ＋ Create new project…
✔ Name for the new project: … doc-notes
✔ Which region should the new project run in? › AWS US East 2 (Ohio) (aws-us-east-2)
Created project cool-darkness-12345678 ("doc-notes") in aws-us-east-2.
Linked ~/doc-notes/.neon:
  orgId:     org-example-12345678
  projectId: cool-darkness-12345678
  branch:    main

✔ Manage this project's Neon setup as code? Adds a neon.ts you can edit and apply with `neon config apply`. … yes
✔ Which Neon services should neon.ts declare? (space to toggle, enter to confirm) › Managed Better Auth, Functions, Object Storage, AI Gateway
INFO: Created neon.ts declaring auth, functions, object-storage, ai-gateway.
```

The `neon link` command also creates a `.env.local` file with your project's variables and installs the `@neon/config` and `@neon/env` packages the config file imports.

The generated `neon.ts` declares all four services, plus some scaffolded examples: a `hello` function with a `./hello.ts` source and an `assets` bucket.

You will need to edit it to match the DocNotes backend instead. Replace the contents of `neon.ts` with the following:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Services on every branch
  auth: true,

  // Beta services, also on every branch
  preview: {
    aiGateway: true,
    buckets: {
      uploads: {},
    },
    functions: {
      api: {
        name: "DocNotes API",
        source: "./functions/api.ts",
      },
    },
  },

  // Branch policy
  branch: (branch) => {
    if (branch.isDefault) {
      // Protect and size for production
      return {
        protected: true,
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.5,
            autoscalingLimitMaxCu: 4,
          },
        },
      };
    }
    if (!branch.exists) {
      // New non-default branches: minimum compute, auto-expire
      return {
        ttl: "7d",
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25,
            autoscalingLimitMaxCu: 0.25,
          },
        },
      };
    }
    // Existing branch: no changes
    return {};
  },
});
```

> Neon Backend services are in beta, so they use the `preview` key in `neon.ts`. The `branch` key declares the policy for new branches and the default branch.

<details>
<summary>Why these branch policy choices?</summary>

- **`protected: true` on the default branch** prevents accidental deletes and resets from tooling. [Protected branches](/docs/guides/protected-branches) can't be deleted or reset without explicit confirmation.
- **`ttl: "7d"` on new branches** makes every preview disposable. If a pull request sits open for a week with no pushes, its branch and everything on it (auth, function deployments, storage namespace) expires automatically.
- **Minimum compute on new branches** keeps preview costs near zero. Copy-on-write means the branch shares storage with production until it diverges, and 0.25 CU is enough for review traffic.
- **Returning `{}` for existing branches** is deliberate: it avoids overwriting settings on branches already in use.

</details>

Then apply the configuration:

```bash
neon deploy
```

`neon deploy` (an alias of `neon config apply`, as the link prompt mentioned) provisions everything the file declares: the Auth tenant, the gateway credential, the bucket, and (once `./functions/api.ts` exists) the function deployment. It then writes the linked branch's credentials to your local `.env.local`:

```text filename=".env.local"
NEON_BRANCH=main
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
NEON_AUTH_BASE_URL=https://ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.build
NEON_AUTH_JWKS_URL=https://ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.build/jwks
NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://br-cool-darkness-a1b2c3d4-api.ai.c-2.us-east-2.aws.neon.tech
AWS_ACCESS_KEY_ID=nak_live_...
AWS_SECRET_ACCESS_KEY=nsk_live_...
AWS_ENDPOINT_URL_S3=https://br-cool-darkness-a1b2c3d4.storage.c-2.us-east-2.aws.neon.tech
AWS_REGION=us-east-2
NEON_FUNCTION_API_BASE_URL=https://br-cool-darkness-a1b2c3d4-api.compute.c-2.us-east-2.aws.neon.tech
```

Notice what these variables have in common: every URL and credential is scoped to the _linked branch_. `DATABASE_URL` points at this branch's Postgres. `NEON_AUTH_BASE_URL` is this branch's auth endpoint. `NEON_AI_GATEWAY_BASE_URL` is this branch's gateway host. `AWS_ENDPOINT_URL_S3` is this branch's storage endpoint. `NEON_FUNCTION_API_BASE_URL` is this branch's function deployment. That's the mechanism the whole workflow rides on: when Neon creates a branch for a pull request, it injects that branch's values instead, and your code doesn't change.

<Admonition type="note" title="Functions in the config">
The function source points at `./functions/api.ts`, which doesn't exist yet. You'll write it in a later step. `neon deploy` provisions the other services regardless.
</Admonition>

## See Postgres branching for yourself

Before wiring the other services, start with the foundation they all stand on: [Postgres branching](/docs/introduction/branching) itself. Everything else in this guide is this same branching behavior applied to another service, so it helps to have the base behavior concrete.

First, create a table and add a row to production so there's something to fork:

```bash shouldWrap
psql "$DATABASE_URL" -c "CREATE TABLE summaries (id serial primary key, content text, summary text)"
psql "$DATABASE_URL" -c "INSERT INTO summaries (content, summary) VALUES ('production doc', 'made in prod')"
```

Now fork production into a feature branch and point your shell at it:

```bash
neon checkout feat/branch-everything
```

`neon checkout` resolves the branch name against your project. Because `feat/branch-everything` doesn't exist yet, it offers to create it. The new branch forks from the project's default branch with the settings from your `neon.ts` policy (the 7-day TTL and minimum compute). It then pins the branch in your local `.neon` context file and pulls the branch's environment variables into `.env.local`, so `DATABASE_URL` now points at the new branch.

Run a schema migration and a write on the branch. This is exactly what happens inside a preview deployment when the build step runs migrations:

```bash shouldWrap
psql "$DATABASE_URL" -c "ALTER TABLE summaries ADD COLUMN reviewed boolean default false"
psql "$DATABASE_URL" -c "INSERT INTO summaries (content, summary, reviewed) VALUES ('branch doc', 'made on branch', true)"
```

Now check both sides. On the branch, the migration applied and the new row exists:

```bash
psql "$DATABASE_URL" -c "SELECT content, reviewed FROM summaries"
```

```text
    content     | reviewed
----------------+----------
 production doc | f
 branch doc     | t
```

Switch back to production and run the same query. The column doesn't exist there, and neither does the row:

```bash
neon checkout main
psql "$DATABASE_URL" -c "SELECT content FROM summaries"
```

```text
    content
----------------
 production doc
```

Two commands to fork, zero setup, and production is untouched by anything that happened on the branch. The branch took about a second to create because nothing was copied: the branch shares production's storage pages and only records the pages you changed (the new column, the new row).

A few related behaviors:

- **Branch from a point in time.** You can fork from the parent branch's current state or any past state, which is useful for reproducing a bug that appeared an hour ago.
- **Reset from parent.** If a long-lived branch drifts too far, you can [reset it from its parent](/docs/guides/reset-from-parent) to bring it back to the parent's current state without recreating it.
- **Deletion is safe and instant.** Deleting the branch frees only the pages it diverged. Production loses nothing.

Drop the demo table so production contains only what the app actually needs:

```bash
psql "$DATABASE_URL" -c "DROP TABLE summaries"
```

Every other service in this guide inherits this behavior: when Neon says a branch gets its own auth tenant or its own storage namespace, it's this same copy-on-write fork applied to that service.

## Create the app schema and database client

Now build the real schema for DocNotes. The `documents` table stores one row per uploaded document: who owns it, where the file lives in the bucket, and what the AI summary says. The owner is a foreign key into the `user` table that Managed Better Auth maintains in the `neon_auth` schema, which is how auth data ends up branching with your business data.

Install Drizzle ORM and the Postgres driver:

```bash
npm install drizzle-orm pg dotenv
npm install --save-dev drizzle-kit @types/pg
```

Create `drizzle.config.ts`. The `schemaFilter` includes `neon_auth` so Drizzle is aware of the auth tables Managed Better Auth maintains:

```ts filename="drizzle.config.ts"
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// The Neon CLI writes the branch's credentials to .env.local
config({ path: '.env.local' });

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  out: './drizzle',
  schema: './src/db/schema.ts',
  schemaFilter: ['public', 'neon_auth'],
});
```

Introspect the auth schema and generate the client files, then add the `documents` table:

```bash
npx drizzle-kit pull
```

This connects to your database, inspects its structure, and generates Drizzle schema definitions for the `neon_auth` tables in the `drizzle` folder. Copy the generated files into `src/db/`:

```bash
mkdir -p src/db && cp drizzle/schema.ts drizzle/relations.ts src/db/
```

Then append your table to `src/db/schema.ts`:

```ts filename="src/db/schema.ts"
import {
  pgTable,
  pgSchema,
  uuid,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const neonAuth = pgSchema('neon_auth');

// ... Managed Better Auth table definitions from drizzle-kit pull ...

export const userInNeonAuth = neonAuth.table('user', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  email: text().notNull(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const documents = pgTable('documents', {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => userInNeonAuth.id),
  filename: text('filename').notNull(),
  objectKey: text('object_key').notNull(),
  summary: text('summary').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Document = typeof documents.$inferSelect;
```

Generate and apply the migration:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

The `documents` table now exists on your linked branch. Verify it:

```bash
psql "$DATABASE_URL" -c "\d documents"
```

```text
                              Table "public.documents"
   Column   |           Type             | Nullable |           Default
------------+----------------------------+----------+------------------------------
 id         | uuid                       | not null | gen_random_uuid()
 user_id    | uuid                       | not null |
 filename   | text                       | not null |
 object_key | text                       | not null |
 summary    | text                       | not null |
 created_at | timestamp with time zone   |          | now()
Indexes:
    "documents_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "documents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES neon_auth.user(id)
```

Note the foreign key: `documents.user_id` references `neon_auth.user(id)`. Your business data and your auth data live in the same database, which is exactly why both fork together.

## Build the function that uses every service

Now write the function declared in `neon.ts`. This single handler demonstrates why branch scoping matters: it verifies the caller's JWT against the branch's auth tenant, reads and writes the branch's database, calls an AI model through the branch's gateway endpoint, and uploads to the branch's storage namespace.

Install the dependencies:

```bash
npm install @neon/functions hono jose openai @aws-sdk/client-s3
```

Create `functions/api.ts`:

```ts filename="functions/api.ts"
import { Hono, type Context, type Next } from 'hono';
import { cors } from 'hono/cors';
import { attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as jose from 'jose';
import OpenAI from 'openai';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { documents } from '../src/db/schema';
import { eq } from 'drizzle-orm';

type AppVariables = { userId: string };

const app = new Hono<{ Variables: AppVariables }>();

// The frontend is a separate SPA, so browser requests are cross-origin.
// Reflect the request origin; tighten this for production.
app.use(
  '/*',
  cors({
    origin: (origin) => origin,
    allowMethods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Postgres: a long-lived pool created once at module scope.
// attachDatabasePool prevents unhandled errors when the pooler
// reclaims idle connections (scale-to-zero, TCP resets).
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);
const db = drizzle(pool);

// Auth: JWTs are verified against this branch's JWKS endpoint.
// The issuer must match this branch's Auth API URL, so a token
// issued by another branch fails verification here.
const JWKS = jose.createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!));

const authMiddleware = async (
  c: Context<{ Variables: AppVariables }>,
  next: Next,
) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing token' }, 401);
  }
  const token = authHeader.split(' ')[1];

  try {
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: new URL(process.env.NEON_AUTH_BASE_URL!).origin,
    });
    if (!payload.sub) {
      return c.json({ error: 'Unauthorized: Invalid token subject' }, 401);
    }
    c.set('userId', payload.sub);
    await next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return c.json({ error: 'Unauthorized: Token verification failed' }, 401);
  }
};

// AI Gateway: OpenAI-compatible endpoint on this branch's host,
// authenticated with this branch's credential. No provider keys.
const ai = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

// Object Storage: S3-compatible client pointed at this branch's
// storage endpoint with this branch's credentials.
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

app.use('/documents*', authMiddleware);

app.post('/documents', async (c) => {
  const userId = c.get('userId');

  const form = await c.req.formData();
  const file = form.get('file') as File;
  if (!file) return c.json({ error: 'Missing file' }, 400);
  const content = await file.text();

  // Store the file in this branch's bucket namespace
  const objectKey = `documents/${userId}/${crypto.randomUUID()}.txt`;
  await s3.send(
    new PutObjectCommand({
      Bucket: 'uploads',
      Key: objectKey,
      Body: content,
      ContentType: file.type || 'text/plain',
    }),
  );

  // Summarize through this branch's gateway endpoint
  const response = await ai.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [
      { role: 'user', content: `Summarize this document:\n\n${content}` },
    ],
  });
  const summary = response.choices[0].message.content ?? '';

  // Record it in this branch's database
  const [row] = await db
    .insert(documents)
    .values({ userId, filename: file.name, objectKey, summary })
    .returning();

  return c.json(row, 201);
});

app.get('/documents', async (c) => {
  const userId = c.get('userId');
  const rows = await db
    .select()
    .from(documents)
    .where(eq(documents.userId, userId));
  return c.json(rows);
});

export default app;
```

Three things in this file stand out:

- **Nothing knows about environments.** There are no conditionals for "is this production?". Every `process.env` value was injected by Neon for the branch this function runs on. The same code serves production and every preview.
- **The auth middleware is branch-scoped by construction.** It verifies tokens against `NEON_AUTH_JWKS_URL` and checks the issuer against `NEON_AUTH_BASE_URL`. Both values are per branch, so a token minted by the production auth tenant is rejected by a preview function, and vice versa. You get cross-environment token confusion protection for free, without writing any of it.
- **The pool is long-lived.** Functions keep running across requests, so use a `pg` `Pool` created once at module scope, not the serverless driver. `attachDatabasePool` swallows expected idle disconnects so the isolate doesn't exit on a scale-to-zero reclaim.

Deploy it:

```bash
neon deploy
```

The CLI bundles `functions/api.ts` with esbuild, uploads it, and deploys it to the linked branch. Get the function's public URL:

```bash
neon functions get api
```

```yaml
id: api
slug: api
name: DocNotes API
invocation_url: https://br-cool-darkness-a1b2c3d4-api.compute.c-2.us-east-2.aws.neon.tech/
current_deployment:
  id: 1
  status: completed
  runtime: nodejs24
active_deployment:
  id: 1
  status: completed
  runtime: nodejs24
```

Note the URL structure: `br-cool-darkness-a1b2c3d4` is the branch ID. Every branch that deploys this function gets its own URL containing its own branch ID.

Test the middleware while you iterate locally with hot reload:

```bash
neon dev
```

The dev server prints a local URL for the function. An unauthenticated request should be rejected:

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8787/documents
```

```text
401
```

The middleware is working. In the next step you'll build the React frontend that supplies real tokens.

## Wire up the React frontend

The frontend is a Vite single-page app. It signs users in through Managed Better Auth and calls the function directly with the session token. Since the app and the function run on different origins, the browser makes cross-origin requests, which is why the function sets CORS headers.

Install the auth packages and React Router:

```bash
npm install @neondatabase/neon-js @neondatabase/auth-ui react-router
npm install tailwindcss @tailwindcss/vite
```

The DocNotes UI uses Tailwind classes. Add the Tailwind Vite plugin to `vite.config.ts`:

```ts filename="vite.config.ts"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // [!code ++]

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // [!code ++]
  ],
});
```

Add the Tailwind imports to `src/index.css`, replacing the template's contents:

```css filename="src/index.css"
@import 'tailwindcss';
```

Create the auth client in `src/neon.ts`:

```ts filename="src/neon.ts"
import { createAuthClient } from '@neondatabase/neon-js/auth';

export const authClient = createAuthClient(
  import.meta.env.VITE_NEON_AUTH_URL,
);
```

The `VITE_NEON_AUTH_URL` variable points at the branch's auth endpoint. Vite only exposes variables prefixed with `VITE_` to client code, so add the frontend's variables to `.env.local`:

```text filename=".env.local" {2}
NEON_AUTH_BASE_URL=https://ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.build
VITE_NEON_AUTH_URL=https://ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.build
VITE_NEON_FUNCTION_API_BASE_URL=https://br-cool-darkness-a1b2c3d4-api.compute.c-2.us-east-2.aws.neon.tech
```

<Admonition type="note" title="Where NEON_FUNCTION_API_BASE_URL comes from">
`neon deploy` already wrote a public invocation URL for each declared function to `.env.local` as `NEON_FUNCTION_<SLUG>_BASE_URL`; that's the `NEON_FUNCTION_API_BASE_URL` shown here. Running `neon env pull` refreshes the branch's variables on demand. Copy the value to `VITE_NEON_FUNCTION_API_BASE_URL` for the frontend to use. Like every other variable in `.env.local`, it's scoped to the linked branch. On a preview deployment, the Vercel integration injects the preview branch's values for all of these variables, including the `VITE_` aliases, so the frontend always talks to its own branch.
</Admonition>

Update the app entry point in `src/main.tsx` to wrap the app in `NeonAuthUIProvider` and `BrowserRouter`:

```tsx filename="src/main.tsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { NeonAuthUIProvider } from '@neondatabase/auth-ui';
import App from './App.tsx';
import { authClient } from './neon';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NeonAuthUIProvider authClient={authClient} emailOTP>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NeonAuthUIProvider>
  </StrictMode>,
);
```

The `emailOTP` prop enables one-time-code sign-in in the pre-built UI. Make sure the project allows it too: in the Neon Console, open **Settings → Auth** and enable **Sign-up and Sign-in with Email**. Neon then delivers the one-time code by email.

Create `src/api.ts`. This helper fetches the session's JWT and attaches it to every request to the function:

```ts filename="src/api.ts"
import { authClient } from './neon';

const API_URL = import.meta.env.VITE_NEON_FUNCTION_API_BASE_URL;

export const api = {
  request: async (endpoint: string, options: RequestInit = {}) => {
    const { data } = await authClient.getSession();
    const token = data?.session?.token;

    if (!token) {
      throw new Error('No active session');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  getDocuments: () => api.request('/documents'),

  uploadDocument: (formData: FormData) =>
    api.request('/documents', {
      method: 'POST',
      body: formData,
    }),

  toggleStar: (id: string) =>
    api.request(`/documents/${id}`, { method: 'PATCH' }),
};
```

Now the app itself. Replace `src/App.tsx` with the DocNotes UI: a sign-in gate, an upload form, and the document list:

```tsx filename="src/App.tsx"
import { useEffect, useState } from 'react';
import {
  AuthView,
  RedirectToSignIn,
  SignedIn,
} from '@neondatabase/auth-ui';
import { api } from './api';
import { Route, Routes, useParams } from 'react-router';

type Document = {
  id: string;
  filename: string;
  summary: string;
  starred?: boolean;
};

function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);

  const refresh = () => {
    api
      .getDocuments()
      .then(setDocuments)
      .catch(console.error);
  };

  useEffect(refresh, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    await api.uploadDocument(data);
    form.reset();
    refresh();
  };

  const toggleStar = async (doc: Document) => {
    const updated = await api.toggleStar(doc.id);
    setDocuments(
      documents.map((d) => (d.id === doc.id ? updated : d)),
    );
  };

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-8">
      <h1 className="text-2xl font-bold">DocNotes</h1>

      <SignedIn>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="file" name="file" accept=".txt" required />
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Upload and summarize
          </button>
        </form>

        <ul className="space-y-4">
          {documents.map((doc) => (
            <li key={doc.id} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{doc.filename}</p>
                <button onClick={() => toggleStar(doc)} aria-label="Star">
                  {doc.starred ? '★' : '☆'}
                </button>
              </div>
              <p className="text-sm text-gray-600">{doc.summary}</p>
            </li>
          ))}
        </ul>
      </SignedIn>

      <RedirectToSignIn />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Documents />} />
      <Route path="/auth/:pathname" element={<AuthViewWrapper />} />
    </Routes>
  );
}

// AuthView needs the current pathname (for example, sign-in or sign-up),
// which it reads from the route parameter.
function AuthViewWrapper() {
  const { pathname } = useParams();
  return <AuthView pathname={pathname} />;
}
```

Run the app locally and test the full flow:

```bash
npm run dev
```

1. Open `http://localhost:5173`. You're redirected to the sign-in page.
2. Sign up with an email address you can check. Neon emails you a one-time code; enter it to finish signing in.
3. Upload a text file. You should see the AI-generated summary appear in the list.

The whole stack just ran against your local checkout of `main`: the auth tenant, the function, the gateway call, and the bucket were all the `main` branch's own.

## Configure auth domains for previews

Managed Better Auth needs to know which domains it should accept, because your preview deployments live on different URLs than production. There are two pieces.

First, add your production domain. In the Neon Console, navigate to **Auth → Configuration**, then under **Domains**, add your production URL (for example, `https://doc-notes.vercel.app`) and click **Add Domain**.

Second, decide how preview origins are trusted. If you connect the project through the Neon-Vercel integration in the next step, it provisions a dedicated Auth API endpoint per preview branch and manages preview domains for you (see the note below). For any other setup, or if you want previews working before you connect Vercel, add a wildcard trusted domain instead. Vercel generates a new hostname per preview, such as `https://doc-notes-git-feature-abc123.vercel.app`, and you don't want to register each one by hand.

Follow [configure trusted domains](/docs/auth/guides/configure-domains) to add a pattern such as `https://*.vercel.app`. Registering domains here is what lets sign-in work from a given origin. The function's CORS middleware already reflects any origin, so tighten it to an allowlist of your hosts before going to production.

<Admonition type="info" title="The Vercel integration handles the rest">
When you use the Neon-Vercel integration with Auth enabled (next step), it provisions a dedicated Auth API endpoint per preview branch and injects that endpoint into the preview's environment variables automatically. You configure production domains once; preview domains are managed for you. For OAuth providers like Google, register the branch callback URLs as described in [branches and preview deployments](/docs/auth/guides/setup-oauth#branches-and-preview-deployments).
</Admonition>

## Connect Vercel for branch-per-PR previews

Now connect Vercel so every pull request automatically gets a branch with all of the above.

1. Open the [Neon integration on the Vercel Marketplace](https://vercel.com/marketplace/neon) and click **Install**.
2. Link your Neon account and select the project you configured with `neon.ts`.
3. In the Connect Project modal, enable **Create Database Branch for Deployment** for **Preview** deployments.
4. Make sure **Resource must be active before deployment** is also on, so Vercel waits for the branch to be ready.

From now on, the workflow is automatic:

1. You open a pull request.
2. Vercel creates a preview deployment and sends a webhook to Neon.
3. Neon creates a branch named `preview/<git-branch>` from production and injects that branch's `DATABASE_URL`, `NEON_AUTH_BASE_URL`, and other variables into the preview environment for that deployment.
4. Because your `neon.ts` declares `auth`, `aiGateway`, `buckets`, and `functions`, the new branch gets its own auth tenant, gateway endpoint, storage namespace, and function deployments too.
5. You review the pull request against a complete, isolated copy of production.
6. When you merge or close the pull request, the branch is cleaned up (more on cleanup timing in the final step).

One more piece of wiring: run migrations as part of the preview build so the branch's schema matches the PR's code. In **Vercel Dashboard → Settings → Build and Deployment Settings**, override the build command:

```bash shouldWrap
npx drizzle-kit migrate && npm run build
```

This is the piece that makes schema changes reviewable: every push to the PR applies the migrations to the preview branch only, so the reviewer always sees the feature against a schema that matches the code.

## Test branch-everything with a pull request

Time to see the whole thing work. You'll add a small feature to DocNotes: the ability to star a document. It touches two layers of the backend and one of the frontend, which makes it a good isolation test:

1. **Schema:** a `starred boolean` column on `documents`.
2. **Function:** a `PATCH /documents/:id` route to toggle the star.
3. **UI:** the star button in `src/App.tsx` calls the new route; it's already in the code you wrote, it just had nothing to call until now.

Start from your production branch:

```bash
neon checkout main
git checkout -b feat/star-documents
```

Make the schema change in `src/db/schema.ts`:

```ts
export const documents = pgTable('documents', {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => userInNeonAuth.id),
  filename: text('filename').notNull(),
  objectKey: text('object_key').notNull(),
  summary: text('summary').notNull(),
  starred: boolean('starred').notNull().default(false), // [!code ++]
  createdAt: timestamp('created_at').defaultNow(),
});
```

Generate the migration file locally (don't apply it; the preview build will):

```bash
npx drizzle-kit generate
```

Add the route to `functions/api.ts`:

```ts filename="functions/api.ts" {3}
app.patch('/documents/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');

  const [existing] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id));
  if (!existing || existing.userId !== userId) {
    return c.json({ error: 'Not found' }, 404);
  }

  const [row] = await db
    .update(documents)
    .set({ starred: !existing.starred })
    .where(eq(documents.id, id))
    .returning();
  return c.json(row);
});
```

The star button is already in the frontend you built (the `toggleStar` helper in `src/api.ts` and the button in `src/App.tsx`), so the UI work here is done. Commit, push, and open a pull request:

```bash
git add . && git commit -m "feat: star documents"
git push origin feat/star-documents
```

When you open the pull request, the machinery you set up takes over:

1. Vercel builds a preview deployment for `feat/star-documents`.
2. Neon creates branch `preview/feat-star-documents` from production, forked at that instant: production's rows, production's users, production's uploaded objects, production's function code.
3. The preview build runs `npx drizzle-kit migrate` against the preview branch's `DATABASE_URL`, adding the `starred` column to the preview's database only.
4. The preview's function is deployed from the PR's code to the preview branch, at the preview branch's URL.
5. The preview environment's variables all point at the preview branch: `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AI_GATEWAY_BASE_URL`, `AWS_ENDPOINT_URL_S3`, `NEON_FUNCTION_API_BASE_URL`, and the `VITE_` variables the frontend reads.

Open the preview URL and verify the feature works end to end:

1. Sign in with an email address you can check; enter the one-time code Neon emails you. You can also sign in with a production account, because the branch inherited production's users.
2. Upload a document and confirm the summary appears.
3. Click the star button. The document is starred.

Now verify each layer is isolated.

**Data and schema.** Check the production branch's `documents` table in the Neon Console. The `starred` column doesn't exist there, and neither do the rows you created in the preview. The migration ran against the preview branch only.

**Users.** In the Neon Console, select the preview branch and navigate to **Auth → Users**: your test account is there. Switch to the production branch's **Auth → Users**: it isn't. The test signup created a user in the preview's auth tenant only.

**Tokens don't cross branches.** Copy a session token from the preview (from your browser's cookies or a request header) and call the production function URL with it:

```bash shouldWrap
curl -s -o /dev/null -w "%{http_code}" https://<production-function-url>/documents \
  -H "Authorization: Bearer <preview-session-token>"
```

```text
401
```

The production function rejects it. The token was issued by the preview branch's auth tenant, with the preview branch's issuer. The same check works in reverse: a production token fails verification at a preview function, too.

**Function URL.** The preview's function requests hit a URL containing the preview branch ID, not the production deployment. You can confirm in the function's logs in the Neon Console: select the preview branch, open **Functions**, and you'll see the preview's `api` deployment serving the preview's traffic.

**AI endpoint, shared account quota.** The preview calls the gateway through the preview branch's endpoint using a credential valid in that branch's lineage, so you can test prompts and models without touching production code or credentials. Usage still counts against the same account-level tokens-per-minute limit and daily spend cap, so a runaway preview can still exhaust quota for production.

**Storage.** Upload a file in the preview, then check the production branch's bucket in the Neon Console: the object only exists on the preview branch's namespace. The bucket forked copy-on-write at branch time, so the preview can even read production's existing documents, but anything it writes stays on the preview.

## Merge, promote, and clean up

When the review passes, merge the pull request. Two things need to happen: the migration applies to production, and the preview branch goes away.

**Promote the migration to production.** When Vercel deploys the merged code to production, the same build command runs `npx drizzle-kit migrate` against the production `DATABASE_URL`. The migration you rehearsed on the preview branch on every push now applies to production, already proven against a branch forked from production's data.

**Verify the feature in production.** Once the production deployment finishes, open your production URL, sign in, and star a document. The `starred` column now exists on the production database, and the production function deployment serves the new route.

**Clean up the preview branch.** Preview branches are deleted when their Vercel deployments are removed, but Vercel's default deployment retention keeps preview deployments around for months, which means preview branches can linger. To clean up the branch as soon as the PR closes, add Neon's [`delete-branch-action`](https://github.com/neondatabase/delete-branch-action) to your repository:

```yaml filename=".github/workflows/cleanup-preview-branch.yml"
name: Cleanup Neon preview branch
on:
  pull_request:
    types: [closed]
jobs:
  delete-branch:
    runs-on: ubuntu-latest
    steps:
      - uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch: preview/${{ github.head_ref }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

The Vercel integration creates branches using the `preview/<git-branch>` naming pattern, so this action targets the same branches the integration creates. Deleting the branch removes everything attached to it: the auth tenant, the function deployments, the storage namespace, and any diverged data. This workflow requires a `NEON_PROJECT_ID` repository variable and a `NEON_API_KEY` repository secret. It's also safe to run alongside Vercel's own cleanup; if the action deletes the branch first, the later cleanup webhook finds it already gone and handles it gracefully.

**Delete the local feature branch too.** The `feat/branch-everything` branch you created in the [Postgres branching demo](#see-postgres-branching-for-yourself) still exists:

```bash
neon branches delete feat/branch-everything
```

</Steps>

## Summary

Neon collapses the whole backend into a single primitive: the branch. Lakebase Postgres, Auth, Functions, AI Gateway, and Object Storage all fork together with it and disappear together when the branch expires. Postgres and Object Storage fork copy-on-write; the other services get branch-scoped endpoints and credentials. One `neon.ts` file declares the environment, the Vercel integration forks it per pull request, and the TTL cleans it up. Previews run against production's real data on near-zero-cost compute, and the protected production branch stays out of reach of the whole workflow.

Two caveats while Functions, AI Gateway, and Object Storage are in beta: they're limited to the two supported regions, and some limits are beta-specific. Check the [Functions](/docs/compute/functions/overview), [AI Gateway](/docs/ai-gateway/overview), and [Object Storage](/docs/storage/overview) overviews for current status and limits.

## Next steps

The setup here is a starting point. A few directions to take it further:

- **Show schema changes in the PR.** Add Neon's [`schema-diff-action`](https://github.com/neondatabase/schema-diff-action) to your pull request workflow to post a comment summarizing the schema changes between the preview branch and production. Reviewers see the exact SQL that will hit production before it does.
- **Run E2E tests against the preview.** The preview branch's connection details are injected as environment variables, so your end-to-end suite can run against a fresh fork of production on every push. See [Automated E2E Testing with Neon Branching and Playwright](/guides/e2e-playwright-tests-with-neon-branching).
- **Not on Vercel?** The per-PR branch creation here comes from the Neon-Vercel integration, but you can get the same workflow with GitHub Actions on any platform. See [Automated Database Branching with GitHub Actions](/guides/neon-github-actions-authomated-branching).

## Resources

- [Branching](/docs/introduction/branching)
- [Branching authentication](/docs/auth/branching-authentication)
- [`neon.ts` reference](/docs/reference/neon-ts)
- [Neon-Vercel integration](/docs/guides/neon-managed-vercel-integration)
- [Managing Vercel preview branch cleanup](/docs/guides/vercel-branch-cleanup)
- [Testing Auth changes safely with Vercel and Neon Branching](/guides/vercel-neon-auth-branching)
- [Automated Database Branching with GitHub Actions](/guides/neon-github-actions-authomated-branching)
- [Automated E2E Testing with Neon Branching and Playwright](/guides/e2e-playwright-tests-with-neon-branching)

<NeedHelp/>
