# 💡 AI Prompt: Connect a Remix application to Neon Postgres

**Role:** You are an expert software agent specializing in Remix (and React Router patterns). Your task is to configure the current Remix project to connect to a Neon Postgres database using a server-only `db.server` module and a route loader that queries the database.

**Purpose:** To connect the Remix app to Neon by installing a PostgreSQL driver, setting `DATABASE_URL`, adding `app/db.server.ts`, and a route loader that runs `SELECT version()` so the UI can display the result.

**Scope:**

- Must be run inside an existing Remix project directory.
- Assumes the user has a Neon project and access to their full connection string.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing Remix project. Detect Remix by dependencies such as `@remix-run/node` and `@remix-run/react` in `package.json`. If the user has no Remix app, direct them to the [Remix Quick Start](https://remix.run/docs/en/main/start/quickstart) to create one before continuing.

---

## ⚡ Step 1: Run neon init (REQUIRED)

**You MUST execute this command before writing any code or installing any packages.** Do not skip this step. Do not manually replicate what it does.

```bash
npx -y neonctl@latest init
```

`neon init` handles everything automatically: it authenticates the user with Neon (sign up or log in), then installs the AI development tooling for the user's coding environment (MCP server, agent skills, IDE extensions, and plugins).

After it completes, instruct the user to **restart their editor**. Once restarted, you can guide them through an interactive "Get started with Neon" flow to create a project, obtain a connection string, store it in the project, install client libraries, and configure the app, including optional [Neon Auth](https://neon.tech/docs/auth/overview) setup.

**If `neon init` succeeds, skip to [Next Steps](#-next-steps).** The rest of the manual instructions below are not needed.

---

## 🛠️ Step 2: Manual setup (fallback — only if `init` is unavailable)

Use this section **only** if:

- `neon init` failed or is unavailable in this environment
- The user explicitly asked for manual configuration

Configure the open Remix project as follows:

### 1. Install dependencies

1. **Prompt the user to select a PostgreSQL driver.** Present these options:

   - **`pg` (node-postgres):** Classic pooling client; use `Pool` with `connectionString` and `ssl: true`.
   - **`postgres` (postgres.js):** Tagged-template queries; pass `ssl: 'require'`.
   - **`@neondatabase/serverless`:** HTTP-based serverless driver; use `neon(process.env.DATABASE_URL)`.

   Ask the user to choose and do not proceed until they answer. Briefly explain when each fits (traditional Node server vs serverless-style).

2. Install the chosen package:

   ```bash
   # node-postgres
   npm install pg

   # postgres.js
   npm install postgres

   # Neon serverless
   npm install @neondatabase/serverless
   ```

---

### 2. Configure environment variables

1. Check for a `.env` file at the project root. Create it if missing.
2. Add `DATABASE_URL` and **prompt the user** to replace placeholders with their Neon connection string from **Neon Console → Project → Connect**.

   ```dotenv title=".env"
   DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
   ```

---

### 3. Create `app/db.server.ts`

Remix excludes `.server` modules from the client bundle. Create `app/db.server.ts` at the root of the `app` directory using the option that matches the selected driver.

#### Option A: `pg` (node-postgres)

```javascript title="app/db.server.ts"
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export { pool };
```

#### Option B: `postgres` (postgres.js)

```javascript title="app/db.server.ts"
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export { sql };
```

#### Option C: `@neondatabase/serverless`

```javascript title="app/db.server.ts"
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export { sql };
```

---

### 4. Add or update a route

Create a route under `app/routes` (for example `app/routes/_index.tsx` or a dedicated route like `app/routes/db.tsx`) that imports from `~/db.server` and loads the PostgreSQL version in a loader.

#### Option A: `pg` (node-postgres)

```javascript
import { pool } from '~/db.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async () => {
  const client = await pool.connect();
  try {
    const response = await client.query('SELECT version()');
    return json({ version: response.rows[0].version });
  } finally {
    client.release();
  }
};

export default function Page() {
  const data = useLoaderData();
  return <>{data.version}</>;
}
```

#### Option B: `postgres` (postgres.js)

```javascript
import { sql } from '~/db.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async () => {
  const response = await sql`SELECT version()`;
  return json({ version: response[0].version });
};

export default function Page() {
  const data = useLoaderData();
  return <>{data.version}</>;
}
```

#### Option C: `@neondatabase/serverless`

```javascript
import { sql } from '~/db.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async () => {
  const response = await sql`SELECT version()`;
  return json({ version: response[0].version });
};

export default function Page() {
  const data = useLoaderData();
  return <>{data.version}</>;
}
```

Use TypeScript (`.tsx`) if the project uses TypeScript. Prefer `json()` from `@remix-run/node` for typed loader responses when that matches the project's Remix version.

---

## 🚀 Next Steps

Once the file modifications are complete:

1. Verify `DATABASE_URL` in `.env` is set to a real connection string (no placeholders).
2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` (or the route you added). The page should show the PostgreSQL version string returned from Neon.
4. **Authentication:** If the app needs user authentication, mention [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:

- The project has Remix dependencies and the chosen driver installed.
- A `.env` file exists with `DATABASE_URL`.
- Database access lives in `app/db.server.ts` (or another `*.server.*` module), not in client-only files.
- The route loader imports from `~/db.server` and never exposes credentials to the browser.
- For `pg`, the loader releases the client in a `finally` block.

---

## ❌ Do Not

- **Do not hardcode credentials** in source files. Always use `process.env.DATABASE_URL`.
- **Do not output the user's connection string** in any response or log.
- **Do not import `db.server` from client components** or routes without a server boundary; keep DB code in loaders, actions, or server-only modules.
- Do not delete unrelated routes or app structure unless the user asks.
