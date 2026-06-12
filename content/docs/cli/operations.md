---
title: 'Neon CLI command: operations'
subtitle: List and manage long-running operations for a Neon project
summary: >-
  The Neon CLI `neonctl operations list` command retrieves the history of system
  operations for a Neon project, showing each operation's ID, action type (such
  as `apply_config` or `suspend_compute`), status, and creation timestamp. Use
  this command to inspect or audit long-running or recently completed operations
  when debugging project state or configuration changes. Requires the Neon CLI
  to be installed and authenticated; scope to a specific project with
  `--project-id` when your account has multiple projects.
enableTableOfContents: true
updatedOn: '2026-06-12T00:33:31.980Z'
redirectFrom:
  - /docs/reference/cli-operations
---

The `operations` command lists operations for a Neon project from the terminal. For information about operations in Neon, see [System operations](/docs/manage/operations).

## Subcommands

<CliUsage command="operations" />

<CliSubcommands command="operations" />

## neonctl operations list (#list)

Lists operations for a Neon project.

<CliUsage command="operations list" />

<CliOptions command="operations list" />

```bash
neonctl operations list
```

```text filename="Output"
┌──────────────────────────────────────┬────────────────────┬──────────┬──────────────────────┐
│ Id                                   │ Action             │ Status   │ Created At           │
├──────────────────────────────────────┼────────────────────┼──────────┼──────────────────────┤
│ fce8642e-259e-4662-bdce-518880aee723 │ apply_config       │ finished │ 2023-06-20T00:45:19Z │
├──────────────────────────────────────┼────────────────────┼──────────┼──────────────────────┤
│ dc1dfb0c-b854-474b-be20-2ea1d2172563 │ apply_config       │ finished │ 2023-06-20T00:43:17Z │
├──────────────────────────────────────┼────────────────────┼──────────┼──────────────────────┤
│ 7a83e300-cf5f-4c1a-b9b5-569b6d6feab9 │ suspend_compute    │ finished │ 2023-06-19T23:50:56Z │
└──────────────────────────────────────┴────────────────────┴──────────┴──────────────────────┘
```
