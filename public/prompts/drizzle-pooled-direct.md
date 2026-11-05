Set up this project to use the right Neon connection string for each job: the direct (unpooled) URL for Drizzle Kit migrations, and the pooled URL for the application.

1. Make sure both connection strings are in my env file. Neon exposes them as `DATABASE_URL` (pooled, the hostname includes `-pooler`) and `DATABASE_URL_UNPOOLED` (direct, the same hostname without `-pooler`).
2. In `drizzle.config.ts`, point `dbCredentials.url` at `DATABASE_URL_UNPOOLED`. Migrations, dumps, and other session-level work must use the direct connection.
3. In the app's database client (`src/db.ts`), use `DATABASE_URL`, the pooled connection, for normal query traffic.
4. Explain the reason in one short note: the pooled connection routes through PgBouncer in transaction mode, which does not support the session state that migrations rely on, so running Drizzle Kit over the pooled URL can fail in ways that never mention pooling.

Reference: https://neon.com/docs/connect/connection-pooling.md and https://neon.com/docs/guides/drizzle.md.
