---
title: Migrate Neon to Lakebase
subtitle: End-to-end migration from Neon Serverless Postgres to Databricks Lakebase Postgres
summary: >-
  Plan and run a full Neon-to-Lakebase migration: Lakebase project and connection
  setup, pg_dump from Neon, pg_restore on Lakebase, verification, cutover, and
  optional Neon teardown, with Databricks docs for Lakebase console and networking.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-04-03T15:00:00.000Z'
---

This guide describes how to migrate a **Neon** database to **Databricks Lakebase Postgres** using **`pg_dump`** and **`pg_restore`**.

<Admonition type="note" title="Logical replication">
Logical replication from Neon to **Lakebase** is not supported. However, you can replicate data from Neon to **Databricks Lakehouse**. See [Replicate data to Databricks with Lakeflow Connect](/docs/guides/logical-replication-databricks).
</Admonition>

## Prerequisites

- A Neon **source** project with the database you are migrating.
- A Databricks account with permission to create **Lakebase** resources in the target region.
- **Postgres major versions** aligned when possible between Neon and Lakebase.
- `pg_dump` and `pg_restore` on a **stable** machine. For install instructions, see [Backups with pg_dump](/docs/manage/backup-pg-dump).

<Admonition type="important">
Lakebase **OAuth** database tokens expire about every hour ([OAuth token authentication](https://docs.databricks.com/aws/en/oltp/projects/authentication#oauth-token-authentication)), so for **`pg_restore`** use a **native Postgres password role** and the connection string from the **Connect** modal (the URI includes the password).
</Admonition>

<Steps>

## Plan the migration

- **Verify Lakebase supports what you need.** Migration assumes Lakebase can run your workload. See **[Lakebase Postgres](https://docs.databricks.com/aws/en/oltp)** for product scope, regions, and operations.
- **Extensions.** On Neon, list installed extensions (for example run `SELECT * FROM pg_extension;`). Compare each one to **[Postgres extensions](https://docs.databricks.com/aws/en/oltp/projects/extensions)** on Databricks. If an extension you depend on is not available on Lakebase, plan an alternative.

## Create a Lakebase project and get a connection string

1. Create a **Lakebase Postgres** project and the target **database**. See [Lakebase Postgres](https://docs.databricks.com/aws/en/oltp).
2. Add a **native Postgres password role** for restore. See [Create Postgres roles](https://docs.databricks.com/aws/en/oltp/projects/postgres-roles).
3. Open the **Connect** modal, select that role, and copy the connection string for use with **pg_restore**. See [Connect to your database](https://docs.databricks.com/aws/en/oltp/projects/connect).

## Export data from Neon

<Admonition type="important">
Avoid using `pg_dump` over a [pooled connection string](/docs/reference/glossary#pooled-connection-string). Use an [unpooled connection string](/docs/reference/glossary#unpooled-connection-string) instead.
</Admonition>

Dump your Neon database with **`pg_dump`**.

1. In the Neon Console, open your project and click **Connect**. Turn **Connection pooling** to **off** and copy the connection string.
2. Run:

```bash
pg_dump -Fc -v -d "<neon_connection_string>" -f neon-export.dump
```

See [Backups with pg_dump](/docs/manage/backup-pg-dump) for the full procedure and flags.

## Restore into Lakebase

Use the **Lakebase connection string** you copied from **Connect** for your password role as the **`pg_restore`** target.

Neon dumps include **ownership** and **privileges** for Neon-specific roles (for example `neondb_owner`, `neon_superuser`, roles used in `ALTER DEFAULT PRIVILEGES`). Those roles do not exist on Lakebase, so a plain `pg_restore` often errors on `ALTER ... OWNER TO ...` and default-privilege grants. That does not mean your tables and data failed to restore; it means ownership and ACL replay could not be applied.

Use **`--no-owner`** so objects are created as the user you connect with, and **`--no-acl`** (or **`-x`**) so Neon-specific `GRANT` / `ALTER DEFAULT PRIVILEGES` statements are skipped. You can grant privileges on Lakebase afterward if your security model needs it.

```bash
pg_restore -v --no-owner --no-acl -d "postgresql://user:password@host/dbname?sslmode=require" neon-export.dump
```

For more on ownership when moving between providers, see [Database object ownership considerations](/docs/import/migrate-from-postgres#database-object-ownership-considerations) in **Migrate data from Postgres**.

## Decommission Neon (optional)

After you have **tested** the Lakebase database (for example with queries and application checks), **cut over** your apps to Lakebase, and confirmed that everything behaves as expected, you can delete the Neon project if you no longer need it. See [Delete a project](/docs/manage/projects#delete-a-project).

</Steps>

## Related docs

**Neon**

- [Region migration](/docs/import/region-migration)
- [Migrate data from Postgres](/docs/import/migrate-from-postgres)

**Databricks Lakebase**

- [Lakebase Postgres](https://docs.databricks.com/aws/en/oltp)
- [Authentication overview](https://docs.databricks.com/aws/en/oltp/projects/authentication)
- [Create Postgres roles](https://docs.databricks.com/aws/en/oltp/projects/postgres-roles)
- [Postgres compatibility](https://docs.databricks.com/aws/en/oltp/projects/compatibility)
- [Postgres extensions](https://docs.databricks.com/aws/en/oltp/projects/extensions)
- [Connect to your database](https://docs.databricks.com/aws/en/oltp/projects/connect)
- [Authenticate to a database instance](https://docs.databricks.com/aws/en/oltp/instances/authentication)

<NeedHelp/>
