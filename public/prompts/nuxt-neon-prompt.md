# 💡 AI Prompt: Connect Nuxt.js to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the Nuxt.js framework. Your task is to configure the current Nuxt.js project to connect to a Neon Postgres database.

**Purpose:** To connect the current Nuxt.js project to Neon Postgres by installing a database driver, wiring `NUXT_DATABASE_URL` through `runtimeConfig`, and adding a server API route that runs `SELECT version()` (using `defineCachedEventHandler` for `@neondatabase/serverless`, as in the Neon Nuxt guide).

**Scope:**
- Must be run inside an existing Nuxt.js project directory.
- Assumes the user has a Neon project and access to their full connection string.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing Nuxt.js project directory. Do not proceed if no Nuxt.js project is detected. You can identify a Nuxt.js project by the presence of `nuxt` in the `dependencies` section of `package.json`.
- **Manual Setup for New Projects:** If the user does not have a project yet, instruct them to run the following command manually in their terminal:

  ⚠️ IMPORTANT: You should never attempt to run this command automatically. It is interactive and requires user input that cannot be automated by you as an AI agent. Ask the user to run it themselves even if they request you to do so.

  ```bash
  npm create nuxt@latest <project-name>
  ```

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

When this prompt is triggered, automatically configure the open Nuxt.js project as follows:

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options:

    *   **`@neondatabase/serverless` (Recommended):** Optimized for serverless and edge functions with HTTP connections. The ideal choice for Nuxt applications deployed on Vercel or Netlify.
    *   **`postgres` (postgres.js):** A fast, full-featured client, excellent for long-running Node.js server environments.
    *   **`pg` (node-postgres):** The classic, widely-used driver for Node.js.

    Make sure to ask the user to choose one of the above options and do not proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2.  Based on the user's selection, run the corresponding installation command:

    ```bash
    # For @neondatabase/serverless
    npm install @neondatabase/serverless

    # For postgres (postgres.js)
    npm install postgres

    # For pg (node-postgres)
    npm install pg
    ```

---

### 2. Configure Environment Variables and Runtime Config

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add `NUXT_DATABASE_URL` and **prompt the user to replace the placeholder** with their connection string from Neon.

    ```dotenv title=".env"
    NUXT_DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.
4.  **Update Nuxt configuration** so server code reads `databaseUrl` from runtime config, matching the Neon Nuxt guide:

    ```typescript title="nuxt.config.ts"
    export default defineNuxtConfig({
      runtimeConfig: {
        databaseUrl: '',
      },
    });
    ```

    At runtime, Nuxt overlays this with the `NUXT_DATABASE_URL` value from the environment (including `.env` during `npm run dev`).

---

### 3. Server API route: `SELECT version()`

Create `server/api/version.get.ts` using the pattern for the selected driver.

#### Option A: Using `@neondatabase/serverless` (`defineCachedEventHandler`, as in the guide)

```typescript title="server/api/version.get.ts"
import { neon } from '@neondatabase/serverless';

export default defineCachedEventHandler(
  async () => {
    const { databaseUrl } = useRuntimeConfig();
    const db = neon(databaseUrl);
    const result = await db`SELECT version()`;
    return result;
  },
  {
    maxAge: 60 * 60 * 24, // cache for a day; adjust as needed
  },
);
```

#### Option B: Using `postgres` (postgres.js)

```typescript title="server/api/version.get.ts"
import postgres from 'postgres';

export default defineEventHandler(async () => {
  const { databaseUrl } = useRuntimeConfig();
  const sql = postgres(databaseUrl, { ssl: 'require' });
  return await sql`SELECT version()`;
});
```

#### Option C: Using `pg` (node-postgres)

```typescript title="server/api/version.get.ts"
import { Pool } from 'pg';

export default defineEventHandler(async () => {
  const { databaseUrl } = useRuntimeConfig();
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: true,
  });
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return rows;
  } finally {
    client.release();
  }
});
```

---

### 4. Optional: Show the version on the home page

The Neon serverless example returns an array of rows from `` db`SELECT version()` ``. You can use `useFetch('/api/version')` and read the first row’s `version` field.

```vue title="app.vue"
<script setup lang="ts">
const { data } = await useFetch('/api/version');
const version = computed(() => {
  const row = Array.isArray(data.value) ? data.value[0] : null;
  return row && typeof row === 'object' && 'version' in row ? (row as { version: string }).version : '';
});
</script>

<template>
  <main>
    <pre v-if="version">{{ version }}</pre>
  </main>
</template>
```

Use `app.vue`, `pages/index.vue`, or your project’s root page path as appropriate.

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `NUXT_DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Start the Nuxt.js development server:
    ```bash
    npm run dev
    ```
3.  Inform the user that the setup is complete. They can open `http://localhost:3000/api/version` for the JSON from `SELECT version()`, and the home page (if updated) to see the version text, consistent with the Neon Nuxt guide.
4.  **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The project has `nuxt` and a supported PostgreSQL driver installed (`@neondatabase/serverless`, `postgres`, or `pg`).
- A `.env` file defines `NUXT_DATABASE_URL` with the placeholder connection string format from the guide.
- `nuxt.config.ts` sets `runtimeConfig.databaseUrl` to `''` (or equivalent) so `NUXT_DATABASE_URL` can populate it at runtime.
- For `@neondatabase/serverless`, `server/api/version.get.ts` uses `defineCachedEventHandler`, `neon(databaseUrl)`, and `` db`SELECT version()` `` with an intentional `maxAge`.
- For `postgres` (postgres.js), the handler uses `{ ssl: 'require' }`.
- For `pg` (node-postgres), the handler uses `ssl: true` on the pool and releases the client in `finally`.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any source code file. Always use Nuxt's `runtimeConfig` and an `.env` file.
- **Do not output the user's connection string** in any response or log.