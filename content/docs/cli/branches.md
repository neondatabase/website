---
title: 'Neon CLI command: branches'
subtitle: 'List, create, rename, and delete branches; set default; run schema diff'
summary: >-
  The Neon CLI `branches` command provides subcommands (list, create, reset,
  restore, rename, schema-diff, set-default, set-expiration, add-compute,
  delete, get) to manage Neon project branches from the terminal. Use this
  reference when you need exact flags and syntax for branch operations:
  point-in-time restore via RFC 3339 timestamp or LSN, schema diff between
  any two branches or historical states, expiration timestamps, or adding
  read replica computes.
enableTableOfContents: true
updatedOn: '2026-06-12T12:32:37.482Z'
redirectFrom:
  - /docs/reference/cli-branches
---

The `branches` command lists, creates, renames, deletes, and retrieves details about branches in your Neon project. It also sets the default branch, adds a compute or [read replica](/docs/introduction/read-replicas) to a branch, restores a branch to an earlier point in time, and runs a [schema diff](/docs/guides/schema-diff) between branches. For information about branches in Neon, see [Manage branches](/docs/manage/branches). If `--project-id` is omitted, the CLI resolves it from your [context file](/docs/cli/set-context), auto-selects when your account has only one project, and prompts otherwise.

<Admonition type="tip" title="Switch the active branch">
To pin a branch in your local `.neon` context file so subsequent commands target it, use [`neonctl checkout`](/docs/cli/checkout).
</Admonition>

<CliSubcommands command="branches" />

## neonctl branches list (#list)

Lists branches in a Neon project.

<CliUsage command="branches list" />

<CliOptions command="branches list" />

List branches with the default `table` output format:

```bash
neonctl branches list --project-id solitary-leaf-288182
```

```text filename="Output"
┌────────────────────────┬──────────────────────────┬──────────────────────┬──────────────────────┐
│ Id                     │ Name                     │ Created At           │ Updated At           │
├────────────────────────┼──────────────────────────┼──────────────────────┼──────────────────────┤
│ br-small-meadow-878874 │ production [default]     │ 2023-07-06T13:15:12Z │ 2023-07-06T14:26:32Z │
├────────────────────────┼──────────────────────────┼──────────────────────┼──────────────────────┤
│ br-round-queen-335380  │ development [current]    │ 2023-07-06T14:45:50Z │ 2023-07-06T14:45:50Z │
└────────────────────────┴──────────────────────────┴──────────────────────┴──────────────────────┘
```

Branch names include text labels that indicate status: `[default]` marks the project's default branch, `[protected]` marks a protected branch, and `[current]` marks the branch pinned in your local `.neon` context file.

List branches with `--output json`, which returns more information than the `table` format:

```bash
neonctl branches list --project-id solitary-leaf-288182 --output json
```

<details>
<summary>Show output</summary>

```json
[
  {
    "id": "br-wild-boat-648259",
    "project_id": "solitary-leaf-288182",
    "name": "production",
    "current_state": "ready",
    "logical_size": 29515776,
    "creation_source": "console",
    "default": true,
    "cpu_used_sec": 78,
    "compute_time_seconds": 78,
    "active_time_seconds": 312,
    "written_data_bytes": 107816,
    "data_transfer_bytes": 0,
    "created_at": "2023-07-09T17:01:34Z",
    "updated_at": "2023-07-09T17:15:13Z"
  },
  {
    "id": "br-shy-cake-201321",
    "project_id": "solitary-leaf-288182",
    "parent_id": "br-wild-boat-648259",
    "parent_lsn": "0/1E88838",
    "name": "development",
    "current_state": "ready",
    "creation_source": "console",
    "default": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-07-09T17:37:10Z",
    "updated_at": "2023-07-09T17:37:10Z"
  }
]
```

</details>

## neonctl branches create (#create)

Creates a branch in a Neon project.

<CliUsage command="branches create" />

<CliOptions command="branches create" />

