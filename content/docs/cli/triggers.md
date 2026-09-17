---
title: 'Neon CLI command: triggers'
subtitle: Create and manage function triggers that invoke a Neon Function on a cron schedule or when an object is created
summary: >-
  The Neon CLI `neon triggers` command manages function triggers on a branch:
  list, get, create, update, enable, disable, and delete triggers that invoke a
  Neon Function on a cron schedule or when an object is created in Object Storage.
enableTableOfContents: true
---

<FeatureBetaProps feature_name="Function Triggers" />

The `triggers` command manages function triggers on a branch. A trigger invokes a [Neon Function](/docs/compute/functions/overview) on a cron schedule (`schedule`), or when an object is created in an [Object Storage](/docs/storage/overview) bucket (`storage_object_created`). Use it to run recurring work like a nightly report or cleanup job, or to process uploads as they land, without a separate scheduler. You deploy the function with [`neon functions deploy`](/docs/cli/functions), then point a trigger at it by slug.

Triggers are branch-scoped. Pass `--project-id` and `--branch` to target a branch, or let the CLI resolve them from your [context file](/docs/cli/set-context). Triggers can also be inherited: a trigger created on a parent branch is visible on its child branches, where the `Inherited` column shows `true`. An inherited trigger stays disabled on the child until you enable it there with [`neon triggers enable`](#enable).

<CliSubcommands command="triggers" />

## neon triggers list (#list)

Lists the triggers on the branch.

<CliUsage command="triggers list" />

<CliOptions command="triggers list" />

```bash
neon triggers list --project-id solitary-heart-93902637 --branch main
```

The `Type` column shows each trigger's type, currently `schedule` or `storage_object_created`. `Schedule` holds the cron for schedule triggers; `Storage` holds the bucket (and prefix, if set) for storage triggers.

```text filename="Output" shouldWrap
Trigger Id                                    Name            Type                    Function Slug  Function Path  Schedule   Storage        Enabled  Inherited  Next Run At
trigger-12345678-90ab-cdef-1234-567890abcdef  nightly-report  schedule                child404       /              0 6 * * *                 true     false      2026-09-11T06:00:00.000000Z
trigger-abcdef12-3456-7890-abcd-ef1234567890  on-upload       storage_object_created  ingest         /object                       assets logos/  true     false
```

## neon triggers get (#get)

Shows a single trigger by ID.

<CliUsage command="triggers get" />

<CliOptions command="triggers get" />

```bash
neon triggers get trigger-12345678-90ab-cdef-1234-567890abcdef --project-id solitary-heart-93902637 --branch main --output json
```

<details>
<summary>Show output</summary>

```json
{
  "type": "schedule",
  "trigger_id": "trigger-12345678-90ab-cdef-1234-567890abcdef",
  "function_slug": "child404",
  "name": "nightly-report",
  "function_path": "/",
  "schedule": {
    "cron": "0 6 * * *"
  },
  "enabled": true,
  "version": 1390408,
  "next_run_at": "2026-09-11T06:00:00.000000Z",
  "inherited": false
}
```

</details>

A `storage_object_created` trigger has `storage_object_created` (bucket and optional prefix) in place of `schedule`, and no `next_run_at`:

<details>
<summary>Show output</summary>

```json
{
  "type": "storage_object_created",
  "trigger_id": "trigger-abcdef12-3456-7890-abcd-ef1234567890",
  "function_slug": "ingest",
  "name": "on-upload",
  "function_path": "/object",
  "storage_object_created": {
    "bucket_name": "assets",
    "prefix": "logos/"
  },
  "enabled": true,
  "version": 1390512,
  "inherited": false
}
```

</details>

## neon triggers create (#create)

Creates a trigger that invokes a function on a cron schedule or when an object is created. `--function-slug` and `--name` are required, and the name must be unique on the branch. Choose the type with one of:

- `--cron` for a `schedule` trigger, a five-field UTC cron expression.
- `--bucket` for a `storage_object_created` trigger, with an optional `--prefix` to match only object keys under that prefix.

`--cron` and `--bucket` are mutually exclusive (`Pass --cron or --bucket, not both.`), and `--prefix` requires `--bucket`.

Object-created triggers (`--bucket` and `--prefix`) require Neon CLI 4.21.0 or later. On an older CLI, `--bucket` isn't recognized and `create` reports a missing `--cron` argument instead.

<CliUsage command="triggers create" />

<CliOptions command="triggers create" />

By default the invocation is sent to `/` and the trigger is enabled. Use `--function-path` to send it to another route, and `--enabled false` to create it in a disabled state.

A schedule trigger:

```bash
neon triggers create --function-slug child404 --name nightly-report --cron '0 6 * * *' --project-id solitary-heart-93902637 --branch main
```

```text filename="Output"
Trigger Id     trigger-12345678-90ab-cdef-1234-567890abcdef
Name           nightly-report
Type           schedule
Function Slug  child404
Function Path  /
Schedule       0 6 * * *
Enabled        true
Inherited      false
Next Run At    2026-09-11T06:00:00.000000Z
```

A storage trigger that fires when an object is created under `logos/` in the `assets` bucket:

```bash
neon triggers create --function-slug ingest --name on-upload --bucket assets --prefix 'logos/' --function-path /object --project-id solitary-heart-93902637 --branch main
```

## neon triggers update (#update)

Updates a trigger. Pass at least one of `--function-slug`, `--name`, `--function-path`, or `--enabled`, plus the field matching the trigger's type: `--cron` for a schedule trigger, or `--bucket`/`--prefix` for a `storage_object_created` trigger. With no fields to change, the command returns an error. The type is fixed at creation, so passing `--cron` to a storage trigger, or `--bucket`/`--prefix` to a schedule trigger, is rejected (`Trigger <id> is type <type>; ...`). Changing a schedule recomputes `Next Run At`.

<CliUsage command="triggers update" />

<CliOptions command="triggers update" />

Reschedule a schedule trigger:

```bash
neon triggers update trigger-12345678-90ab-cdef-1234-567890abcdef --cron '*/30 * * * *' --project-id solitary-heart-93902637 --branch main
```

Change the prefix a storage trigger matches:

```bash
neon triggers update trigger-abcdef12-3456-7890-abcd-ef1234567890 --prefix 'incoming/' --project-id solitary-heart-93902637 --branch main
```

## neon triggers enable (#enable)

Enables a trigger so it runs on its schedule. Enabling recomputes `Next Run At`.

<CliUsage command="triggers enable" />

<CliOptions command="triggers enable" />

```bash
neon triggers enable trigger-12345678-90ab-cdef-1234-567890abcdef --project-id solitary-heart-93902637 --branch main
```

## neon triggers disable (#disable)

Disables a trigger without deleting it. A disabled trigger keeps its definition but does not run, and its `Next Run At` is cleared. Re-enable it with [`neon triggers enable`](#enable).

<CliUsage command="triggers disable" />

<CliOptions command="triggers disable" />

```bash
neon triggers disable trigger-12345678-90ab-cdef-1234-567890abcdef --project-id solitary-heart-93902637 --branch main
```

## neon triggers delete (#delete)

Deletes a trigger.

<CliUsage command="triggers delete" />

<CliOptions command="triggers delete" />

```bash
neon triggers delete trigger-12345678-90ab-cdef-1234-567890abcdef --project-id solitary-heart-93902637 --branch main
```

```text filename="Output"
INFO: Trigger trigger-12345678-90ab-cdef-1234-567890abcdef deleted
```
