---
title: 'Neon CLI command: roles'
subtitle: 'List, inspect, create, and delete database roles, and reset their passwords'
summary: >-
  The `neon roles` CLI command lists, inspects, creates, and deletes database
  roles in a Neon project and resets their passwords. Its subcommands target a
  specific branch or the project default. Use it when you need to add an
  admin or a scoped read-only or read-write role, create a passwordless role
  with `--no-login`, rotate a password, or remove a role from the command line. Role
  names are capped at 63 bytes; commands require the Neon CLI and either
  browser-based auth or an API key.
enableTableOfContents: true
updatedOn: '2026-11-05T15:33:57.188Z'
redirectFrom:
  - /docs/reference/cli-roles
  - /docs/cli/role
---

From the terminal, the `roles` command lists, inspects, creates, and deletes roles in a Neon project, and resets their passwords. It's also available as [`neon postgres roles`](/docs/cli/postgres#roles). For information about roles in Neon, see [Manage roles](/docs/manage/roles). If `--project-id` is omitted, the CLI resolves it from your [context file](/docs/cli/link), auto-selects when your account has only one project, and otherwise asks you to pass `--project-id`.

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

The create output includes the password Neon generated for the new role. Neon returns it only once, so copy it now, or run [`neon roles reset-password`](#reset-password) later to get a new one. A `--no-login` role has no password, so no `Password` row appears.

By default, a new role joins `neon_superuser`, which makes it an admin on every database. Pass `--access read_only` for a role that can only read, or `--access read_write` for one that can also insert, update, and delete rows. A scoped role applies to one database. Name it with `--database`, or leave it out when the branch has only one. Its access is limited to the `public` schema unless you pass `--schema`, and to tables owned by that database's owner, including tables the owner creates later.

```bash
neon roles create --name reporting --access read_only
```

```bash
neon roles create --name app_writer --access read_write --database neondb --schema public
```

`--database` and `--schema` work only with `--access read_only` or `--access read_write`.

## neon roles get (#get)

Shows a role's details. The `<role>` is the role name.

<CliUsage command="roles get" />

<CliOptions command="roles get" />

```bash
neon roles get reporting
```

```text filename="Output"
Name                   reporting
Branch ID              br-lively-sunset-123456
Protected              false
Authentication Method  password
Created At             2026-11-05T14:24:30Z
Updated At             2026-11-05T14:24:30Z
```

## neon roles reset-password (#reset-password)

Generates a new password for a role and prints it. The old password stops working. By default the command waits until the compute applies the new password, so you can connect with it right away. With `--no-wait`, it returns as soon as the API accepts the reset.

<CliUsage command="roles reset-password" />

<CliOptions command="roles reset-password" />

```bash
neon roles reset-password sally
```

```text filename="Output"
Password reset for sally on main
Name        sally
Password    npg_aBcDeFgH1234
Created At  2026-06-20T00:43:17Z
```

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
