---
title: Function Triggers
subtitle: Let Neon invoke a function for you.
summary: >-
  Function Triggers invoke a deployed Neon Function in response to an event, with no external
  scheduler and no compute kept running to watch for it. Covers the trigger types (schedule and
  object-created), what an invocation sends your function, and how triggers behave across
  branches.
enableTableOfContents: true
updatedOn: '2026-10-20T18:56:03.438Z'
---

A Function Trigger tells Neon to invoke a deployed [Neon Function](/docs/compute/functions/overview) in response to an event, so recurring or event-driven work runs as your own code next to your data. There's no scheduler or queue to operate and no compute kept running to watch for the event. Functions are long-running, so one trigger handles a quick health check or a table-scanning batch, and it fires even when the compute is scaled to zero.

Trigger types available today:

- **`schedule`**: a cron expression evaluated in Coordinated Universal Time (UTC). See [Schedule a function](/docs/compute/functions/triggers/schedule).
- **`storage_object_created`**: an object created in an [Object Storage](/docs/storage/overview) bucket, optionally under a key prefix. See [Trigger on an object upload](/docs/compute/functions/triggers/object-storage).

![Both trigger types invoke one Neon Function, which can reach Postgres, external HTTP APIs, the AI Gateway, and Object Storage](/docs/compute/functions/triggers/types-fan-in.png 'priority')

