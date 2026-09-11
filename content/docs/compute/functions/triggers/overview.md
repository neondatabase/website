---
title: Function Triggers
subtitle: Let Neon invoke a function for you.
summary: >-
  Function Triggers invoke a deployed Neon Function in response to an event, with no external
  scheduler and no compute kept running to watch for it. Covers the trigger types (schedule and
  object-created), what an invocation sends your function, how triggers behave across branches,
  and the current limits.
enableTableOfContents: true
updatedOn: '2026-09-11T15:58:40.262Z'
---

A Function Trigger tells Neon to invoke a deployed [Neon Function](/docs/compute/functions/overview) in response to an event. No external scheduler, no queue wiring, and no compute kept running to watch for it.

Trigger types available today:

- **`schedule`** — a cron expression evaluated in UTC. See [Schedule a function](/docs/compute/functions/triggers/schedule).
- **`storage_object_created`** — an object created in an [Object Storage](/docs/storage/overview) bucket, optionally under a key prefix. See [Trigger on an object upload](/docs/compute/functions/triggers/object-storage).

The API uses a `type` discriminator, so more types can be added later without changing existing triggers. You manage all types through the Neon API.

## Function Triggers vs pg_cron

[pg_cron](/docs/extensions/pg_cron) schedules SQL inside Postgres. A scheduled Function Trigger runs your function code instead. They solve different problems:

|                        | pg_cron                              | Function Triggers                                                                            |
| ---------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| Runs                   | A SQL statement or Postgres function | Your JavaScript or TypeScript function                                                       |
| Where                  | Inside the Postgres compute          | On Neon's compute, next to your data                                                         |
| External APIs          | No                                   | Yes: HTTP, [AI Gateway](/docs/ai-gateway/overview), [Object Storage](/docs/storage/overview) |
| Compute scaled to zero | Doesn't run                          | Runs; the invocation starts the function                                                     |

## Trigger fields

A trigger belongs to a project and branch and points to one function on that branch.

| Field                    | Required                     | Description                                                                                                                                                     |
| ------------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                   | Yes                          | `"schedule"` or `"storage_object_created"`.                                                                                                                     |
| `function_slug`          | Yes                          | The [slug](/docs/compute/functions/deploy#slugs) of the function to invoke. It's the only identifier.                                                           |
| `name`                   | Yes                          | A label, 1 to 256 characters. Unique among triggers visible on the branch, including inherited ones.                                                            |
| `schedule`               | For `schedule`               | `{ "cron": "*/15 * * * *" }`, always UTC. See [Schedule a function](/docs/compute/functions/triggers/schedule).                                                 |
| `storage_object_created` | For `storage_object_created` | `{ "bucket_name": "my-bucket", "prefix": "uploads/" }` (`prefix` optional). See [Trigger on an object upload](/docs/compute/functions/triggers/object-storage). |
| `function_path`          | No                           | Path the invocation is sent to. Defaults to `/`. Path only, no query string.                                                                                    |
| `enabled`                | No                           | Defaults to `true`. Set `false` to keep a trigger without running it.                                                                                           |

Neon returns these read-only fields on every trigger:

| Field              | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| `trigger_id`       | Opaque ID in the form `trigger-<uuid>`, stable across the project.      |
| `version`          | A number that increases when the trigger's configuration changes.       |
| `next_run_at`      | Next run, UTC. `null` while disabled. Advances on its own as runs pass. |
| `source_branch_id` | The branch that authored the configuration in effect.                   |
| `inherited`        | `true` when that configuration came from an ancestor branch.            |

A function can have multiple triggers, each evaluated independently, for example a 15-minute sync and a nightly full run. Give each a distinct `function_path`, or read `trigger.id` / `trigger.name` from the request body, so the handler can tell them apart.

## What your function receives

When a trigger fires, Neon sends the function:

- **Method:** `POST`.
- **Path:** the trigger's `function_path`, exactly as configured. Your handler needs a route that matches it (the default `/` matches `app.post('/')`).
- **Body:** a JSON envelope describing the occurrence. The shape is the same for every trigger type; `trigger.type` and the `data` object vary:

  ```json
  {
    "version": 1,
    "invocation_id": "abc123FUPHOw0Pl1ZooidgpJhvHaShi1aX40cQ0b321",
    "trigger": { "type": "schedule", "id": "trigger-1a2b3c4d-5e6f-7890-abcd-ef1234567890", "name": "uptime-check" },
    "data": { "scheduled_at": "2026-09-08T19:30:00Z" }
  }
  ```

  `data` holds the event details: `scheduled_at` (UTC) for a `schedule` trigger, or `bucket_name` and `object_key` for a [`storage_object_created`](/docs/compute/functions/triggers/object-storage#what-your-function-receives) trigger. `trigger` says which trigger fired, so a function with several triggers can tell them apart.

- **Headers:** `content-type: application/json`, a W3C [`traceparent`](https://www.w3.org/TR/trace-context/), and `X-Neon-Trigger-Invocation-Id` (equal to the body's `invocation_id`).

Design your handler for the trigger type you use: it answers `POST` and reads what it needs from `data`.

### Confirming a request came from Neon

Neon delivers trigger calls to the function's public URL. To confirm a request is a genuine trigger invocation and not an arbitrary caller, check for the `X-Neon-Trigger-Invocation-Id` header: Neon strips any client-supplied `X-Neon-*` header at the edge, so a request that carries one is sent by Neon's trigger system. A handler that only serves triggers can reject requests that lack it, as the [worked handler](/docs/compute/functions/triggers/schedule#write-a-handler-for-the-scheduled-call) does.

The `invocation_id` is a correlation ID, not a secret: a digest of the trigger and its occurrence, stable across retries, so it ties your logs to a specific run. Matching the header against the body is a consistency check, not the security boundary; the guarantee is the header's presence. Keep the handler idempotent and guard destructive actions regardless.

If the compute is scaled to zero when a trigger fires, the invocation wakes it, so that first run is slower while the compute starts (a cold start).

## Triggers and branching

Triggers follow Neon's branch inheritance:

- **A child branch inherits its parent's triggers.** They appear with `inherited: true`, `enabled: false`, and `next_run_at: null`, and keep the same `trigger_id`. An inherited trigger doesn't run on the child until you enable it there.
- **Editing an inherited trigger makes it branch-local.** The `PATCH` creates a child-local copy under the same `trigger_id`: `inherited` becomes `false` and `source_branch_id` becomes the child. The parent is unchanged.
- **Deleting an inherited trigger on the child removes it there for good.** It won't reappear, and the parent keeps running it.

So branching a production branch for a test doesn't double your scheduled work. Nothing runs on the child until you enable it, and enabling it there can't affect the parent.

## Limits

|                          |                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| Trigger types            | `schedule` and `storage_object_created`                                                                |
| Cron format (`schedule`) | Five numeric fields, UTC. No seconds, named days or months, or macros.                                 |
| Interval (`schedule`)    | As frequent as every minute (`* * * * *`); no maximum interval                                         |
| `function_slug`          | Must match a function on the branch. Slugs are `^[a-z0-9]{1,20}$` and can't change after first deploy. |
| `name`                   | 1 to 256 characters, unique per branch including inherited triggers                                    |
| `function_path`          | 1 to 2048 characters, path only                                                                        |

## Next steps

When you're ready, walk through a worked example for each type: [Schedule a function](/docs/compute/functions/triggers/schedule) (with a cron reference) and [Trigger on an object upload](/docs/compute/functions/triggers/object-storage).
