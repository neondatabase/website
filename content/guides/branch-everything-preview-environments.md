---
title: 'Branch everything: fully isolated preview environments on Neon'
subtitle: 'Give every pull request its own production-like copy of your entire backend: Lakebase Postgres, Managed Better Auth, Functions, AI Gateway, and Object Storage'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-09-07T00:00:00.000Z'
updatedOn: '2026-09-10T13:55:57.516Z'
---

If you're building an application with a real backend (a database, authentication, serverless functions, AI, and file storage), a preview deployment that only deploys your code doesn't tell you much about how the change will behave in production. The preview runs your new code, but everything behind that code is still shared with production. So every time you click through a feature to review it, your test actions land in the same systems your real users depend on:

1. **Database**: A test write during review ends up in your production tables, right next to your real data.
2. **Auth**: A test signup during review creates a real user in your production user base.
3. **Functions**: The preview invokes your production serverless functions.
4. **AI**: Preview AI requests use the same API credentials as production.
5. **Storage**: A file you upload in a preview lands in a production bucket.

Each one is a problem on its own, but together they make the preview environment untrustworthy. You can't test a feature without touching production, and you can't test multiple features at once because they collide on the same data.

The usual fix is a shared staging environment. But if you've maintained one, you know the problems: it drifts out of sync with production the moment someone deploys to it manually, everyone's tests collide on the same data, and someone has to keep the whole thing running.

[Neon](/docs/introduction) takes a different approach. On Neon, you can branch your database the same way you branch your code, and everything Neon offers (Managed Better Auth, Functions, AI Gateway, and Object Storage) branches with it.

In this guide, you'll build a small document summarization app and wire it up so every pull request gets a complete isolated environment. Every branch has its own copy of your production data, its own auth, its own function deployments, its own AI credentials, and its own storage namespace. You can review features against a full copy of production without touching production at all.

<CopyPrompt
  src="/prompts/branch-everything-preview-environments-prompt.md"
  description="Use this prompt to customize the guide and build it with your AI agent."
  buttonText="Copy prompt"
/>

## What is branching?

If you've used Git, [database branching](/docs/introduction/branching) will feel familiar. A Neon branch is a fork of your production database at a point in time. Branches are built on **copy-on-write**: instead of duplicating data, the branch shares storage with its parent and only records the changes made after the fork, so creating one takes about a second and costs almost nothing. And because the branch starts as an exact copy of production, you're reviewing against your real data.

Database branching solves the data problem, but most applications also have an auth provider, serverless functions, AI calls, and file storage. On Neon, everything branches together: every branch gets its own copy of every service, isolated from the parent and from other branches:

| Service                                                | What the branch gets                                                                            |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **[Lakebase Postgres](/docs/postgres/overview)**       | A copy-on-write clone of your data, isolated from the parent                                    |
| **[Managed Better Auth](/docs/auth/overview)**         | Its own auth: users, sessions, and config in the `neon_auth` schema, with a unique Auth API URL |
| **[Neon Functions](/docs/compute/functions/overview)** | Its own function deployments at branch-scoped URLs, with branch-scoped env vars                 |
| **[Neon AI Gateway](/docs/ai-gateway/overview)**       | Its own gateway endpoint, with credentials bound to the branch and its descendants              |
| **[Neon Object Storage](/docs/storage/overview)**      | Its own storage namespace: buckets and objects cloned copy-on-write at fork time                |

Every service in the table inherits from the parent at fork time and is scoped to the branch: auth tokens issued on one branch are invalid on another, function URLs contain the branch ID, and storage credentials point at the branch's endpoint. A branch has your production schema, rows, users, and files.

## What you'll build

You'll build **DocNotes**, a small document summarization tool, and wire it so every pull request gets a complete isolated environment. The app has one core flow: a signed-in user uploads a text document, an AI model summarizes it, and the app stores the file and saves the summary with the document.

The backend pieces:

