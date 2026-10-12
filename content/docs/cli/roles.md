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
updatedOn: '2026-10-03T12:43:38.865Z'
redirectFrom:
  - /docs/reference/cli-roles
  - /docs/cli/role
---

The `roles` command lists, creates, and deletes roles in a Neon project from the terminal. For information about roles in Neon, see [Manage roles](/docs/manage/roles). If `--project-id` is omitted, the CLI resolves it from your [context file](/docs/cli/link), auto-selects when your account has only one project, and otherwise asks you to pass `--project-id`.

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
Roles on main
Name          Created At
neondb_owner  2026-06-19T18:27:19Z
```

The table is titled with the branch the roles belong to, so you can tell at a glance which branch you're looking at.

List roles with the `--output` format set to `json`:

```bash
neon roles list --output json
```

<details>
<summary>Show output</summary>

```json
[
  {
    "branch_id": "br-odd-frog-123456",
    "name": "neondb_owner",
    "protected": false,
    "created_at": "2026-06-28T10:17:28Z",
    "updated_at": "2026-06-28T10:17:28Z"
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
Role created on main
Name        sally
Password    npg_aBcDeFgH1234
Created At  2026-06-20T00:43:17Z
```

The create output includes the password Neon generated for the new role. Neon returns it only once, so copy it now. A `--no-login` role has no password, so no `Password` row appears.

## neon roles delete (#delete)

Deletes a role. The `<role>` is the role name.

<CliUsage command="roles delete" />

<CliOptions command="roles delete" />

```bash
neon roles delete sally
```

```text filename="Output"
Role deleted from main
Name        sally
Created At  2026-06-20T00:43:17Z
```
