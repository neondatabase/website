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

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the TanStack Start project as follows:

### 1. Install Dependencies

1. **Prompt the user to select a PostgreSQL driver.** Present the following options:

    - **`@neondatabase/serverless` (Recommended):** Optimized for serverless and edge functions with HTTP connections.
    - **`postgres` (postgres.js):** A fast, full-featured client, excellent for long-running Node.js server environments.
    - **`pg` (node-postgres):** The classic, widely-used driver for Node.js.

    Make sure to ask the user to choose one of the above options and do not proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2. Based on the user's selection, run the corresponding installation command:

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

1. Check for the presence of a `.env.local` file at the root of the project. If it doesn't exist, create one.
2. Add the following `DATABASE_URL` parameter to the `.env.local` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

```dotenv title=".env.local"
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
```

3. Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 3. Create a Centralized Database Module

To manage the database connection efficiently and prevent exposing credentials, create a single, server-only module.

1. Create a new directory `src/data`.
2. Inside it, create a file named `db.ts`.
3. **Use the code block that corresponds to the driver selected in Step 1** to populate this file. This module will initialize and export a reusable database client.

#### Option A: Using `@neondatabase/serverless`

  ```typescript title="data/db"
  import { createServerFn } from "@tanstack/react-start";
  import { neon } from "@neondatabase/serverless";

  export const getServerlessDriverData = createServerFn({
    method: "GET",
  }).handler(async () => {
    if (process.env.DATABASE_URL == null) {
      console.warn("[Error]: Missing database url");
      throw new Error("Missing database url");
    }

    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`SELECT version()`;

    return response[0].version;
  });
  ```

#### Option B: Using `postgres` (postgres.js)

  ```typescript title="data/db"
  import { createServerFn } from "@tanstack/react-start";
  import postgres from "postgres";

  export const getPostgresJsData = createServerFn({ method: "GET" }).handler(
    async () => {
      if (process.env.DATABASE_URL == null) {
        console.warn("[Error]: Missing database url");
        throw new Error("Missing database url");
      }

      const sql = postgres(process.env.DATABASE_URL, {
        ssl: "require",
      });
      const response = await sql`SELECT version()`;
      return response[0].version;
    },
  );
  ```

#### Option C: Using `pg` (node-postgres)

  ```typescript title="data/db"
  import { createServerFn } from "@tanstack/react-start";
  import { Pool } from "pg";

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  export const getNodePostgresData = createServerFn({ method: "GET" }).handler(
    async () => {
      const client = await pool.connect();
      try {
        const { rows } = await client.query("SELECT version()");
        return rows[0].version;
      } finally {
        client.release();
      }
    },
  );
  ```

5. Create an additional file inside the `src/data` directory called `static-db.ts`.
4. **Use the code block that corresponds to the driver selected in Step 1** to populate this file. This module will initialize and export a reusable database client.

#### Option A: Using `@neondatabase/serverless`

```typescript title="data/static-db.ts"
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { createServerFn } from "@tanstack/react-start";

import { neon } from "@neondatabase/serverless";

export const getServerlessDriverData = createServerFn({ method: "GET" })
.middleware([staticFunctionMiddleware])
.handler(async () => {
  if (process.env.DATABASE_URL == null) {
    console.warn("[Error]: Missing database url");
    throw new Error("Missing database url");
  }

  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`SELECT version()`;

  return response[0].version;
});

```

#### Option B: Using `postgres` (postgres.js)

```typescript title="data/static-db.ts"
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { createServerFn } from "@tanstack/react-start";

import postgres from "postgres";

export const getPostgresJsData = createServerFn({ method: "GET" })
.middleware([staticFunctionMiddleware])
.handler(async () => {
  if (process.env.DATABASE_URL == null) {
    console.warn("[Error]: Missing database url");
    throw new Error("Missing database url");
  }

  const sql = postgres(process.env.DATABASE_URL, {
    ssl: "require",
  });
  const response = await sql`SELECT version()`;
  return response[0].version;
});
```

#### Option C: Using `pg` (node-postgres)

```typescript title="data/static-db.ts"
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { createServerFn } from "@tanstack/react-start";

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export const getNodePostgresData = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .handler(async () => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query("SELECT version()");
      return rows[0].version;
    } finally {
      client.release();
    }
  });
```

---

### 4. Create Examples to Test the Connection

Implement the following examples to showcase different TanStack Start patterns.

#### 4.A: Server Function

Modify the main page to fetch and display the database version on the server.
**Replace the contents of `app/page.tsx`** with the code corresponding to the selected driver.

##### Option A: For `@neondatabase/serverless`