1. **Managed Better Auth** for sign-in, with user data in the database's `neon_auth` schema.
2. **A Neon Function** exposing `POST /documents` (upload, summarize, store) and `GET /documents` (list the caller's documents). The function verifies the caller's JSON Web Token (JWT), calls the AI Gateway, uploads to Object Storage, and writes to Postgres.
3. **A React frontend** (a Vite single-page app) that signs users in and calls the function with their session token.

The workflow pieces:

1. A single `neon.ts` file declaring the backend services and branch policy, which the Neon CLI uses to provision every branch automatically.
2. Two GitHub Actions workflows that automate the whole loop: for every pull request, they create a preview branch, deploy the function from the PR's code, run migrations, and deploy the frontend to Vercel. When you merge, they promote the changes to production and delete the preview branch.

```mermaid
flowchart TD
  A["Open a pull request"] --> B["Preview workflow creates a<br/>Neon branch from production"]
  B --> C["neon deploy applies neon.ts:<br/>Auth, Functions, AI Gateway,<br/>Object Storage"]
  C --> D["Migrate, build, and deploy<br/>the preview to Vercel"]
  D --> E["Review the feature against<br/>a full copy of production"]
  E --> F{Merge?}
  F -- Yes --> G["Production workflow migrates<br/>and deploys; workflow deletes<br/>the preview branch"]
  F -- No --> H["Close the PR: workflow deletes<br/>the branch, TTL as backstop"]
```

## Prerequisites

Before starting, make sure you have:

1. **Node.js**: Version 22 or later. Download from [nodejs.org](https://nodejs.org/).
2. **Neon Account**: Sign up for an account at [console.neon.tech](https://console.neon.tech/signup). AI Gateway requires a paid plan.
3. **Neon CLI**: Installed globally (`npm i -g neon@latest`) and authenticated (`neon auth`). See the [Neon CLI Quickstart](/docs/cli/quickstart) for details.
4. **GitHub account and repository**: Sign up at [github.com](https://github.com) and create a new repository for the project. The workflows will run on this repository.
5. **Vercel account**: Sign up at [vercel.com](https://vercel.com). The frontend will be deployed to Vercel for every branch.
6. **Vercel CLI**: Installed globally (`npm i -g vercel@latest`) and authenticated (`vercel login`). See the [Vercel CLI Quickstart](https://vercel.com/docs/cli) for details.

<Admonition type="note" title="Beta regions">
Functions, AI Gateway, and Object Storage are in beta and currently available in AWS US East (Ohio) (`aws-us-east-2`) and AWS Europe (Frankfurt) (`aws-eu-central-1`). Support is expanding toward all regions. Create your project in one of these regions to follow along.
</Admonition>

<Steps>

## Set up the project and declare the backend

You'll start by creating a new Vite React project and linking it to a Neon project. The `neon.ts` file you'll create declares the backend services and branch policy, which the Neon CLI uses to provision every branch automatically.

Create the project directory and initialize it:

```bash
mkdir doc-notes && cd doc-notes
npm create vite@latest . -- --template react-ts
```

When prompted:

- Select "ESLint" for the Linter.
- Select "No" for "Install with npm and start now?"

Then install the dependencies:

```bash
npm install
```

Link the directory to your Neon project by running:

```bash
neon link
```

You'll be prompted to select your organization, then a project. **Create a new project** named `doc-notes`. Next, select a region. Choose **AWS US East (Ohio)** (`aws-us-east-2`) or **AWS Europe (Frankfurt)** (`aws-eu-central-1`); this guide uses US East (Ohio).

When prompted to manage the project as code, select **Yes**. This creates a `neon.ts` file in your project root. Finally, when asked which Neon services you require, select **Auth**, **Functions**, **Object Storage**, and **AI Gateway**.

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
```

The `neon link` command also creates a `.env.local` file with your project's variables.

Replace the contents of `neon.ts` with the following. It declares the backend services and branch policy for every branch:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  preview: {
    aiGateway: true,
    buckets: {
      uploads: {},
    },
    functions: {
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
    // Size for disposable preview and set a 7-day TTL
    return {
      ttl: "7d",
      postgres: {
        computeSettings: {
          autoscalingLimitMinCu: 0.25,
          autoscalingLimitMaxCu: 0.25,
        },
      },
    };
  },
});
```

The `preview` section declares the beta services (AI Gateway, Object Storage, and Functions). You'll define the function source in a later step. The `branch` section declares the policy for every branch: the default branch is protected and sized for production, and every other branch is a disposable preview with minimum compute and a 7-day TTL.

<details>
<summary>Why these branch policy choices?</summary>

The policy is designed to make every branch a safe, disposable preview environment:

- **`protected: true` on the default branch** stops tooling from deleting or resetting it by accident. [Protected branches](/docs/guides/protected-branches) can't be deleted or reset without explicit confirmation.
- **`ttl: "7d"` on every non-default branch** makes every preview disposable. If a pull request sits open for a week with no pushes, its branch and everything on it (auth, function deployments, storage namespace) expires automatically.
- **Minimum compute on non-default branches** keeps preview costs near zero.

</details>

Save the file and apply it to provision the services and write the branch's environment variables to `.env.local`:

```bash
neon deploy
```

<Admonition type="note" title="Update existing branches">
If you followed the steps in this guide, the default branch was created with Neon's default compute settings, which differ from your `neon.ts` policy. The CLI detects that mismatch and, because `neon deploy` won't silently overwrite settings that are already set, it fails. To apply your `neon.ts` configuration to the existing branch, run:

```bash
neon deploy --update-existing
```

This updates the existing branch's settings to match `neon.ts`.
</Admonition>

After `neon deploy` completes, the CLI creates an `.env.local` file in your project root. It contains the branch's environment variables, which your code will use to connect to the backend services:

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

You can see what these variables have in common: every URL and credential is scoped to the _linked branch_. `DATABASE_URL` points at this branch's Postgres. `NEON_AUTH_BASE_URL` is this branch's auth endpoint. `NEON_AI_GATEWAY_BASE_URL` is this branch's gateway host. `AWS_ENDPOINT_URL_S3` is this branch's storage endpoint. `NEON_FUNCTION_API_BASE_URL` is this branch's function deployment. This is exactly what makes every branch a complete, isolated preview environment: the code running on a branch only sees the services for that branch.

## Branch production into a feature branch

To demonstrate how branching works, you'll create a demo table on production, branch it into a feature branch, and make changes on the branch. The changes will be isolated to the branch and won't affect production.

Run the following commands to create a demo table and insert a row on production:

```bash shouldWrap
# Load the branch's environment variables into your shell
set -a && source .env.local && set +a

psql "$DATABASE_URL" -c "CREATE TABLE summaries (id serial primary key, content text, summary text)"
psql "$DATABASE_URL" -c "INSERT INTO summaries (content, summary) VALUES ('production doc', 'made in prod')"
```

Now branch production into a feature branch:

```bash
neon checkout feat/branch-everything
```

<Admonition type="note" title="Create the branch when prompted">
When prompted to create the branch, click **Yes**.
</Admonition>

`neon checkout` creates a new branch named `feat/branch-everything` and updates your `.env.local` file with the new branch's variables. The branch is a copy-on-write fork of production, so it shares storage with production and only records changes made on the branch. It follows the branch policy you declared in `neon.ts`: it has a 7-day TTL and minimum compute.

Run the following commands to add a new column and insert a row on this branch. The changes will be recorded on the branch and won't affect production.

```bash shouldWrap
set -a && source .env.local && set +a

psql "$DATABASE_URL" -c "ALTER TABLE summaries ADD COLUMN reviewed boolean default false"
psql "$DATABASE_URL" -c "INSERT INTO summaries (content, summary, reviewed) VALUES ('branch doc', 'made on branch', true)"
```

Verify the changes on the branch:

```bash
psql "$DATABASE_URL" -c "SELECT content, reviewed FROM summaries"
```

You should see the new column and the new row:

```text
    content         | reviewed
----------------+----------
 production doc | f
 branch doc     | t
```

Now switch back to the `main` branch and verify that production is untouched:

```bash
neon checkout main
set -a && source .env.local && set +a
psql "$DATABASE_URL" -c "SELECT content FROM summaries"
```

You should see only the original row:

```text
    content
----------------
 production doc
```

You've just demonstrated the core behavior of Neon branching: the feature branch has its own copy of the data, isolated from production. Changes made on the branch don't affect production, and production remains unchanged.

You can clean up the demo table on production by running:

```bash
psql "$DATABASE_URL" -c "DROP TABLE summaries"
```

In a similar way, every other service on Neon branches with your database. Every branch has its own auth, function deployments, AI credentials, and storage namespace.

## Create the app schema and database client

Now you'll build the backend for DocNotes. The app has a single table, `documents`, which stores uploaded documents and their AI summaries. Each document belongs to a user in the `user` table that Managed Better Auth maintains in the `neon_auth` schema.

Install Drizzle ORM and the Postgres driver:

```bash
npm install drizzle-orm pg dotenv
npm install --save-dev drizzle-kit @types/pg
```

### Set up Drizzle ORM

Create `drizzle.config.ts` in the project root:

```ts filename="drizzle.config.ts"
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  out: './drizzle',
  schema: './src/db/schema.ts',
  schemaFilter: ['public', 'neon_auth'],
});
```

This config tells Drizzle Kit where to find your schema, where to output migration files, and how to connect to the database. The `schemaFilter` option ensures that Drizzle introspects both the `public` schema (for your app tables) and the `neon_auth` schema (for Managed Better Auth tables).

### Pull the Managed Better Auth schema

Managed Better Auth automatically creates and maintains Better Auth tables in the `neon_auth` schema. Since these tables reside in your Neon database, you can work with them directly using SQL queries or any Postgres-compatible ORM, including defining foreign key relationships.

To integrate the Managed Better Auth tables into your Drizzle ORM setup, you need to introspect the existing `neon_auth` schema and generate the corresponding Drizzle schema definitions.

This step makes Drizzle aware of the auth tables, allowing you to create relationships between your application data (like the `documents` table) and the user data managed by Managed Better Auth.

1.  **Introspect the database:**
    Run the Drizzle Kit `pull` command to generate schema files based on your existing database tables:

    ```bash
    npx drizzle-kit pull
    ```

    This command connects to your database (using the `DATABASE_URL` loaded from `.env.local`), inspects its structure, and creates `schema.ts` and `relations.ts` files inside a new `drizzle` folder. These files contain the Drizzle schema definitions for the Managed Better Auth tables.

2.  **Organize schema files:**
    Create a new directory `src/db`, then move the generated `schema.ts` and `relations.ts` files from the `drizzle` directory to `src/db/schema.ts` and `src/db/relations.ts` respectively:

    ```bash
    mkdir -p src/db && mv drizzle/schema.ts drizzle/relations.ts src/db/
    ```

    Your project structure should now look like this:

    ```text
     ├ 📂 drizzle
     │ ├ 📂 meta
     │ ├ 📜 schema.ts ───────────┐
     │ └ 📜 relations.ts ────────┤
     ├ 📂 src                    │
     │ ├ 📂 db                   │
     │ │ ├ 📜 relations.ts <─────┤
     │ │ └ 📜 schema.ts <────────┘
     │ └ 📜 App.tsx
     └ …
    ```

3.  **Add the documents table to the schema:**

    Open `src/db/schema.ts` to view the `neon_auth` tables that Drizzle generated from your existing database schema. At the bottom of the file, append the `documents` table definition as shown below. You'll also need to add the necessary imports at the top of the file.

    ```ts filename="src/db/schema.ts" {24-35}
    import { pgTable, pgSchema, index, foreignKey, uuid, text, timestamp, unique, boolean, uniqueIndex, jsonb } from "drizzle-orm/pg-core"
    import { sql } from 'drizzle-orm';

    export const neonAuth = pgSchema('neon_auth');

    // ... Managed Better Auth table definitions from drizzle-kit pull ...

    export const userInNeonAuth = neonAuth.table("user", {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: text().notNull(),
        email: text().notNull(),
        emailVerified: boolean().notNull(),
        image: text(),
        createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
        updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
        role: text(),
        banned: boolean(),
        banReason: text(),
        banExpires: timestamp({ withTimezone: true, mode: 'string' }),
      }, (table) => [
        unique("user_email_key").on(table.email),
    ]);

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

    The `documents` table contains the following columns: `id`, `user_id`, `filename`, `object_key`, `summary`, and `created_at`. It references the `user` table in the `neon_auth` schema via a foreign key on the `user_id` column.

### Generate and apply migrations

Now, generate the SQL migration file to create the `documents` table.

```bash
npx drizzle-kit generate
```

This creates a new SQL file in the `drizzle` directory.

<Admonition type="important" title="Issue with commented migrations">
This is a [known issue](https://github.com/drizzle-team/drizzle-orm/issues/4851) in Drizzle. If `drizzle-kit pull` generated an initial migration file (e.g., `0000_...sql`) wrapped in block comments (`/* ... */`), `drizzle-kit migrate` may fail with an `unterminated /* comment` error.

To resolve this, manually delete the contents of the `0000_...sql` file or replace the block comments with line comments (`--`).
</Admonition>

Apply this migration to your database by running:

```bash
npx drizzle-kit migrate
```

The `documents` table now exists on your branch's database. You can verify it by running:

```bash
psql "$DATABASE_URL" -c "\d documents"
```

```text
                              Table "public.documents"
   Column   |            Type             | Collation | Nullable |      Default
------------+-----------------------------+-----------+----------+-------------------
 id         | uuid                        |           | not null | gen_random_uuid()
 user_id    | uuid                        |           | not null |
 filename   | text                        |           | not null |
 object_key | text                        |           | not null |
 summary    | text                        |           | not null |
 created_at | timestamp without time zone |           |          | now()
Indexes:
    "documents_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "documents_user_id_user_id_fk" FOREIGN KEY (user_id) REFERENCES neon_auth."user"(id)
```

## Build the function

You'll now build the function that handles document uploads. The function exposes two endpoints: `POST /documents` (upload, summarize, store) and `GET /documents` (list the caller's documents).

Install the dependencies for the function:

```bash
npm install @neon/functions hono jose openai @aws-sdk/client-s3
```

Create `functions/api.ts` and add the following code:

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

// The frontend is a Vite single-page app.
// The browser makes cross-origin requests to the function, so set CORS headers.
app.use(
  '/*',
  cors({
    origin: (origin) => origin,
    allowMethods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);
const db = drizzle(pool);

const JWKS = jose.createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!));

const ai = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

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

const s3 = new S3Client({ forcePathStyle: true });

app.use('/documents*', authMiddleware);

app.post('/documents', async (c) => {
  const userId = c.get('userId');

  const form = await c.req.formData();
  const file = form.get('file') as File;
  if (!file) return c.json({ error: 'Missing file' }, 400);
  const content = await file.text();

  const objectKey = `documents/${userId}/${crypto.randomUUID()}.txt`;
  await s3.send(
    new PutObjectCommand({
      Bucket: 'uploads',
      Key: objectKey,
      Body: content,
      ContentType: file.type || 'text/plain',
    }),
  );

  const response = await ai.chat.completions.create({
    model: 'gpt-oss-120b',
    messages: [
      { role: 'user', content: `Summarize this document:\n\n${content}` },
    ],
  });
  const summary = response.choices[0].message.content ?? '';

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

The code above does the following:

1.  **Server setup**
    - Initializes a **Hono app** with a typed context (`AppVariables`), so the authenticated user's ID can be attached to each request.
    - Configures **CORS** to reflect the incoming request's origin. The Vite frontend runs on a different origin than the function, so the browser needs these headers to complete cross-origin requests. Before going to production, tighten this to an allowlist of your hosts.

2.  **Database integration**
    - Creates a **connection pool** (`max: 5`) from the branch's `DATABASE_URL` and wraps it with **Drizzle ORM** for typed queries against the `documents` table.
    - Calls `attachDatabasePool(pool)` so the Functions runtime can drain the pool's idle connections when the function is suspended between invocations.

3.  **Branch-scoped service clients**
    - `JWKS` fetches the signing keys from the branch's Managed Better Auth endpoint (`NEON_AUTH_JWKS_URL`), used to verify JWTs.
    - `ai` is an OpenAI client that the Neon AI Gateway uses to summarize documents, authenticated with the branch's gateway token (`NEON_AI_GATEWAY_TOKEN`).
    - `s3` is an S3 client that the AWS SDK uses to upload files to the branch's Object Storage endpoint (`AWS_ENDPOINT_URL_S3`), authenticated with the branch's access key and secret.

4.  **Authentication middleware**
    - Implements middleware that checks for a **Bearer token** in the `Authorization` header.
    - Verifies the token against the branch's JWKS using the `jose` library, and checks the token's `issuer` matches the branch's auth URL.
    - Extracts the user ID from the token's `sub` claim and attaches it to the request context.
    - Rejects requests with missing or invalid tokens, returning `401 Unauthorized`.

5.  **API endpoints**
    - **POST `/documents`**  
      Reads the uploaded file from the multipart form, stores it in the branch's `uploads` bucket, calls the AI Gateway to summarize the content, and inserts a row into the `documents` table with the user ID, filename, object key, and summary.

    - **GET `/documents`**  
      Lists the documents belonging to the authenticated user.

Every client here is configured from the linked branch's environment variables, so the same code runs unchanged on every branch and only ever touches that branch's services.

Update the `functions` section of `neon.ts` to declare the function:

```ts filename="neon.ts" {1-6}
functions: {
  api: {
    name: "api",
    source: "./functions/api.ts",
  }
}
```

Deploy the function to the linked branch with:

```bash
neon deploy
```

The CLI bundles `functions/api.ts` with esbuild, uploads it, and deploys it to the linked branch. After deployment, you can see the function's status and invocation URL.

You can also get the function's status and invocation URL any time by running:

```bash
neon functions get api
```

```yaml
Slug: api
Name: api
Invocation Url: https://br-cool-darkness-a1b2c3d4-api.compute.c-2.us-east-2.aws.neon.tech
```

You can also see the function's invocation URL in `.env.local` as `NEON_FUNCTION_API_BASE_URL`. This is the URL the frontend will use to call the function. The URL is scoped to the branch (as indicated by the `br-` prefix), so every branch gets its own deployment.

You can also run the function locally with the Neon Functions dev server. Start it with:

```bash
neon dev
```

The dev server prints a local URL for the function. An unauthenticated request should be rejected. Test it with `curl`:

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8787/documents
```

```text
401
```

The middleware rejects the request because it has no `Authorization` header. You can test the function with a valid JWT from Managed Better Auth by signing in through the frontend and copying the token from the browser's network tab.

## Wire up the React frontend

The frontend is a Vite single-page app. It signs users in through Managed Better Auth and calls the function directly with the session token. Since the app and the function run on different origins, the browser makes cross-origin requests, which is why the function sets CORS headers.

Install the auth packages, React Router, and Tailwind CSS:

```bash
npm install @neondatabase/neon-js @neondatabase/auth-ui react-router
npm install tailwindcss @tailwindcss/vite
```

Add the Tailwind plugin to `vite.config.ts`:

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

Update `src/index.css` to import Tailwind and the pre-built auth UI styles:

```css filename="src/index.css"
@import 'tailwindcss';
@import '@neondatabase/auth-ui/tailwind';

:root {
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #0f172a;
  background-color: #f3f4f6;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #000000;
}
```

Create the auth client in `src/neon.ts`:

```ts filename="src/neon.ts"
import { createAuthClient } from '@neondatabase/neon-js/auth';

export const authClient = createAuthClient(
  import.meta.env.VITE_NEON_AUTH_URL,
);
```

The `VITE_NEON_AUTH_URL` variable points at the branch's auth endpoint. Vite only exposes variables prefixed with `VITE_` to client code, so add the frontend's variables to `.env.local`:

```text filename=".env.local" {2-3}
NEON_AUTH_BASE_URL=https://ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.build
VITE_NEON_AUTH_URL=https://ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.build
VITE_NEON_FUNCTION_API_BASE_URL=https://br-cool-darkness-a1b2c3d4-api.compute.c-2.us-east-2.aws.neon.tech
```

<Admonition type="note" title="How to keep frontend variables in sync with the branch">
Locally, `neon deploy` writes a public invocation URL for each declared function to `.env.local` as `NEON_FUNCTION_<SLUG>_BASE_URL`, so `NEON_FUNCTION_API_BASE_URL` here. Running `neon env pull` refreshes the branch's variables on demand. Copy the values to the two `VITE_` aliases for the frontend to use; you do this once per branch you work on, because `neon checkout` refreshes `.env.local` when you switch branches. In CI, you need to set up a script to pull the branch's variables and copy the necessary ones to the `VITE_` aliases before building the frontend.
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

The `emailOTP` prop enables one-time-code sign-in in the pre-built UI.

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
};
```

Finally, update `src/App.tsx` to display the list of documents and the upload form. The app uses the pre-built `AuthView` and `AccountView` components for sign-in and account management, and calls the function through the `api` helper.

```tsx filename="src/App.tsx"
import { useEffect, useState } from 'react';
import { AccountView, AuthView, RedirectToSignIn, SignedIn } from '@neondatabase/auth-ui';
import { api } from './api';
import { Route, Routes, useParams } from 'react-router';
import { type Document } from './db/schema';

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

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-8">
      <h1 className="text-2xl font-bold tracking-tight text-white">DocNotes</h1>

      <SignedIn>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="file"
            name="file"
            accept=".txt"
            required
            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-600 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-white hover:border-gray-400"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:w-auto"
          >
            Upload and summarize
          </button>
        </form>

        <ul className="space-y-3">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow"
            >
              <p className="font-medium text-gray-900">{doc.filename}</p>
              <p className="mt-1 text-sm text-gray-600">{doc.summary}</p>
            </li>
          ))}
        </ul>
      </SignedIn>

      <RedirectToSignIn />
    </main>
  );
}

function AuthViewWrapper() {
  const { pathname } = useParams();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8 dark:bg-gray-900">
      <AuthView pathname={pathname} />
    </div>
  );
}

function AccountPage() {
  const { pathname } = useParams();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8 dark:bg-gray-900">
      <AccountView pathname={pathname} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Documents />} />
      <Route path="/auth/:pathname" element={<AuthViewWrapper />} />
      <Route path="/account/:pathname" element={<AccountPage />} />
    </Routes>
  );
}
```

Run the app locally and test the full flow:

```bash
npm run dev
```

1. Open `http://localhost:5173`. You're redirected to the sign-in page.
2. Sign up with an email address you can check. Neon emails you a one-time code; enter it to finish signing in.
3. Upload a text file. You should see the AI-generated summary appear in the list.

You can verify that the document is stored in Object Storage and the summary is stored in the `documents` table on your branch's database.

## Configure auth domains for previews

Managed Better Auth needs to know which domains it should accept, because your preview deployments live on different URLs than production. You need to register your production domain and add a wildcard pattern that trusts your preview origins.

First, add your production domain. In the Neon Console, navigate to **Auth → Configuration**, then under **Domains**, add your production URL (for example, `https://doc-notes.com`) and click **Add Domain**.

Second, add a wildcard trusted domain for previews. Each preview deploy gets a new `*.vercel.app` hostname, such as `https://doc-notes-abc123.vercel.app`, and you don't want to register each one by hand. Follow [wildcard domains for previews](/docs/auth/guides/configure-domains#wildcard-domains-for-previews) to add a pattern such as `https://*.vercel.app`. Registering domains here is what lets sign-in work from a given origin. The function's CORS middleware already reflects any origin, so tighten it to an allowlist of your hosts before going to production.

<Admonition type="info" title="How preview auth endpoints are provisioned">
The preview workflow applies your `neon.ts` policy to each preview branch, and `auth: true` gives every branch its own Auth API endpoint. You configure production domains once; preview origins are trusted with the wildcard pattern.
</Admonition>

## Automate previews and production with GitHub Actions

You can automate the creation of preview environments and production deployments with GitHub Actions. The workflows in this guide do the following:

- **Preview** (`preview.yml`): on every pull request, creates a `preview/<git-branch>` Neon branch, applies your `neon.ts` policy to it (provisioning auth, the AI Gateway, Object Storage, and deploying the function from the PR's code), runs migrations, builds the frontend with the preview's URLs baked in, and deploys it to Vercel. A second job deletes the branch when the pull request closes.
- **Production** (`production.yml`): on every push to `main`, deploys the function from `main`, runs migrations against production, and deploys the production build to Vercel.

### Prepare the frontend for Vercel

The workflows deploy the built `dist` folder to Vercel as a static site. The app uses client-side routing (`/auth/:pathname` routes), so tell Vercel to serve `index.html` for paths that don't match a file. Create `public/vercel.json`; Vite copies everything in `public/` into `dist` at build time:

```json filename="public/vercel.json"
{
  "framework": null,
  "installCommand": null,
  "buildCommand": null,
  "outputDirectory": null,
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

<Admonition type="note" title="Why these fields are null">
The `framework`, `installCommand`, `buildCommand`, and `outputDirectory` fields are set to `null` to tell Vercel that the workflow will handle building and deploying the app, rather than Vercel's default build process.
</Admonition>

### Commit and push the project to GitHub

The workflows run on GitHub, so commit your work and push it to the repository you created in the prerequisites:

<Admonition type="note" title="New to GitHub?">
For instructions on creating a new repository on GitHub, see [Creating a new repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).
</Admonition>

```bash shouldWrap
git init
git add .
git commit -m "Add DocNotes app with Neon backend"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### Create the Vercel project and token

1. From the project directory, run `vercel link` and attach the directory to a new Vercel project named `doc-notes`.

   ```bash
   vercel link
   ? Set up “~/doc-notes”? yes
   ? Which scope should contain your project? My Org's projects
   ? Link to existing project? no
   ? What’s your project’s name? doc-notes
   ? In which directory is your code located? ./
   > Auto-detected Project Settings for Vite

   ? Want to modify these settings? no
   ? Do you want to change additional project settings? no
   ✅  Linked to my-org-projects/doc-notes (created .vercel and added it to .gitignore)
   ```

2. Run `cat .vercel/project.json` and note the `orgId` and `projectId` values.
3. Create a Vercel token at [vercel.com/account/tokens](https://vercel.com/account/tokens).
4. In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add three secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.

### Add the Neon credentials to your repository

The workflows authenticate with the Neon CLI and Neon's branch actions using an API key:

1. Create a Neon API key. See [create an API key](/docs/manage/api-keys#create-an-api-key).
2. Add it as the repository secret `NEON_API_KEY`.
3. Add your project ID (found in the `.neon` directory as `projectId`) as a variable `NEON_PROJECT_ID` in **Settings → Secrets and variables → Actions → Variables**.

<Admonition type="tip" title="Automatic setup">
The [Neon GitHub integration](/docs/guides/neon-github-integration) can set `NEON_API_KEY` and `NEON_PROJECT_ID` up for you. This guide shows how to do it manually, so you understand what the workflow needs.
</Admonition>

### Add the preview workflow

Create `.github/workflows/preview.yml` with the following content:

```yaml filename=".github/workflows/preview.yml"
name: Preview environment

on:
  pull_request:
    types: [opened, reopened, synchronize, closed]

concurrency:
  group: preview-${{ github.event.number }}
  cancel-in-progress: true

jobs:
  preview:
    if: github.event.action != 'closed'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - run: npm ci
      - run: npm i -g neon@latest

      - name: Create the preview branch
        uses: neondatabase/create-branch-action@v6
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch_name: preview/${{ github.head_ref }}
          api_key: ${{ secrets.NEON_API_KEY }}

      - name: Apply neon.ts and deploy the function to the preview branch
        run: |
          neon deploy --branch "preview/${{ github.head_ref }}" \
            --project-id "$NEON_PROJECT_ID" --update-existing
        env:
          NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
          NEON_PROJECT_ID: ${{ vars.NEON_PROJECT_ID }}

      - name: Pull the preview branch's variables and run migrations
        run: |
          neon env pull --branch "preview/${{ github.head_ref }}" \
            --file .env.preview --project-id "$NEON_PROJECT_ID"
          set -a && source .env.preview && set +a
          echo "VITE_NEON_AUTH_URL=$NEON_AUTH_BASE_URL" >> "$GITHUB_ENV"
          echo "VITE_NEON_FUNCTION_API_BASE_URL=$NEON_FUNCTION_API_BASE_URL" >> "$GITHUB_ENV"
          npx drizzle-kit migrate
        env:
          NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
          NEON_PROJECT_ID: ${{ vars.NEON_PROJECT_ID }}

      - name: Build the frontend
        run: npm run build

      - name: Deploy the preview to Vercel
        id: deploy
        run: |
          mkdir -p .vercel
          printf '{"orgId":"%s","projectId":"%s"}\n' "$VERCEL_ORG_ID" "$VERCEL_PROJECT_ID" > .vercel/project.json
          URL=$(npx vercel deploy dist --yes --token "$VERCEL_TOKEN" \
            | grep -Eo 'https://[^[:space:]]+\.vercel\.app' | tail -1)
          echo "url=$URL" >> "$GITHUB_OUTPUT"
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Comment the preview URL on the pull request
        env:
          GH_TOKEN: ${{ github.token }}
          PREVIEW_URL: ${{ steps.deploy.outputs.url }}
        run: |
          gh pr comment "${{ github.event.number }}" --body "Preview environment: $PREVIEW_URL"

  cleanup:
    if: github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Delete the preview branch
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch: preview/${{ github.head_ref }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

The preview workflow does the following:

1. **Creates the preview branch.** `create-branch-action` creates `preview/<git-branch>` from your project's default branch. If the branch already exists (a push to an open pull request), the action reuses it, so the workflow is safe to run on every event.
2. **Applies `neon.ts`.** `neon deploy --branch` reconciles the preview branch with your policy: auth, the AI Gateway, and Object Storage are provisioned on it, and the function is deployed from the PR's code to the preview branch's URL.
3. **Pulls variables and migrates.** `neon env pull` fetches every branch-scoped variable into `.env.preview`, the workflow derives the two `VITE_` aliases from them, and `npx drizzle-kit migrate` runs against the preview branch's `DATABASE_URL`. This is the piece that makes schema changes reviewable: every push to the pull request applies the migrations to the preview branch only, so the reviewer always sees the feature against a schema that matches the code.
4. **Builds and deploys.** `npm run build` bakes the `VITE_` URLs into the bundle, and `vercel deploy dist` publishes it as a static preview deployment. The `mkdir` + `printf` step writes the Vercel project link from your secrets, so the deployment lands in the right project without committing `.vercel/` to the repository.
5. **Comments the URL.** `gh pr comment` posts the preview URL on the pull request, so reviewers always have a link to the latest build.

The `cleanup` job runs when the pull request closes, merged or not, and deletes the preview branch. Deleting the branch removes everything attached to it: the auth, the function deployments, the storage namespace, and any diverged data. If the job can't run, the branch policy's TTL expires the branch anyway.

### Add the production workflow

Create `.github/workflows/production.yml`:

```yaml filename=".github/workflows/production.yml"
name: Production deploy

on:
  push:
    branches: [main]

concurrency:
  group: production-${{ github.ref }}

jobs:
  production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - run: npm ci
      - run: npm i -g neon@latest

      - name: Apply neon.ts and deploy the function to production
        run: |
          neon deploy --branch main --project-id "$NEON_PROJECT_ID" \
            --update-existing --allow-protected
        env:
          NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
          NEON_PROJECT_ID: ${{ vars.NEON_PROJECT_ID }}

      - name: Pull production's variables and run migrations
        run: |
          neon env pull --branch main --file .env.production --project-id "$NEON_PROJECT_ID"
          set -a && source .env.production && set +a
          echo "VITE_NEON_AUTH_URL=$NEON_AUTH_BASE_URL" >> "$GITHUB_ENV"
          echo "VITE_NEON_FUNCTION_API_BASE_URL=$NEON_FUNCTION_API_BASE_URL" >> "$GITHUB_ENV"
          npx drizzle-kit migrate
        env:
          NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
          NEON_PROJECT_ID: ${{ vars.NEON_PROJECT_ID }}

      - name: Build the frontend
        run: npm run build

      - name: Deploy to Vercel
        run: |
          mkdir -p .vercel
          printf '{"orgId":"%s","projectId":"%s"}\n' "$VERCEL_ORG_ID" "$VERCEL_PROJECT_ID" > .vercel/project.json
          npx vercel deploy dist --prod --yes --token "$VERCEL_TOKEN"
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

The production job mirrors the preview job with two differences: it targets the `main` branch, so `neon deploy` needs `--allow-protected` to apply the policy to your protected production branch. And `vercel deploy --prod` publishes to your production domain instead of a preview URL.

From now on, the workflow is automatic:

1. You open a pull request.
2. The preview workflow creates branch `preview/<git-branch>` from production and provisions every service on it from your `neon.ts`.
3. The workflow migrates the branch's schema, builds the frontend with the branch's URLs, and deploys it to Vercel.
4. You review the pull request against a complete, isolated copy of production.
5. When you merge or close the pull request, the workflow deletes the branch.

Commit the workflows and push them to GitHub:

```bash
git add .github/workflows
git commit -m "ci: add preview and production workflows"
git push origin main
```

## Test branch-everything with a pull request

Now that the workflows are in place, you can test a new feature with a pull request. The feature is to let users "star" documents, so they can mark important ones. This requires three changes:

1. **Schema:** a `starred boolean` column on `documents`.
2. **Function:** a `PATCH /documents/:id` route to toggle the star.
3. **Frontend:** a star button on each document, wired to the new route.

Create a new branch for the feature:

```bash
neon checkout feat/star-documents
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

Generate the migration file:

```bash
npx drizzle-kit generate
```

<Admonition type="note" title="Run the migration locally">
You can optionally run the migration locally, which uses the `.env.local` variables to apply it to your local branch. This lets you test the end-to-end flow locally with `npm run dev` and `neon dev`.
</Admonition>

Add the route to `functions/api.ts`:

```ts filename="functions/api.ts"
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

Then update the frontend's API helper to call the new route:

```ts filename="src/api.ts"
export const api = {
  // ... the request helper ...

  getDocuments: () => api.request('/documents'),

  uploadDocument: (formData: FormData) =>
    api.request('/documents', {
      method: 'POST',
      body: formData,
    }),

  toggleStar: (id: string) => // [!code ++]
    api.request(`/documents/${id}`, { method: 'PATCH' }), // [!code ++]
};
```

Then make the frontend call the new route when the user clicks the star button:

```tsx filename="src/App.tsx"
const toggleStar = async (doc: Document) => { // [!code ++]
  const updated = await api.toggleStar(doc.id); // [!code ++]
  setDocuments( // [!code ++]
    documents.map((d) => (d.id === doc.id ? updated : d)), // [!code ++]
  ); // [!code ++]
}; // [!code ++]
```

And render a star button next to each document's filename:

```tsx filename="src/App.tsx" {5-22}
<li
  key={doc.id}
  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow"
>
  <div className="flex items-center justify-between">
    <p className="text-sm text-gray-500">
      {doc.createdAt
        ? new Date(doc.createdAt).toLocaleString()
        : 'Unknown'}
    </p>
    <button
      onClick={() => toggleStar(doc)}
      aria-label={doc.starred ? 'Unstar' : 'Star'}
      className={`rounded text-xl leading-none transition-colors hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
        doc.starred
          ? 'text-yellow-500'
          : 'text-gray-300 hover:text-yellow-400'
      }`}
    >
      {doc.starred ? '★' : '☆'}
    </button>
  </div>
  <p className="font-medium text-gray-900">{doc.filename}</p>
  <p className="mt-1 text-sm text-gray-600">{doc.summary}</p>
</li>
```

You now have a complete feature that touches the database, the function, and the frontend. You can similarly add a feature that touches Object Storage, or the AI Gateway, or any combination of services. Commit the changes and push the branch to GitHub:

```bash
git add . && git commit -m "feat: star documents"
git push origin feat/star-documents
```

When you open the pull request, the preview workflow takes over:

1. It creates branch `preview/feat/star-documents`: a copy-on-write fork of production made at that instant, with production's rows, production's users, production's uploaded objects, and production's function code.
2. `neon deploy` applies your `neon.ts` policy to the branch, so it gets its own auth, gateway endpoint, storage namespace, and a function deployment built from the PR's code at the preview branch's URL.
3. The workflow pulls the preview branch's variables and derives the necessary `VITE_` aliases from them, so the frontend build points at the preview's own auth and function.
4. `npx drizzle-kit migrate` runs against the preview branch's `DATABASE_URL`, adding the `starred` column to the preview's database only.
5. The workflow builds the frontend and deploys it to Vercel, then comments the preview URL on the pull request.

Open the preview URL and verify the feature works end to end:

1. Sign in with an email address you can check; enter the one-time code Neon emails you. You can also sign in with a production account, because the branch inherited production's users.
2. Upload a document and confirm the summary appears.
3. Click the star button. The document is starred.

Now verify each layer is isolated.

**Data and schema.** Check the production branch's `documents` table in the Neon Console. The `starred` column doesn't exist there, and neither do the rows you created in the preview. The migration ran against the preview branch only.

**Users.** In the Neon Console, select the preview branch and navigate to **Auth → Users**: your test account is there. Switch to the production branch's **Auth → Users**: it isn't. The test signup created a user in the preview's auth only.

**Tokens don't cross branches.** Copy a session token from the preview (from your browser's cookies or a request header) and call the production function URL with it:

```bash shouldWrap
curl -s -o /dev/null -w "%{http_code}" https://<production-function-url>/documents \
  -H "Authorization: Bearer <preview-session-token>"
```

```text
401
```

The production function rejects it. The preview branch's auth issued the token with its own issuer. The same check works in reverse: a production token fails verification at a preview function, too.

**Function URL.** The preview's function requests hit a URL containing the preview branch ID, not the production deployment. You can confirm in the function's logs in the Neon Console: select the preview branch, open **Functions**, and you'll see the preview's `api` deployment serving the preview's traffic.

**AI credentials.** The preview branch has its own AI Gateway credentials.

**Storage.** Upload a file in the preview, then check the production branch's bucket in the Neon Console: the object only exists on the preview branch's namespace. The bucket forked copy-on-write at branch time, so the preview can even read production's existing documents, but anything it writes stays on the preview.

## Merge, promote, and clean up

You've verified the feature works end to end on the preview branch, and that the preview is isolated from production. Now merge the pull request to `main` to promote the feature to production.

**Promote the migration to production.** The merge pushes to `main`, which triggers the production workflow: `neon deploy` re-applies the policy and deploys the function from `main`, and `npx drizzle-kit migrate` runs against the production `DATABASE_URL`. The migration you tested on the preview branch on every push now applies to production, already proven against a fork of production's data. The workflow finishes by deploying the production build to Vercel with `--prod`.

**Verify the feature in production.** Once the production deployment finishes, open your production URL, sign in, and star a document. The `starred` column now exists on the production database, and the production function deployment serves the new route.

**Clean up the preview branch.** The preview workflow's cleanup job deletes `preview/<git-branch>` as soon as the pull request closes, merged or not. Deleting the branch removes everything attached to it: the auth, the function deployments, the storage namespace, and any diverged data. The branch policy's 7-day TTL is the backstop if the job can't run.

</Steps>

## Summary

Neon collapses the whole backend into a single primitive: the branch. Lakebase Postgres, Managed Better Auth, Functions, AI Gateway, and Object Storage all branch copy-on-write with it and disappear together when the branch expires. One `neon.ts` file declares the environment, two GitHub Actions workflows create a branch per pull request and deploy everything, and the TTL cleans up anything the workflows miss. Previews run against production's real data on near-zero-cost compute, and the protected production branch stays out of reach of the whole workflow.

## Next steps

The preview workflow is a complete end-to-end test of your feature, but you can add more automation to make it even easier to review and ship:

- **Show schema changes in the PR.** Add Neon's [`schema-diff-action`](https://github.com/neondatabase/schema-diff-action) to your pull request workflow to post a comment summarizing the schema changes between the preview branch and production. Reviewers see the exact SQL that will hit production before it does.
- **Run E2E tests against the preview.** The preview workflow exports the branch's connection details as environment variables, so your end-to-end suite can run against a fresh fork of production on every push. See [automated E2E testing with Neon Branching and Playwright](/guides/e2e-playwright-tests-with-neon-branching).
- **Not on Vercel?** The preview workflow builds the frontend and deploys it to Vercel, but you can adapt it to any static hosting provider. The workflow's `npm run build` step produces a static bundle in `dist/`, which you can deploy anywhere.

## Source code

You can find the complete source code for this example on GitHub.

<DetailIconCards>
<a href="https://github.com/dhanushreddy291/doc-notes" description="Complete source code for the DocNotes example built with Lakebase Postgres, Managed Better Auth, Functions, AI Gateway, and Object Storage" icon="github">DocNotes Example Repository</a>
</DetailIconCards>

## Resources

- [Neon Database Branching](/docs/introduction/branching)
- [Branching authentication](/docs/auth/branching-authentication)
- [`neon.ts` reference](/docs/reference/neon-ts)
- [Automate branching with GitHub Actions](/docs/guides/branching-github-actions)
- [Automate Neon Functions deployments with GitHub Actions](/guides/neon-functions-github-actions)

<NeedHelp/>
