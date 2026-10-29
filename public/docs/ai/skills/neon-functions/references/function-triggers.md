# Function Triggers

A Function Trigger is a branch-scoped rule that POSTs to a Neon Function so recurring work does not need a separate scheduler. The request is a normal `fetch` invocation: same public URL, same 15-minute time-to-first-byte limit, same injected env (`DATABASE_URL`, …).

Same regions as Functions: `aws-us-east-2`, `aws-us-east-1`, `aws-eu-central-1`, and `aws-ap-southeast-1`. Needs Neon CLI 4.21 or newer to declare triggers in `neon.ts`.

If `neon deploy` returns 404 `function triggers not available for this project`, the project does not have Function Triggers yet. Deploy the function without applying the trigger (`neon functions deploy <slug> --src <entry>`) and retry `neon deploy` once the project has them.

## Supported types

`triggers` is a keyed map on `defineConfig`. Types:

| `type`                   | When it fires                                      | `neon.ts` fields                         | CLI create                                      |
| ------------------------ | -------------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| `schedule`               | On a five-field UTC cron expression                | `function`, `cron`                       | `neon triggers create --cron '…'`               |
| `storage_object_created` | When an object is created in a declared bucket     | `function`, `bucket`, optional `prefix`  | `neon triggers create --bucket <name>`          |

`create` takes `--cron` or `--bucket`, not both. `@neon/functions` ≥ 0.11.0: `parseTriggerDelivery` accepts both types; `parseTriggerInvocation` and Hono `parseTrigger(c)` stay schedule-only (`storage_object_created` is `invalid_body` there).

## Fields

The trigger name is the `neon.ts` map key (CLI `--name`). It must be unique among every trigger visible on the branch, including other functions.

| Field          | Required | Notes                                                                 |
| -------------- | -------- | --------------------------------------------------------------------- |
| `type`         | yes      | `"schedule"` or `"storage_object_created"`                            |
| `function`     | yes      | Function slug. REST/MCP: `function_slug`                              |
| `cron`         | schedule | Five-field UTC expression, e.g. `0 * * * *`, `*/15 * * * *`           |
| `bucket`       | storage  | Bucket name. REST: `storage_object_created.bucket_name`               |
| `prefix`       | no       | Object-key prefix filter. REST: `storage_object_created.prefix`       |
| `functionPath` | no       | Path on the function. Default `/`. CLI: `--function-path`             |
| `enabled`      | no       | Default `true`. CLI: `--enabled false` to create disabled             |

## neon.ts (preferred)

Declare `triggers` next to `functions` (and `buckets` when using storage). `neon deploy` applies triggers **after** the functions they target. Triggers that exist remotely but are omitted from `neon.ts` are left alone.

```typescript
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  functions: {
    ingest: { name: "Object ingest", source: "src/index.ts" },
    cron: { name: "Cron", source: "src/cron.ts" },
  },
  buckets: { assets: { access: "public_read" } },
  triggers: {
    "on-upload": {
      type: "storage_object_created",
      function: "ingest",
      bucket: "assets",
      prefix: "logos/",
      functionPath: "/object",
    },
    "every-minute": {
      type: "schedule",
      function: "cron",
      cron: "* * * * *",
      functionPath: "/cron",
    },
  },
});
```

```bash
neon deploy
```

Change the cron string, bucket, or prefix and deploy again to reschedule. Starter: `neon bootstrap --template cron-job`.

## CLI

Use when you are not applying `neon.ts`, or to list, enable, disable, or delete.

```bash
neon triggers create --function-slug cron --name hourly --cron '0 * * * *' --function-path /cron
neon triggers create --function-slug ingest --name on-upload --bucket assets --prefix 'logos/' --function-path /object
neon triggers list
neon triggers list --output json
neon triggers update <id> --branch <branch> --cron '*/30 * * * *'
neon triggers update <id> --branch <branch> --bucket assets --prefix 'incoming/'
neon triggers enable <id> --branch <branch>
neon triggers disable <id> --branch <branch>
neon triggers delete <id> --branch <branch>
```

`enable` / `disable` wrap `update --enabled`. Updating the cron recomputes `Next Run At`. Disabling clears `Next Run At`. Alias: `neon trigger`. `--cron` on a storage trigger, or `--bucket` / `--prefix` on a schedule trigger, is rejected.

Inspect a trigger with `neon triggers list --output json`. Pass `--branch` on get/update/enable/disable/delete: without it the CLI resolves the trigger id as a branch name.

Project and branch otherwise resolve from `--project-id` / `--branch`, then `.neon`, then a single-project auto-detect.

## MCP backup

The Neon MCP server (`?category=functions`) exposes `list_triggers`, `get_trigger`, `create_trigger`, `update_trigger`, and `delete_trigger`. `branch_id` is a `br-…` id, not a branch name (`list_branches` to resolve). Create a schedule trigger with snake_case:

```json
{
  "type": "schedule",
  "function_slug": "cron",
  "name": "hourly",
  "function_path": "/cron",
  "schedule": { "cron": "0 * * * *" },
  "enabled": true
}
```

