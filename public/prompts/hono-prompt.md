# 💡 AI Prompt: Connect Hono to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and modern web frameworks. Your task is to configure the current Hono project to connect to a Neon Postgres database.

**Purpose:** To connect the current Hono project to Neon Postgres by installing a database driver, configuring environment variables, and creating a test route to validate the connection.

**Scope:**
- Must be run inside an existing Hono project directory.
- Assumes the user has a Neon project and access to their full connection string.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing Hono project directory. Do not proceed if no Hono project is detected. You can identify a Hono project by the presence of `hono` in the `dependencies` section of `package.json`.
- **Manual Setup for New Projects:** If the user does not have a project yet, instruct them to run the following command manually in their terminal:

  ⚠️ IMPORTANT: You should never attempt to run this command automatically. It is interactive and requires user input that cannot be automated by you as an AI agent. Ask the user to run it themselves even if they request you to do so.

  ```bash
  npm create hono@latest my-hono-app
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

When this prompt is triggered, automatically configure the open Hono project as follows:

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options:

    *   **`@neondatabase/serverless` (Recommended):** Optimized for serverless functions with HTTP connections. Best choice for Cloudflare Workers, Vercel, etc.
    *   **`postgres` (postgres.js):** A fast, full-featured client, great for Node.js environments.
    *   **`pg` (node-postgres):** The classic, widely-used driver for Node.js.

   Make sure to ask the user to choose one of the above options and don't proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2.  Based on the user's selection, run the corresponding installation command. For the Node.js runtime, ensure `@hono/node-server` is available (install it if the project does not already depend on it).

    ```bash
    npm install @hono/node-server

    # For `@neondatabase/serverless`
    npm install @neondatabase/serverless

    # For `postgres` (postgres.js)
    npm install postgres

    # For `pg` (node-postgres)
    npm install pg
    ```

---

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 3. Create an Example to Test the Connection

To provide a clear way to verify the setup, update the main application entry (for example `src/index.ts`) to query the database and return the PostgreSQL version as JSON.

1.  **Locate the main entry point file** (often `src/index.ts` after `create-hono`).
2.  **Use the code block that corresponds to the driver selected in Step 1.** Ensure `process.env.DATABASE_URL` is loaded in development the same way your Hono template does (for example `dotenv`, Node `--env-file`, or framework env loading).

    #### Option A: Using `pg` (node-postgres)

    ```typescript title="src/index.ts"
    import { Pool } from 'pg';
    import { Hono } from 'hono';
    import { serve } from '@hono/node-server';

    const app = new Hono();
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    app.get('/', async (c) => {
      const client = await pool.connect();
      try {
        const { rows } = await client.query('SELECT version()');
        return c.json({ version: rows[0].version });
      } catch (error) {
        console.error('Database query failed:', error);
        return c.text('Failed to connect to database', 500);
      } finally {
        client.release();
      }
    });

    serve(app);
    ```

    #### Option B: Using `postgres` (postgres.js)

    ```typescript title="src/index.ts"
    import { Hono } from 'hono';
    import postgres from 'postgres';
    import { serve } from '@hono/node-server';

    const app = new Hono();

    app.get('/', async (c) => {
      try {
        const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
        const response = await sql`SELECT version()`;
        return c.json({ version: response[0].version });
      } catch (error) {
        console.error('Database query failed:', error);
        return c.text('Failed to connect to database', 500);
      }
    });

    serve(app);
    ```

    #### Option C: Using `@neondatabase/serverless`

    ```typescript title="src/index.ts"
    import { Hono } from 'hono';
    import { serve } from '@hono/node-server';
    import { neon } from '@neondatabase/serverless';

    const app = new Hono();

    app.get('/', async (c) => {
      try {
        const sql = neon(process.env.DATABASE_URL);
        const response = await sql`SELECT version()`;
        return c.json({ version: response[0]?.version });
      } catch (error) {
        console.error('Database query failed:', error);
        return c.text('Failed to connect to database', 500);
      }
    });

    serve(app);
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their connection string in `.env`. Do not proceed if placeholder values are still present.
2.  Start the Hono development server:
    ```bash
    npm run dev
    ```
3.  Inform the user that the setup is complete. To test the connection, they can visit `http://localhost:3000` in their browser. They should see a JSON response with a `version` field containing the PostgreSQL version from their Neon database.
4.  **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A supported PostgreSQL driver (`@neondatabase/serverless`, `postgres`, or `pg`) is installed as a dependency in `package.json`.
- `@hono/node-server` is present when targeting Node.js with `serve(app)`.
- A `.env` file is present or has been created with a `DATABASE_URL` placeholder.
- The test route uses `Hono`, `serve` from `@hono/node-server`, and the driver pattern from the Neon Hono guide (`Pool` + `ssl: true` for `pg`; `postgres(..., { ssl: 'require' })` inside the handler for postgres.js; `neon(process.env.DATABASE_URL)` inside the handler for the Neon serverless driver).
- The successful JSON shape is `{ version: string }`.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any `.ts` or `.js` source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined routes or middleware. Only adjust the root route and imports needed for the database test.
