# 💡 AI Prompt: Connect Next.js to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the Next.js framework. Your task is to configure the current Next.js project to connect to a Neon Postgres database, demonstrating modern data fetching and mutation patterns.

**Purpose:** Configure a Next.js App Router project to connect to Neon Postgres. Install a database driver, set up environment variables, create a database module, and implement Server Components, Server Actions, and API Routes.

**Scope:**
Must be run inside an existing Next.js project directory (check `package.json` for `next` dependency). If no project exists, first run: `npx create-next-app@latest my-nextjs-app --yes`

---

## Instructions

### 1. Install Dependencies

**Prompt user to select a PostgreSQL driver:**
- `@neondatabase/serverless` (Recommended): Optimized for serverless/edge functions on Vercel
- `postgres` (postgres.js): Fast, full-featured for long-running Node.js servers
- `pg` (node-postgres): Classic, widely-used driver for Node.js

Wait for user choice, then run:

```bash
npm install @neondatabase/serverless    # or postgres or pg based on user choice
```

### 2. Configure Environment Variables

Create `.env.local` if missing, add:

```env
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Prompt user to replace with their Neon connection string** (Neon Console → Project → Connect)

### 3. Create Database Module

Create `app/lib/db.ts` with the driver-specific code:

**For @neondatabase/serverless:**
```ts
import { neon } from '@neondatabase/serverless';
export const sql = neon(process.env.DATABASE_URL!);
```

**For postgres:**
```ts
import postgres from 'postgres';
export const sql = postgres(process.env.DATABASE_URL!);
```

**For pg:**
```ts
import { Pool } from 'pg';
export const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
```

### 4. Create Examples

**Server Component** - Replace `app/page.tsx`:

*For @neondatabase/serverless or postgres:*
```tsx
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

*For pg:*
```tsx
import { pool } from '@/app/lib/db';

async function getDbVersion() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return rows[0].version;
  } finally { client.release(); }
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

**Server Action** - Create `app/action/page.tsx`:

*For @neondatabase/serverless or postgres:*
```tsx
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
    return await sql`SELECT * FROM comments`;
  }

  const comments = await getComments();
  return (
    <div>
      <h2>Server Action Example</h2>
      <form action={createComment}>
        <input type="text" name="comment" placeholder="Add a comment" />
        <button type="submit">Submit</button>
      </form>
      <h3>Comments:</h3>
      <ul>{comments.map((c: any) => <li key={c.id}>{c.comment}</li>)}</ul>
    </div>
  );
}
```

*For pg:*
```tsx
import { pool } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export default async function ActionPage() {
  async function createComment(formData: FormData) {
    'use server';
    const comment = formData.get('comment') as string;
    const client = await pool.connect();
    try { await client.query('INSERT INTO comments (comment) VALUES ($1)', [comment]); }
    finally { client.release(); }
    revalidatePath('/action');
  }

  async function getComments() {
    const client = await pool.connect();
    try {
      await client.query('CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, comment TEXT)');
      const res = await client.query('SELECT * FROM comments');
      return res.rows;
    } finally { client.release(); }
  }

  const comments = await getComments();
  return (
    <div>
      <h2>Server Action Example</h2>
      <form action={createComment}>
        <input type="text" name="comment" placeholder="Add a comment" />
        <button type="submit">Submit</button>
      </form>
      <h3>Comments:</h3>
      <ul>{comments.map((c: any) => <li key={c.id}>{c.comment}</li>)}</ul>
    </div>
  );
}
```

**API Route** - Create `app/api/version/route.ts`:

*For @neondatabase/serverless or postgres:*
```ts
import { sql } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await sql`SELECT version()`;
  return NextResponse.json(result[0]);
}
```

*For pg:*
```ts
import { pool } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return NextResponse.json(rows[0]);
  } finally { client.release(); }
}
```

## Next Steps

Verify DATABASE_URL is set (no placeholders), then:
```bash
npm run dev
```

Test at:
- `http://localhost:3000` - Server Component
- `http://localhost:3000/action` - Server Action
- `http://localhost:3000/api/version` - API Route

## Validation

- Project has `next` and any postgres driver installed
- `.env.local` with `DATABASE_URL` exists
- `app/lib/db.ts` exports database client
- Server-side code imports from `@/app/lib/db`
- For `pg`: client released in `finally` block

## Important

- Never hardcode credentials; always use `process.env`
- Never output user's connection string in responses
- Never import `app/lib/db.ts` into Client Components (`"use client"`)
- Only modify specified files