`create_trigger` required fields for schedule: `type`, `function_slug`, `name`, `schedule`. REST is the same payload at `POST /projects/{project_id}/branches/{branch_id}/triggers`. For `storage_object_created`, use CLI or REST with `"type": "storage_object_created"` and `storage_object_created: { "bucket_name": "assets", "prefix": "logos/" }`. CLI docs: https://neon.com/docs/cli/triggers.md.

## Delivery payload

Neon POSTs JSON. The Functions proxy drops client-supplied `x-neon-*` headers, so a present `x-neon-trigger-invocation-id` is from a trigger delivery. It must match `invocation_id` in the body.

A Function that also serves app or public HTTP must not apply JWT or `X-Secret` middleware to the trigger path. Neon trigger POSTs do not send those. Caller shapes: [production-hardening.md](production-hardening.md).

Schedule wire JSON (snake_case):

```json
{
  "version": 1,
  "invocation_id": "…",
  "trigger": {
    "type": "schedule",
    "id": "trigger-…",
    "name": "hourly"
  },
  "data": { "scheduled_at": "2026-09-15T23:35:00Z" }
}
```

Storage-object-created wire JSON:

```json
{
  "version": 1,
  "invocation_id": "…",
  "trigger": {
    "type": "storage_object_created",
    "id": "trigger-…",
    "name": "on-upload"
  },
  "data": { "bucket_name": "uploads", "object_key": "smoke.txt" }
}
```

Parsed (`@neon/functions` ≥ 0.11.0) is camelCase. `parseTriggerDelivery` also sets a top-level `type`. Schedule: `data.scheduledAt`. Storage: `data.bucketName`, `data.objectKey`. Narrow on `invocation.type` (or `isScheduleTriggerInvocation` / `isStorageObjectCreatedTriggerInvocation`) before reading `data` — a check on `trigger.type` does not narrow the sibling `data` field.

### `parseTriggerDelivery` (both types)

```typescript
import { parseTriggerDelivery } from "@neon/functions/triggers";

export default {
  async fetch(request: Request): Promise<Response> {
    const parsed = await parseTriggerDelivery(request);
    if (!parsed.ok) {
      const status = parsed.error === "invalid_body" ? 400 : 401;
      return new Response(parsed.error, { status });
    }

    const invocation = parsed.invocation;
    if (invocation.type === "storage_object_created") {
      return Response.json({
        bucketName: invocation.data.bucketName,
        objectKey: invocation.data.objectKey,
      });
    }

    return Response.json({
      scheduledAt: invocation.data.scheduledAt,
    });
  },
};
```

`parseTriggerDelivery(request)` clones the Request before `json()`, so `request.json()` still works. If you already have the body: `parseTriggerDelivery({ headers, body })` (sync). `parsed.error` is `missing_header`, `invalid_body`, or `invocation_id_mismatch`. Unknown `trigger.type` values fail as `invalid_body`.

Hono: `parseTriggerDelivery(c.req.raw)`.

### `parseTrigger` (Hono, schedule only)

Throws `HTTPException`. `c.req.json()` still works afterwards. Returns `ScheduleTriggerInvocation`. A `storage_object_created` delivery is `invalid_body`.

| Failure                  | Status | Message                                       |
| ------------------------ | ------ | --------------------------------------------- |
| missing header           | 401    | `Missing x-neon-trigger-invocation-id header` |
| header ≠ `invocation_id` | 401    | `Invocation id mismatch`                      |
| invalid JSON or payload  | 400    | `Invalid trigger payload`                     |

```typescript
import { parseTrigger } from "@neon/functions/hono";

app.post("/cron", async (c) => {
  const invocation = await parseTrigger(c);
  return c.json({ ok: true, invocationId: invocation.invocationId });
});
```

### `parseTriggerInvocation` (`fetch`, schedule only)

```typescript
import { parseTriggerInvocation } from "@neon/functions/triggers";

export default {
  async fetch(request: Request): Promise<Response> {
    const parsed = await parseTriggerInvocation(request);
    if (!parsed.ok) {
      const status = parsed.error === "invalid_body" ? 400 : 401;
      return new Response(parsed.error, { status });
    }
    return Response.json({
      ok: true,
      invocationId: parsed.invocation.invocationId,
    });
  },
};
```

## Local `neon dev`

`neon dev` forwards `x-neon-trigger-invocation-id`, so you can simulate a tick:

```bash
curl -X POST http://localhost:8787/cron \
  -H 'content-type: application/json' \
  -H 'x-neon-trigger-invocation-id: local-dev' \
  -d '{
    "version": 1,
    "invocation_id": "local-dev",
    "trigger": { "type": "schedule", "id": "trigger-local", "name": "hourly" },
    "data": { "scheduled_at": "2026-09-15T00:00:00Z" }
  }'
```

A public POST to the **deployed** function that includes that header still returns 401: the proxy strips client `x-neon-*` headers.

## Inheritance

Triggers are branch-scoped. A trigger created on a parent is visible on children (`inherited: true`, `source_branch_id` points at the origin) and starts disabled there.

`neon deploy` of a `neon.ts` that declares the same trigger (default `enabled: true`) enables that inherited copy on the child. Omit it from `neon.ts` to leave the inherited trigger disabled. Enable without applying `neon.ts` with `neon triggers enable <id> --branch <branch>`.

## Logs

```bash
neon logs query --source function --since 1h
```

Pass `--branch` when the function is not on the branch in `.neon`.
