# 💡 AI Prompt: Connect a SvelteKit Project to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the SvelteKit framework. Your task is to configure the current SvelteKit project to connect to a Neon Postgres database.

**Purpose:** To connect the current SvelteKit project to Neon Postgres by installing a database driver, configuring environment variables, creating a dedicated server-only database module, and implementing a server `load` function to validate the connection and render it on a page.

**Scope:**
- Must be run inside an existing SvelteKit project directory.
- Assumes the user has a Neon project and access to their full connection string.
- All file modifications must follow SvelteKit conventions for server-side code and data loading.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing SvelteKit project directory. Do not proceed if no SvelteKit project is detected. You can identify a SvelteKit project by the presence of `@sveltejs/kit` in the `devDependencies` section of `package.json`.
- **Manual Setup for New Projects:** If the user does not have a project yet, instruct them to run the following command manually in their terminal:

  ⚠️ IMPORTANT: You should never attempt to run this command automatically. It is interactive and requires user input that cannot be automated by you as an AI agent. Ask the user to run it themselves even if they request you to do so.

  ```bash
  npx sv create my-app --template minimal --no-add-ons --types ts
  ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open SvelteKit project as follows:

Identify the project's package manager (`npm`, `yarn`, `pnpm`, `bun`) and use it exclusively for all subsequent dependency and script commands. While the examples below use `npm`, substitute the appropriate commands for your project's manager.

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options:

    *   **`@neondatabase/serverless` (Recommended):** Optimized for serverless and edge functions with HTTP connections. The ideal choice for SvelteKit applications deployed on Vercel, Netlify, or Cloudflare.
    *   **`postgres` (postgres.js):** A fast, full-featured client, excellent for long-running Node.js server environments.
    *   **`pg` (node-postgres):** The classic, widely-used driver for Node.js.

    Make sure to ask the user to choose one of the above options and do not proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2.  Based on the user's selection, run the corresponding installation command. Also install `dotenv` for managing environment variables during local development.

    ```bash
    # For @neondatabase/serverless
    npm install @neondatabase/serverless dotenv

    # For postgres (postgres.js)
    npm install postgres dotenv

    # For pg (node-postgres)
    npm install pg dotenv
    ```

---

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 3. Create a Centralized Database Module

To securely manage the database connection, create a server-only module. This prevents the database client and credentials from ever being exposed to the browser.

1.  Create a new file at `src/lib/server/db.ts`.
2.  **Use the code block that corresponds to the driver selected in Step 1** to populate this file. This module will initialize and export the database client.

    NOTE: You may see a TypeScript error on the `$env/static/private` import. This is expected. SvelteKit will automatically generate the necessary type definitions the next time you run the development server (`npm run dev`) or build your project, which will resolve the error.

    #### Option A: Using `@neondatabase/serverless`

    ```typescript title="src/lib/server/db.ts"
    import { neon } from '@neondatabase/serverless';
    import { DATABASE_URL } from '$env/static/private';

    export const sql = neon(DATABASE_URL);
    ```

    #### Option B: Using `postgres` (postgres.js)

    ```typescript title="src/lib/server/db.ts"
    import postgres from 'postgres';
    import { DATABASE_URL } from '$env/static/private';

    export const sql = postgres(DATABASE_URL);
    ```

    #### Option C: Using `pg` (node-postgres)

    ```typescript title="src/lib/server/db.ts"
    import { Pool } from 'pg';
    import { DATABASE_URL } from '$env/static/private';

    export const pool = new Pool({
      connectionString: DATABASE_URL,
    });
    ```

---

### 4. Implement Server Load Function and Page Component

Modify the root route to fetch data from the database on the server and display it on the page.

1.  **Create the server load function:** Create a new file at `src/routes/+page.server.ts`. Populate it with the code that corresponds to the driver selected in Step 1.

    #### Option A & B: For `@neondatabase/serverless` or `postgres`

    ```typescript title="src/routes/+page.server.ts"
    import { sql } from '$lib/server/db';

    export async function load() {
      const response = await sql`SELECT version()`;
      return {
        version: response[0].version as string,
      };
    }
    ```

    #### Option C: For `pg` (node-postgres)

    ```typescript title="src/routes/+page.server.ts"
    import { pool } from '$lib/server/db';

    export async function load() {
      const client = await pool.connect();
      try {
        const { rows } = await client.query('SELECT version()');
        return {
          version: rows[0].version,
        };
      } finally {
        client.release();
      }
    }
    ```

2.  **Create the page component:** Locate or create the file `src/routes/+page.svelte` and replace its contents with the following code. This component is driver-agnostic and will render the data passed from the `load` function.

    ```svelte title="src/routes/+page.svelte"
    <script lang="ts">
      export let data;
    </script>

    <main>
      <h1>SvelteKit + Neon</h1>
      <p>Successfully connected to Postgres. Version: {data.version}</p>
    </main>
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Start the SvelteKit development server:
    ```bash
    npm run dev
    ```
3.  Inform the user that the setup is complete. To test the connection, they can visit `http://localhost:5173` in their browser. They should see a page displaying the PostgreSQL version from their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The project has `@sveltejs/kit`, a supported PostgreSQL driver, and `dotenv` installed.
- A `.env` file is present or has been created with a `DATABASE_URL` key.
- A server-only module exists at `src/lib/server/db.ts` and correctly imports `DATABASE_URL` from `$env/static/private`.
- `src/routes/+page.server.ts` exists, imports the database client from `$lib/server/db`, and exports a `load` function.
- `src/routes/+page.svelte` has a `<script>` block that exports a `data` prop.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any source code file. Always use `$env/static/private`.
- **Do not output the user's connection string** in any response or log.
- **Do not import from `src/lib/server/` into any `+page.svelte` or `+layout.svelte` file.** Data should only flow from `+page.server.ts` to the page component via the `data` prop.
- Do not delete or modify other user-defined routes or components. Only create/modify the files specified.