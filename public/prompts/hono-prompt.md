# 💡 AI Prompt: Connect Hono to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and modern web frameworks. Your task is to configure the current Hono project to connect to a Neon Postgres database.

**Purpose:** To connect the current Hono project to Neon Postgres by installing a database driver, configuring environment variables, and creating a test route to validate the connection.

**Scope:**
- Must be run inside an existing Hono project directory.
- Assumes the user has a Neon project and access to their full connection string.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing Hono project directory. Donot proceed if no Hono project is detected. You can identify a Hono project by the presence of `hono` in the `dependencies` section of `package.json`.
- **Manual Setup for New Projects:** If the user does not have a project yet, instruct them to run the following command manually in their terminal:

  ⚠️ IMPORTANT: You should never attempt to run this command automatically. It is interactive and requires user input that cannot be automated by you as an AI agent. Ask the user to run it themselves even if they request you to do so.

  ```bash
  npm create hono@latest my-hono-app
  ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Hono project as follows:

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options:

    *   ** `@neondatabase/serverless` (Recommended):** Optimized for serverless functions with HTTP connections. Best choice for Cloudflare Workers, Vercel, etc.
    *   ** `postgres` (postgres.js):** A fast, full-featured client, great for Node.js environments.
    *   ** `pg` (node-postgres):** The classic, widely-used driver for Node.js.

   Make sure to ask the user to choose one of the above options and don't proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2.  Based on the user's selection, run the corresponding installation command:

    ```bash
    # For `@neondatabase/serverless`
    npm install @neondatabase/serverless

    # For `postgres` (postgres.js)
    npm install postgres

    # For `pg` (node-postgres)
    npm install pg

    # Install dotenv for all options
    npm i -D dotenv
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

### 3. Create an Example to Test the Connection

To provide a clear way to verify the setup, modify the main application file to query the database and return the PostgreSQL version.

1.  **Locate the main entry point file** (usually `src/index.ts`).
2.  **Replace the default "Hello Hono!" route** with a new root route that connects to the database.
3.  **Use the code block that corresponds to the driver selected in Step 1.**

    #### Option A: Using `@neondatabase/serverless`

    ```typescript title="src/index.ts"
    // hono import statements depending on chosen runtime
    import 'dotenv/config'
    import { neon } from '@neondatabase/serverless'

    const app = new Hono()

    app.get('/', async (c) => {
      try {
        const sql = neon(process.env.DATABASE_URL!)
        const response = await sql`SELECT version()`
        const version = response[0]?.version || 'No version found'
        return c.json({
          message: 'Connection successful!',
          version: version
        })
      } catch (error) {
        console.error('Database query failed:', error)
        return c.json({ error: 'Failed to connect to the database.' }, 500)
      }
    })

    // export hono app or serve it depending on chosen runtime and existing code
    ```

    #### Option B: Using `postgres` (postgres.js)

    ```typescript title="src/index.ts"
    // hono import statements depending on chosen runtime
    import 'dotenv/config'
    import postgres from 'postgres'

    const app = new Hono()

    app.get('/', async (c) => {
      try {
        const sql = postgres(process.env.DATABASE_URL!)
        const response = await sql`SELECT version()`
        const version = response[0]?.version || 'No version found'
        return c.json({
          message: 'Connection successful!',
          version: version
        })
      } catch (error) {
        console.error('Database query failed:', error)
        return c.json({ error: 'Failed to connect to the database.' }, 500)
      }
    })

    // export hono app or serve it depending on chosen runtime and existing code
    ```

    #### Option C: Using `pg` (node-postgres)

    ```typescript title="src/index.ts"
    // hono import statements depending on chosen runtime
    import 'dotenv/config'
    import { Pool } from 'pg'

    const app = new Hono()

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    })

    app.get('/', async (c) => {
      let client
      try {
        client = await pool.connect()
        const { rows } = await client.query('SELECT version()')
        const version = rows[0]?.version || 'No version found'
        return c.json({
          message: 'Connection successful!',
          version: version
        })
      } catch (error) {
        console.error('Database query failed:', error)
        return c.json({ error: 'Failed to connect to the database.' }, 500)
      } finally {
        client?.release()
      }
    })

    // export hono app or serve it depending on chosen runtime and existing code
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their connection string in `.env`. Do not proceed if placeholder value are still present.
2.  Start the Hono development server:
    ```bash
    npm run dev
    ```
3.  Inform the user that the setup is complete. To test the connection, they can visit `http://localhost:3000` in their browser. They should see a JSON response containing the PostgreSQL version from their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A supported PostgreSQL driver (`@neondatabase/serverless`, `postgres`, or `pg`) is installed as a dependency in `package.json`.
- A `.env` file is present or has been created with a `DATABASE_URL` placeholder.
- The test route correctly imports and uses the chosen driver.
- The connection logic is wrapped in a `try...catch` block to handle potential errors gracefully.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any `.ts` or `.js` source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined routes or middleware. Only modify the default root route created by `create-hono-app`.