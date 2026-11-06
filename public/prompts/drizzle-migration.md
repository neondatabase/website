Generate and apply a Drizzle Kit migration from my schema to Neon:

1. Make the change I describe in `src/schema.ts` (the Drizzle schema).
2. Generate the SQL migration from the schema:
   ```bash
   npx drizzle-kit generate
   ```
   This writes a numbered SQL file to the `drizzle` output folder set in `drizzle.config.ts`. Show me the generated SQL before applying it.
3. Apply the migration to Neon:
   ```bash
   npx drizzle-kit migrate
   ```
   Drizzle Kit reads the connection from `drizzle.config.ts`, which must point at the direct (unpooled) connection string.
4. Confirm the change landed by inspecting the table in the database, then tell me what changed. Do not print the connection string.

For the full walkthrough, see https://neon.com/docs/guides/drizzle.md.
