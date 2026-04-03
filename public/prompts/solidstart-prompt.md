# 💡 AI Prompt: Connect SolidStart to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the SolidStart meta-framework. Your task is to configure the current SolidStart project to connect to a Neon Postgres database.

**Purpose:** To connect the current SolidStart project to Neon Postgres by installing a database driver, configuring environment variables, and creating both a server-rendered page and an API route to validate the connection.

**Scope:**
- Must be run inside an existing SolidStart project directory.
- Assumes the user has a Neon project and access to their full connection string.
- Modifications will demonstrate two primary data-fetching patterns in SolidStart: server-side page data loading and API routes.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing SolidStart project directory. Do not proceed if no SolidStart project is detected. You can identify a SolidStart project by the presence of `solid-start` in the `dependencies` or `devDependencies` section of `package.json`.
- **Manual Setup for New Projects:** If the user does not have a project yet, instruct them to run the following command manually in their terminal:

  ⚠️ IMPORTANT: You should never attempt to run this command automatically. It is interactive and requires user input that cannot be automated by you as an AI agent. Ask the user to run it themselves even if they request you to do so.

  ```bash
  npm init solid@latest my-solidstart-app
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

When this prompt is triggered, automatically configure the open SolidStart project as follows:

Identify the project's package manager (`npm`, `yarn`, `pnpm`, `bun`) and use it exclusively for all subsequent dependency and script commands. While the examples below use `npm`, substitute the appropriate commands for your project's manager.

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options (same order as the Neon docs):

    *   **`pg` (node-postgres):** The classic, widely-used driver for Node.js.
    *   **`postgres` (postgres.js):** A fast, full-featured client, great for Node.js environments.
    *   **`@neondatabase/serverless` (Neon serverless driver):** Optimized for serverless and edge-style deployments with HTTP connections.

    Make sure to ask the user to choose one of the above options and do not proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2.  Based on the user's selection, run the corresponding installation command.

    ```bash
    # For pg (node-postgres)
    npm install pg

    # For postgres (postgres.js)
    npm install postgres

    # For @neondatabase/serverless (Neon serverless driver)
    npm install @neondatabase/serverless
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

### 3. Create Examples to Test the Connection

To demonstrate both server-side rendering and API endpoints, create two separate examples.

#### 3.A: Create a Server-Rendered Page

1.  **Locate the main home page file** (usually `src/routes/index.tsx`).
2.  **Replace the contents of this file** with the code block that corresponds to the driver selected in Step 1. This page will fetch the database version on the server before rendering.

    ##### Option A: Using `@neondatabase/serverless`

    ```typescript title="src/routes/index.tsx"
    import { neon } from "@neondatabase/serverless";
    import { createAsync, query } from "@solidjs/router";

    const getVersion = query(async () => {
      "use server";
      const sql = neon(process.env.DATABASE_URL);
      const response = await sql`SELECT version()`;
      const { version } = response[0];

      return version;
    }, 'version')

    export const route = {
      preload: () => getVersion(),
    };

    export default function Page() {
      const version = createAsync(() => getVersion());
      return (
        <main>
          <h1>DB Connection Test</h1>
          <p>PostgreSQL Version: {version()}</p>
        </main>
      );
    }
    ```

    ##### Option B: Using `postgres` (postgres.js)

    ```typescript title="src/routes/index.tsx"
    import postgres from 'postgres';
    import { createAsync, query } from "@solidjs/router";

    const getVersion = query(async () => {
      "use server";
      const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
      const response = await sql`SELECT version()`;
      return response[0].version;
    }, 'version')

    export const route = {
      preload: () => getVersion(),
    };

    export default function Page() {
      const version = createAsync(() => getVersion());
      return (
        <main>
          <h1>DB Connection Test</h1>
          <p>PostgreSQL Version: {version()}</p>
        </main>
      );
    }
    ```

    ##### Option C: Using `pg` (node-postgres)

    ```typescript title="src/routes/index.tsx"
    import pg from 'pg';
    import { createAsync, query } from "@solidjs/router";

    const getVersion = query(async () => {
      "use server";
      const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
      });
      const client = await pool.connect();
      const response = await client.query('SELECT version()');
      return response.rows[0].version;
    }, 'version')

    export const route = {
      preload: () => getVersion(),
    };

    export default function Page() {
      const version = createAsync(() => getVersion());
      return (
        <main>
          <h1>DB Connection Test</h1>
          <p>PostgreSQL Version: {version()}</p>
        </main>
      );
    }
    ```

#### 3.B: Create an API Route

1.  **Create a new file** at `src/routes/api/version.ts`.
2.  **Add the contents below** that correspond to the driver selected in Step 1. This will create an API endpoint that returns the database version as JSON.

    ##### Option A: Using `@neondatabase/serverless`

    ```typescript title="src/routes/api/version.ts"
    import { neon } from '@neondatabase/serverless';
    import { json } from '@solidjs/router'

    export async function GET() {
      const sql = neon(process.env.DATABASE_URL!);
      const response = await sql`SELECT version()`;

      return json(response[0]);
    }
    ```

    ##### Option B: Using `postgres` (postgres.js)

    ```typescript title="src/routes/api/version.ts"
    import postgres from 'postgres';
    import { json } from '@solidjs/router'

    export async function GET() {
      const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
      const response = await sql`SELECT version()`;

      return json(response[0]);
    }
    ```

    ##### Option C: Using `pg` (node-postgres)

    ```typescript title="src/routes/api/version.ts"
    import { Pool } from 'pg';
    import { json } from '@solidjs/router'

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    export async function GET() {
      const client = await pool.connect();
      let data = {};
      try {
        const { rows } = await client.query('SELECT version()');
        data = rows[0];
      } finally {
        client.release();
      }
      return json(data);
    }
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Start the SolidStart development server:
    ```bash
    npm run dev
    ```
3.  Inform the user that the setup is complete. When you run `npm run dev`, you can expect to see the Postgres version string on [localhost:3000](http://localhost:3000/):
    *   Visit `http://localhost:3000` for the server-rendered page (Page component).
    *   Visit `http://localhost:3000/api/test` for the API route JSON response.
4.  **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A supported PostgreSQL driver (`pg`, `postgres`, or `@neondatabase/serverless`) is installed.
- A `.env` file is present or has been created with a `DATABASE_URL` key.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any `.ts` or `.tsx` source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined routes or components. Only modify `src/routes/index.tsx` and create `src/routes/api/test.ts` as specified.