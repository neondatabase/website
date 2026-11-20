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
  pg_dump must use an unpooled connection string. A coding agent with a
  terminal can run the upgrade for you.
enableTableOfContents: true
updatedOn: '2026-11-20T11:55:49.607Z'
---

Each Neon project runs one major Postgres version, the one you chose when you created it. Neon applies minor version updates for you (see [Postgres version support](/docs/postgresql/postgres-version-support)). To move to a newer major version, such as from Postgres 17 to Postgres 19, create a new project on that version and migrate your data to it.

To check your current version, run this in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any SQL client:

```sql
SELECT version();
```

## Before you begin

- Read the [PostgreSQL release notes](https://www.postgresql.org/docs/current/release.html) for the new version, and for any versions you skip, to find changes that affect your app.
- Check that the [extensions](/docs/extensions/pg-extensions) you use are available on the new version.
- Optionally, benchmark your current database so you can compare performance after the upgrade.

## Upgrade your project

<Steps>

## Create a Neon project with the new Postgres version

[Create a new Neon project](/docs/manage/projects#create-a-project) and select the Postgres version you want. Create it in the same region as your current project.

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

The Import Data Assistant only needs the connection string for your current project. It imports into the same or a newer Postgres version, never an older one. Piping `pg_dump` output directly into `pg_restore` saves time but can fail during long migrations, so use it only for small databases.

If you use `pg_dump` and `pg_restore`:

- Connect with an [unpooled connection string](/docs/reference/glossary#unpooled-connection-string), not a [pooled one](/docs/reference/glossary#pooled-connection-string).
- Use the `pg_dump` and `pg_restore` programs from the newer Postgres version. They can read data from every older version Neon supports.
- Dump one database at a time. Neon doesn't support `pg_dumpall`.
- Create your roles in the new project before you restore, because `pg_dump` doesn't copy roles. See [Database object ownership considerations](/docs/import/migrate-from-postgres#database-object-ownership-considerations).

<Admonition type="note">
Neon doesn't upgrade a project to a new major version in place, and doesn't support `pg_upgrade`.
</Admonition>

## Switch over your applications

After the migration finishes and you've checked that the new database works as expected, point your applications at it by replacing your current connection details with the new ones.

To get the new connection details, click **Connect** in the Console nav to open the **Connect to your branch** modal. See [Connect from any application](/docs/connect/connect-from-any-app).

</Steps>

## Upgrade with an AI agent

A coding agent with a terminal, such as Claude Code, Cursor, or Codex, can run the upgrade for you. The prompt below starts by [setting up Neon for your agent](/docs/ai/agent-setup), which installs the Neon CLI, signs you in, and adds the Neon skills and MCP Server. The agent also needs the `pg_dump` and `pg_restore` programs for the new Postgres version.

```text shouldWrap
Set me up for Neon. Fetch https://neon.com/prompts/agent-setup.md and follow it. Then upgrade my Neon project <project_id> to Postgres 19: create a new Neon project on Postgres 19 in the same region, and create the same roles in it. Copy each database to it with pg_dump and pg_restore over unpooled connection strings, using the Postgres 19 versions of those programs. Don't change the current project. When the restore finishes, compare row counts for every table in both projects and give me the new project's connection string.
```

Review the result before you switch your applications over. Chat-only assistants that can't run `pg_dump` can create the project, but they can't copy your data.

<NeedHelp/>
