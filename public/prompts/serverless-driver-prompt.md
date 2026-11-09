# LLM/Agent Prompt: Set up the Neon serverless driver (JavaScript/TypeScript)

**Role:**
You are an expert software agent responsible for connecting this project to a Neon Postgres database using the Neon serverless driver (`@neondatabase/serverless`).

**Follow these precise, step-by-step instructions.**

**Constraints:**
- Do not output the contents of the `.env` file or the database connection string in any response.
- Do not invent, infer, or guess sensitive values; use only the connection string the user provides.
- Preserve all unrelated configuration and file contents.
- Do not modify unrelated files or settings.
- Limit your output to concise code diffs or file edits only; no explanations unless explicitly requested.

---

## 1. Configure the connection string

- Search all code, environment files, and deployment configs for the database connection string variable.
- If the project uses a variable other than `DATABASE_URL` (e.g., `POSTGRES_URL`), replace it with `DATABASE_URL` in code, `.env` files, and deployment configs.
- If no Neon connection string is set, ask the user for one and stop. They can copy it from the **Connect** button in the Neon Console. It looks like `postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require`.
- Store the connection string as `DATABASE_URL` in the project's environment file (e.g., `.env`). If `DATABASE_URL` exists, replace its value. Otherwise, add it to the end of the file. Preserve all other entries.
- Confirm the environment file is listed in `.gitignore`. Add it if it isn't.

---

## 2. Install the driver

- Ensure the project uses Node.js v19 or higher.
- Install the latest version of `@neondatabase/serverless` (1.0.0 or later) with the project's package manager (`pnpm`, `yarn`, or `npm`) in the correct workspace/package directory. For example:
  ```bash
  npm install @neondatabase/serverless
  ```
- The driver includes TypeScript types. Don't install `@types/pg` for it.

---

## 3. Choose HTTP or WebSockets

- Use the `neon()` function over HTTP for single queries and non-interactive transactions. This is the default choice, and it works in serverless and edge runtimes (Vercel, Cloudflare Workers, Netlify, Deno):
  ```typescript
  import { neon } from '@neondatabase/serverless';

  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT * FROM todos WHERE id = ${id}`;
  ```
- Use `Pool` or `Client` over WebSockets only if the project needs interactive transactions, sessions, or a `node-postgres` (`pg`) compatible API. Replace `pg` imports with `@neondatabase/serverless`:
  ```typescript
  import { Pool } from '@neondatabase/serverless';

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const { rows } = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
  ```
- In serverless and edge functions, create, use, and close `Pool` and `Client` inside a single request handler. Don't reuse them across requests.
- On Node.js 21 and earlier, WebSockets need a constructor. Install `ws` and set `neonConfig.webSocketConstructor = ws`. Node.js 22 and later don't need this.
- Make sure scripts that run outside a framework load environment variables, for example with `import 'dotenv/config';`.

---

## 4. Query usage

- Use the `neon()` query function as a tagged template. Template values are sent as query parameters, so they're safe from SQL injection.
- For queries written with `$1`, `$2` placeholders, use `sql.query('SELECT * FROM todos WHERE id = $1', [id])`.
- Use `sql.unsafe()` only for trusted values that aren't user input, such as known table names.
- For multiple queries in one non-interactive transaction, use `sql.transaction([sql`...`, sql`...`])`.
- Replace any calls to `sql` as a conventional function, such as `sql('SELECT ...', [id])`. They throw an error in version 1.0.0 and later.

---

## 5. If the project uses Drizzle ORM

- Skip this step if the project doesn't use Drizzle.
- Use the Drizzle adapter that matches the transport:
  ```typescript
  import { neon } from '@neondatabase/serverless';
  import { drizzle } from 'drizzle-orm/neon-http';
  import * as schema from './schema';

  const sql = neon(process.env.DATABASE_URL!);
  export const db = drizzle(sql, { schema });
  ```
  For WebSockets, use `drizzle-orm/neon-serverless` with a `Pool` instead.
- Run migrations with the matching migrator and a Drizzle database object, not just `sql`:
  ```typescript
  import 'dotenv/config';
  import { migrate } from 'drizzle-orm/neon-http/migrator';
  import { db } from './db';

  await migrate(db, { migrationsFolder: './drizzle' });
  ```

---

## 6. Checklist (Enforce All)

- All code, environment files, and deployment configs use `DATABASE_URL` for the connection string.
- The connection string is stored in an environment variable, not hardcoded, and the environment file is listed in `.gitignore`.
- `@neondatabase/serverless` 1.0.0 or later is installed, and Node.js v19 or higher is used.
- HTTP (`neon()`) is used unless the project needs interactive transactions, sessions, or `pg` compatibility.
- All queries use tagged templates or `sql.query()` with placeholders, and `sql.unsafe()` only for trusted values.
- No pre-1.0.0 patterns (calling `sql` as a conventional function) are present.
- Output is reviewed and adapted for monorepo, workspace, or custom structure.

---

## 7. Troubleshooting

- If error: "This function can now be called only as a tagged-template function": find the call that uses `sql(...)` as a conventional function and change it to a tagged template or `sql.query(...)`.
- If error: "Wrong URL scheme or missing user, host or database in connection parameters": `DATABASE_URL` isn't loaded. Check that the environment file exists and that the script loads it (for example, with `import 'dotenv/config';`).
- If error: "All attempts to open a WebSocket to connect to the database failed": the runtime has no built-in `WebSocket`. Set `neonConfig.webSocketConstructor` (see step 3), or use `neon()` over HTTP.
- If package installation or integration issues occur, check package manager, workspace configuration, and folder structure. Only output solutions that pass all checklist items. If any check fails, revise the output until full compliance is achieved.

---

**End of prompt.**
**Apply all required changes directly to the codebase. Do not just output instructions; make the edits in the relevant files. Do not include explanations, links, or references to external documentation.**
