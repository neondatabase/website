---
title: 'Neon CLI command: triggers'
subtitle: Create and manage function triggers that invoke a Neon Function on a cron schedule
summary: >-
  The Neon CLI `neon triggers` command manages function triggers on a branch:
  list, get, create, update, enable, disable, and delete triggers that invoke a
  Neon Function on a cron schedule.
enableTableOfContents: true
---

<FeatureBetaProps feature_name="Function Triggers" />

The `triggers` command manages function triggers on a branch. A trigger invokes a [Neon Function](/docs/compute/functions/overview) on a cron schedule, so you can run recurring work (a nightly report, a cleanup job, a periodic sync) without a separate scheduler. You deploy the function with [`neon functions deploy`](/docs/cli/functions), then point a trigger at it by slug.

Triggers are branch-scoped. Pass `--project-id` and `--branch` to target a branch, or let the CLI resolve them from your [context file](/docs/cli/set-context). Triggers can also be inherited: a trigger created on a parent branch is visible on its child branches, where the `Inherited` column shows `true` and `source_branch_id` points to the origin branch. An inherited trigger stays disabled on the child until you enable it there with [`neon triggers enable`](#enable).

<CliSubcommands command="triggers" />

## neon triggers list (#list)

Lists the triggers on the branch.

<CliUsage command="triggers list" />

<CliOptions command="triggers list" />

```bash
neon triggers list --project-id solitary-heart-93902637 --branch main
```

```text filename="Output"
Trigger Id                                    Name            Function Slug  Function Path  Schedule   Enabled  Inherited  Next Run At
trigger-12345678-90ab-cdef-1234-567890abcdef  nightly-report  child404       /              0 6 * * *  true     false      2026-09-11T06:00:00.000000Z
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
  "source_branch_id": "br-morning-frost-a1b2c3d4",
  "inherited": false
}
```

</details>

## neon triggers create (#create)

Creates a trigger that invokes a function on a cron schedule. `--function-slug`, `--name`, and `--cron` are required. `--cron` takes a five-field UTC cron expression. The trigger name must be unique on the branch.

<CliUsage command="triggers create" />

<CliOptions command="triggers create" />

By default the invocation is sent to `/` and the trigger is enabled. Use `--function-path` to send it to another route, and `--enabled false` to create it in a disabled state.

```bash
neon triggers create --function-slug child404 --name nightly-report --cron '0 6 * * *' --project-id solitary-heart-93902637 --branch main
```

```text filename="Output"
Trigger Id     trigger-12345678-90ab-cdef-1234-567890abcdef
Name           nightly-report
Function Slug  child404
Function Path  /
Schedule       0 6 * * *
Enabled        true
Inherited      false
Next Run At    2026-09-11T06:00:00.000000Z
```

## neon triggers update (#update)

Updates a trigger. Pass at least one of `--function-slug`, `--name`, `--cron`, `--function-path`, or `--enabled`; with no fields to change, the command returns an error. Changing the schedule recomputes `Next Run At`.

<CliUsage command="triggers update" />

<CliOptions command="triggers update" />

```bash
neon triggers update trigger-12345678-90ab-cdef-1234-567890abcdef --cron '*/30 * * * *' --project-id solitary-heart-93902637 --branch main
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
