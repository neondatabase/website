# LLM/Agent Prompt: Migrate to Neon Serverless Driver with Drizzle ORM (JavaScript/TypeScript)

**Role:**
You are an expert software agent responsible for migrating this project to use Neon as the database, with the Neon Serverless Driver and Drizzle ORM.

**Follow these precise, step-by-step instructions.**

**Constraints:**
- Do not output the contents of the `.env` file or the database connection string in any response.
- Do not invent, infer, or guess sensitive values; use only the provided connection string.
- Preserve all unrelated configuration and file contents.
- Do not modify unrelated files or settings.
- Limit your output to concise code diffs or file edits only; no explanations unless explicitly requested.

---

## 1. Provision a Neon Database

- If the project's environment file (`.env` or `.env.local`) already contains a Neon `DATABASE_URL`, skip provisioning and use it.
- Otherwise, provision a temporary Neon Postgres database by running `npx neon@latest claim create` from the project root. No Neon account is required.
  - The command writes `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, and `NEON_BRANCH` to `.env` if it exists, otherwise to `.env.local`. It replaces an existing `DATABASE_URL` and preserves all other entries.
  - If the command fails, ask the user to run `npx neon@latest claim create` themselves.
- Confirm the environment file is listed in `.gitignore`. Add it if it isn't.
- The temporary database expires after about 72 hours unless it's claimed. Tell the user to run `npx neon@latest claim accept` to keep it in their Neon account.

---

## 2. Install Required Packages

- Install the latest versions of these packages:
  - Dependencies: `drizzle-orm`, `@neondatabase/serverless` (1.0.0 or later), `dotenv`
  - Dev dependency: `drizzle-kit`
- Use the project's package manager (`pnpm`, `yarn`, or `npm`) in the correct workspace/package directory.
- Example (for pnpm):
  ```bash
  pnpm add drizzle-orm @neondatabase/serverless dotenv
  pnpm add -D drizzle-kit
  ```

---

## 3. Node.js Version Requirement

- Ensure the project uses Node.js v19 or higher.

---

## 4. Environment Variable Standardization

- Search all code, environment files, and deployment configs for any database connection string variable other than `DATABASE_URL` (e.g., `POSTGRES_URL`).
- Replace all such variables with `DATABASE_URL` in code, `.env` files, and deployment configs.
- Ensure the Neon connection string is stored in `DATABASE_URL`.

---

## 5. Update Drizzle ORM and Neon Integration

- Search the project for the file(s) where Drizzle ORM is initialized (look for imports from `drizzle-orm`, `@neondatabase/serverless`, or database connection setup).
- Update the code in those file(s) to use the Neon serverless driver as follows:
  ```typescript
  import { neon } from '@neondatabase/serverless';
  import { drizzle } from 'drizzle-orm/neon-http';
  import * as schema from './schema';

  const sql = neon(process.env.DATABASE_URL!);
  export const db = drizzle(sql, { schema });
  ```
- If no such file exists, create a new file (e.g., `db.ts`) with the above code and update imports throughout the project to use this new setup.
- Ensure all references to the database connection use this updated integration.

---

## 6. Update Migration Runner

- Search for migration scripts or files (e.g., those that run Drizzle migrations).
- Ensure migrations use a Drizzle database object created with the Neon driver, not just `sql`, with the matching migrator:
  ```typescript
  import 'dotenv/config';
  import { migrate } from 'drizzle-orm/neon-http/migrator';
  import { db } from './db';

  await migrate(db, { migrationsFolder: './drizzle' });
  ```
- Ensure all migration and seed scripts explicitly load environment variables by adding `import 'dotenv/config';` at the top of each script.
- If `drizzle.config.ts` exists, ensure it uses `dialect: 'postgresql'` and reads the connection string from `process.env.DATABASE_URL`.

---

## 7. Query Usage

- Search for all SQL query usage in the codebase.
- Ensure the `neon` function is used as a template function for SQL queries:
  ```typescript
  const result = await sql`SELECT * FROM todos WHERE id = ${id}`;
  ```
- Tagged-template values are sent as query parameters, so they're safe from SQL injection.
- For queries written with `$1`, `$2` placeholders, use `sql.query('SELECT * FROM todos WHERE id = $1', [id])`.
- Use `sql.unsafe()` only for trusted values that aren't user input, such as known table names.
- Replace any calls to `sql` as a conventional function, such as `sql('SELECT ...', [id])`. They throw an error in version 1.0.0 and later.

---

## 8. Checklist (Enforce All)

- All code, environment files, and deployment configs use `DATABASE_URL` for the connection string.
- All required packages are at compatible, up-to-date versions.
- Node.js v19 or higher is used.
- The code uses the latest `@neondatabase/serverless` package and v1.0.0+ patterns.
- The `neon` function is used as a template function for SQL queries.
- All queries use tagged templates or `sql.query()` with placeholders, and `sql.unsafe()` only for trusted values.
- The environment file is listed in `.gitignore`.
- The connection string is stored in an environment variable, not hardcoded.
- For migrations, a Drizzle database object is used, not just `sql`.
- No deprecated/pre-1.0.0 patterns are present.
- Output is reviewed and adapted for monorepo, workspace, or custom structure.

---

## 9. Run Migrations and Seed Database

- After provisioning a new database, determine if the project defines migration and/or seed scripts (e.g., by checking `package.json`).
- If such scripts exist, output instructions to the user to run them (e.g., `pnpm db:migrate`, `pnpm db:seed`) to initialize the schema and data.
- If no migration or seed scripts are found, skip this step.

---

## 10. Troubleshooting

- If error: "This function can now be called only as a tagged-template function": find the call that uses `sql(...)` as a conventional function and change it to a tagged template or `sql.query(...)`.
- If error: "Wrong URL scheme or missing user, host or database in connection parameters": `DATABASE_URL` isn't loaded. Check that the environment file exists and that the script imports `dotenv/config` (or the framework loads `.env` automatically).
- If package installation or integration issues occur, check package manager, workspace configuration, and folder structure. Only output solutions that pass all checklist items. If any check fails, revise the output until full compliance is achieved.

---

**End of prompt.**
**Apply all required changes directly to the codebase. Do not just output instructions; make the edits in the relevant files. Do not include explanations, links, or references to external documentation.**
