# 💡 AI Prompt: Connect a Node.js application to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Node.js project to connect to a Neon Postgres database.

**Purpose:** To install the appropriate client library and `dotenv`, store Neon connection details in a `.env` file, add an `app.js` entry that runs `SELECT version()`, and run it with `node app.js`.

**Scope:**

- Assumes the user is working within a Node.js project directory.
- Assumes the user has an existing Neon database and access to connection details from the Neon Console (Node.js connection string preset).

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt targets a plain Node.js project (not necessarily a web framework). Detect the package manager (`npm`, `yarn`, `pnpm`, `bun`) and use it for installs. Examples below use `npm`.
- If there is no `package.json`, create one:

  ```bash
  mkdir neon-nodejs-example
  cd neon-nodejs-example
  npm init -y
  ```

---

## ⚡ Step 1: Try neon init (recommended)

If you can execute terminal commands, start by running `neon init`. This is the fastest path to a fully configured project.

```bash
npx neonctl@latest init
```

`neon init` handles everything automatically: it authenticates the user with Neon (sign up or log in), then installs the AI development tooling for the user's coding environment (MCP server, agent skills, IDE extensions, and plugins).

After it completes, instruct the user to **restart their editor**. Once restarted, you can guide them through an interactive "Get started with Neon" flow to create a project, obtain a connection string, store it in the project, install client libraries, and configure the app, including optional [Neon Auth](https://neon.tech/docs/auth/overview) setup.

**If `neon init` succeeds, skip to [Next Steps](#-next-steps).** The rest of the manual instructions below are not needed.

---

## 🛠️ Step 2: Manual setup (fallback)

Use this section only if:

- Your environment does not support running terminal commands
- `neon init` is unavailable or failed
- The user explicitly prefers manual configuration

### Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Node.js project as follows:

### 1. Select a client

Ask the user to choose one:

1. **`@neondatabase/serverless`** (Neon serverless driver)
2. **`pg` (node-postgres)**
3. **`postgres` (postgres.js)**

Do not proceed until they choose.

### 2. Install dependencies

```bash
# Neon serverless driver
npm install @neondatabase/serverless dotenv

# node-postgres
npm install pg dotenv

# postgres.js
npm install postgres dotenv
```

### 3. Store Neon credentials

1. Check for a `.env` file at the project root. Create it if missing.
2. Add the variables below. Instruct the user to copy values from **Neon Console → Project → Dashboard → Connect**, choosing **Node.js** from the connection string dropdown. Explain that `ENDPOINT_ID` is optional and mainly for older clients without SNI; include it only if the Console provides it and they need the workaround.

   ```shell title=".env"
   PGHOST='[neon_hostname]'
   PGDATABASE='[dbname]'
   PGUSER='[user]'
   PGPASSWORD='[password]'
   ENDPOINT_ID='[endpoint_id]'
   ```

3. Remind the user: never expose these values to the browser or commit them to version control.

### 4. Create `app.js`

Add `app.js` at the project root with the block that matches the selected client.

#### Option 1: Neon serverless driver

```javascript title="app.js"
require('dotenv').config();

const { neon } = require('@neondatabase/serverless');

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
);

async function getPgVersion() {
  const result = await sql`SELECT version()`;
  console.log(result[0]);
}

getPgVersion();
```

#### Option 2: `pg` (node-postgres)

```javascript title="app.js"
require('dotenv').config();

const { Pool } = require('pg');

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
  },
});

async function getPgVersion() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT version()');
    console.log(result.rows[0]);
  } finally {
    client.release();
  }
}

getPgVersion();
```

#### Option 3: `postgres` (postgres.js)

```javascript title="app.js"
require('dotenv').config();

const postgres = require('postgres');

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result[0]);
}

getPgVersion();
```

### 5. Optional: older clients and `ENDPOINT_ID`

If the user needs the endpoint-ID workaround for `postgres.js` (older clients without SNI), use:

```javascript title="app.js"
require('dotenv').config();

const postgres = require('postgres');

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();
```

Only apply this when the user's environment requires it; prefer the simpler `postgres.js` snippet when modern clients are in use.

---

## 🚀 Next Steps

Once the setup is complete:

1. Verify `.env` contains real values (no `[neon_hostname]`-style placeholders).
2. Run:

   ```bash
   node app.js
   ```

3. The console should print an object or row that includes the PostgreSQL `version` string from Neon.
4. **Authentication:** If the app needs user authentication, mention [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:

- The chosen driver and `dotenv` are installed.
- `.env` uses `PGHOST`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` as in the Neon Console Node.js preset (plus `ENDPOINT_ID` only when needed).
- `app.js` uses `require('dotenv').config()` before reading `process.env`.
- For `pg`, pooled clients are released in a `finally` block after `connect()`.
- Credentials never appear in application source code.

---

## ❌ Do Not

- Do not hardcode credentials in `app.js` or any other file.
- Do not output the user's `.env` values or connection string in responses.
- Do not expose database connection code to browser bundles; this guide is for server-side Node.js only.
