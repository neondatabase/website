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
updatedOn: '2026-07-01T13:41:48.668Z'
redirectFrom:
  - /docs/reference/cli-databases
  - /docs/cli/database
  - /docs/cli/db
---

The `databases` command lists, creates, and deletes databases in a Neon project from the terminal. For information about databases in Neon, see [Manage databases](/docs/manage/databases). If `--project-id` is omitted, the CLI resolves it from your [context file](/docs/cli/set-context), auto-selects when your account has only one project, and prompts otherwise.

<CliSubcommands command="databases" />

## neon databases list (#list)

Lists databases. If you don't specify a branch ID or name with `--branch`, the command targets the project's default branch. This applies to all `databases` subcommands.

<CliUsage command="databases list" />

<CliOptions command="databases list" />

```bash
neon databases list --branch br-autumn-dust-190886
```

```text filename="Output"
┌────────┬────────────┬──────────────────────┐
│ Name   │ Owner Name │ Created At           │
├────────┼────────────┼──────────────────────┤
│ neondb │ daniel     │ 2023-06-19T18:27:19Z │
└────────┴────────────┴──────────────────────┘
```

## neon databases create (#create)

Creates a database. If you don't specify `--owner-name`, the current user becomes the database owner.

<CliUsage command="databases create" />

<CliOptions command="databases create" />

```bash
neon databases create --name mynewdb --owner-name john
```

```text filename="Output"
┌─────────┬────────────┬──────────────────────┐
│ Name    │ Owner Name │ Created At           │
├─────────┼────────────┼──────────────────────┤
│ mynewdb │ john       │ 2023-06-19T23:45:45Z │
└─────────┴────────────┴──────────────────────┘
```

## neon databases delete (#delete)

Deletes a database. The `<database>` is the database name.

<CliUsage command="databases delete" />

<CliOptions command="databases delete" />

```bash
neon databases delete mydb
```

```text filename="Output"
┌─────────┬────────────┬──────────────────────┐
│ Name    │ Owner Name │ Created At           │
├─────────┼────────────┼──────────────────────┤
│ mydb    │ daniel     │ 2023-06-19T23:45:45Z │
└─────────┴────────────┴──────────────────────┘
```
