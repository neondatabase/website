---
title: Schedule a function
subtitle: Create and manage scheduled Function Triggers.
summary: >-
  Create, list, update, disable, and delete scheduled Function Triggers with the Neon API:
  a Hono handler for the scheduled POST, a five-field UTC cron reference, how to confirm a
  run in the logs, and the common errors.
enableTableOfContents: true
updatedOn: '2026-09-08T23:00:43.703Z'
---

This page shows how to schedule a deployed function with a cron expression, then covers listing, updating, disabling, and deleting triggers. For what a trigger is and how it behaves across branches, see the [overview](/docs/compute/functions/triggers/overview). Triggers are managed through the Neon API; there are no CLI commands for them yet.

## Before you begin

You need a [deployed function](/docs/compute/functions/get-started) and its [slug](/docs/compute/functions/deploy#slugs), plus a Neon [API key](/docs/manage/api-keys) to call the trigger API. If you deployed with the CLI, [`neon link`](/docs/cli/link) already wrote your project and branch to a `.neon` file; you can also find the IDs in the [Neon Console](https://console.neon.tech).

The examples use these variables:

```bash
export API="https://console.neon.tech/api/v2"
export NEON_API_KEY="<your-api-key>"
export PROJECT_ID="<your-project-id>"
export BRANCH_ID="<your-branch-id>"
```

<Steps>

## Write a handler for the scheduled call

A scheduled invocation is a `POST` with `{scheduled_at}` and no credentials, so the route must accept an unauthenticated `POST` and read the body for context. A trigger call can't be authenticated yet and the function's URL is public, so make the handler safe for anyone to call (see [What your function receives](/docs/compute/functions/triggers/overview#what-your-function-receives)).

This [Hono](https://hono.dev) function checks a URL and records the result. The outbound `fetch` is work you can't run from SQL inside the database:

```ts
import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';

const app = new Hono();
const sql = neon(process.env.DATABASE_URL!);

// No auth middleware on this route: scheduled invocations arrive without credentials.
app.post('/', async (c) => {
  const { scheduled_at: scheduledAt } = await c.req.json<{ scheduled_at: string }>();

  const started = performance.now();
  const res = await fetch('https://example.com', { signal: AbortSignal.timeout(10_000) });
  const latencyMs = Math.round(performance.now() - started);

  await sql`
    INSERT INTO checks (scheduled_at, status_code, latency_ms)
    VALUES (${scheduledAt}, ${res.status}, ${latencyMs})
    ON CONFLICT (scheduled_at) DO NOTHING
  `;

  console.log(`check ${scheduledAt}: ${res.status} in ${latencyMs}ms`);
  return c.json({ ok: true, scheduled_at: scheduledAt, status: res.status });
});

export default app;
```

`DATABASE_URL` is injected for you. See [Environment variables](/docs/compute/functions/environment-variables). The `ON CONFLICT (scheduled_at) DO NOTHING` clause makes a redelivered occurrence a no-op.

Create the table it writes to, in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or with [`neon psql`](/docs/cli/psql):

```sql
CREATE TABLE IF NOT EXISTS checks (
  scheduled_at timestamptz PRIMARY KEY,
  status_code  int,
  latency_ms   int
);
```

Then deploy the function:

```bash
neon functions deploy uptime --src functions/uptime.ts
```

## Create the trigger

`POST` to the branch's triggers collection. `type`, `function_slug`, `name`, and `schedule` are required; `function_path` and `enabled` are optional. Start with `* * * * *` so you can confirm the trigger in under a minute, then move it to a real cadence below.

```bash
curl -X POST "$API/projects/$PROJECT_ID/branches/$BRANCH_ID/triggers" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "schedule",
    "function_slug": "uptime",
    "name": "uptime-check",
    "schedule": { "cron": "* * * * *" },
    "function_path": "/",
    "enabled": true
  }'
```

Neon responds `201` with the trigger wrapped in a `trigger` object:

```json
{
  "trigger": {
    "type": "schedule",
    "trigger_id": "trigger-1a2b3c4d-5e6f-7890-abcd-ef1234567890",
    "function_slug": "uptime",
    "name": "uptime-check",
    "function_path": "/",
    "schedule": { "cron": "* * * * *" },
    "enabled": true,
    "version": 1347042,
    "next_run_at": "2026-09-08T19:31:00.000000Z",
    "source_branch_id": "br-example-branch-12345678",
    "inherited": false
  }
}
```

`next_run_at` is when the first run lands. It's in UTC and advances on its own as runs pass.

## Confirm it ran

The schedule is every minute, so wait about a minute, then read the function's logs:

```bash
neon logs query --source function
```

Your `check ...` line appears with the `scheduled_at` value from the request body. See [Observability](#observability) for why that line matters.

Once you've seen a run, move the trigger to its real cadence with a `PATCH` on `schedule` (see [Update a trigger](#update-a-trigger)). Left at `* * * * *`, it keeps invoking the function every minute.

</Steps>

## Cron reference

A schedule is a five-field numeric cron expression, always interpreted in **UTC**:

```
minute  hour  day-of-month  month  day-of-week
```

There's no timezone setting. For a schedule that tracks local time, convert to UTC yourself, and account for daylight saving shifts.

| Expression     | Meaning (UTC)                     |
| -------------- | --------------------------------- |
| `*/15 * * * *` | Every 15 minutes                  |
| `0 9 * * 1-5`  | 09:00, Monday through Friday      |
| `0,30 * * * *` | On the hour and half hour         |
| `15 14 1 * *`  | 14:15 on the 1st of each month    |
| `0 0 1 * *`    | Midnight on the 1st of each month |
| `* * * * *`    | Every minute                      |

Ranges (`1-5`), lists (`0,30`), steps (`*/2`), and fixed values all work, and there's no minimum interval, so every minute is allowed. Neon rejects a few things standard cron allows, each with a `400`: a seconds field (`* * * * * *`), named days or months (`0 9 * * MON`, `0 0 1 JAN *`), macros (`@daily`, `@hourly`), values outside a field's range (`70 * * * *`), and zero steps (`*/0 * * * *`).

## Manage triggers

These examples use `$TRIGGER_ID`, the `trigger_id` from the create response.

### List triggers on a branch

```bash
curl "$API/projects/$PROJECT_ID/branches/$BRANCH_ID/triggers" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

```json
{
  "triggers": [
    {
      "type": "schedule",
      "trigger_id": "trigger-1a2b3c4d-5e6f-7890-abcd-ef1234567890",
      "function_slug": "uptime",
      "name": "uptime-check",
      "function_path": "/",
      "schedule": { "cron": "0 3 * * *" },
      "enabled": true,
      "version": 1347043,
      "next_run_at": "2026-09-09T03:00:00.000000Z",
      "source_branch_id": "br-example-branch-12345678",
      "inherited": false
    }
  ]
}
```

The list is ordered by `trigger_id` and includes triggers [inherited](/docs/compute/functions/triggers/overview#triggers-and-branching) from a parent branch. There's no pagination or filtering.

### Get one trigger

```bash
curl "$API/projects/$PROJECT_ID/branches/$BRANCH_ID/triggers/$TRIGGER_ID" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

Returns the same `{ "trigger": { ... } }` shape as create.

### Update a trigger

`PATCH` is partial, but it must include the `type` discriminator plus at least one field to change. You can change `function_slug`, `name`, `function_path`, `schedule`, and `enabled`.

```bash
curl -X PATCH "$API/projects/$PROJECT_ID/branches/$BRANCH_ID/triggers/$TRIGGER_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "type": "schedule", "schedule": { "cron": "0 3 * * *" } }'
```

A successful update returns `200` with the full object. `version` increases and `next_run_at` is recomputed against the new schedule.

### Disable and re-enable

Disabling keeps the trigger but stops scheduling it:

```bash
curl -X PATCH "$API/projects/$PROJECT_ID/branches/$BRANCH_ID/triggers/$TRIGGER_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "type": "schedule", "enabled": false }'
```

Disabling sets `next_run_at` to `null` and increments `version`. Send `"enabled": true` to start it again; `next_run_at` is recomputed from the current time.

### Delete a trigger

```bash
curl -X DELETE "$API/projects/$PROJECT_ID/branches/$BRANCH_ID/triggers/$TRIGGER_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" -i
```

```
HTTP/1.1 204 No Content
```

<Admonition type="note">
Disabling or deleting stops future scheduling, but an occurrence already committed for delivery is still expected to run. Change a trigger a second or more before the scheduled minute to prevent that run; don't rely on a disable landing in the same instant as a fire.
</Admonition>

## Observability

A scheduled invocation isn't distinguishable from an ordinary HTTP call in the platform logs. The `invoke begin` and `invoke end` lines under the `neon.function.request` scope look the same either way, and there's no separate "trigger fired" event to query.

Make the run visible from inside your handler instead. A `console.log` that includes `scheduled_at` gives you a searchable line tied to the run that produced it:

```ts
console.log(`check ${scheduledAt}: ${res.status} in ${latencyMs}ms`);
```

Your output lands under the `neon.function.app` scope, in the Console's Logs tab and in:

```bash
neon logs query --source function
```

Function logs come from `neon logs query --source function`, not the `functions` command group. Standard Node instrumentation such as Sentry or OpenTelemetry also works, and the incoming `traceparent` header ties a run into an existing trace.

## Common errors

| Situation                                               | Status | Message                                        |
| ------------------------------------------------------- | ------ | ---------------------------------------------- |
| A trigger with that `name` already exists on the branch | `409`  | function trigger name already exists on branch |
| Invalid cron expression                                 | `400`  | cron: cron value is outside field bounds       |
| A `timezone` key inside `schedule`                      | `400`  | unexpected field "timezone"                    |
| A query string in `function_path`                       | `400`  | invalid function trigger path                  |
| No function with that slug on the branch                | `404`  | target function not visible on branch          |

The request body is strict: any field not in the schema is rejected rather than ignored, so a typo fails loudly. In particular, the function is identified by `function_slug`; there's no `function_id` field.

## Related

- [Function Triggers overview](/docs/compute/functions/triggers/overview)
- [pg_cron](/docs/extensions/pg_cron): schedule SQL inside Postgres instead
- [Deploy and manage](/docs/compute/functions/deploy)
- [Authentication](/docs/compute/functions/authentication)
- [Logs](/docs/compute/functions/logs)
