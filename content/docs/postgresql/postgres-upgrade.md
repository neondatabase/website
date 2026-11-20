---
title: Upgrading your Postgres version
subtitle: Learn how upgrade to a new major Postgres version in Neon
summary: >-
  Upgrading to a new major Postgres version in Neon requires creating a new
  project at the target version and migrating data. Each Neon project is
  locked to the major version selected at creation. Use the Import Data
  Assistant for smaller databases, pg_dump/pg_restore for larger ones, or
  logical replication for near-zero downtime on active databases. Note that
  pg_upgrade is not supported, minor version upgrades are automatic, and
  pg_dump must use an unpooled connection string.
enableTableOfContents: true
updatedOn: '2026-11-20T11:47:22.496Z'
---

This topic describes how to upgrade your Neon project from one **major** Postgres version to a newer one.

Postgres version numbers consist of a **major** and a **minor** version number. For example, in the version number 16.1, 16 is the major version number and the 1 is the minor version number.

Neon manages **minor** Postgres version upgrades for you, as per the [Lakebase Postgres Version Support Policy](/docs/postgresql/postgres-version-support). Typically, no user action is required for **minor** version upgrades. Neon deploys minor versions soon after they become available. However, upgrading to a new major Postgres version is a manual task that must be performed by you.

Each Neon project is tied to a specific Postgres major version, which you selected when creating your Neon project.

You can check your Neon project's Postgres version in the **Postgres** panel on the **Overview** page or by running the following query from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any SQL client connection to your database:

```sql
SELECT version();
```

## Before you begin

- Review the [PostgreSQL release notes](https://www.postgresql.org/docs/current/release.html) for the new Postgres version. Major Postgres versions often introduce user-visible incompatibilities, so review the release notes for these changes. While you can upgrade directly to a new major Postgres version without going through each intermediate version, make sure you review the release notes for any skipped versions, as they may contain changes relevant to your upgrade.
- Optionally, you may want to run some performance tests of your current database to set a benchmark for post-upgrade comparison.

## Upgrade your project

<Steps>

## Create a Neon project with the new Postgres version

[Create a new Neon project](/docs/manage/projects#create-a-project) and select the Postgres version you want. Create it in the same region as your current project.

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

The Import Data Assistant only needs the connection string for your current project, and it can import into a newer Postgres version. Piping `pg_dump` output directly into `pg_restore` saves time but can fail during long migrations, so use it only for small databases.

If you use `pg_dump` and `pg_restore`:

- Connect with an [unpooled connection string](/docs/reference/glossary#unpooled-connection-string), not a [pooled one](/docs/reference/glossary#pooled-connection-string).
- Use the `pg_dump` and `pg_restore` programs from the newer Postgres version. They can read data from every older version Neon supports.
- Dump one database at a time. Neon doesn't support `pg_dumpall`.

<Admonition type="note">
Neon doesn't support `pg_upgrade`.
</Admonition>

## Switch over your applications

After the migration finishes and you've checked that the new database works as expected, point your applications at it by replacing your current connection details with the new ones.

To get the new connection details, click **Connect** in the Console nav to open the **Connect to your branch** modal. See [Connect from any application](/docs/connect/connect-from-any-app).

</Steps>

## Upgrade with an AI agent

A coding agent with a terminal, such as Claude Code, Cursor, or Codex, can run the upgrade for you. Connect it with the [Neon MCP Server](/docs/ai/neon-mcp-server) or the [Neon CLI](/docs/cli), and make sure the `pg_dump` and `pg_restore` programs for the new Postgres version are installed where the agent runs. The agent creates the project and gets the connection strings through Neon, then copies the data with `pg_dump` and `pg_restore` in its terminal.

Give it a prompt like this:

```text shouldWrap
Upgrade my Neon project <project_id> to Postgres 19. Create a new Neon project on Postgres 19 in the same region. Copy each database to it with pg_dump and pg_restore over unpooled connection strings, using the Postgres 19 versions of those programs. Don't change the current project. When the restore finishes, compare row counts for every table in both projects and give me the new project's connection string.
```

Review the result before you switch your applications over. Chat-only assistants that can't run `pg_dump` can create the project, but they can't copy your data.

<NeedHelp/>
