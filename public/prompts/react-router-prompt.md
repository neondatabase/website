# 💡 AI Prompt: Connect React Router to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the React Router framework. Your task is to configure the current React Router project to connect to a Neon Postgres database using server-side data loaders.

**Purpose:** To connect the current React Router project to Neon Postgres by installing a database driver, configuring environment variables, and creating a new "Route Module" that fetches data on the server and renders it on the client.

**Scope:**
- Must be run inside an existing React Router project directory (created via `create-react-router`).
- Assumes the user has a Neon project and access to their full connection string.
- All modifications will follow the "Route Module" convention, separating server-side `loader` logic from the client-side `Component`.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing React Router project directory. Do not proceed if no such project is detected. You can identify a React Router project by the presence of `@react-router/dev` in the `devDependencies` section of `package.json`.
- **Setup for New Projects:** If the user does not have a project yet, run the following command:

  ```bash
  npx create-react-router@latest my-app --yes
  ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open React Router project as follows:

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options:

    *   **`@neondatabase/serverless` (Recommended):** Optimized for serverless and edge functions with HTTP connections. The ideal choice for applications deployed on Vercel or Netlify.
    *   **`postgres` (postgres.js):** A fast, full-featured client, excellent for long-running Node.js server environments.
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

### 3. Create the Database Connection Route

This involves two steps: defining the new route and creating the file that handles its logic.

#### 3.A: Define the Route

1.  **Locate the main route configuration file** at `app/routes.ts`.
2.  **Add a new route definition** to the exported array that points to a new file, `app/routes/version.tsx`.

    ```typescript title="app/routes.ts"
    import { type RouteConfig, route, index } from '@react-router/dev/routes';

    export default [
      index('./home.tsx'),
      route('version', './routes/version.tsx'), // <-- Add this line
    ] satisfies RouteConfig;
    ```

#### 3.B: Create the Route Module

1.  **Create a new file** at `app/routes/version.tsx`.
2.  Populate it with the code block that corresponds to the driver selected in Step 1. This file contains both the server-side `loader` function and the client-side React `Component`.

    ##### Option A: Using `@neondatabase/serverless`

    ```tsx title="app/routes/version.tsx"
    import { neon } from '@neondatabase/serverless';
    import type { Route } from './+types/version';

    export async function loader() {
      const sql = neon(process.env.DATABASE_URL!);
      const response = await sql`SELECT version()`;
      return { version: response[0].version as string };
    }

    export default function Version({ loaderData }: Route.ComponentProps) {
      return (
        <div>
          <h1>Database Version</h1>
          <p>{loaderData.version}</p>
        </div>
      );
    }
    ```

    ##### Option B: Using `postgres` (postgres.js)

    ```tsx title="app/routes/version.tsx"
    import postgres from 'postgres';
    import type { Route } from './+types/version';

    export async function loader() {
      const sql = postgres(process.env.DATABASE_URL!);
      const response = await sql`SELECT version()`;
      return { version: response[0].version };
    }

    export default function Version({ loaderData }: Route.ComponentProps) {
      return (
        <div>
          <h1>Database Version</h1>
          <p>{loaderData.version}</p>
        </div>
      );
    }
    ```

    ##### Option C: Using `pg` (node-postgres)

    ```tsx title="app/routes/version.tsx"
    import { Pool } from 'pg';
    import type { Route } from './+types/version';

    export async function loader() {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const client = await pool.connect();
      try {
        const { rows } = await client.query('SELECT version()');
        return { version: rows[0].version };
      } finally {
        client.release();
        await pool.end();
      }
    }

    export default function Version({ loaderData }: Route.ComponentProps) {
      return (
        <div>
          <h1>Database Version</h1>
          <p>{loaderData.version}</p>
        </div>
      );
    }
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  **Generate route types.** This is a required step. Run the following command to fix typescript errors:
    ```bash
    npm run typecheck
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
4.  Inform the user that the setup is complete. To test the connection, they can visit `http://localhost:5173/version` in their browser. They should see a page displaying the PostgreSQL version from their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The project has `@react-router/dev` and a supported PostgreSQL driver installed.
- A `.env` file is present or has been created with a `DATABASE_URL` key.
- The `app/routes.ts` file includes a route definition for `'version'` pointing to `./routes/version.tsx`.
- The `app/routes/version.tsx` file exists and exports both an `async function loader()` and a default `Component`.
- The `loader` function correctly uses `process.env.DATABASE_URL` for the connection.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any `.ts` or `.tsx` source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined routes or components. Only modify `app/routes.ts` and create `app/routes/version.tsx` as specified.