# 💡 AI Prompt: Connect Astro to Neon Postgres (Serverless Driver)

**Purpose:** Connect the currently open Astro project to a Neon Postgres database using the `@neondatabase/serverless` driver.

**Scope:**
- Assumes the Astro projects was created via `npm create astro@latest`
- Assumes the user has an existing Neon database and access to its connection string
- Must be run inside an open Astro project directory

✅ Read and understand the entire instruction set before executing

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Astro project as follows:

### 1. Install the Neon serverless driver

Run:

```
npm install @neondatabase/serverless
```

---

### 2. Verify that there is an `.env` file

- Check for the presence of a `.env` file at the root of the project.
- If it doesn't exist, advise the user to create one and add the following line, replacing the connection string with the one copied from their Neon project,

  ```
  DATABASE_URL="postgresql://<user>:<password>@<hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
  ```

- **Do not hardcode** credentials directly in the code.
- Prompt the user to get their connection string from the **Neon Console → Project → Connect**

---

### 3. Update the Astro project to use the Neon driver server-side

#### `.astro` frontmatter

```
import { neon } from '@neondatabase/serverless';

const sql = neon(import.meta.env.DATABASE_URL);
const response = await sql`SELECT version()`;
const data = response[0].version;
```

```
<h1>Postgres version:</h1>
<p>{data}</p>
```

#### API route (`src/pages/api/index.ts`)

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

## 🚀 Next Steps

Once setup is complete:

1. Advise the user to start that Astro dev server:

  ```
   npm run dev
  ```

2. To test the app, open the browser and visit:

   - `http://localhost:4321` to test `.astro` output
   - `http://localhost:4321/api` to test API route

You should see the Postgres version returned by your Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:

- The `@neondatabase/serverless` package is used exclusively
- Queries are server-side only (not in client JS or components)
- The connection string is loaded from `import.meta.env.DATABASE_URL`
- A `.env` file is present or has been created
- No use of `dotenv` (Astro loads `.env` automatically)

---

## ❌ Do Not

- Do not use `pg`, `postgres.js`, or any other Postgres client
- Do not hardcode credentials
- Do not run database code on the client
- Do not suggest installing or configuring `dotenv`

---

For help finding your connection string, see: [Connect from any application – Neon Docs](https://neon.tech/docs/connect/connect-from-any-application)