The `--name` value must be unique within the project and can be up to 256 characters; see [Branch naming requirements](/docs/manage/branches#branch-naming-requirements). A `read_only` compute is a [read replica](/docs/introduction/read-replicas).

<Admonition type="note">
When creating a branch from a protected parent branch, role passwords on the child branch are changed. For more information about this Protected Branches feature, see [New passwords generated for Postgres roles on child branches](/docs/guides/protected-branches#new-passwords-generated-for-postgres-roles-on-child-branches).
</Admonition>

```bash
neonctl branches create
```

```text filename="Output"
┌─────────────────────────┬─────────────────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                      │ Name                    │ Default │ Created At           │ Updated At           │
├─────────────────────────┼─────────────────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-mute-sunset-67218628 │ br-mute-sunset-67218628 │ false   │ 2023-08-03T20:07:27Z │ 2023-08-03T20:07:27Z │
└─────────────────────────┴─────────────────────────┴─────────┴──────────────────────┴──────────────────────┘
endpoints
┌───────────────────────────┬──────────────────────┐
│ Id                        │ Created At           │
├───────────────────────────┼──────────────────────┤
│ ep-floral-violet-94096438 │ 2023-08-03T20:07:27Z │
└───────────────────────────┴──────────────────────┘
connection_uris
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ Connection Uri                                                                           │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ postgresql://[user]:[password]@[neon_hostname]/[dbname]                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

<Admonition type="note">
If the parent branch has more than one role or database, the `branches create` command does not output a connection URI. As an alternative, you can use the `connection-string` command to retrieve the connection URI for a branch. This command includes options for specifying the role and database. See [the connection-string command](/docs/cli/connection-string).
</Admonition>

Create a branch with `--output json`, which returns the full branch response data:

```bash
neonctl branches create --output json
```

<details>
<summary>Show output</summary>

```json
{
  "branch": {
    "id": "br-frosty-art-30264288",
    "project_id": "polished-shape-60485499",
    "parent_id": "br-polished-fire-02083731",
    "parent_lsn": "0/1E887C8",
    "name": "br-frosty-art-30264288",
    "current_state": "init",
    "pending_state": "ready",
    "creation_source": "neonctl",
    "default": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2023-08-03T20:12:24Z",
    "updated_at": "2023-08-03T20:12:24Z"
  },
  "endpoints": [
    {
      "host": "ep-cool-darkness-123456.us-east-2.aws.neon.tech",
      "id": "ep-cool-darkness-123456",
      "project_id": "polished-shape-60485499",
      "branch_id": "br-frosty-art-30264288",
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 1,
      "region_id": "aws-us-east-2",
      "type": "read_write",
      "current_state": "init",
      "pending_state": "active",
      "settings": {},
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "disabled": false,
      "passwordless_access": true,
      "creation_source": "neonctl",
      "created_at": "2023-08-03T20:12:24Z",
      "updated_at": "2023-08-03T20:12:24Z",
      "proxy_host": "us-east-2.aws.neon.tech",
      "suspend_timeout_seconds": 0,
      "provisioner": "k8s-pod"
    }
  ],
  "connection_uris": [
    {
      "connection_uri": "postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require",
      "connection_parameters": {
        "database": "dbname",
        "password": "AbC123dEf",
        "role": "alex",
        "host": "ep-cool-darkness-123456.us-east-2.aws.neon.tech",
        "pooler_host": "ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech"
      }
    }
  ]
}
```

</details>

Create a branch with a user-defined name:

```bash
neonctl branches create --name feature/user-auth
```

Set the compute size when creating a branch:

```bash
neonctl branches create --name mybranch --cu 2
```

Set the compute's autoscaling range when creating a branch:

```bash
neonctl branches create --name mybranch --cu 0.5-3
```

Create a branch with a read replica compute:

```bash
neonctl branches create --name my_read_replica_branch --type read_only
```

Create a branch from a parent branch other than your `main` branch:

```bash
neonctl branches create --name feature/payment-api --parent development
```

Create an instant restore branch by specifying the `--parent` option with a timestamp:

```bash
neonctl branches create --name data_recovery --parent 2023-07-11T10:00:00Z
```

The timestamp must be in RFC 3339 format (this [timestamp converter](https://it-tools.tech/date-converter) can help). For more about instant restore, see [Instant restore](/docs/guides/branch-restore).

Create a branch and connect to it with `psql` immediately. Arguments after `--` are passed through to psql, so you can run an `.sql` file or a query on creation:

```bash
neonctl branches create --psql
neonctl branches create --psql -- -f dump.sql
neonctl branches create --psql -- -c "SELECT version()"
```

Create a schema-only branch:

```bash
neonctl branches create --schema-only
```

## neonctl branches reset (#reset)

Resets a child branch to the latest data from its parent. The `<id|name>` is the branch ID or branch name; either works.

<CliUsage command="branches reset" />

<CliOptions command="branches reset" />

The `--parent` option is required; resetting from the parent branch is currently the only supported reset operation. To rewind a branch to an earlier point in time, see [restore](#restore).

```bash
neonctl branches reset development --parent
```

```text filename="Output"
┌──────────────────────┬─────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                   │ Name        │ Default │ Created At           │ Last Reset At        │
├──────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-aged-sun-a5qowy01 │ development │ false   │ 2024-05-07T09:31:59Z │ 2024-05-07T09:36:32Z │
└──────────────────────┴─────────────┴─────────┴──────────────────────┴──────────────────────┘
```

## neonctl branches restore (#restore)

Restores a branch to a specified point in time in its own or another branch's history. The `<target-id|name>` is the ID or name of the branch you want to restore, and `<source>` is the source branch you want to restore from. Source options are:

- `^self`: restores the selected branch to an earlier point in its own history. You must specify a timestamp or LSN (restoring to head is not supported).
- `^parent`: restores the target branch to its parent. By default the target is restored to the latest (head) of its parent. Append `@timestamp` or `@lsn` to restore to an earlier point in the parent's history.
- A source branch ID or name: restores the target branch to the selected source branch. It restores the latest (head) by default. Append `@timestamp` or `@lsn` to restore to an earlier point in the source branch's history.

<CliUsage command="branches restore" />

<CliOptions command="branches restore" />

The `--preserve-under-name` option is required when restoring to `^self`.

Restore `main` to an earlier point in its own history, saving the previous state to a backup branch named `main_restore_backup_2024-05-06`:

```bash shouldWrap
neonctl branches restore main ^self@2024-05-06T10:00:00.000Z --preserve-under-name main_restore_backup_2024-05-06
```

```text filename="Output"
INFO: Restoring branch br-purple-dust-a5hok5mk to the branch br-purple-dust-a5hok5mk timestamp 2024-05-06T10:00:00.000Z
Restored branch
┌─────────────────────────┬──────┬──────────────────────┐
│ Id                      │ Name │ Last Reset At        │
├─────────────────────────┼──────┼──────────────────────┤
│ br-purple-dust-a5hok5mk │ main │ 2024-05-07T09:45:21Z │
└─────────────────────────┴──────┴──────────────────────┘
Backup branch
┌─────────────────────────┬────────────────────────────────┐
│ Id                      │ Name                           │
├─────────────────────────┼────────────────────────────────┤
│ br-flat-forest-a5z016gm │ main_restore_backup_2024-05-06 │
└─────────────────────────┴────────────────────────────────┘
```

Restore the target branch `feature/user-auth` to the head of the source branch `main`:

```bash
neonctl branches restore feature/user-auth main
```

```text filename="Output"
INFO: Restoring branch br-restless-frost-69810125 to the branch br-curly-bar-82389180 head
Restored branch
┌────────────────────────────┬───────────────────┬──────────────────────┐
│ Id                         │ Name              │ Last Reset At        │
├────────────────────────────┼───────────────────┼──────────────────────┤
│ br-restless-frost-69810125 │ feature/user-auth │ 2024-02-21T15:42:34Z │
└────────────────────────────┴───────────────────┴──────────────────────┘
```

Restore `feature/user-auth` to an earlier point in time from its parent branch:

```bash
neonctl branches restore feature/user-auth ^parent@2024-02-21T10:30:00.000Z
```

```text filename="Output"
INFO: Restoring branch br-restless-frost-69810125 to the branch br-patient-union-a5s838zf timestamp 2024-02-21T10:30:00.000Z
Restored branch
┌────────────────────────────┬───────────────────┬──────────────────────┐
│ Id                         │ Name              │ Last Reset At        │
├────────────────────────────┼───────────────────┼──────────────────────┤
│ br-restless-frost-69810125 │ feature/user-auth │ 2024-02-21T15:55:04Z │
└────────────────────────────┴───────────────────┴──────────────────────┘
```

## neonctl branches rename (#rename)

Renames a branch.

<CliUsage command="branches rename" />

<CliOptions command="branches rename" />

The new name follows the same rules as `--name` on [branches create](#create); see [Branch naming requirements](/docs/manage/branches#branch-naming-requirements).

```bash
neonctl branches rename mybranch teambranch
```

```text filename="Output"
┌───────────────────────┬────────────┬──────────────────────┬──────────────────────┐
│ Id                    │ Name       │ Created At           │ Updated At           │
├───────────────────────┼────────────┼──────────────────────┼──────────────────────┤
│ br-rough-sound-590393 │ teambranch │ 2023-07-09T20:46:58Z │ 2023-07-09T21:02:27Z │
└───────────────────────┴────────────┴──────────────────────┴──────────────────────┘
```

## neonctl branches schema-diff (#schema-diff)

Compares the latest schemas of any two branches, or compares against a specific point in a branch's own or another branch's history.

The `[base-branch]` is the branch to compare against. It's optional; if omitted, the command uses the branch from your `set-context` file, or the project's default branch if no context is configured.

The `[compare-source]` specifies the branch or state to compare against. Options are:

- `^self`: compares the selected branch to an earlier point in its own history. You must specify a timestamp or LSN.
- `^parent`: compares the selected branch to the head of its parent branch. You can append `@timestamp` or `@lsn` to compare to an earlier point in the parent's history.
- A branch ID or name: compares the selected branch to the head of another specified branch. Append `@timestamp` or `@lsn` to compare to an earlier point in the specified branch's history.

<CliUsage command="branches schema-diff" />

<CliOptions command="branches schema-diff" />

<Admonition type="note">
Use the `--no-color` or `--color false` [global option](/docs/cli#global-options) to decolorize command output in CI/CD pipelines.
</Admonition>

Compare the schema of the `production` branch to the head of the `development` branch:

```bash
neonctl branches schema-diff production development
```

The output indicates that in the table `public.playing_with_neon`, a new column `description character varying(255)` has been added in the `development` branch that is not present in the `production` branch.

```text filename="Output"
--- Database: neondb	(Branch: br-wandering-firefly-a50un462)
+++ Database: neondb	(Branch: br-fancy-sky-a5cydw8p)
@@ -26,9 +26,10 @@

 CREATE TABLE public.playing_with_neon (
     id integer NOT NULL,
     name text NOT NULL,
-    value real
+    value real,
+    description character varying(255)
 );
```

Compare the schema of `feature/user-auth` to an earlier point in its own history at LSN `0/123456`:

```bash
neonctl branches schema-diff feature/user-auth ^self@0/123456
```

Compare the schema of `feature/user-auth` to the head of its parent branch:

```bash
neonctl branches schema-diff feature/user-auth ^parent
```

Compare the schema of the `production` branch to the state of `feature/payment-api` at timestamp `2024-06-01T00:00:00.000Z`:

```bash
neonctl branches schema-diff production feature/payment-api@2024-06-01T00:00:00.000Z
```

## neonctl branches set-default (#set-default)

Sets a branch as the default branch in your Neon project.

<CliUsage command="branches set-default" />

<CliOptions command="branches set-default" />

```bash
neonctl branches set-default mybranch
```

```text filename="Output"
┌────────────────────┬──────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                 │ Name     │ Default │ Created At           │ Updated At           │
├────────────────────┼──────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-odd-frog-703504 │ mybranch │ true    │ 2023-07-11T12:22:12Z │ 2023-07-11T12:22:59Z │
└────────────────────┴──────────┴─────────┴──────────────────────┴──────────────────────┘
```

## neonctl branches set-expiration (#set-expiration)

Sets or updates the expiration date for a branch. When the expiration time is reached, the branch and its compute endpoints are permanently deleted.

<CliUsage command="branches set-expiration" />

<CliOptions command="branches set-expiration" />

Set an expiration date for a branch:

```bash
neonctl branches set-expiration mybranch --expires-at 2025-08-15T18:00:00Z
```

Remove expiration from a branch (omit the parameter):

```bash
neonctl branches set-expiration mybranch
```

## neonctl branches add-compute (#add-compute)

Adds a compute to an existing branch in your Neon project.

<CliUsage command="branches add-compute" />

<CliOptions command="branches add-compute" />

A `read_only` compute is a [read replica](/docs/introduction/read-replicas). A branch can have a single primary read-write compute and multiple read replica computes.

Add a read replica compute to a branch:

```bash
neonctl branches add-compute mybranch --type read_only
```

```text filename="Output"
┌─────────────────────┬──────────────────────────────────────────────────┐
│ Id                  │ Host                                             │
├─────────────────────┼──────────────────────────────────────────────────┤
│ ep-rough-lab-865061 │ ep-rough-lab-865061.ap-southeast-1.aws.neon.tech │
└─────────────────────┴──────────────────────────────────────────────────┘
```

Set the compute size when adding a compute to a branch:

```bash
neonctl branches add-compute main --cu 2
```

Set the compute's autoscaling range when adding a compute to a branch:

```bash
neonctl branches add-compute main --cu 0.5-3
```

## neonctl branches delete (#delete)

Deletes a branch in a Neon project.

<CliUsage command="branches delete" />

<CliOptions command="branches delete" />

```bash
neonctl branches delete br-rough-sky-158193
```

```text filename="Output"
┌─────────────────────┬─────────────────┬──────────────────────┬──────────────────────┐
│ Id                  │ Name            │ Created At           │ Updated At           │
├─────────────────────┼─────────────────┼──────────────────────┼──────────────────────┤
│ br-rough-sky-158193 │ my_child_branch │ 2023-07-09T20:57:39Z │ 2023-07-09T21:06:41Z │
└─────────────────────┴─────────────────┴──────────────────────┴──────────────────────┘
```

Branches are soft-deleted by default, and enter a 7-day [deletion recovery period](/docs/manage/branches#recover-a-deleted-branch) before being permanently removed.

## neonctl branches get (#get)

Retrieves details about a branch.

<CliUsage command="branches get" />

<CliOptions command="branches get" />

Get a branch with the default `table` output format:

```bash
neonctl branches get production
```

```text filename="Output"
┌────────────────────────┬────────────┬──────────────────────┬──────────────────────┐
│ Id                     │ Name       │ Created At           │ Updated At           │
├────────────────────────┼────────────┼──────────────────────┼──────────────────────┤
│ br-small-meadow-878874 │ production │ 2023-07-06T13:15:12Z │ 2023-07-06T13:32:37Z │
└────────────────────────┴────────────┴──────────────────────┴──────────────────────┘
```

Get a branch with the `--output` format option set to `json`:

```bash
neonctl branches get production --output json
```

<details>
<summary>Show output</summary>

```json
{
  "id": "br-lingering-bread-896475",
  "project_id": "noisy-rain-039137",
  "name": "production",
  "current_state": "ready",
  "logical_size": 29769728,
  "creation_source": "console",
  "default": false,
  "cpu_used_sec": 522,
  "compute_time_seconds": 522,
  "active_time_seconds": 2088,
  "written_data_bytes": 174433,
  "data_transfer_bytes": 20715,
  "created_at": "2023-06-28T10:17:28Z",
  "updated_at": "2023-07-11T12:22:59Z"
}
```

</details>
