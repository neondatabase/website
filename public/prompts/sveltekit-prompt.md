# 💡 AI Prompt: Connect a SvelteKit Project to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the SvelteKit framework. Your task is to configure the current SvelteKit project to connect to a Neon Postgres database.

**Purpose:** To connect the current SvelteKit project to Neon Postgres by installing a database driver, configuring environment variables, creating `src/db.server.ts`, and implementing `src/routes/+page.server.ts` and `+page.svelte` on the root route, matching the Neon SvelteKit guide.

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
    DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 3. Create `db.server.ts`

Create `src/db.server.ts` at the root of `src` and add the code for the selected driver (same as the Neon SvelteKit guide).

#### Option A: Using `pg` (node-postgres)

```typescript title="src/db.server.ts"
import 'dotenv/config';
import pg from 'pg';

const connectionString: string = process.env.DATABASE_URL as string;

const pool = new pg.Pool({
  connectionString,
  ssl: true,
});

export { pool };
```

#### Option B: Using `postgres` (postgres.js)

```typescript title="src/db.server.ts"
import 'dotenv/config';
import postgres from 'postgres';

const connectionString: string = process.env.DATABASE_URL as string;

const sql = postgres(connectionString, { ssl: 'require' });

export { sql };
```

#### Option C: Using `@neondatabase/serverless`

```typescript title="src/db.server.ts"
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const connectionString: string = process.env.DATABASE_URL as string;

const sql = neon(connectionString);
export { sql };
```

---

### 4. Root route: `+page.server.ts` and `+page.svelte`

1.  **Server load:** Create or replace `src/routes/+page.server.ts`. Import from `../db.server`.

    #### Option A: Using `pg` (node-postgres)

    ```typescript title="src/routes/+page.server.ts"
    import { pool } from '../db.server';

    export async function load() {
      const client = await pool.connect();
      try {
        const { rows } = await client.query('SELECT version()');
        const { version } = rows[0];
        return {
          version,
        };
      } finally {
        client.release();
      }
    }
    ```

    #### Option B & C: Using `postgres` (postgres.js) or `@neondatabase/serverless`

    ```typescript title="src/routes/+page.server.ts"
    import { sql } from '../db.server';

    export async function load() {
      const response = await sql`SELECT version()`;
      const { version } = response[0];
      return {
        version,
      };
    }
    ```

2.  **Page component:** Create or replace `src/routes/+page.svelte`:

    ```svelte title="src/routes/+page.svelte"
    <script>
      export let data;
    </script>

    <h1>Database Version</h1>
    <p>{data.version}</p>
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Start the SvelteKit development server:
    ```bash
    npm run dev
    ```
3.  Inform the user that the setup is complete. To test the connection, they can visit `http://localhost:5173` in their browser. They should see **Database Version** and the PostgreSQL version string from Neon.
4.  **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The project has `@sveltejs/kit`, a supported PostgreSQL driver, and `dotenv` installed.
- A `.env` file is present or has been created with a `DATABASE_URL` key.
- `src/db.server.ts` uses `import 'dotenv/config'` and exports `pool` (pg) or `sql` (postgres.js / Neon) with `ssl: true` or `{ ssl: 'require' }` as in the guide.
- `src/routes/+page.server.ts` imports from `../db.server` and returns `{ version }` from `load()`.
- `src/routes/+page.svelte` exports `data` and displays `data.version`.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any source code file. Use `process.env.DATABASE_URL` via `dotenv/config` in `db.server.ts` as in the guide.
- **Do not output the user's connection string** in any response or log.
- **Do not import `db.server.ts` into `+page.svelte`.** Data must flow from `+page.server.ts` through the `data` prop.
- Do not delete or modify other user-defined routes or components beyond the root route files listed above.