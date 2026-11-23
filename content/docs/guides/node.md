---
title: Connect a Node.js application to Neon
subtitle: Create a Node.js project, link it with neon link, and query Lakebase Postgres from Node.js with node-postgres, postgres.js, or the Neon serverless driver
summary: >-
  To connect a Node.js app to Lakebase Postgres on Neon, create a Node.js
  project, run neon link to write DATABASE_URL to your env file, and query it
  with node-postgres, postgres.js, or the Neon serverless driver. Covers one
  runnable example per driver (create, insert, select, update, delete, and a
  transaction), loading env files with Node's --env-file-if-exists flags instead
  of dotenv, an optional Neon development branch and agent skills, running the
  app elsewhere, troubleshooting, and Neon's other backend services from Node.js.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/node
  - /docs/integrations/node
  - /docs/guides/javascript
updatedOn: '2026-11-20T21:12:21.472Z'
---

<PromptBlock src="/prompts/javascript-prompt.md" labels={["Set up your agent and follow this guide", "Look up driver docs", "Connect your Node.js project"]} />

<Steps>

## Create a Node.js project

Create a project with `npm init -y`, which writes a `package.json` with default settings, then set it to ES modules so the `import` statements in this guide work. You need [Node.js](https://nodejs.org/en/download) 24.10 or later (or 22.21), for the `--env-file-if-exists` flag in [Connect and run a query](#connect-and-run-a-query). Skip this step if you already have a Node.js project.

```bash filename="Terminal"
mkdir neon-nodejs-app
cd neon-nodejs-app
npm init -y
npm pkg set type=module
```

`npm init -y` writes `"type": "commonjs"`, and `npm pkg set type=module` replaces it. If your app already uses `require()`, don't change its `type`, because that breaks those calls. Instead, give the files in this guide an `.mjs` extension, such as `index.mjs` for `index.js`. Node runs `.mjs` files as ES modules in any project.

If your project runs on Bun, use the [Bun guide](/docs/guides/bun) instead, which uses Bun's built-in `Bun.sql` client.

## Add Neon's agent skills (optional)

Add Neon's [agent skills](/docs/ai/agent-skills) to your project with the command below. They teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The agent prompt at the top of this page installs them, so skip this step if you used it:

```bash filename="Terminal"
npx neon@latest skills
```

The [Neon MCP Server](/docs/ai/neon-mcp-server) connects your agent to Neon's tools as well; its page covers the setup.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and [Managed Better Auth](/docs/auth/overview) run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), sign in, and create the project. The npm install needs Node.js 20.19 or later; without Node.js, run `brew install neonctl` (Homebrew) or use another option on the install page:

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

The first tab runs `neon link` in your project directory, which writes `DATABASE_URL` into `.env.local` (or `.env` if one exists). The second tab copies the connection string into that file by hand. Add the env files and `node_modules` to `.gitignore` first, so the connection string and installed packages stay out of git:

```bash filename="Terminal"
printf '\nnode_modules\n.env\n.env.local\n' >> .gitignore
```

The examples load the env file with Node's `--env-file-if-exists` flags, so you don't need `dotenv`.

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

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

Install one of three Postgres drivers. For a long-running Node.js server, use [node-postgres](https://node-postgres.com) (`pg`) or [postgres.js](https://github.com/porsager/postgres); both keep a pool of TCP connections open. For serverless and edge hosts, use the [Neon serverless driver](/docs/serverless/serverless-driver), which queries over HTTP. See [Choosing your connection method](/docs/connect/choose-connection).

<CodeTabs labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```bash
npm install pg
```

```bash
npm install postgres
```

```bash
npm install @neondatabase/serverless
```

</CodeTabs>

If you use node-postgres, current `pg` versions print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` in your env file to keep the same behavior without the warning. `neon link`, `neon checkout`, `neon env pull`, and `neon deploy` write `sslmode=require` again, so repeat the change after you run them.

## Connect and run a query

Create a file named `index.js` in your project directory. The script connects with the driver you installed and prints the Postgres version. Each tab reads the connection string from `DATABASE_URL`.

<CodeTabs labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript filename="index.js"
import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const { rows } = await client.query('SELECT version()');
console.log(rows[0].version);

await client.end();
```

```javascript filename="index.js"
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL);

const [row] = await sql`SELECT version()`;
console.log(row.version);

await sql.end();
```

```javascript filename="index.js"
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const [row] = await sql`SELECT version()`;
console.log(row.version);
```

</CodeTabs>

Run the script with Node's `--env-file-if-exists` flags, which load `.env` and `.env.local` if they exist:

```bash filename="Terminal"
node --env-file-if-exists=.env --env-file-if-exists=.env.local index.js
```

Node skips an env file that doesn't exist, and may print a note such as `.env not found. Continuing without it.`, so it's fine to have only one of them. If both files set `DATABASE_URL`, the later one, `.env.local`, wins. `--env-file-if-exists` is stable from Node.js 24.10 and 22.21. The output shows the Postgres version of your database, which confirms the connection:

```text
PostgreSQL 18.x ...
```

</Steps>

## Examples

Each example is one script that creates a `books` table, then inserts, selects, updates, and deletes rows, with a transaction in the middle. The script deletes the rows it adds, so you can run it again. Save it as `books.js` in your project, and run it with the same command as above, with `books.js` in place of `index.js`. The examples write rows to the branch that your `DATABASE_URL` points at, so run them on a development branch: complete [Work on a development branch](#work-on-a-development-branch-optional) first. Without the CLI, create a branch in the Neon Console and copy its connection string into `.env.local`, as described in [Create a branch](/docs/manage/branches#create-a-branch).

<CodeTabs labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript filename="books.js"
import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  // Create a table
  await client.query(`
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      year INT
    )
  `);

  // Insert a row and get its id back
  const dune = (
    await client.query('INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id', [
      'Dune',
      'Frank Herbert',
      1965,
    ])
  ).rows[0];

  // Select the row
  const selected = await client.query('SELECT id, title, year FROM books WHERE id = $1', [dune.id]);
  console.log('Selected:', selected.rows[0]);

  // Update the row
  await client.query('UPDATE books SET year = $1 WHERE id = $2', [1966, dune.id]);

  // Insert two rows in a transaction: both commit, or neither does
  await client.query('BEGIN');
  let emma, persuasion;
  try {
    emma = (
      await client.query('INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id', [
        'Emma',
        'Jane Austen',
        1815,
      ])
    ).rows[0];
    persuasion = (
      await client.query('INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id', [
        'Persuasion',
        'Jane Austen',
        1817,
      ])
    ).rows[0];
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }

  // Select all the rows
  const all = await client.query('SELECT title, year FROM books ORDER BY year');
  console.log('All books:', all.rows);

  // Delete the rows this script added
  await client.query('DELETE FROM books WHERE id = ANY($1)', [[dune.id, emma.id, persuasion.id]]);
} finally {
  await client.end();
}
```

```javascript filename="books.js"
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL);

try {
  // Create a table
  await sql`
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      year INT
    )
  `;

  // Insert a row and get its id back
  const [dune] = await sql`
    INSERT INTO books (title, author, year) VALUES ('Dune', 'Frank Herbert', 1965) RETURNING id
  `;

  // Select the row
  const [selected] = await sql`SELECT id, title, year FROM books WHERE id = ${dune.id}`;
  console.log('Selected:', selected);

  // Update the row
  await sql`UPDATE books SET year = ${1966} WHERE id = ${dune.id}`;

  // Insert two rows in a transaction: both commit, or neither does
  const [emma, persuasion] = await sql.begin(async (tx) => {
    const [first] = await tx`
      INSERT INTO books (title, author, year) VALUES ('Emma', 'Jane Austen', 1815) RETURNING id
    `;
    const [second] = await tx`
      INSERT INTO books (title, author, year) VALUES ('Persuasion', 'Jane Austen', 1817) RETURNING id
    `;
    return [first, second];
  });

  // Select all the rows
  const all = await sql`SELECT title, year FROM books ORDER BY year`;
  console.log('All books:', all);

  // Delete the rows this script added
  await sql`DELETE FROM books WHERE id IN ${sql([dune.id, emma.id, persuasion.id])}`;
} finally {
  await sql.end();
}
```

```javascript filename="books.js"
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Create a table
await sql`
  CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INT
  )
`;

// Insert a row and get its id back
const [dune] = await sql`
  INSERT INTO books (title, author, year) VALUES ('Dune', 'Frank Herbert', 1965) RETURNING id
`;

// Select the row
const [selected] = await sql`SELECT id, title, year FROM books WHERE id = ${dune.id}`;
console.log('Selected:', selected);

// Update the row
await sql`UPDATE books SET year = ${1966} WHERE id = ${dune.id}`;

// Insert two rows in one transaction: both commit, or neither does
const [[emma], [persuasion]] = await sql.transaction([
  sql`INSERT INTO books (title, author, year) VALUES ('Emma', 'Jane Austen', 1815) RETURNING id`,
  sql`INSERT INTO books (title, author, year) VALUES ('Persuasion', 'Jane Austen', 1817) RETURNING id`,
]);

// Select all the rows
const all = await sql`SELECT title, year FROM books ORDER BY year`;
console.log('All books:', all);

// Delete the rows this script added
await sql`DELETE FROM books WHERE id IN (${dune.id}, ${emma.id}, ${persuasion.id})`;
```

</CodeTabs>

The node-postgres example runs `BEGIN` and `COMMIT` itself. postgres.js's `sql.begin` commits when its callback returns, and the Neon serverless driver's `sql.transaction` runs its queries as one non-interactive transaction, so those queries can't use each other's results. On every run after the first, postgres.js also prints a `NOTICE` that the `books` table already exists. You can ignore it.

## Run it elsewhere

On a host, set `DATABASE_URL` in the host's environment instead of an env file, and keep it on the server: it holds your credentials, so never include it in browser code. For production, use your default branch's pooled connection string, which goes through [Neon's connection pooler](/docs/connect/connection-pooling): run `neon connection-string main --pooled` in your own terminal, replacing `main` with `production` if that's your project's default branch, because the command prints the password. Neon's pooler already pools connections, so you don't need to add a pool in your app; if you do, return connections to it promptly (see [Double pooling](/docs/connect/choose-connection#common-pitfalls)). postgres.js opens a pool by default. If you use node-postgres's `pg.Pool`, attach an `error` listener: Neon can scale a compute to zero after inactivity, which drops idle connections, and an unhandled pool error stops the app. The Neon serverless driver sends each query as an HTTP request, so it needs no pool.

## Add more of your backend

Add a Neon backend service to your Node.js app with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). Each service branches with your database, so a `dev` branch gets its own data for each service. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it and writes its variables to your env file (`.env` if it exists, otherwise `.env.local`). Running the app with the `--env-file-if-exists` flags loads them into `process.env`, so SDKs that read `process.env` find them. Set them on your host too.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. Call it from your server code. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. Call models from your server code. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your Node.js server, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In your server code, [seal](/docs/realtime/guides/queries#sealing-queries) the live query with `@neon/realtime/server` and `NEON_REALTIME_SECRET`: sealing signs the query so the browser can subscribe to it but can't change it. Return the sealed query, and `NEON_REALTIME_URL`, from your server; the browser subscribes with `@neon/realtime/client`. Keep the secret on the server. See [Realtime](/docs/realtime/overview).

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

`AggregateError [ECONNREFUSED]` or `Wrong URL scheme or missing user, host or database in connection parameters`
: The script ran without `DATABASE_URL`. node-postgres and postgres.js fall back to a local server, and the Neon serverless driver rejects the empty value. Run the script from your project directory with the `--env-file-if-exists` flags, and check that one of the env files sets `DATABASE_URL`. On a host, set it in the environment.

`Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'pg'`
: The driver isn't installed in this project, or you ran the script from another directory. Run the install command from [Install a Postgres driver](#install-a-postgres-driver) in your project directory. The package name in the message tells you which one is missing.

`Make sure to set "type": "module" in the nearest package.json file or use the .mjs extension`
: The project is CommonJS, so Node doesn't load the `import` statements. Run `npm pkg set type=module` in the project directory, or give the files `.mjs` extensions. For an existing app that uses `require()`, use the `.mjs` names, as described in Create a Node.js project.

</DefinitionList>

## Next steps

- [Connect an Express application to Neon](/docs/guides/express): Query Neon from Express routes.
- [Connect a Hono application to Neon](/docs/guides/hono): Query Neon from Hono routes on Node.js.
- [Connect a Next.js application to Neon](/docs/guides/nextjs): Query Neon from Next.js server code.
- [Connect from Drizzle to Neon](/docs/guides/drizzle): Define a schema and run migrations with an ORM.
- [Connect from Prisma to Neon](/docs/guides/prisma): Use Prisma's client and migrations instead of raw SQL.

<NeedHelp/>
