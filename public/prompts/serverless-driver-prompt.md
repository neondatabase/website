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

- Provision a Neon Postgres database using `npx neondb --yes`
- If that fails, prompt the user to run `npx neondb --yes` instead
- If the database is claimable (i.e., a claim URL is provided):
  - Add a comment with the claim URL directly above the `DATABASE_URL` line in the environment file (e.g., `.env`):  
    ```
    # To keep your Neon database permanently, claim it here: https://neon.tech/claim/abc123
    DATABASE_URL=postgres://...
    ```
- Store the Neon connection string in the environment variable `DATABASE_URL` in the project's environment file (e.g., `.env`).
- If `DATABASE_URL` exists, replace its value. If it does not exist, add it to the end of the file. Preserve all other `.env` entries.

---

## 2. Install Required Packages

- Ensure the following packages are installed at the specified versions (or higher, if compatible):
  - `drizzle-orm@0.44.2`
  - `@neondatabase/serverless@1.0.1`
  - `drizzle-kit@0.31.4`
- Use the project's package manager (`pnpm`, `yarn`, or `npm`) in the correct workspace/package directory.
- Example (for pnpm):
  ```bash
  pnpm add drizzle-orm@0.44.2 @neondatabase/serverless@1.0.1 drizzle-kit@0.31.4
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
- Ensure migrations use a Drizzle database object created with the Neon driver, not just `sql`.
- Update the code as needed to use the correct integration pattern.
- Ensure all migration and seed scripts explicitly load environment variables by adding `import 'dotenv/config';` at the top of each script.
- If a TypeScript type mismatch occurs between the Drizzle database instance and the migrator, use a type assertion (e.g., `as any`) to suppress the error.

---

## 7. Query Usage

- Search for all SQL query usage in the codebase.
- Ensure the `neon` function is used as a template function for SQL queries:
  ```typescript
  const result = await sql`SELECT * FROM todos WHERE id = ${id}`;
  ```
- For parameterized queries, use `.query()`. Use `.unsafe()` only for trusted, non-user input values.
- Remove any deprecated or pre-1.0.0 usage patterns (e.g., calling `sql` as a conventional function).

---

## 8. Checklist (Enforce All)

- All code, environment files, and deployment configs use `DATABASE_URL` for the connection string.
- All required packages are at compatible, up-to-date versions.
- Node.js v19 or higher is used.
- The code uses the latest `@neondatabase/serverless` package and v1.0.0+ patterns.
- The `neon` function is used as a template function for SQL queries.
- All queries are parameterized or use `.unsafe()` only for trusted values.
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

- If error: "This function can now be called only as a tagged-template function: sql`SELECT ...`", update all dependencies and ensure correct driver usage.
- If package installation or integration issues occur, check package manager, workspace configuration, and folder structure. Only output solutions that pass all checklist items. If any check fails, revise the output until full compliance is achieved.

---

**End of prompt.**
**Apply all required changes directly to the codebase. Do not just output instructions; make the edits in the relevant files. Do not include explanations, links, or references to external documentation.**