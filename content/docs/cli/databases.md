---
title: 'Neon CLI command: databases'
subtitle: 'List, create, and delete databases in a Neon project'
summary: >-
  The Neon CLI `databases` command lists, creates, and deletes Postgres
  databases within a Neon project branch directly from the terminal. Use
  `neonctl databases create --name <db> --owner-name <role>` to provision a
  database on a named branch, or omit `--branch` to target the project's
  default branch. Each subcommand accepts `--project-id` (required only for
  accounts with multiple projects) and `--context-file` for reusable context.
enableTableOfContents: true
updatedOn: '2026-06-12T00:40:08.097Z'
redirectFrom:
  - /docs/reference/cli-databases
---

The `databases` command lists, creates, and deletes databases in a Neon project from the terminal. For information about databases in Neon, see [Manage databases](/docs/manage/databases).

<CliSubcommands command="databases" />

## neonctl databases list (#list)

Lists databases. If you don't specify a branch ID or name with `--branch`, the command targets the project's default branch. This applies to all `databases` subcommands.

<CliUsage command="databases list" />

<CliOptions command="databases list" />

```bash
neonctl databases list --branch br-autumn-dust-190886
```

```text filename="Output"
┌────────┬────────────┬──────────────────────┐
│ Name   │ Owner Name │ Created At           │
├────────┼────────────┼──────────────────────┤
│ neondb │ daniel     │ 2023-06-19T18:27:19Z │
└────────┴────────────┴──────────────────────┘
```

## neonctl databases create (#create)

Creates a database. If you don't specify `--owner-name`, the current user becomes the database owner.

<CliUsage command="databases create" />

<CliOptions command="databases create" />

```bash
neonctl databases create --name mynewdb --owner-name john
```

```text filename="Output"
┌─────────┬────────────┬──────────────────────┐
│ Name    │ Owner Name │ Created At           │
├─────────┼────────────┼──────────────────────┤
│ mynewdb │ john       │ 2023-06-19T23:45:45Z │
└─────────┴────────────┴──────────────────────┘
```

## neonctl databases delete (#delete)

Deletes a database. The `<database>` is the database name.

<CliUsage command="databases delete" />

<CliOptions command="databases delete" />

```bash
neonctl databases delete mydb
```

```text filename="Output"
┌─────────┬────────────┬──────────────────────┐
│ Name    │ Owner Name │ Created At           │
├─────────┼────────────┼──────────────────────┤
│ mydb    │ daniel     │ 2023-06-19T23:45:45Z │
└─────────┴────────────┴──────────────────────┘
```
