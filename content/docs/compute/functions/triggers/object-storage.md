---
title: Trigger on an object upload
subtitle: Run a function when an object is created in a bucket.
summary: >-
  Create and manage storage_object_created Function Triggers with the Neon API: a Hono
  handler for the upload event, the bucket and prefix filter, what your function receives,
  and how to confirm a run in the logs.
enableTableOfContents: true
updatedOn: '2026-09-11T15:58:40.262Z'
---

A `storage_object_created` trigger tells Neon to invoke a deployed [Neon Function](/docs/compute/functions/overview) when an object is created in an [Object Storage](/docs/storage/overview) bucket. Optionally scope it to a key `prefix`, so only uploads under that path fire the function. There's no external event wiring and no compute kept running to watch the bucket.

For what a trigger is and how it behaves across branches, see the [overview](/docs/compute/functions/triggers/overview). The scheduled trigger type is covered in [Schedule a function](/docs/compute/functions/triggers/schedule); this page covers the object-created type. You manage both through the Neon API.

## Before you begin

You need a [deployed function](/docs/compute/functions/get-started) and its [slug](/docs/compute/functions/deploy#slugs), a [bucket](/docs/storage/buckets) on the branch, and a Neon [API key](/docs/manage/api-keys). If you deployed with the CLI, [`neon link`](/docs/cli/link) already wrote your project and branch to a `.neon` file; you can also find the IDs in the [Neon Console](https://console.neon.tech).

The examples use these variables:

```bash
export API="https://console.neon.tech/api/v2"
export NEON_API_KEY="<your-api-key>"
export PROJECT_ID="<your-project-id>"
export BRANCH_ID="<your-branch-id>"
```

<Steps>

## Write a handler for the upload event

An object-created invocation is a `POST` whose JSON body carries the occurrence: `data.bucket_name`, `data.object_key`, the `trigger` that fired, and an `invocation_id`. Neon delivers it to the function's public URL, so the route sits outside your auth middleware. You can confirm the call came from Neon with the `X-Neon-Trigger-Invocation-Id` header (see [Confirming a request came from Neon](/docs/compute/functions/triggers/overview#confirming-a-request-came-from-neon)); keep the handler idempotent and guard destructive actions regardless.

This [Hono](https://hono.dev) function records each uploaded object. From here you'd typically fetch and process the object, enqueue a job, or notify another service:

```ts
import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';

const app = new Hono();
const sql = neon(process.env.DATABASE_URL!);

// This route is public. Neon strips client-set X-Neon-* headers, so the presence of
// X-Neon-Trigger-Invocation-Id attests the call came from Neon's trigger system.
app.post('/', async (c) => {
  if (!c.req.header('x-neon-trigger-invocation-id')) {
    return c.json({ error: 'not a trigger call' }, 403);
  }

  const { data } = await c.req.json<{ data: { bucket_name: string; object_key: string } }>();
  const { bucket_name: bucket, object_key: key } = data;

  await sql`
    INSERT INTO uploads (bucket, object_key)
    VALUES (${bucket}, ${key})
    ON CONFLICT (bucket, object_key) DO NOTHING
  `;

  console.log(`object created: ${bucket}/${key}`);
  return c.json({ ok: true, bucket, object_key: key });
});

export default app;
```

`DATABASE_URL` is injected for you. See [Environment variables](/docs/compute/functions/environment-variables). The `ON CONFLICT (bucket, object_key) DO NOTHING` clause makes a redelivered occurrence a no-op.

Create the table it writes to, in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or with [`neon psql`](/docs/cli/psql):

```sql
CREATE TABLE IF NOT EXISTS uploads (
  bucket      text,
  object_key  text,
  seen_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (bucket, object_key)
);
```

Then deploy the function:

```bash
neon functions deploy onupload --src functions/onupload.ts
```

## Create the trigger

`POST` to the branch's triggers collection. `type`, `function_slug`, `name`, and `storage_object_created` (with `bucket_name`) are required; `prefix`, `function_path`, and `enabled` are optional.

```bash
curl -X POST "$API/projects/$PROJECT_ID/branches/$BRANCH_ID/triggers" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "storage_object_created",
    "function_slug": "onupload",
    "name": "record-uploads",
    "storage_object_created": {
      "bucket_name": "my-bucket",
      "prefix": "uploads/"
    },
    "function_path": "/",
    "enabled": true
  }'
```

Neon responds `201` with the trigger wrapped in a `trigger` object:

```json
{
  "trigger": {
    "type": "storage_object_created",
    "trigger_id": "trigger-1a2b3c4d-5e6f-7890-abcd-ef1234567890",
    "function_slug": "onupload",
    "name": "record-uploads",
    "function_path": "/",
    "storage_object_created": {
      "bucket_name": "my-bucket",
      "prefix": "uploads/"
    },
    "enabled": true,
    "version": 1347042,
    "source_branch_id": "br-example-branch-12345678",
    "inherited": false
  }
}
```

Unlike a scheduled trigger, an object-created trigger has no `schedule` or `next_run_at`: it fires on the event, not the clock.

## Confirm it ran

Upload an object under the bucket and prefix you configured (see [Upload and manage objects](/docs/storage/objects)), then read the function's logs:

```bash
neon logs query --source function
```

Your `object created: ...` line appears with the `bucket_name` and `object_key` from the request body. See [Observability](#observability) for why that line matters.

<Admonition type="note">
A newly created trigger takes a few seconds to become active. If your first test upload doesn't fire the function, wait a moment and upload again.
</Admonition>

</Steps>

## What your function receives

An object-created fire delivers the same envelope shape as every trigger type, with `trigger.type` set to `storage_object_created` and the event details under `data`:

```json
{
  "version": 1,
  "invocation_id": "abc123FUPHOw0Pl1ZooidgpJhvHaShi1aX40cQ0b321",
  "trigger": { "type": "storage_object_created", "id": "trigger-1a2b3c4d-5e6f-7890-abcd-ef1234567890", "name": "record-uploads" },
  "data": {
    "bucket_name": "my-bucket",
    "object_key": "uploads/report.csv"
  }
}
```

- **`data.bucket_name`** — the bucket the object was created in.
- **`data.object_key`** — the full key of the created object, including any prefix.

The request also carries the `X-Neon-Trigger-Invocation-Id` header (equal to `invocation_id`), `content-type: application/json`, and a W3C [`traceparent`](https://www.w3.org/TR/trace-context/). For confirming the request came from Neon, see [Confirming a request came from Neon](/docs/compute/functions/triggers/overview#confirming-a-request-came-from-neon) in the overview.

## Trigger config

The object-created settings live under `storage_object_created`:

| Field         | Required | Description                                                                                      |
| ------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `bucket_name` | Yes      | The bucket to watch, on the trigger's branch.                                                    |
| `prefix`      | No       | Only objects whose key starts with this prefix fire the trigger. Omit to watch the whole bucket. |

The top-level `type`, `function_slug`, `name`, `function_path`, and `enabled` fields, and the read-only `trigger_id` / `version` / `source_branch_id` / `inherited`, work exactly as in [Trigger fields](/docs/compute/functions/triggers/overview#trigger-fields).

## Manage triggers

Listing, getting, updating, disabling, and deleting an object-created trigger use the same API as scheduled triggers, described in [Manage triggers](/docs/compute/functions/triggers/schedule#manage-triggers). A `PATCH` must include the `type` discriminator; for this type you can change `function_slug`, `name`, `function_path`, `enabled`, and the `storage_object_created` config (for example, to move the watched `prefix`):

```bash
curl -X PATCH "$API/projects/$PROJECT_ID/branches/$BRANCH_ID/triggers/$TRIGGER_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "storage_object_created",
    "storage_object_created": { "bucket_name": "my-bucket", "prefix": "incoming/" }
  }'
```

## Observability

In the platform logs, an object-created invocation looks like any other HTTP call: the `invoke begin` and `invoke end` lines under the `neon.function.request` scope are the same either way. Trace a run from your own handler output instead. A `console.log` that includes the object key gives you a searchable line tied to the run that produced it:

```ts
console.log(`object created: ${bucket}/${key}`);
```

Your output appears under the `neon.function.app` scope, in the Console's Logs tab and in `neon logs query --source function` (not the `functions` command group). Standard Node instrumentation such as Sentry or OpenTelemetry also works, and the incoming `traceparent` header ties a run into an existing trace.

## Common errors

| Situation                                               | Status | Message (ends with)                            |
| ------------------------------------------------------- | ------ | ---------------------------------------------- |
| A trigger with that `name` already exists on the branch | `409`  | function trigger name already exists on branch |
| No `storage_object_created` object                      | `400`  | `storage_object_created (field required)`      |
| `storage_object_created` without `bucket_name`          | `400`  | `bucket_name (field required)`                 |
| A query string in `function_path`                       | `400`  | invalid function trigger path                  |
| No function with that slug on the branch                | `404`  | target function not visible on branch          |

The request body is strict: any field not in the schema is rejected rather than ignored, so a typo fails loudly. The function is identified by `function_slug`; there's no `function_id` field.

## Related

- [Function Triggers overview](/docs/compute/functions/triggers/overview)
- [Schedule a function](/docs/compute/functions/triggers/schedule): the time-based trigger type
- [Object Storage](/docs/storage/overview) and [Upload and manage objects](/docs/storage/objects)
- [Deploy and manage](/docs/compute/functions/deploy)
- [Logs](/docs/compute/functions/logs)
