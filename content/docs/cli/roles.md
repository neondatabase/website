---
title: 'Neon CLI command: roles'
subtitle: 'List, create, and delete database roles in a Neon project'
summary: >-
  The `neon roles` CLI command lists, creates, and deletes database roles in
  a Neon project, with subcommands scoped to a specific branch or the project
  default. Use it when you need to add a login role, create a passwordless role
  with `--no-login`, or remove an existing role from the command line. Role
  names are capped at 63 bytes; commands require the Neon CLI and either
  browser-based auth or an API key.
enableTableOfContents: true
updatedOn: '2026-07-01T13:41:48.668Z'
redirectFrom:
  - /docs/reference/cli-roles
  - /docs/cli/role
---

The `roles` command lists, creates, and deletes roles in a Neon project from the terminal. For information about roles in Neon, see [Manage roles](/docs/manage/roles). If `--project-id` is omitted, the CLI resolves it from your [context file](/docs/cli/set-context), auto-selects when your account has only one project, and prompts otherwise.

<CliSubcommands command="roles" />

## neon roles list (#list)

Lists roles. If you don't specify a branch ID or name with `--branch`, the command targets the project's default branch. This applies to all `roles` subcommands.

<CliUsage command="roles list" />

<CliOptions command="roles list" />

List roles with the default `table` output format:

```bash
neon roles list
```

```text filename="Output"
┌────────┬──────────────────────┐
│ Name   │ Created At           │
├────────┼──────────────────────┤
│ daniel │ 2023-06-19T18:27:19Z │
└────────┴──────────────────────┘
```

List roles with the `--output` format set to `json`:

```bash
neon roles list --output json
```

<details>
<summary>Show output</summary>

```json
[
  {
    "branch_id": "br-odd-frog-703504",
    "name": "daniel",
    "protected": false,
    "created_at": "2023-06-28T10:17:28Z",
    "updated_at": "2023-06-28T10:17:28Z"
  }
]
```

</details>

## neon roles create (#create)

Creates a role. The role name cannot exceed 63 bytes.

<CliUsage command="roles create" />

<CliOptions command="roles create" />

```bash
neon roles create --name sally
```

```text filename="Output"
┌───────┬──────────────────────┐
│ Name  │ Created At           │
├───────┼──────────────────────┤
│ sally │ 2023-06-20T00:43:17Z │
└───────┴──────────────────────┘
```

## neon roles delete (#delete)

Deletes a role. The `<role>` is the role name.

<CliUsage command="roles delete" />

<CliOptions command="roles delete" />

```bash
neon roles delete sally
```

```text filename="Output"
┌───────┬──────────────────────┐
│ Name  │ Created At           │
├───────┼──────────────────────┤
│ sally │ 2023-06-20T00:43:17Z │
└───────┴──────────────────────┘
```
