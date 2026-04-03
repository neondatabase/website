# 💡 AI Prompt: Connect Astro to Neon Postgres

**Purpose:** Connect the currently open Astro project to a Neon Postgres database using the same client options as the Neon Astro guide: `pg` (node-postgres), `postgres` (postgres.js), or `@neondatabase/serverless`.

**Scope:**
- Assumes the Astro project was created via `npm create astro@latest` (or equivalent).
- Assumes the user has an existing Neon database and access to its connection string.
- Must be run inside an open Astro project directory.

✅ Read and understand the entire instruction set before executing

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

When this prompt is triggered, automatically configure the open Astro project as follows:

### 1. Install dependencies

1. **Prompt the user to select a PostgreSQL driver.** Present the following options (same order as the Neon docs):

   - **`pg` (node-postgres):** The classic, widely-used driver for Node.js.
   - **`postgres` (postgres.js):** A fast, full-featured client for Node.js.
   - **`@neondatabase/serverless` (Neon serverless driver):** HTTP-based driver suited to serverless and edge-style deployments.

   Do not proceed until the user chooses one.

2. Run the matching install:

   ```bash
   # For pg (node-postgres)
   npm install pg

   # For postgres (postgres.js)
   npm install postgres

   # For @neondatabase/serverless (Neon serverless driver)
   npm install @neondatabase/serverless
   ```

### 2. Enable on-demand rendering

Run:

```bash
npx astro add node
```

This enables [on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/) (SSR) so pages and API routes can query the database at request time. Without it, database access in production may only run at build time.

### 3. Store Neon credentials

- Ensure a `.env` file exists at the project root.
- Add (or update) `DATABASE_URL` using the user's real values from **Neon Console → Project → Connect**:

  ```dotenv title=".env"
  DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
  ```

- **Do not hardcode** credentials in application source. Astro loads `.env` automatically; do not require `dotenv` for this.

### 4. Create `src/lib/neon.ts` (or `src/lib/neon.js`)

Centralize the client. **Use the block for the driver chosen in step 1.**

#### Option A: `pg` (node-postgres)

```typescript title="src/lib/neon.ts"
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
  ssl: true
});
```

#### Option B: `postgres` (postgres.js)

```typescript title="src/lib/neon.ts"
import postgres from 'postgres';

export const sql = postgres(import.meta.env.DATABASE_URL, { ssl: 'require' });
```

#### Option C: `@neondatabase/serverless`

```typescript title="src/lib/neon.ts"
import { neon } from '@neondatabase/serverless';

export const sql = neon(import.meta.env.DATABASE_URL);
```

### 5. Query from a page (`.astro` frontmatter)

In a page such as `src/pages/index.astro`, query in the frontmatter between `---` fences.

#### Option A: `pg`

```astro
---
import { pool } from '../lib/neon';

const client = await pool.connect();

let data = null;

try {
  const response = await client.query('SELECT version()');
  data = response.rows[0].version;
} finally {
  client.release();
}
---

{data}
```

#### Option B: `postgres` or Option C: `@neondatabase/serverless` (both use exported `sql`)

```astro
---
import { sql } from '../lib/neon';

const response = await sql`SELECT version()`;
const data = response[0].version;
---

{data}
```

You may add markup around `{data}` (for example a heading) as long as the import and query pattern matches the guide.

### 6. Optional: API route `src/pages/api/index.ts`

#### Option A: `pg`

```typescript title="src/pages/api/index.ts"
import { pool } from '../../lib/neon';

export async function GET() {
  const client = await pool.connect();
  let data = {};
  try {
    const { rows } = await client.query('SELECT version()');
    data = rows[0];
  } finally {
    client.release();
  }
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}
```

#### Option B / C: `postgres` or `@neondatabase/serverless`

```typescript title="src/pages/api/index.ts"
import { sql } from '../../lib/neon';

export async function GET() {
  const response = await sql`SELECT version()`;
  return new Response(JSON.stringify(response[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

## 🚀 Next Steps

Once setup is complete:

1. Advise the user to run the Astro dev server:

   ```bash
   npm run dev
   ```

2. **Run the app:** when you run `npm run dev`, you can expect to see the Postgres version string on `localhost:4321` (page) or `localhost:4321/api` (API route):

   - `http://localhost:4321` for the `.astro` page output
   - `http://localhost:4321/api` for the API route JSON

3. **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:

- Exactly one of `pg`, `postgres`, or `@neondatabase/serverless` is installed and used consistently in the utility file, page, and API route.
- The Node adapter is added (`npx astro add node`) so on-demand rendering works in production.
- A `src/lib/neon` utility exists: either `export const pool` (pg) or `export const sql` (postgres.js / Neon serverless).
- Page and API code import from that utility; queries run server-side only (frontmatter or `GET` handler), not in client-side scripts.
- The connection string is read via `import.meta.env.DATABASE_URL`.
- A `.env` file is present or created with `DATABASE_URL` in the canonical Neon format (placeholders until the user pastes a real string).
- Do not suggest installing or configuring `dotenv` for Astro's built-in env loading.

---

## ❌ Do Not

- Do not mix two different drivers in the same code path.
- Do not hardcode credentials.
- Do not run database code in client-only Astro islands without a server endpoint.
- Do not output the user's connection string in logs or assistant replies.

---

For help finding your connection string, see: [Connect from any application – Neon Docs](https://neon.tech/docs/connect/connect-from-any-application)
