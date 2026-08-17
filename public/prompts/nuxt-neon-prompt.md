# 💡 AI Prompt: Connect Nuxt.js to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the Nuxt.js framework. Your task is to configure the current Nuxt.js project to connect to a Neon Postgres database.

**Purpose:** To connect the current Nuxt.js project to Neon Postgres by installing a database driver, storing the connection string in `.env` as `DATABASE_URL`, creating a server-only database module that reads it from `process.env`, and implementing both a server-rendered page and an API route to validate the connection.

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

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Nuxt.js project as follows:

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** The best choice depends on where they deploy:

    -   **`@neondatabase/serverless`:** Connects over HTTP/WebSocket. Best for serverless and edge platforms without their own pooling (Netlify, Deno Deploy, Cloudflare Workers).
    -   **`postgres` (postgres.js) or `pg` (node-postgres):** Standard TCP drivers. Best for long-lived servers (Railway, Render, a VPS, Docker), and for Vercel/Cloudflare with their platform pooling.

    Ask the user to choose one and do not proceed until they do. For a full breakdown, point them to https://neon.com/docs/connect/choose-connection.

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

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**, or by running `neon env pull --file .env` from a linked project directory. (`neon env pull` defaults to `.env.local`, but `nuxt dev` only loads `.env`, so pass `--file .env`.)
4.  No `nuxt.config.ts` change is needed. The connection string is a server-side secret, so the server code below reads `process.env.DATABASE_URL` directly. Do not route it through `runtimeConfig`: a server-only value doesn't need it, and Nuxt does not replace a `runtimeConfig` default set from a differently named `process.env` variable at runtime.

---

### 3. Create a Centralized Database Module

To manage the database connection according to Nuxt conventions, create a server-only utility file.

1.  Ensure the `server/utils/` directory exists. If not, create it.
2.  Create a new file at `server/utils/db.ts`.
3.  **Use the code block that corresponds to the driver selected in Step 1** to populate this file. Each reads `process.env.DATABASE_URL` directly and exports the database client.

    #### Option A: Using `@neondatabase/serverless`

    ```typescript title="server/utils/db.ts"
    import { neon } from '@neondatabase/serverless';

    export const sql = neon(process.env.DATABASE_URL!);
    ```

    #### Option B: Using `postgres` (postgres.js)

    ```typescript title="server/utils/db.ts"
    import postgres from 'postgres';

    export const sql = postgres(process.env.DATABASE_URL!);
    ```

    #### Option C: Using `pg` (node-postgres)

    ```typescript title="server/utils/db.ts"
    import { Pool } from 'pg';

    export const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    ```

---

### 4. Create Examples to Test the Connection

Implement an API route to fetch data and a page to display it.

#### 4.A: Create an API Route

1.  Create a new file at `server/api/version.get.ts`.
2.  Populate it with the code corresponding to the driver selected in Step 1.

    ##### Option A & B: For `@neondatabase/serverless` or `postgres`

    ```typescript title="server/api/version.get.ts"
    import { sql } from '../utils/db';

    export default defineEventHandler(async () => {
      const result = await sql`SELECT version()`;
      return result[0];
    });
    ```

    ##### Option C: For `pg` (node-postgres)

    ```typescript title="server/api/version.get.ts"
    import { pool } from '../utils/db';

    export default defineEventHandler(async () => {
      const client = await pool.connect();
      try {
        const { rows } = await client.query('SELECT version()');
        return rows[0];
      } finally {
        client.release();
      }
    });
    ```

#### 4.B: Create a Page to Display the Data

Modify the main page to fetch data from the new API route.
**Replace the contents of `app/app.vue`** with the following code. This component is driver-agnostic.

```vue title="app/app.vue"
<script setup lang="ts">
const { data, error } = await useFetch('/api/version');
</script>

<template>
  <main>
    <h1>Nuxt.js + Neon</h1>
    <div v-if="data">
      <p>Successfully connected to Postgres. Version:</p>
      <pre>{{ data.version }}</pre>
    </div>
    <div v-else-if="error">
      <p>Failed to connect:</p>
      <pre>{{ error.message }}</pre>
    </div>
  </main>
</template>
```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Start the Nuxt.js development server:
    ```bash
    npm run dev
    ```
3.  Inform the user that the setup is complete. To test the connection, they can:
    -   Visit `http://localhost:3000` to see the server-rendered page displaying the PostgreSQL version.
    -   Visit `http://localhost:3000/api/version` to see a JSON response from the API route.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The project has `nuxt`, and a supported PostgreSQL driver installed.
- A `.env` file is present or has been created with a `DATABASE_URL` key.
- A server utility exists at `server/utils/db.ts` and reads `process.env.DATABASE_URL`.
- An API route exists at `server/api/version.get.ts` and uses the database client.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any source code file. Always read `process.env.DATABASE_URL` from an `.env` file.
- **Do not import `server/utils/db.ts` from a Vue component or `app/` code.** The connection string must stay server-side.
- **Do not output the user's connection string** in any response or log.
