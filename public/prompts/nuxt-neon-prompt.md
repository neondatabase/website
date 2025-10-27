# 💡 AI Prompt: Connect Nuxt.js to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the Nuxt.js framework. Your task is to configure the current Nuxt.js project to connect to a Neon Postgres database.

**Purpose:** To connect the current Nuxt.js project to Neon Postgres by installing a database driver, securely configuring environment variables via runtime config, creating a server-only database module, and implementing both a server-rendered page and an API route to validate the connection.

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

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `NUXT_DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

    ```dotenv title=".env"
    NUXT_DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.
4.  **Update the Nuxt configuration** to expose the environment variable securely to the server side. Open `nuxt.config.ts` and add the `runtimeConfig` block:

    ```typescript title="nuxt.config.ts"
    export default defineNuxtConfig({
      // Other config...
      runtimeConfig: {
        databaseUrl: process.env.NUXT_DATABASE_URL,
      },
    })
    ```

---

### 3. Create a Centralized Database Module

To manage the database connection according to Nuxt conventions, create a server-only utility file.

1.  Ensure the `server/utils/` directory exists. If not, create it.
2.  Create a new file at `server/utils/db.ts`.
3.  **Use the code block that corresponds to the driver selected in Step 1** to populate this file. This module will initialize and export the database client.

    #### Option A: Using `@neondatabase/serverless`

    ```typescript title="server/utils/db.ts"
    import { neon } from '@neondatabase/serverless';

    const config = useRuntimeConfig();
    export const sql = neon(config.databaseUrl);
    ```

    #### Option B: Using `postgres` (postgres.js)

    ```typescript title="server/utils/db.ts"
    import postgres from 'postgres';

    const config = useRuntimeConfig();
    export const sql = postgres(config.databaseUrl);
    ```

    #### Option C: Using `pg` (node-postgres)

    ```typescript title="server/utils/db.ts"
    import { Pool } from 'pg';

    const config = useRuntimeConfig();
    export const pool = new Pool({
      connectionString: config.databaseUrl,
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

1.  Verify the user has correctly set their `NUXT_DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Start the Nuxt.js development server:
    ```bash
    npm run dev
    ```
3.  Inform the user that the setup is complete. To test the connection, they can:
    *   Visit `http://localhost:3000` to see the server-rendered page displaying the PostgreSQL version.
    *   Visit `http://localhost:3000/api/version` to see a JSON response from the API route.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The project has `nuxt`, and a supported PostgreSQL driver installed.
- A `.env` file is present or has been created with a `NUXT_DATABASE_URL` key.
- `nuxt.config.ts` correctly defines a `runtimeConfig.databaseUrl`.
- A server utility exists at `server/utils/db.ts` and correctly uses `useRuntimeConfig`.
- An API route exists at `server/api/version.get.ts` and uses the database client.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any source code file. Always use Nuxt's `runtimeConfig` and an `.env` file.
- **Do not output the user's connection string** in any response or log.