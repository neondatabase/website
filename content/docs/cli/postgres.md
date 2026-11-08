---
title: 'Neon CLI command: postgres'
subtitle: 'Manage computes, databases, and roles, and connect to Lakebase Postgres, from one command group'
summary: >-
  The Neon CLI `postgres` command (aliases `pg` and `lakebase`) groups the
  Lakebase Postgres commands: `computes`, `databases`, `roles`, `connection-string`,
  and `psql`. Use this reference for `neon postgres computes`, which lists,
  inspects, resizes, suspends, starts, restarts, and deletes the computes in a
  Neon project. The other subcommands match their top-level forms, such as
  `neon roles` and `neon psql`.
enableTableOfContents: true
---

The `postgres` command groups the commands that work with Lakebase Postgres in a Neon project: [computes](#computes), [databases](/docs/cli/databases), [roles](/docs/cli/roles), [connection strings](/docs/cli/connection-string), and [psql](/docs/cli/psql). Its aliases are `pg` and `lakebase`, so `neon pg roles list` and `neon lakebase roles list` work too.

`computes` is only available under `postgres`. The other subcommands run the same command as their top-level spelling, so `neon postgres roles list` and `neon roles list` do the same thing. Both spellings work.

If `--project-id` is omitted, the CLI resolves it from your [context file](/docs/cli/link), auto-selects when your account has only one project, and otherwise asks you to pass `--project-id`.

<CliSubcommands command="postgres" />

## neon postgres computes (#computes)

Manages the computes in a Neon project. Aliases: `compute`, `endpoints`, and `endpoint`. For background, see [Manage computes](/docs/manage/computes).

<CliUsage command="postgres computes" />

<CliOptions command="postgres computes" />

<CliSubcommands command="postgres computes" anchorParts="computes" />

`update`, `start`, `suspend`, `restart`, and `delete` wait until the change is applied. Pass `--no-wait` to return as soon as the API accepts the request. To add a compute, use [`neon branches add-compute`](/docs/cli/branches#add-compute).

### neon postgres computes list (#computes-list)

Lists computes. With `--branch`, or when your `.neon` context file pins a branch, it lists that branch's computes. Otherwise it lists every compute in the project. `--all-branches` lists every compute in the project even when `.neon` pins a branch.

<CliUsage command="postgres computes list" />

<CliOptions command="postgres computes list" />

```bash
neon postgres computes list --branch main
```

```text filename="Output"
Computes on main
ID                      Branch ID                  Type        Current State  Autoscaling Limit Min Cu  Autoscaling Limit Max Cu
ep-cool-king-123456     br-lively-sunset-123456    read_write  active         0.25                      2
```

### neon postgres computes get (#computes-get)

Shows a compute's details, including its host, state, autoscaling limits, and scale-to-zero timeout.

<CliUsage command="postgres computes get" />

<CliOptions command="postgres computes get" />

```bash
neon postgres computes get ep-cool-king-123456
```

<details>
<summary>Show output</summary>

```text
ID                        ep-cool-king-123456
Branch ID                 br-lively-sunset-123456
Type                      read_write
Current State             active
Host                      ep-cool-king-123456.us-east-2.aws.neon.tech
Region ID                 aws-us-east-2
Autoscaling Limit Min Cu  0.25
Autoscaling Limit Max Cu  2
Suspend Timeout Seconds   600
Disabled                  false
Last Active               2026-11-05T14:46:05Z
Created At                2026-11-05T14:46:01Z
```

</details>

### neon postgres computes update (#computes-update)

Changes a compute's size, scale-to-zero timeout, name, or connection access. It sends only the options you pass, and fails if you pass none. When the change is applied, it prints the compute.

<CliUsage command="postgres computes update" />

<CliOptions command="postgres computes update" />

Set autoscaling to 0.25 to 2 compute units (CU) and suspend after 10 minutes of inactivity:

```bash
neon postgres computes update ep-cool-king-123456 --cu 0.25-2 --suspend-timeout 600
```

`--disabled` restricts connections to the compute and schedules a suspend. Pass `--disabled=false` to allow connections again:

```bash
neon postgres computes update ep-cool-king-123456 --disabled=false
```

### neon postgres computes start (#computes-start)

Starts a suspended compute and prints it once it's active.

<CliUsage command="postgres computes start" />

<CliOptions command="postgres computes start" />

```bash
neon postgres computes start ep-cool-king-123456
```

### neon postgres computes suspend (#computes-suspend)

Suspends a compute and prints it once it's idle.

<CliUsage command="postgres computes suspend" />

<CliOptions command="postgres computes suspend" />

```bash
neon postgres computes suspend ep-cool-king-123456
```

### neon postgres computes restart (#computes-restart)

Restarts a compute and prints it once it's back up.

<CliUsage command="postgres computes restart" />

<CliOptions command="postgres computes restart" />

```bash
neon postgres computes restart ep-cool-king-123456
```

With `--no-wait`, the output says the restart was accepted but not yet applied:

```text filename="Output"
Compute ep-cool-king-123456: restart accepted, not yet applied
```

### neon postgres computes delete (#computes-delete)

Deletes a compute, such as a [read replica](/docs/introduction/read-replicas) you no longer need, and prints a confirmation.

<CliUsage command="postgres computes delete" />

<CliOptions command="postgres computes delete" />

```bash
neon postgres computes delete ep-divine-tree-123456
```

```text filename="Output"
Compute ep-divine-tree-123456 deleted
```

## neon postgres databases (#databases)

Lists, creates, and deletes databases. It's the same command as [`neon databases`](/docs/cli/databases), which documents its subcommands and options.

<CliUsage command="postgres databases" />

```bash
neon postgres databases list
```

## neon postgres roles (#roles)

Lists, inspects, creates, and deletes roles, and resets their passwords. It's the same command as [`neon roles`](/docs/cli/roles), which documents its subcommands and options.

<CliUsage command="postgres roles" />

```bash
neon postgres roles list
```

## neon postgres connection-string (#connection-string)

Prints a connection string for a branch. Alias: `cs`. It's the same command as [`neon connection-string`](/docs/cli/connection-string), which documents its options.

<CliUsage command="postgres connection-string" />

```bash
neon pg cs main
```

## neon postgres psql (#psql)

Opens a psql session on a branch. It's the same command as [`neon psql`](/docs/cli/psql), which documents its options.

<CliUsage command="postgres psql" />

```bash
neon postgres psql main -- -c "SELECT version()"
```
