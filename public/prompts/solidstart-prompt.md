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

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open SolidStart project as follows:

Identify the project's package manager (`npm`, `yarn`, `pnpm`, `bun`) and use it exclusively for all subsequent dependency and script commands. While the examples below use `npm`, substitute the appropriate commands for your project's manager.

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options:

    *   **`@neondatabase/serverless` (Recommended):** Optimized for serverless and edge functions with HTTP connections. The best choice for SolidStart applications deployed to Vercel, Netlify, or Cloudflare.
    *   **`postgres` (postgres.js):** A fast, full-featured client, great for Node.js environments.
    *   **`pg` (node-postgres):** The classic, widely-used driver for Node.js.

    Make sure to ask the user to choose one of the above options and do not proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2.  Based on the user's selection, run the corresponding installation command.

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

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 3. Create Examples to Test the Connection

To demonstrate both server-side rendering and API endpoints, create two separate examples.

#### 3.A: Create a Server-Rendered Page

1.  **Locate the main home page file** (usually `src/routes/index.tsx`).
2.  **Replace the contents of this file** with the code block that corresponds to the driver selected in Step 1. This page will fetch the database version on the server before rendering.

    ##### Option A: Using `@neondatabase/serverless`

    ```typescript title="src/routes/index.tsx"
    import { createAsync } from "@solidjs/router";
    import { neon } from "@neondatabase/serverless";

    const getDbVersion = async () => {
      "use server";
      const sql = neon(process.env.DATABASE_URL!);
      const response = await sql`SELECT version()`;
      return response[0].version as string;
    };

    export const route = {
      load: () => getDbVersion(),
    };

    export default function Home() {
      const version = createAsync(() => getDbVersion());
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
    import { createAsync } from "@solidjs/router";
    import postgres from "postgres";

    const getDbVersion = async () => {
      "use server";
      const sql = postgres(process.env.DATABASE_URL!);
      const response = await sql`SELECT version()`;
      return response[0].version;
    };

    export const route = {
      load: () => getDbVersion(),
    };

    export default function Home() {
      const version = createAsync(() => getDbVersion());
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
    import { createAsync } from "@solidjs/router";
    import { Pool } from "pg";

    const getDbVersion = async () => {
      "use server";
      const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
      const client = await pool.connect();
      try {
        const { rows } = await client.query('SELECT version()');
        return rows[0].version;
      } finally {
        client.release();
        await pool.end();
      }
    };

    export const route = {
      load: () => getDbVersion(),
    };

    export default function Home() {
      const version = createAsync(() => getDbVersion());
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

    export async function GET() {
      const sql = neon(process.env.DATABASE_URL!);
      const [response] = await sql`SELECT version()`;
      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    ```

    ##### Option B: Using `postgres` (postgres.js)

    ```typescript title="src/routes/api/version.ts"
    import postgres from 'postgres';

    export async function GET() {
      const sql = postgres(process.env.DATABASE_URL!);
      const [response] = await sql`SELECT version()`;
      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    ```

    ##### Option C: Using `pg` (node-postgres)

    ```typescript title="src/routes/api/version.ts"
    import { Pool } from 'pg';

    export async function GET() {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
      const client = await pool.connect();
      try {
        const { rows } = await client.query('SELECT version()');
        return new Response(JSON.stringify(rows[0]), {
          headers: { 'Content-Type': 'application/json' },
        });
      } finally {
        client.release();
        await pool.end();
      }
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
3.  Inform the user that the setup is complete. To test the connection, they can:
    *   Visit `http://localhost:3000` in their browser to see the server-rendered page displaying the PostgreSQL version.
    *   Visit `http://localhost:3000/api/version` to see a JSON response from the API route.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A supported PostgreSQL driver (`@neondatabase/serverless`, `postgres`, or `pg`) is installed.
- A `.env` file is present or has been created with a `DATABASE_URL` key.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any `.ts` or `.tsx` source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined routes or components. Only modify `src/routes/index.tsx` and create `src/routes/api/version.ts` as specified.