---
title: Move changes from a branch to production
subtitle: Options for schema or data changes already made on a development branch
summary: >-
  Explains what to do when schema changes or data already exist on a
  development branch and need to be moved back to production.
enableTableOfContents: true
updatedOn: '2026-05-20T09:47:02.219Z'
---

Neon branches are isolated copy-on-write clones of your data. They're intended for safe development, testing, preview environments, and experimentation without affecting production.

The intended workflow is to create a branch from production, test your changes there, and then apply the final schema migration to production. If you need fresh production data on the development branch, use [Reset from parent](/docs/guides/reset-from-parent).

This guide covers an exception path. Use it when changes were already made directly on a development branch, such as inserted rows, or imported data, and you now need to move some of that work back to production.

<Admonition type="important" title="Use this as a recovery workflow">
Moving changes from a child branch back to its parent is not the default Neon branching workflow. Treat this guide as a recovery path for cases where work has already happened on a development branch and you need a deliberate way to copy or recreate those changes in production.
</Admonition>

Unlike Git branches, database branches can't be merged automatically after they diverge. If the same row is modified in both a development branch and a production branch, Postgres has no built-in way to reconcile those changes.

<Callout title="Is there a 'Merge to parent' button?">
No. Neon doesn't support automatic merging of diverged branches or provide a built-in operation to combine changes from a child branch back to its parent.

[**Reset from parent**](/docs/guides/reset-from-parent) works in the other direction: it updates a child branch with the latest data from its parent. To move schema or data from a development branch back to production, use one of the workflows below.
</Callout>

## Choose the right workflow

| Goal                                      | Recommended workflow                             |
| ----------------------------------------- | ------------------------------------------------ |
| Deploy schema changes                     | Run migrations against production                |
| Copy table data directly between branches | Use `postgres_fdw`                               |
| Copy reference or seed data               | Export and import selected tables with upserts   |
| Move imported or bulk data                | Use `postgres_fdw`, `pg_dump`, or `pg_restore`   |
| Synchronize live divergent branches       | Use logical replication or custom reconciliation |

## Schema-only changes

For schema-only changes, use migrations instead of copying branch state.

Typical workflow:

1. Create a development branch from production
2. Develop and test schema changes
3. Generate migration files
4. Apply migrations to production

This workflow is common with tools such as:

- Prisma Migrate
- Drizzle Kit
- Flyway
- Alembic
- Rails migrations

Because migrations are deterministic and ordered, they avoid the conflict resolution problems associated with merging divergent database states.

If you want to test migrations without exposing production data, use a [schema-only branch](/docs/guides/branching-schema-only).

For general branching workflows, see [Branching](/docs/introduction/branching).

## Copy table data with postgres_fdw

If you need to move specific tables or query data across branches within the same Neon project, you can use the `postgres_fdw` (Foreign Data Wrapper) extension. This lets you connect one branch directly to another and run SQL queries to copy the data without creating a local file export. Checkout the [`postgres_fdw` extension documentation](/docs/extensions/postgres_fdw) for more details.

This workflow works well for moving imported data or copying specific tables from a development branch up to production.

1. Enable the extension on the destination branch, such as your production branch:

   ```sql
   CREATE EXTENSION postgres_fdw;
   ```

2. Create a foreign server pointing to your source branch, such as your development branch, using its connection endpoint:

   ```sql
   CREATE SERVER dev_branch
   FOREIGN DATA WRAPPER postgres_fdw
   OPTIONS (host 'ep-xyz-123456.us-east-2.aws.neon.tech', dbname 'neondb', port '5432');
   ```

3. Create a user mapping with the source branch credentials:

   ```sql
   CREATE USER MAPPING FOR CURRENT_USER
   SERVER dev_branch
   OPTIONS (user 'example_dev_user', password 'AbC123dEf');
   ```

4. Import the foreign table into a temporary schema so it doesn't conflict with your target branch's existing schema:

   ```sql
   CREATE SCHEMA dev_data;
   IMPORT FOREIGN SCHEMA public LIMIT TO (my_imported_table)
   FROM SERVER dev_branch INTO dev_data;
   ```

5. Copy the data. List the columns explicitly, and use `ON CONFLICT` if rows might already exist in the destination:

   ```sql
   INSERT INTO public.my_imported_table (id, name, created_at)
   SELECT id, name, created_at
   FROM dev_data.my_imported_table
   ON CONFLICT (id) DO UPDATE
   SET name = EXCLUDED.name;
   ```

## Export and import selected data

For smaller datasets, reference tables, or seed data, export and import workflows are often the simplest approach.

Examples include:

- Feature flag tables
- Lookup tables
- Country or region data
- Configuration records
- Seed datasets

Typical workflow:

1. Export selected tables from the development branch
2. Review or modify the exported data
3. Import the data into production with a conflict strategy, such as `INSERT ... ON CONFLICT`

For example, you might export a single table using `pg_dump`:

```bash
pg_dump \
  --data-only \
  --table=feature_flags \
  $DEV_DATABASE_URL > feature_flags.sql
```

Then import it into production:

```bash
psql $PROD_DATABASE_URL < feature_flags.sql
```

When possible, design seed scripts and import operations to be idempotent using techniques such as `INSERT ... ON CONFLICT`.

For more information, see [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres).

## Move imported or bulk data

If you imported a large dataset into a development branch for testing or cleanup, move it to production manually. Branches in the same Neon project still act as independent Postgres databases.

Use one of these workflows:

- Connecting the branches directly via [`postgres_fdw`](#copy-table-data-with-postgres_fdw) to copy tables using SQL.
- Exporting and importing using `pg_dump` and `pg_restore`.
- Using an ETL tool or application-level import pipeline.

<Admonition type="note">
If both production and development receive writes, you need to decide how to handle conflicts involving rows, constraints, sequences, and transactions.
</Admonition>

For large or continuously changing datasets, consider [logical replication between Neon projects](/docs/guides/logical-replication-neon-to-neon) instead of a one-time export/import workflow.

If the development branch contains the complete desired production state, you can also perform a controlled cutover by pausing writes and redirecting your application to the tested branch. This replaces production state rather than merging branch histories. For branch operations, see [Manage branches](/docs/manage/branches).
