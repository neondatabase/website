---
title: 'How do I create tables in my Neon database using SQL?'
subtitle: 'Use standard Postgres CREATE TABLE syntax from the SQL Editor, psql, or any driver.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

Neon runs standard Postgres, so you create tables with standard `CREATE TABLE` syntax. Run the statement from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) in the Console, from `psql`, or through any application driver. Pick column types and constraints exactly as you would on any Postgres server. For anything beyond a quick experiment, use a migration tool so your schema lives in version control. See [Query with Neon's SQL Editor](/docs/get-started/query-with-neon-sql-editor) for the in-Console workflow.

## Create a table

A realistic example using common Postgres types and constraints:

```sql
CREATE TABLE users (
  id           BIGSERIAL PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  display_name TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE posts (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT,
  published  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX posts_user_id_idx ON posts (user_id);
```

A few notes on the choices above:

- `BIGSERIAL` gives you an auto-incrementing 64-bit primary key. For newer projects, `GENERATED ALWAYS AS IDENTITY` is the modern equivalent.
- Prefer `TEXT` over `VARCHAR(n)` unless you have a specific length constraint. Both store the same way in Postgres.
- `TIMESTAMPTZ` (timestamp with time zone) is almost always the right time type.
- `JSONB` lets you store and index JSON. Use it for flexible attributes; use regular columns for anything you query often.
- `REFERENCES` adds a foreign key. Add a regular index on the column too; Postgres doesn't create one automatically for the referencing side.

## Three places you can run it

<Tabs labels={["SQL Editor", "psql", "Driver"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech) and select your project.
2. Click **SQL Editor** in the sidebar.
3. Pick the branch and database from the selectors at the top.
4. Paste the `CREATE TABLE` statement and click **Run**.

The SQL Editor also supports meta-commands like `\dt` (list tables) and `\d users` (describe a table). See [Meta-commands](/docs/get-started/query-with-neon-sql-editor#meta-commands).

</TabItem>

<TabItem>

Copy the `psql` command from the **Connection Details** modal (open it from **Connect** on the Project Dashboard), then run your DDL interactively or from a file:

```bash
psql "$NEON_URL" -f schema.sql
```

</TabItem>

<TabItem>

From your application, run the statement through whatever driver you use. For example, with `pg` in Node.js:

```js
import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query(`CREATE TABLE ... `);
await client.end();
```

</TabItem>

</Tabs>

<Admonition type="tip" title="Use a migration tool for real schemas">
Ad-hoc `CREATE TABLE` is fine for prototyping. For anything that needs to evolve, use a migration tool: Drizzle, Prisma Migrate, Alembic, dbmate, Flyway, or sqlx. Migrations keep your schema in version control, apply consistently across environments, and play well with Neon's [branching workflow](/docs/get-started/workflow-primer) (each branch can carry its own migrated schema).
</Admonition>

<CTA title="Connect Neon to your ORM" description="Step-by-step guides for Drizzle, Prisma, SQLAlchemy, Knex, and more." buttonText="ORM guides" buttonUrl="/docs/get-started/orms" />
