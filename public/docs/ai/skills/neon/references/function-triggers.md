# Function Triggers (CLI, MCP, REST)

A Function Trigger is a branch-scoped rule that POSTs to a Neon Function on a cron (`type: "schedule"`) or when an object is created in a bucket (`type: "storage_object_created"`). Same regions as Functions (`aws-us-east-2`, `aws-us-east-1`, `aws-eu-central-1`, and `aws-ap-southeast-1`).

**Prefer `neon.ts`.** Declare a `triggers` map. The record key is the trigger name. `neon deploy` applies triggers after the functions they target. Names must be unique among every trigger visible on the branch. Triggers that exist remotely but are omitted from `neon.ts` are left alone; delete with `neon triggers delete`.

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

Needs Neon CLI 4.21 or newer (`@neon/config` 1.7.0).

**CLI** when you are not applying `neon.ts`, or to list, enable, disable, or delete. `create` takes `--cron` or `--bucket`, not both:

```bash
neon triggers create --function-slug cron --name hourly --cron '0 * * * *' --function-path /cron
neon triggers create --function-slug ingest --name on-upload --bucket assets --prefix 'logos/' --function-path /object
neon triggers list
neon triggers update <id> --branch <branch> --cron '*/30 * * * *'
neon triggers update <id> --branch <branch> --bucket assets --prefix 'incoming/'
neon triggers enable <id> --branch <branch>
neon triggers disable <id> --branch <branch>
neon triggers delete <id> --branch <branch>
```

Inspect a trigger with `neon triggers list --output json`. Pass `--branch` on get/update/enable/disable/delete: without it the CLI resolves the trigger id as a branch name. Inherited triggers (created on a parent branch) show `Inherited true` on the child and start disabled. `neon deploy` of a `neon.ts` that declares the same trigger enables that copy; omit it to leave the inherited trigger disabled.

**MCP backup** (Neon MCP server, `?category=functions`): `list_triggers`, `get_trigger`, `create_trigger`, `update_trigger`, `delete_trigger`. `create_trigger` takes `project_id`, `branch_id` (a `br-…` id, not a name), and `body` with `"type": "schedule"`, `function_slug`, `name`, and `schedule: { cron }`. REST if neither CLI nor MCP is available: `POST /projects/{project_id}/branches/{branch_id}/triggers`. Schedule body matches MCP. Storage body uses `"type": "storage_object_created"` and `storage_object_created: { bucket_name, prefix }`. CLI reference: https://neon.com/docs/cli/triggers.md.

Authenticate a trigger delivery with `parseTriggerDelivery` from `@neon/functions` (≥ 0.11.0). `parseTrigger` / `parseTriggerInvocation` stay schedule-only. Full type table, payload, and Hono example: the `neon-functions` skill, `references/function-triggers.md`.
