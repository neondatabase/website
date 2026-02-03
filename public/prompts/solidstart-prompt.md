# AI Prompt: Connect SolidStart to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the SolidStart meta-framework. Your task is to configure the current SolidStart project to connect to a Neon Postgres database.

**Purpose:** Install driver, configure env vars, create server-rendered page and API route.

**Scope:** Run inside SolidStart project (check `package.json` for `solid-start`). If no project exists, ask user to run: `npm init solid@latest my-solidstart-app`

---

## Instructions (for AI-enabled editors)

### 1. Install Dependencies

**Prompt user to select a PostgreSQL driver:**
- `@neondatabase/serverless` (Recommended): Optimized for serverless/edge on Vercel, Netlify, Cloudflare
- `postgres` (postgres.js): Fast, full-featured for Node.js
- `pg` (node-postgres): Classic, widely-used driver

Wait for user choice, then run:

```bash
npm install @neondatabase/serverless    # or postgres or pg based on user choice
```

### 2. Configure Environment Variables

Create `.env` if missing, add:

```env
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"
```

**Prompt user to replace with their Neon pooled connection string** (Neon Console → Connect)

### 3. Create Server-Rendered Page

Replace `src/routes/index.tsx`:

*For @neondatabase/serverless or postgres:*
```tsx
import { neon } from "@neondatabase/serverless";
// or: import postgres from 'postgres';
import { createAsync, query } from "@solidjs/router";

const getVersion = query(async () => {
  "use server";
  const sql = neon(process.env.DATABASE_URL!);
  // or: const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return response[0].version;
}, 'version')

export const route = { preload: () => getVersion() };

export default function Page() {
  const version = createAsync(() => getVersion());
  return (
    <main>
      <h1>DB Connection Test</h1>
      <p>PostgreSQL Version: {version()}</p>
    </main>
  );
}
```

*For pg:*
```tsx
import pg from 'pg';
import { createAsync, query } from "@solidjs/router";

const getVersion = query(async () => {
  "use server";
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  const response = await client.query('SELECT version()');
  return response.rows[0].version;
}, 'version')

export const route = { preload: () => getVersion() };

export default function Page() {
  const version = createAsync(() => getVersion());
  return (
    <main>
      <h1>DB Connection Test</h1>
      <p>PostgreSQL Version: {version()}</p>
    </main>
  );
}
```

### 4. Create API Route

Create `src/routes/api/version.ts`:

*For @neondatabase/serverless or postgres:*
```ts
import { neon } from '@neondatabase/serverless';
// or: import postgres from 'postgres';
import { json } from '@solidjs/router'

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  // or: const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return json(response[0]);
}
```

*For pg:*
```ts
import { Pool } from 'pg';
import { json } from '@solidjs/router'

const pool = new Pool({ connectionString: process.env.DATABASE_URL!, ssl: true });

export async function GET() {
  const client = await pool.connect();
  let data = {};
  try {
    const { rows } = await client.query('SELECT version()');
    data = rows[0];
  } finally { client.release(); }
  return json(data);
}
```

## Next Steps

Verify DATABASE_URL is set (no placeholders), then:
```bash
npm run dev
```

Test at:
- `http://localhost:3000` - Server-rendered page
- `http://localhost:3000/api/version` - API route

## Validation

- Project has `solid-start` and a postgres driver installed
- `.env` with `DATABASE_URL` exists
- `src/routes/index.tsx` fetches version
- `src/routes/api/version.ts` returns JSON
- For `pg`: client released in `finally` block

## Important

- Never hardcode credentials; always use `process.env`
- Never output user's connection string in responses
- Never modify unrelated routes or components