```tsx title="src/routes/index.js"
import { createFileRoute } from "@tanstack/react-router";

// data
import { getServerlessDriverData } from "../data/db.ts";

export const Route = createFileRoute("/")({
  loader: async () => {
    return getServerlessDriverData();
  },

  component: App,
});

function App() {
  const data = Route.useLoaderData();

  return (
    <div className="container">
      <h1>Serverless Driver</h1>
      <p>Data loaded from a Neon serverless driver instance.</p>

      <p style={{ marginTop: "3rem" }}>Postgres version:</p>
      <p>{data}</p>
    </div>
  );
}
```

##### Option B: For `postgres`

```tsx title="src/routes/index.js"
import { createFileRoute } from "@tanstack/react-router";

// data
import { getPostgresJsData } from "../data/db.ts";

export const Route = createFileRoute("/")({
  loader: async () => {
    return getPostgresJsData();
  },

  component: App,
});

function App() {
  const data = Route.useLoaderData();

  return (
    <div className="container">
      <h1>Serverless Driver</h1>
      <p>Data loaded from a Neon serverless driver instance.</p>

      <p style={{ marginTop: "3rem" }}>Postgres version:</p>
      <p>{data}</p>
    </div>
  );
}
```

##### Option C: For `pg` (node-postgres)

```tsx title="src/routes/index.js"
import { createFileRoute } from "@tanstack/react-router";

// data
import { getNodePostgresData } from "../data/db.ts";

export const Route = createFileRoute("/")({
  loader: async () => {
    return getNodePostgresData();
  },

  component: App,
});

function App() {
  const data = Route.useLoaderData();

  return (
    <div className="container">
      <h1>Serverless Driver</h1>
      <p>Data loaded from a Neon serverless driver instance.</p>

      <p style={{ marginTop: "3rem" }}>Postgres version:</p>
      <p>{data}</p>
    </div>
  );
}
```

#### 4.B: Static Server Functions

Create a new page to demonstrate TanStack start's static server function and the integration with neon.
**Create a new file at `src/routes/static-server-function.tsx`** with the code corresponding to the selected driver.

##### Option A: For `@neondatabase/serverless`

```tsx title="src/routes/static-server-function.js"
import { createFileRoute } from "@tanstack/react-router";
import { getServerlessDriverData } from "../data/static-db";

export const Route = createFileRoute("/static-server-function")({
  loader: async () => {
    return getServerlessDriverData();
  },

  component: App,
});

function App() {
  const data = Route.useLoaderData();

  return (
    <div className="container">
      <h1>Serverless Driver</h1>
      <p>Data loaded from a Neon serverless driver instance.</p>

      <p style={{ marginTop: "3rem" }}>Postgres version:</p>
      <p>{data}</p>
    </div>
  );
}
```

##### Option B: For `postgres`

```tsx title="src/routes/static-server-function.js"
import { createFileRoute } from "@tanstack/react-router";
import { getPostgresJsData } from "../data/static-db";

export const Route = createFileRoute("/static-server-function")({
  loader: async () => {
    return getPostgresJsData();
  },

  component: App,
});

function App() {
  const data = Route.useLoaderData();

  return (
    <div className="container">
      <h1>Serverless Driver</h1>
      <p>Data loaded from a Neon serverless driver instance.</p>

      <p style={{ marginTop: "3rem" }}>Postgres version:</p>
      <p>{data}</p>
    </div>
  );
}
```

##### Option C: For `pg` (node-postgres)

```tsx title="src/routes/static-server-function.js"
import { createFileRoute } from "@tanstack/react-router";
import { getNodePostgresData } from "../data/static-db";

export const Route = createFileRoute("/static-server-function")({
  loader: async () => {
    return getNodePostgresData();
  },

  component: App,
});

function App() {
  const data = Route.useLoaderData();

  return (
    <div className="container">
      <h1>Serverless Driver</h1>
      <p>Data loaded from a Neon serverless driver instance.</p>

      <p style={{ marginTop: "3rem" }}>Postgres version:</p>
      <p>{data}</p>
    </div>
  );
}
```

Once the file modifications are complete:

1. Verify the user has correctly set their `DATABASE_URL` in the `.env.local` file. Do not proceed if placeholder values are still present.
2. Start the TanStack Start development server:

```bash
  npm run dev
```

3. Inform the user that the setup is complete. To test the different connection patterns, they can visit:
  
- `http://localhost:3000` to see the **Server Function**.
- `http://localhost:3000/static-server-function` to see the **Static Server Function**.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:

- The project has `start` and a supported PostgreSQL driver installed.
- A `.env.local` file is present or has been created with a `DATABASE_URL` key.
- For the `pg` driver, ensure the client connection is properly released in a `finally` block.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined routes or components. Only create/modify the files specified.
