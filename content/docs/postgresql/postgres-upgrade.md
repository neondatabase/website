---
title: Upgrading your Postgres version
subtitle: Move your Neon project to a newer major Postgres version
summary: >-
  Upgrading to a new major Postgres version in Neon requires creating a new
  project at the target version and migrating data. Each Neon project is
  locked to the major version selected at creation. Use the Import Data
  Assistant for smaller databases, pg_dump/pg_restore for larger ones, or
  logical replication for near-zero downtime on active databases. Note that
  pg_upgrade is not supported, minor version upgrades are automatic, and
  pg_dump must use an unpooled connection string.
enableTableOfContents: true
updatedOn: '2026-11-20T13:53:03.601Z'
---

Each Neon project runs one major Postgres version, the one you chose when you created it. Neon applies minor version updates for you (see [Postgres version support](/docs/postgresql/postgres-version-support)). To move to a newer major version, such as from Postgres 17 to Postgres 19, create a new project on that version and migrate your data to it.

To check your current version, run this in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any SQL client:

```sql
SELECT version();
```

## Before you begin

- Read the [PostgreSQL release notes](https://www.postgresql.org/docs/current/release.html) for the new version, and for any versions you skip, to find changes that affect your app.
- Check that the extensions you use are available on the new version. Run `SELECT extname, extversion FROM pg_extension;` in each database to list them, then look them up in the [supported extensions table](/docs/extensions/pg-extensions).

## Upgrade your project

<Steps>

## Create a Neon project with the new Postgres version

[Create a new Neon project](/docs/manage/projects#create-a-project) and select the Postgres version you want. Create it in the same region as your current project. With the [Neon CLI](/docs/cli/projects#create):

```bash
neon projects create --name my-app-pg19 --pg-version 19 --region-id aws-us-east-2
```

If you use the Import Data Assistant, you can create the project from inside the assistant instead. It defaults to your current database's version, so select the newer one.

If you've configured any of these settings in your current project, apply them to the new one now or after you migrate your data:

- [Compute size](/docs/manage/computes#edit-a-compute)
- [Autoscaling](/docs/guides/autoscaling-guide)
- [Scale to Zero](/docs/guides/scale-to-zero-guide)
- [Protected branches](/docs/guides/protected-branches)
- [IP Allow](/docs/introduction/ip-allow)

## Migrate your data

Choose a method based on your database size and how much downtime you can accept:

| Method                                                               | Best for                                         | Downtime                               |
| -------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------- |
| [Import Data Assistant](/docs/import/import-data-assistant)          | Databases under 10 GB                            | Some, during the import                |
| [pg_dump and pg_restore](/docs/import/migrate-from-postgres)         | Databases of any size                            | Some, between the dump and the restore |
| [Piping pg_dump to pg_restore](/docs/import/migrate-from-neon)       | Small databases                                  | Some, during the copy                  |
| [Logical replication](/docs/guides/logical-replication-neon-to-neon) | Active databases that can't afford much downtime | Near zero                              |

The Import Data Assistant only needs the connection string for your current project. It imports into the same or a newer Postgres version, never an older one. Its compatibility checks can flag an extension as unsupported even when it's available on the new version. See the [false extension warning note](/docs/import/import-data-assistant#check-compatibility) and compare against the [supported extensions table](/docs/extensions/pg-extensions) instead. Piping `pg_dump` output directly into `pg_restore` saves time but can fail during long migrations, so use it only for small databases.

If you use `pg_dump` and `pg_restore`:

- Connect with an [unpooled connection string](/docs/reference/glossary#unpooled-connection-string), not a [pooled one](/docs/reference/glossary#pooled-connection-string).
- Use the `pg_dump` and `pg_restore` programs from the newer Postgres version. They can read data from every older version Neon supports, and an older `pg_restore` refuses to restore into a newer server.
- Dump one database at a time. Neon doesn't support `pg_dumpall`.
- You can ignore `permission denied to change default privileges` errors for the `cloud_admin` role during the restore. The new project already has those privileges.
- Create your roles in the new project before you restore, because `pg_dump` doesn't copy roles. See [Database object ownership considerations](/docs/import/migrate-from-postgres#database-object-ownership-considerations).

<Admonition type="note">
Neon doesn't upgrade a project to a new major version in place, and doesn't support `pg_upgrade`.
</Admonition>

## Switch over your applications

After the migration finishes and you've checked that the new database works as expected, point your applications at it by replacing your current connection details with the new ones.

To get the new connection details, click **Connect** in the Console nav to open the **Connect to your branch** modal, or run [`neon connection-string`](/docs/cli/connection-string) with the new project's ID. Add `--pooled` for a pooled connection string.

```bash
neon connection-string --project-id <new_project_id>
```

See [Connect from any application](/docs/connect/connect-from-any-app).

</Steps>

<NeedHelp/>
