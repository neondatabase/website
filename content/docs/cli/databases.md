---
title: 'Neon CLI command: databases'
subtitle: 'List, create, and delete databases in a Neon project'
summary: >-
  The Neon CLI `databases` command lists, creates, and deletes Postgres
  databases within a Neon project branch directly from the terminal. Use
  `neon databases create --name <db> --owner-name <role>` to provision a
  database on a named branch, or omit `--branch` to target the project's
  default branch. Each subcommand accepts `--project-id` (required only for
  accounts with multiple projects) and `--context-file` for reusable context.
enableTableOfContents: true
updatedOn: '2026-11-09T17:20:53.058Z'
redirectFrom:
  - /docs/reference/cli-databases
  - /docs/cli/database
  - /docs/cli/db
---

The `databases` command lists, creates, and deletes databases in a Neon project from the terminal. It's also available as [`neon postgres databases`](/docs/cli/postgres#databases). For information about databases in Neon, see [Manage databases](/docs/manage/databases). If `--project-id` is omitted, the CLI resolves it from your [context file](/docs/cli/link), auto-selects when your account has only one project, and otherwise asks you to pass `--project-id`.

<CliSubcommands command="databases" />

## neon databases list (#list)

Lists databases. If you don't specify a branch ID or name with `--branch`, the command targets the project's default branch. This applies to all `databases` subcommands.

<CliUsage command="databases list" />

<CliOptions command="databases list" />

```bash
neon databases list
```

```text filename="Output"
Databases on main
Name    Owner Name    Created At
neondb  neondb_owner  2026-06-19T18:27:19Z
```

The table is titled with the branch the databases belong to. Pass `--branch <id-or-name>` to list another branch's databases.

## neon databases create (#create)

Creates a database. If you don't specify `--owner-name`, the branch's only role becomes the database owner. If the branch has more than one role, the command fails unless you pass `--owner-name`. If it has no roles, the command fails.

<CliUsage command="databases create" />

<CliOptions command="databases create" />

```bash
neon databases create --name mynewdb --owner-name alex
```

```text filename="Output"
Database created on main
Name        mynewdb
Owner Name  alex
Created At  2026-06-19T23:45:45Z
```

## neon databases delete (#delete)

Deletes a database. The `<database>` is the database name.

<CliUsage command="databases delete" />

<CliOptions command="databases delete" />

```bash
neon databases delete mydb
```

```text filename="Output"
Database deleted from main
Name        mydb
Owner Name  neondb_owner
Created At  2026-06-19T23:45:45Z
```
