---
title: 'Neon CLI command: snapshots'
subtitle: 'Create, list, restore, and schedule branch snapshots from the terminal'
summary: >-
  The Neon CLI `snapshots` command provides subcommands (create, list, get,
  update, delete, restore, finalize, schedule) to manage point-in-time
  snapshots of your Neon branches. Use this reference for exact flags and
  syntax: snapshot a branch at an LSN or timestamp, set an expiration, restore
  a snapshot into a new or existing branch, and configure an automatic backup
  schedule.
enableTableOfContents: true
updatedOn: '2026-07-17T17:50:54.830Z'
---

The `snapshots` command creates, lists, updates, deletes, and restores snapshots of your Neon branches, and manages the automatic backup schedule of a branch. A snapshot captures the state of a branch at a point in time, so you can restore it later. For background on the feature, plans, and limits, see [Backup and restore](/docs/guides/backup-restore).

If `--project-id` is omitted, the CLI resolves it from your [context file](/docs/cli/set-context), auto-selects when your account has only one project, and prompts otherwise.

<CliSubcommands command="snapshots" />

## neon snapshots create (#create)

Creates a snapshot from a branch. By default, it snapshots the head of the branch from your context or the project's default branch. Use `--lsn` or `--timestamp` to capture an earlier point within the branch's [restore window](/docs/introduction/history-window); the two options are mutually exclusive.

<CliUsage command="snapshots create" />

<CliOptions command="snapshots create" />

Snapshot the head of a branch with a name:

```bash
neon snapshots create --branch main --name pre-migration
```

Snapshot a branch at a specific LSN and set an expiration:

```bash
neon snapshots create --branch main --lsn 0/1F3C8A0 --expires-at 2025-12-31T23:59:59Z
```

Snapshot a branch at a point in time:

```bash
neon snapshots create --branch main --timestamp 2025-01-01T00:00:00Z
```

Timestamps and expiration times use RFC 3339 format. Omit `--expires-at` to keep the snapshot indefinitely.

## neon snapshots list (#list)

Lists the snapshots in a project.

<CliUsage command="snapshots list" />

<CliOptions command="snapshots list" />

```bash
neon snapshots list
```

## neon snapshots get (#get)

Retrieves a snapshot by ID or name.

<CliUsage command="snapshots get" />

<CliOptions command="snapshots get" />

```bash
neon snapshots get snap-1234
```

## neon snapshots update (#update)

Renames a snapshot or changes its expiration. Use `--clear-expiration` to keep a snapshot indefinitely; it's mutually exclusive with `--expires-at`.

<CliUsage command="snapshots update" />

<CliOptions command="snapshots update" />

Rename a snapshot:

```bash
neon snapshots update snap-1234 --name pre-migration
```

Clear a snapshot's expiration:

```bash
neon snapshots update snap-1234 --clear-expiration
```

## neon snapshots delete (#delete)

Deletes a snapshot by ID or name.

<CliUsage command="snapshots delete" />

<CliOptions command="snapshots delete" />

```bash
neon snapshots delete snap-1234
```

## neon snapshots restore (#restore)

Restores a snapshot into a branch. By default, the restore is left un-finalized so you can inspect the restored branch first, then swap it in with [snapshots finalize](#finalize). Pass `--finalize` to move computes onto the restored branch and swap it in for the target immediately.

<CliUsage command="snapshots restore" />

<CliOptions command="snapshots restore" />

Restore a snapshot to a new branch:

```bash
neon snapshots restore snap-1234 --name recovered
```

Restore onto an existing branch un-finalized to preview, then finalize:

```bash
neon snapshots restore snap-1234 --target-branch main
```

Restore onto a branch and swap it in immediately:

```bash
neon snapshots restore snap-1234 --target-branch main --finalize
```

## neon snapshots finalize (#finalize)

Finalizes a previewed snapshot restore, swapping the restored branch in for the target. Use this after running `snapshots restore` without `--finalize`. The argument is the ID of the restored branch that `snapshots restore` created, not the target branch. The `restore` command prints the exact `finalize` command to run.

<CliUsage command="snapshots finalize" />

<CliOptions command="snapshots finalize" />

```bash
neon snapshots finalize br-summer-water-au2msxjn
```

The replaced (old) branch is kept under an auto-generated name unless you set one with `--name`.

## Snapshot schedule (#schedule)

The `snapshots schedule` subcommands get and set the automatic snapshot (backup) schedule of a branch.

<CliSubcommands command="snapshots schedule" anchorParts="schedule" />

### neon snapshots schedule get (#schedule-get)

Gets a branch's automatic snapshot schedule.

<CliUsage command="snapshots schedule get" />

<CliOptions command="snapshots schedule get" />

```bash
neon snapshots schedule get --branch main
```

### neon snapshots schedule set (#schedule-set)

Sets a branch's automatic snapshot schedule. Build a single-entry schedule with `--frequency` and its companion flags, or pass a full JSON schedule with `--schedule` for a multi-entry schedule (this overrides the single-entry flags).

Pick one `--frequency`; that choice determines which of `--day` and `--hour` you must also set. The supported frequencies are:

| `--frequency` | Also required     | `--day` range       |
| ------------- | ----------------- | ------------------- |
| `daily`       | `--hour` (0-23)   | not used            |
| `weekly`      | `--day`, `--hour` | 1-7 (Monday-Sunday) |
| `monthly`     | `--day`, `--hour` | 1-31                |

Use `--retention` with any frequency to set how long each snapshot is kept.

<CliUsage command="snapshots schedule set" />

<CliOptions command="snapshots schedule set" />

Set a daily 03:00 snapshot kept for 7 days (604800 seconds):

```bash
neon snapshots schedule set --branch main --frequency daily --hour 3 --retention 604800
```

Set a weekly snapshot on Mondays at 04:00:

```bash
neon snapshots schedule set --branch main --frequency weekly --day 1 --hour 4
```

Set a multi-entry schedule with JSON:

```bash
neon snapshots schedule set --branch main --schedule '[{"frequency":"daily","hour":3},{"frequency":"weekly","day":1,"hour":4}]'
```

Retention is set in seconds (minimum 3600). Omit `--retention` to keep snapshots indefinitely.
