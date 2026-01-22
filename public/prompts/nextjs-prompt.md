# 💡 AI Prompt: Connect Next.js to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the Next.js framework. Your task is to configure the current Next.js project to connect to a Neon Postgres database, demonstrating modern data fetching and mutation patterns.

**Purpose:** To connect the current Next.js project to Neon Postgres by installing a database driver, configuring environment variables, creating a centralized database module, and implementing examples for Server Components, Server Actions, and API Routes.

**Scope:**
- Must be run inside an existing Next.js App Router project directory.
- Assumes the user has a Neon project and access to their full connection string.
- All modifications will follow Next.js conventions for server-side logic, environment variables, and data handling.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing Next.js project directory. Do not proceed if no Next.js project is detected. You can identify a Next.js project by the presence of `next` in the `dependencies` section of `package.json`.
- **Setup for New Projects:** If the user does not have a nextjs project yet, run the following command to create one:

  ```bash
  npx create-next-app@latest my-nextjs-app --yes
  ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Next.js project as follows:

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

1.  Check for the presence of a `.env.local` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `DATABASE_URL` parameter to the `.env.local` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

    ```dotenv title=".env.local"
    DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
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
    export const sql = postgres(process.env.DATABASE_URL!);
    ```

    #### Option C: Using `pg` (node-postgres)

    ```typescript title="app/lib/db.ts"
    import { Pool } from 'pg';
    export const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    ```

---

### 4. Create Examples to Test the Connection

Implement the following examples to showcase different Next.js patterns.

#### 4.A: App Router - Server Component (Data Fetching)

Modify the main page to fetch and display the database version on the server.
**Replace the contents of `app/page.tsx`** with the code corresponding to the selected driver.

##### Option A & B: For `@neondatabase/serverless` or `postgres`

```tsx title="app/page.tsx"
import { sql } from '@/app/lib/db';

async function getDbVersion() {
  const result = await sql`SELECT version()`;
  return result[0].version as string;
}

export default async function Home() {
  const version = await getDbVersion();
  return (
    <main>
      <h1>Next.js + Neon</h1>
      <p>PostgreSQL Version: {version}</p>
    </main>
  );
}
```

##### Option C: For `pg` (node-postgres)

```tsx title="app/page.tsx"
import { pool } from '@/app/lib/db';

async function getDbVersion() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return rows[0].version;
  } finally {
    client.release();
  }
}

export default async function Home() {
  const version = await getDbVersion();
  return (
    <main>
      <h1>Next.js + Neon</h1>
      <p>PostgreSQL Version: {version}</p>
    </main>
  );
}
```

#### 4.B: App Router - Server Action (Data Mutation)

Create a new page with a form that uses a Server Action to insert data.
**Create a new file at `app/action/page.tsx`** with the code corresponding to the selected driver.

##### Option A & B: For `@neondatabase/serverless` or `postgres`

```tsx title="app/action/page.tsx"
import { sql } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export default async function ActionPage() {
  async function createComment(formData: FormData) {
    'use server';
    const comment = formData.get('comment') as string;
    await sql`INSERT INTO comments (comment) VALUES (${comment})`;
    revalidatePath('/action');
  }

  async function getComments() {
    await sql`CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, comment TEXT)`;
    const comments = await sql`SELECT * FROM comments`;
    return comments;
  }

  return (
    <div>
      <h2>Server Action Example</h2>
      <form action={createComment}>
        <input type="text" name="comment" placeholder="Add a comment" />
        <button type="submit">Submit</button>
      </form>
      <h3>Comments:</h3>
      <ul>
        {await getComments().then((comments) =>
          comments.map((c: any) => <li key={c.id}>{c.comment}</li>)
        )}
      </ul>
    </div>
  );
}
```

##### Option C: For `pg` (node-postgres)

```tsx title="app/action/page.tsx"
import { pool } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export default async function ActionPage() {
  async function createComment(formData: FormData) {
    'use server';
    const comment = formData.get('comment') as string;
    const client = await pool.connect();
    try {
      await client.query('INSERT INTO comments (comment) VALUES ($1)', [comment]);
    } finally {
      client.release();
    }
    revalidatePath('/action');
  }

  async function getComments() {
    const client = await pool.connect();
    try {
      await client.query('CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, comment TEXT)');
      const res = await client.query('SELECT * FROM comments');
      return res.rows;
    } finally {
      client.release();
    }
  }

  return (
    <div>
      <h2>Server Action Example</h2>
      <form action={createComment}>
        <input type="text" name="comment" placeholder="Add a comment" />
        <button type="submit">Submit</button>
      </form>
      <h3>Comments:</h3>
      <ul>
        {await getComments().then((comments) =>
          comments.map((c: any) => <li key={c.id}>{c.comment}</li>)
        )}
      </ul>
    </div>
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
  const result = await sql`SELECT version()`;
  return NextResponse.json(result[0]);
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
    return NextResponse.json(rows[0]);
  } finally {
    client.release();
  }
}
```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env.local` file. Do not proceed if placeholder values are still present.
2.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
3.  Inform the user that the setup is complete. To test the different connection patterns, they can visit:
    *   `http://localhost:3000` to see the **Server Component**.
    *   `http://localhost:3000/action` to test the **Server Action** form.
    *   `http://localhost:3000/api/version` to test the **Serverless API Route**.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The project has `next` and a supported PostgreSQL driver installed.
- A `.env.local` file is present or has been created with a `DATABASE_URL` key.
- A server-only module exists at `app/lib/db.ts` and exports the database client.
- All server-side code (Server Components, Server Actions, API routes) correctly imports the client from `@/app/lib/db`.
- For the `pg` driver, ensure the client connection is properly released in a `finally` block.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- **Do not import from `app/lib/db.ts` into any Client Component** (files marked with `"use client"`). This module is for server-side use only.
- Do not delete or modify other user-defined routes or components. Only create/modify the files specified.