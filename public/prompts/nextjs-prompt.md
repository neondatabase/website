# 💡 AI Prompt: Connect Next.js to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the Next.js framework. Your task is to configure the current Next.js project to connect to a Neon Postgres database, demonstrating modern data fetching and mutation patterns.

**Purpose:** To connect the current Next.js project to Neon Postgres by installing a database driver, configuring environment variables, creating a centralized database module, and implementing examples for Server Components, Server Actions, and API Routes.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing Next.js project directory. Do not proceed if no Next.js project is detected. You can identify a Next.js project by the presence of `next` in the `dependencies` section of `package.json`.
- **Setup for New Projects:** If the user does not have a Next.js project yet, run the following command to create one:

  ```bash
  npx create-next-app@latest my-nextjs-app --yes
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

Configure the open Next.js project as follows:

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options:

    *   **`@neondatabase/serverless` (Recommended):** Optimized for serverless and edge functions with HTTP connections. The ideal choice for applications deployed on Vercel.
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
2.  Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 3. Create a Centralized Database Module

To manage the database connection efficiently and prevent exposing credentials, create a single, server-only module.

1.  Create a new directory `app/lib`.
2.  Inside it, create a file named `db.ts`.
3.  **Use the code block that corresponds to the driver selected in Step 1** to populate this file. This module will initialize and export a reusable database client.

    #### Option A: Using `@neondatabase/serverless`

    ```typescript title="app/lib/db.ts"
    import { neon } from '@neondatabase/serverless';
    export const sql = neon(process.env.DATABASE_URL!);
    ```

    #### Option B: Using `postgres` (postgres.js)

    ```typescript title="app/lib/db.ts"
    import postgres from 'postgres';
    export const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });
    ```

    #### Option C: Using `pg` (node-postgres)

    ```typescript title="app/lib/db.ts"
    import { Pool } from 'pg';
    export const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      ssl: true,
    });
    ```

---

### 4. Create Examples to Test the Connection

Implement the following examples to showcase different Next.js patterns.

#### 4.A: App Router - Server Component (Data Fetching)

Modify the main page to fetch and display the database version on the server.
**Replace the contents of `app/page.tsx`** with the code corresponding to the selected driver.

**Important for AI:** The code examples below include `export const dynamic = 'force-dynamic'` to ensure fresh database queries on every request. After implementing, briefly inform the user that this setting prevents Next.js from caching the page statically, and they can explore other caching strategies in the [Next.js Caching docs](https://nextjs.org/docs/app/building-your-application/caching) if needed.

##### Option A & B: For `@neondatabase/serverless` or `postgres`

```tsx title="app/page.tsx"
import { sql } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

async function getData() {
  const response = await sql`SELECT version()`;
  return response[0].version as string;
}

export default async function Page() {
  const data = await getData();
  return <>{data}</>;
}
```

##### Option C: For `pg` (node-postgres)

```tsx title="app/page.tsx"
import { pool } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

async function getData() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return rows[0].version;
  } finally {
    client.release();
  }
}

export default async function Page() {
  const data = await getData();
  return <>{data}</>;
}
```

#### 4.B: App Router - Server Action (Data Mutation)

Create a new page with a form that uses a Server Action to insert data.
**Create a new file at `app/action/page.tsx`** with the code corresponding to the selected driver.

##### Option A & B: For `@neondatabase/serverless` or `postgres`

```tsx title="app/action/page.tsx"
import { sql } from '@/app/lib/db';

export default async function Page() {
  async function create(formData: FormData) {
    'use server';
    await sql`CREATE TABLE IF NOT EXISTS comments (comment TEXT)`;
    const comment = formData.get('comment');
    await sql`INSERT INTO comments (comment) VALUES (${comment})`;
  }

  return (
    <form action={create}>
      <input type="text" placeholder="write a comment" name="comment" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

##### Option C: For `pg` (node-postgres)

```tsx title="app/action/page.tsx"
import { pool } from '@/app/lib/db';

export default async function Page() {
  async function create(formData: FormData) {
    'use server';
    const client = await pool.connect();
    try {
      await client.query('CREATE TABLE IF NOT EXISTS comments (comment TEXT)');
      const comment = formData.get('comment');
      await client.query('INSERT INTO comments (comment) VALUES ($1)', [comment]);
    } finally {
      client.release();
    }
  }

  return (
    <form action={create}>
      <input type="text" placeholder="write a comment" name="comment" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### 4.C: API Route - Serverless Function

Create a traditional API endpoint that runs on the Node.js runtime.
**Create a new file at `app/api/version/route.ts`** with the code corresponding to the selected driver.

##### Option A & B: For `@neondatabase/serverless` or `postgres`

```ts title="app/api/version/route.ts"
import { sql } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  return NextResponse.json({ version });
}
```

##### Option C: For `pg` (node-postgres)

```ts title="app/api/version/route.ts"
import { pool } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    const { version } = rows[0];
    return NextResponse.json({ version });
  } finally {
    client.release();
  }
}
```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
3.  Inform the user that the setup is complete. To test the different connection patterns, they can visit:
    *   `http://localhost:3000` to see the **Server Component**.
    *   `http://localhost:3000/action` to test the **Server Action** form.
    *   `http://localhost:3000/api/version` to test the **Serverless API Route**.
4.  **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database. For Next.js-specific setup, see the [Neon Auth Next.js quickstart](https://neon.tech/docs/auth/quick-start/nextjs-api-only).

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The project has `next` and a supported PostgreSQL driver installed.
- A `.env` file is present or has been created with a `DATABASE_URL` key.
- A server-only module exists at `app/lib/db.ts` and exports the database client (`sql` or `pool`).
- All server-side code (Server Components, Server Actions, API routes) correctly imports the client from `@/app/lib/db`.
- For `pg`, the pool uses `ssl: true`; for `postgres` (postgres.js), the client uses `{ ssl: 'require' }`.
- For the `pg` driver, ensure the client connection is properly released in a `finally` block where `connect()` is used.

---

## ❌ Do Not

- **Do not skip `neon init`.** Do not scaffold the project or install packages before running `npx -y neonctl@latest init`. It must be the first step.
- **Do not use `next-auth`, `Auth.js`, or other third-party auth libraries** when the user asks for Neon. Use Neon Auth (`@neondatabase/auth`) instead.
- **Do not hardcode credentials** or sensitive information in any source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- **Do not import from `app/lib/db.ts` into any Client Component** (files marked with `"use client"`). This module is for server-side use only.
- Do not delete or modify other user-defined routes or components. Only create/modify the files specified.