The API uses a `type` discriminator, so more types can be added later without changing existing triggers. Manage triggers from the [Neon Console](https://console.neon.tech), the [`neon triggers`](/docs/cli/triggers) CLI, the Neon API, or [`neon.ts`](/docs/reference/neon-ts); each guide shows which of these its type supports.

## Trigger fields

A trigger belongs to a project and branch and points to one function on that branch.

| Field                    | Required                     | Description                                                                                                                                                     |
| ------------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                   | Yes                          | `"schedule"` or `"storage_object_created"`.                                                                                                                     |
| `function_slug`          | Yes                          | The [slug](/docs/compute/functions/deploy#slugs) of the function to invoke, matching `^[a-z0-9]{1,20}$` and fixed after first deploy. It's the only identifier. |
| `name`                   | Yes                          | A label, 1 to 256 characters. Unique among triggers visible on the branch, including inherited ones.                                                            |
| `schedule`               | For `schedule`               | `{ "cron": "*/15 * * * *" }`, always UTC. See [Schedule a function](/docs/compute/functions/triggers/schedule).                                                 |
| `storage_object_created` | For `storage_object_created` | `{ "bucket_name": "my-bucket", "prefix": "uploads/" }` (`prefix` optional). See [Trigger on an object upload](/docs/compute/functions/triggers/object-storage). |
| `function_path`          | No                           | Path the invocation is sent to, 1 to 2048 characters. Defaults to `/`. Path only, no query string.                                                              |
| `enabled`                | No                           | Defaults to `true`. Set `false` to keep a trigger without running it.                                                                                           |

Neon returns these read-only fields on every trigger:

| Field         | Description                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| `trigger_id`  | Opaque ID in the form `trigger-<uuid>`, stable across the project.           |
| `version`     | A number that increases when the trigger's configuration changes.            |
| `next_run_at` | Next run, UTC. `null` while disabled. Advances automatically after each run. |
| `inherited`   | `true` when that configuration came from an ancestor branch.                 |

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
    "data": { "scheduled_at": "2026-09-08T19:30:00Z" },
    "previous_attempts": [],
    "previous_attempts_omitted": 0
  }
  ```

  `data` holds the event details: `scheduled_at` (UTC) for a `schedule` trigger, or `bucket_name` and `object_key` for a [`storage_object_created`](/docs/compute/functions/triggers/object-storage#what-your-function-receives) trigger. `trigger` says which trigger fired, so a function with several triggers can tell them apart. Here `trigger.id` is the same value as the trigger resource's `trigger_id`, and this `version` is the payload's schema version, not the trigger's configuration `version`. For `previous_attempts` and `previous_attempts_omitted`, see [Read previous failures](#read-previous-failures).

- **Headers:** `content-type: application/json`, a W3C [`traceparent`](https://www.w3.org/TR/trace-context/), and `X-Neon-Trigger-Invocation-Id` (equal to the body's `invocation_id`).

Design your handler for the trigger type you use: it answers `POST` and reads what it needs from `data`.

A trigger invocation can be slower on a cold start: if the function's runtime was idle and evicted, Neon spins it up first, and a query to a Postgres compute that has [scaled to zero](/docs/introduction/scale-to-zero) wakes that compute too.

### Confirming a request came from Neon

Neon delivers trigger calls to the function's public URL. To confirm a request is a genuine trigger invocation and not an arbitrary caller, check for the `X-Neon-Trigger-Invocation-Id` header: Neon strips any client-supplied `X-Neon-*` header at the edge, so a request that carries one is sent by Neon's trigger system. A handler that only serves triggers can reject requests that lack it, as the [worked handler](/docs/compute/functions/triggers/schedule#write-a-handler-for-the-scheduled-call) does.

The `invocation_id` is a correlation ID, not a secret. It's a digest of the trigger and its occurrence, stable across retries, so it ties your logs to a specific run. What proves the request came from Neon is the presence of the header, not its value, so matching the header against the body is only a consistency check. Keep the handler idempotent and guard destructive actions regardless.

## Delivery and retries

Neon retries failed trigger deliveries a few times, up to 72 hours after the event is created. A `2xx` response marks the delivery as successful once your function finishes sending the response body. Other responses, including redirects and `429`, count as failures. Neon doesn't follow redirects. Errors in your function, including errors that prevent it from loading, also count as failures, as does a delivery to a function that's missing or can't run. If the last retry fails, Neon discards the event.

Delivery can happen more than once, even if your handler already did the work, and deliveries can arrive out of order. The `invocation_id` stays the same across deliveries of the same event. Make your handler idempotent, so processing the same event again doesn't repeat side effects. For example, use `invocation_id` as a unique key when recording a result, and commit that record together with the database changes it protects.

Retries use the same [Functions pricing](/docs/introduction/plans#functions) as other invocations.

### Request a later retry

If your handler needs more time before another attempt, return `503 Service Unavailable` with a `Retry-After` header. Neon honors this header only on a `503` returned by your handler. It ignores the header on other statuses, including `429`.

The header accepts a whole number of seconds, such as `Retry-After: 60`, or an HTTP-date, such as `Retry-After: Wed, 21 Oct 2026 07:28:00 GMT`. Neon clamps the requested wait to 1 to 900 seconds. Zero or a past date becomes a one-second wait. The retry can happen slightly later than that wait.

A valid header can keep retries going beyond the usual retry limits, but it never extends the event's original 72-hour lifetime. The lifetime starts when the event is created, not when your handler returns `503`. Each later failure needs its own valid `503` and `Retry-After` to extend retries again. An absent or invalid header uses the usual retry policy; it doesn't reset the retry limits.

### Read previous failures

The request body's `previous_attempts` array is empty on the first delivery. On later deliveries, it contains only previous failures from your function, ordered from oldest to newest among the retained entries. Neon keeps up to the latest 16 entries and limits the serialized history to 32 KiB, dropping the oldest entries as needed. `previous_attempts_omitted` is an integer that counts the failures left out of the array. It starts at `0`.

Each entry has these fields:

| Field                     | Type              | Description                                                                                                                                           |
| ------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status_code`             | Integer or `null` | HTTP status returned by your function, or `null` if the failure had no HTTP response.                                                                 |
| `timestamp`               | String            | UTC timestamp when the response or failure completed.                                                                                                 |
| `response_body`           | String            | Up to the first 1 KiB of the response body, decoded as UTF-8 with replacement for invalid bytes. For failures without a response, a short error text. |
| `response_body_truncated` | Boolean           | `true` if the response preview was cut short.                                                                                                         |

For example, a delivery after your handler returned `503` can include:

```json
{
  "previous_attempts": [
    {
      "status_code": 503,
      "timestamp": "2026-10-20T12:00:00Z",
      "response_body": "Dependency unavailable",
      "response_body_truncated": false
    }
  ],
  "previous_attempts_omitted": 0
}
```

These fields are part of the [full request envelope](#what-your-function-receives). Failures on Neon's side don't appear in this history or count toward your function's retries. History is bounded, so use `invocation_id` to handle duplicates rather than the number of history entries.

## Test triggers locally

Triggers only fire from Neon's side against the deployed function, so a trigger never calls your local machine. To iterate on the handler, serve the function with [`neon dev`](/docs/compute/functions/get-started#develop-locally) and replay the trigger payload yourself with `curl`.

1. Start the dev server:

   ```bash
   neon dev
   ```

   It serves the functions declared in `neon.ts` with hot reload, injects `DATABASE_URL` and other Neon variables from the linked branch, and prints a local URL for each function (by default `http://localhost:8787`).

2. Send a `POST` to the local URL plus the trigger's `function_path`, with the same JSON envelope the trigger would send. Include an `X-Neon-Trigger-Invocation-Id` header if your handler checks for it. A schedule replay carries `data.scheduled_at`:

   ```bash shouldWrap
   curl -X POST http://localhost:8787/ \
     -H "Content-Type: application/json" \
     -H "X-Neon-Trigger-Invocation-Id: local-test" \
     -d '{"version":1,"invocation_id":"local-1","trigger":{"type":"schedule","id":"trigger-local","name":"local-schedule"},"data":{"scheduled_at":"2026-09-08T19:30:00Z"},"previous_attempts":[],"previous_attempts_omitted":0}'
   ```

   An object-created replay carries `data.bucket_name` and `data.object_key`:

   ```bash shouldWrap
   curl -X POST http://localhost:8787/ \
     -H "Content-Type: application/json" \
     -H "X-Neon-Trigger-Invocation-Id: local-test" \
     -d '{"version":1,"invocation_id":"local-2","trigger":{"type":"storage_object_created","id":"trigger-local","name":"local-upload"},"data":{"bucket_name":"my-bucket","object_key":"uploads/report.csv"},"previous_attempts":[],"previous_attempts_omitted":0}'
   ```

Handler output appears in the `neon dev` terminal rather than in `neon logs query`. Leave off the `X-Neon-Trigger-Invocation-Id` header to confirm a guarded handler returns `403`. If the handler reads from Object Storage, the bucket and object live on the branch, so deploy first and make sure the object you replay exists there.

## Triggers and branching

Triggers follow Neon's branch inheritance:

- **A child branch inherits its parent's triggers.** They appear with `inherited: true`, `enabled: false`, and `next_run_at: null`, and keep the same `trigger_id`. An inherited trigger doesn't run on the child until you enable it there.
- **Editing an inherited trigger makes it branch-local.** The `PATCH` creates a child-local copy under the same `trigger_id`, and `inherited` becomes `false`. The parent is unchanged.
- **Deleting an inherited trigger on the child removes it there for good.** It won't reappear, and the parent keeps running it.

So branching a production branch for a test doesn't double your scheduled work. Nothing runs on the child until you enable it, and enabling it there can't affect the parent.

## Next steps

When you're ready, walk through a worked example for each type: [Schedule a function](/docs/compute/functions/triggers/schedule) (with a cron reference) and [Trigger on an object upload](/docs/compute/functions/triggers/object-storage).
