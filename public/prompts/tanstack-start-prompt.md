# 💡 AI Prompt: Connect TanStack start to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the TanStack start framework. Your task is to configure the current TanStack Start project to connect to a Neon Postgres database, demonstrating modern data fetching and mutation patterns.

**Purpose:** To connect the current TanStack Start project to Neon Postgres by installing a database driver, configuring environment variables, creating a centralized database module, and implementing examples for Server Function and Static Server Function.

**Scope:**

- Must be run inside an existing TanStack Start project directory.
- Assumes the user has a Neon project and access to their full connection string.
- All modifications will follow TanStack Start conventions for server-side logic, environment variables, and data handling.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing TanStack Start project directory. Do not proceed if no TanStack Start project is detected. You can identify a TanStack Start project by the presence of `@tanstack/react-start` or `@tanstack/solid-start` in the `dependencies` section of `package.json`.
- **Setup for New Projects:** If the user does not have a TanStack Start project yet, run the following command to create one:

```bash
  npm create @tanstack/start@latest
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

When this prompt is triggered, automatically configure the TanStack Start project as follows:

### 1. Install Dependencies

1. **Prompt the user to select a PostgreSQL driver.** Present the following options (same order as the Neon docs):

    - **`pg` (node-postgres):** The classic, widely-used driver for Node.js.
    - **`postgres` (postgres.js):** A fast, full-featured client, excellent for long-running Node.js server environments.
    - **`@neondatabase/serverless` (Neon serverless driver):** Optimized for serverless and edge-style deployments with HTTP connections.

    Make sure to ask the user to choose one of the above options and do not proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2. Based on the user's selection, run the corresponding installation command:

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

1. Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2. Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

```dotenv title=".env"
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
```

3. Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 3. Create a Centralized Database Module

To manage the database connection efficiently and prevent exposing credentials, create server-only modules under `src/data`.

1. Create a new directory `src/data` if it does not exist.
2. Create `src/data/get-neon-data.ts` for **Server Functions**. **Use the code block that corresponds to the driver selected in Step 1.**

#### Option A: Using `pg` (node-postgres)

  ```typescript title="src/data/get-neon-data.ts"
  import { Pool } from 'pg';
  import { createServerFn } from "@tanstack/react-start";

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  export const getData = createServerFn({ method: "GET" }).handler(async () => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT version()');
      return rows[0].version;
    } finally {
      client.release();
    }
  });
  ```

#### Option B: Using `postgres` (postgres.js)

  ```typescript title="src/data/get-neon-data.ts"
  import postgres from 'postgres';
  import { createServerFn } from "@tanstack/react-start";

  export const getData = createServerFn({ method: "GET" }).handler(async () => {
    const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
    const response = await sql`SELECT version()`;
    return response[0].version;
  });
  ```

#### Option C: Using `@neondatabase/serverless`

  ```typescript title="src/data/get-neon-data.ts"
  import { neon } from "@neondatabase/serverless";
  import { createServerFn } from "@tanstack/react-start";

  export const getData = createServerFn({ method: "GET" }).handler(async () => {
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`SELECT version()`;

    return response[0].version;
  });
  ```

3. Create `src/data/get-neon-data-static.ts` for **Static Server Functions** (same driver as Step 1). **Use the code block that corresponds to the selected driver.**

#### Option A: Using `pg` (node-postgres)

```typescript title="src/data/get-neon-data-static.ts"
import { Pool } from 'pg';
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export const getData = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .handler(async () => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT version()');
      return rows[0].version;
    } finally {
      client.release();
    }
  });
```

#### Option B: Using `postgres` (postgres.js)

```typescript title="src/data/get-neon-data-static.ts"
import postgres from 'postgres';
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";

export const getData = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .handler(async () => {
    const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
    const response = await sql`SELECT version()`;
    return response[0].version;
  });
```

#### Option C: Using `@neondatabase/serverless`

```typescript title="src/data/get-neon-data-static.ts"
import { neon } from "@neondatabase/serverless";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";

export const getData = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .handler(async () => {
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`SELECT version()`;

    return response[0].version;
  });
```

---

### 4. Create Examples to Test the Connection

Implement the following examples to showcase different TanStack Start patterns.

#### 4.A: Server Function

Update the root route so the loader calls your server function: `createFileRoute`, `loader`, and `RouteComponent` displaying loader data (same pattern as the Neon TanStack Start guide).

**Update `src/routes/index.tsx`** (or the project’s root route file) as follows. The pattern is the same for every driver; only the import path for `getData` stays `../data/get-neon-data.ts`.

```tsx title="src/routes/index.tsx"
import { createFileRoute } from "@tanstack/react-router";
import { getData } from "../data/get-neon-data.ts";

export const Route = createFileRoute("/")({
  loader: async () => {
    return getData();
  },

  component: RouteComponent,
});

export default function RouteComponent() {
  const data = Route.useLoaderData();

  return <>{data}</>;
}
```

#### 4.B: Static Server Functions

_Be aware Static Server Functions are executed at build time, and cached as a static asset for pre-rendering or static generation._

**Create `src/routes/static-server-function.tsx`** using the same route pattern, importing `getData` from `../data/get-neon-data-static.ts`:

```tsx title="src/routes/static-server-function.tsx"
import { createFileRoute } from "@tanstack/react-router";
import { getData } from "../data/get-neon-data-static.ts";

export const Route = createFileRoute("/static-server-function")({
  loader: async () => {
    return getData();
  },

  component: RouteComponent,
});

export default function RouteComponent() {
  const data = Route.useLoaderData();

  return <>{data}</>;
}
```

## 🚀 Next Steps

Once the file modifications are complete:

1. Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2. Start the TanStack Start development server:

```bash
  npm run dev
```

3. Inform the user that the setup is complete. When you run `npm run dev`, you can expect to see the Postgres version string on [localhost:3000](http://localhost:3000/):

- `http://localhost:3000` for the **Server Function** example.
- `http://localhost:3000/static-server-function` for the **Static Server Function** example.

4. **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:

- The project has `start` and a supported PostgreSQL driver installed (`pg`, `postgres`, or `@neondatabase/serverless`).
- A `.env` file is present or has been created with a `DATABASE_URL` key.
- For the `pg` driver, ensure the client connection is properly released in a `finally` block.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined routes or components. Only create/modify the files specified.
