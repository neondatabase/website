# Best Practice Prompt for Neon Serverless Driver Integration (Drizzle ORM)

Purpose:  
This prompt enforces only the most current, correct, and secure instructions for integrating the Neon serverless driver (`@neondatabase/serverless`) with Drizzle ORM in JavaScript/TypeScript applications.  
It is intended for use by agentic AI/LLMs to generate or refactor code, ensuring all best practices, anti-patterns, and Drizzle-specific requirements are followed.
- Out of scope:
  - Advanced driver configuration (e.g., arrayMode, fullResults, fetchOptions)
  - Local proxy setup for local development
  - Non-JS/TS environments (unless otherwise specified)
  - Prisma, Node.js Pool/Client, Vercel Edge/Serverless (see stack-specific prompts)

## Version Compatibility
- Install compatible versions:
  - `pnpm add drizzle-orm@0.44.2 @neondatabase/serverless@1.0.1 drizzle-kit@0.31.4`
- IF any error about calling the Neon client as a function, THEN update all three packages and restart the dev server.

## Node.js Version
- Use Node.js v19 or higher for Neon serverless driver v1+.

## Environment Variable Migration
- IF any environment variable is used for the database connection string that is not `DATABASE_URL` (e.g., `POSTGRES_URL`), THEN:
  - Update all code, .env files, and deployment configs to use `DATABASE_URL` instead.
  - Replace all instances of the old variable with `DATABASE_URL`.

---

## Essential, Up-to-Date Steps for Integration
- Install `@neondatabase/serverless` and `drizzle-orm` using the project's package manager (`pnpm`, `yarn`, or `npm`) in the correct workspace/package directory.
- Use Node.js v19 or higher.
- Obtain the Neon connection string from the Project Dashboard and assign it to `DATABASE_URL` in the environment.
- Use the `neon` function for HTTP-based queries:
  - Use as a template function for SQL queries.
  - Use `.query()` for parameterized queries.
  - Use `.unsafe()` only for trusted, non-user input values.
- For Drizzle migrations, instantiate a Drizzle database object with the Neon driver, not just `sql`.
- Always close pools/clients in serverless/edge environments.
- No deprecated/pre-1.0.0 patterns.
- Review and adapt output for monorepo, workspace, or custom structure.

---

## Do's and Don'ts

### DO:
- Use the latest compatible versions of all required packages.
- Use the `neon` function as a template function for SQL queries.
- Store the connection string in `DATABASE_URL`.
- Use `.query()` for parameterized queries and `.unsafe()` only for trusted values.
- For migrations, use a Drizzle database object, not just `sql`.
- Review and adapt the output for monorepo, workspace, or custom project structure.
- Ensure all code, environment files, and deployment configs use `DATABASE_URL` for the connection string.

### DO NOT:
- Do not use Node.js versions below 19 for Neon serverless driver v1+.
- Do not call the `neon` function as a conventional function (must be a template function).
- Do not interpolate untrusted user input directly into SQL queries.
- Do not use deprecated or pre-1.0.0 patterns.
- Do not use mismatched or outdated versions of Drizzle ORM, Neon serverless driver, or Drizzle Kit.
- Do not use any environment variable for the connection string other than `DATABASE_URL`.
- Do not install or import `drizzle-orm/neon-http` as a package (it is a subpath import only).

---

## Correct Example (Current Best Practice)

**Dependencies:**
```bash
pnpm add drizzle-orm@0.44.2 @neondatabase/serverless@1.0.1 drizzle-kit@0.31.4
```

**Imports and Usage:**
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });
// Use db for queries and migrations
```

**ALWAYS use:**
```typescript
const result = await sql`SELECT * FROM todos WHERE id = ${id}`;
```

**NEVER use:**
```typescript
// Not supported in v1+
const result = await sql('SELECT * FROM todos WHERE id = $1', [id]);
```

---

## Checklist
- [ ] All code, environment files, and deployment configs use `DATABASE_URL` for the connection string. No other variable is used.
- [ ] All required packages are at compatible, up-to-date versions.
- [ ] Node.js v19 or higher is used.
- [ ] The code uses the latest `@neondatabase/serverless` package and v1.0.0+ patterns.
- [ ] The `neon` function is used as a template function for SQL queries.
- [ ] All queries are parameterized or use `.unsafe()` only for trusted values.
- [ ] The connection string is stored in an environment variable, not hardcoded.
- [ ] For migrations, a Drizzle database object is used, not just `sql`.
- [ ] No deprecated/pre-1.0.0 patterns are present.
- [ ] Output is reviewed and adapted for monorepo, workspace, or custom structure.

---

## Troubleshooting
- IF error: "This function can now be called only as a tagged-template function: sql`SELECT ...`", THEN update all dependencies and ensure correct driver usage.
- IF package installation or integration issues, THEN check package manager, workspace configuration, and folder structure. Only return solutions that pass all checklist items. If any check fails, revise the output until full compliance is achieved.
