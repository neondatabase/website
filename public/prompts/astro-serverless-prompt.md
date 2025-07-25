# 💡 AI Prompt: Connect Astro to Neon Postgres (Serverless Driver)

**Goal:** Help users connect an existing Astro project to a Neon Postgres database using the **@neondatabase/serverless** driver.

**Scope:**
- Applies only to server-side database access in Astro (`.astro` frontmatter or API routes).
- Assumes the user has:
  - An existing Astro app created via `npm create astro@latest`
  - A Neon Postgres database with the connection string available

---

## ✅ Minimal Example

```
import { neon } from '@neondatabase/serverless';
const sql = neon(import.meta.env.DATABASE_URL);
const result = await sql`SELECT now()`;
console.log(result[0]);
```

---

## ✅ Setup Checklist for Astro + Neon

1. **Install the Neon serverless driver**  
   
   ```
   npm install @neondatabase/serverless
   ```

2. **Add a `.env` file** at the root of the Astro project  
   
   ```
   DATABASE_URL="postgresql://<user>:<password>@<hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
   ```

3. **Use the Neon driver in server-side code only**:
   - `.astro` frontmatter
   - `src/pages/api/*.ts` API routes

4. **Run your Astro project**
   
   ```
   npm run dev
   ```

---

## 🧪 Integration Examples

### `.astro` frontmatter

---
import { neon } from '@neondatabase/serverless';

const sql = neon(import.meta.env.DATABASE_URL);
const response = await sql`SELECT version()`;
const data = response[0].version;
---
<h1>Postgres version:</h1>
<p>{data}</p>

---

### API Route (`src/pages/api/index.ts`)

```
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(import.meta.env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return new Response(JSON.stringify(response[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

## ⚠️ AI Rules & Validation

### ✅ Required Practices
- Use **@neondatabase/serverless** exclusively.
- Connect using:  
  const sql = neon(import.meta.env.DATABASE_URL);
- Store the database connection string in a `.env` file — **never hardcode credentials**.
- Ensure **all queries are server-side only** (in `.astro` or API route).
- Assume the Astro project was created with `npm create astro@latest`.

### 🚫 Do Not
- ❌ Suggest `pg`, `postgres.js`, or any non-serverless client.
- ❌ Hardcode the `DATABASE_URL` or any credentials in code.
- ❌ Run queries on the client side.
- ❌ Suggest loading `.env` with `dotenv` — Astro loads it automatically.

---

## 🔍 Pre-Generation AI Checklist

Before generating output, **validate all of the following**:

- ✅ @neondatabase/serverless is used
- ✅ import.meta.env.DATABASE_URL is used correctly
- ✅ No hardcoded credentials
- ✅ Query is executed **server-side** only
- ✅ Project assumes Astro structure created by `npm create astro@latest`

If any check fails, **revise the output before suggesting it.**

---

Your Astro project is now connected to Neon!  
For more, visit: [Connect Astro to Postgres – Neon Docs](https://neon.tech/docs)

