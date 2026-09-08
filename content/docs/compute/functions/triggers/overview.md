---
title: Function Triggers
subtitle: Let Neon invoke a function for you.
summary: >-
  Function Triggers invoke a deployed Neon Function on a cron schedule, with no external
  scheduler and no compute kept running to hold the timer. Covers what a scheduled invocation
  sends your function, how triggers behave across branches, and the current limits. Schedule
  is the only trigger type today, evaluated in UTC.
enableTableOfContents: true
updatedOn: '2026-09-08T22:56:13.993Z'
---

A Function Trigger tells Neon to invoke a deployed [Neon Function](/docs/compute/functions/overview) on a schedule. You give it a cron expression, and Neon calls the function at each run. No external scheduler, and no compute kept running to hold the timer.

Today the only trigger type is `schedule`, a cron expression evaluated in UTC. The API uses a `type` discriminator, so more types can be added later without changing existing triggers.

Triggers are managed through the Neon API; there are no `neon` CLI commands for them yet. To create one, see [Schedule a function](/docs/compute/functions/triggers/schedule).

## Function Triggers vs pg_cron

[pg_cron](/docs/extensions/pg_cron) schedules SQL inside Postgres. Function Triggers schedule your function code. They solve different problems:

|                        | pg_cron                              | Function Triggers                                                                            |
| ---------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| Runs                   | A SQL statement or Postgres function | Your JavaScript or TypeScript function                                                       |
| Where                  | Inside the Postgres compute          | On Neon's compute, next to your data                                                         |
| External APIs          | No                                   | Yes: HTTP, [AI Gateway](/docs/ai-gateway/overview), [Object Storage](/docs/storage/overview) |
| Compute scaled to zero | Doesn't run                          | Runs; the invocation starts the function                                                     |

## Trigger fields

A trigger belongs to a project and branch and points to one function on that branch.

| Field           | Required | Description                                                                                           |
| --------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `type`          | Yes      | `"schedule"` is the only value today.                                                                 |
| `function_slug` | Yes      | The [slug](/docs/compute/functions/deploy#slugs) of the function to invoke. It's the only identifier. |
| `name`          | Yes      | A label, 1 to 256 characters. Unique among triggers visible on the branch, including inherited ones.  |
| `schedule`      | Yes      | `{ "cron": "*/15 * * * *" }`. Cron is always UTC.                                                     |
| `function_path` | No       | Path the invocation is sent to. Defaults to `/`. Path only, no query string.                          |
| `enabled`       | No       | Defaults to `true`. Set `false` to keep a trigger without running it.                                 |

Neon returns these read-only fields on every trigger:

| Field              | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| `trigger_id`       | Opaque ID in the form `trigger-<uuid>`, stable across the project.      |
| `version`          | A number that increases when the trigger's configuration changes.       |
| `next_run_at`      | Next run, UTC. `null` while disabled. Advances on its own as runs pass. |
| `source_branch_id` | The branch that authored the configuration in effect.                   |
| `inherited`        | `true` when that configuration came from an ancestor branch.            |

A function can have multiple triggers, each evaluated independently, for example a 15-minute sync and a nightly full run. Give each a distinct `function_path` so the handler can tell them apart; the request itself doesn't say which trigger fired.

## What your function receives

When a schedule fires, Neon sends the function:

- **Method:** `POST`.
- **Path:** the trigger's `function_path`, exactly as configured.
- **Body:** the scheduled minute, `{"scheduled_at":"2026-09-08T19:30:00Z"}`. This is the only context in the request.
- **Headers:** `content-type: application/json` and a W3C [`traceparent`](https://www.w3.org/TR/trace-context/).

Design your handler for this. It must answer `POST` (a `GET`-only handler won't see the call) and read `scheduled_at` from the body, since the headers don't carry it.

A trigger call also can't be authenticated yet: scheduled calls carry no credentials, so keep this route outside your auth middleware, or the trigger's own request is rejected. And since the URL is public, you can't tell a trigger from any other caller, so make the handler safe to call: keep it idempotent and guard destructive actions. An unguessable `function_path` is obscurity, not authentication; don't rely on it as a secret.

If the compute is scaled to zero when a schedule fires, the invocation wakes it, so that first run is slower while the compute starts (a cold start).

## Triggers and branching

Triggers follow Neon's branch inheritance:

- **A child branch inherits its parent's triggers.** They appear with `inherited: true`, `enabled: false`, and `next_run_at: null`, and keep the same `trigger_id`. An inherited trigger doesn't run on the child until you enable it there.
- **Editing an inherited trigger makes it branch-local.** The `PATCH` creates a child-local copy under the same `trigger_id`: `inherited` becomes `false` and `source_branch_id` becomes the child. The parent is unchanged.
- **Deleting an inherited trigger on the child removes it there for good.** It won't reappear, and the parent keeps running it.

So branching a production branch for a test doesn't double your scheduled work. Nothing runs on the child until you enable it, and enabling it there can't affect the parent.

## Limits

|                 |                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| Trigger types   | `schedule` only                                                                                        |
| Cron format     | Five numeric fields, UTC. No seconds, named days or months, or macros.                                 |
| Interval        | As frequent as every minute (`* * * * *`); no maximum interval                                         |
| `function_slug` | Must match a function on the branch. Slugs are `^[a-z0-9]{1,20}$` and can't change after first deploy. |
| `name`          | 1 to 256 characters, unique per branch including inherited triggers                                    |
| `function_path` | 1 to 2048 characters, path only                                                                        |

## Next steps

When you're ready, [Schedule a function](/docs/compute/functions/triggers/schedule) walks through creating, updating, and deleting triggers, with a cron reference and a worked example.
