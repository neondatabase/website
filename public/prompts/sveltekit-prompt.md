# 💡 AI Prompt: Connect SvelteKit to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and SvelteKit. Configure the current SvelteKit project to connect to a Neon Postgres database.

**Purpose:** Install a database driver, configure environment variables, create a server-only database module, and implement a server load function.

**Scope:**
Must run inside an existing SvelteKit project (`@sveltejs/kit` in package.json). If no project exists run:
```bash
npx sv create my-app --template minimal --types ts --no-add-ons --no-install
```

---

## Instructions

### 1. Install Dependencies

**Prompt user to select a PostgreSQL driver:**
- `@neondatabase/serverless` (Recommended): Optimized for serverless/edge on Vercel, Netlify, Cloudflare
- `postgres` (postgres.js): Fast, full-featured for long-running Node.js servers
- `pg` (node-postgres): Classic driver for Node.js

Wait for user choice, then run:

```bash
npm install @neondatabase/serverless dotenv  # or postgres or pg based on user choice
```

### 2. Configure Environment Variables

Create `.env` if missing, add:

```env
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Prompt user to replace with their Neon connection string** (Neon Console → Project → Connect)

### 3. Create Database Module

Create `src/lib/server/db.ts` with driver-specific code:

**For @neondatabase/serverless:**
```ts
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';
export const sql = neon(DATABASE_URL);
```

**For postgres:**
```ts
import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';
export const sql = postgres(DATABASE_URL);
```

**For pg:**
```ts
import { Pool } from 'pg';
import { DATABASE_URL } from '$env/static/private';
export const pool = new Pool({ connectionString: DATABASE_URL });
```

### 4. Create Examples

**Server Load Function** - Create `src/routes/+page.server.ts`:

*For @neondatabase/serverless or postgres:*
```ts
import { sql } from '$lib/server/db';

export async function load() {
  const response = await sql`SELECT version()`;
  return { version: response[0].version as string };
}
```

*For pg:*
```ts
import { pool } from '$lib/server/db';

export async function load() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return { version: rows[0].version };
  } finally { client.release(); }
}
```

**Page Component** - Replace `src/routes/+page.svelte`:
```svelte
<script lang="ts">
  export let data;
</script>

<main>
  <h1>SvelteKit + Neon</h1>
  <p>PostgreSQL Version: {data.version}</p>
</main>
```

---

## Next Steps

Verify DATABASE_URL is set (no placeholders), then:
```bash
npm run dev
```

Test at: `http://localhost:5173`

## Validation

- Project has `@sveltejs/kit` and a postgres driver installed
- `.env` with `DATABASE_URL` exists
- `src/lib/server/db.ts` exports database client
- `src/routes/+page.server.ts` imports from `$lib/server/db` and exports `load`
- `src/routes/+page.svelte` has `export let data`
- For `pg`: client released in `finally` block

## Important

- Never hardcode credentials; use `$env/static/private`
- Never output user's connection string in responses
- Never import `src/lib/server/` into client components
- Only modify specified files
