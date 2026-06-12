---
title: neon.ts reference
subtitle: Configuration schema for Neon Functions and branch policy.
summary: >-
  neon.ts declares which functions and services exist on a project and how
  each branch is tuned. Reference for defineConfig: service toggles, function
  definitions, and the per-branch tuning closure.
enableTableOfContents: true
---

<PrivatePreviewEnquire/>

`neon.ts` is a TypeScript config file that declares which functions and services exist on a project and how each branch should be configured. Place it at the root of your project.

```bash
npm install @neondatabase/config
```

## Shape

```ts filename="neon.ts"
import { defineConfig } from "@neondatabase/config/v1";

export default defineConfig({
  // Static: what exists on every branch
  auth: true,
  dataApi: false,
  preview: {
    functions: {
      hello: {
        name: "My first function",
        source: "./functions/hello.ts",
        env: { RESEND_API_KEY: process.env.RESEND_API_KEY! },
        dev: { port: 8787 },
      },
    },
  },
  // Dynamic: per-branch tuning
  branch: (branch) => {
    if (branch.name === "main") {
      return { protected: true };
    }
    return { parent: "main", ttl: "7d" };
  },
});
```

`defineConfig` takes an object with two parts, both optional:

- **Static fields** (`auth`, `dataApi`, `preview`): declare what services and functions exist. The same set applies to every branch. This is what determines which Neon service URLs (`NEON_AUTH_BASE_URL`, `NEON_DATA_API_URL`) are injected.
- **`branch` closure**: receives a read-only `BranchTarget` and returns per-branch tuning. It can only adjust settings, not add or remove services or functions. Omit it if you don't need per-branch tuning.

## Static fields

### Services

Static toggles declare which services exist on every branch and which Neon env vars are injected into deployed functions.

| Field     | Values                               | Default | Injects              |
| --------- | ------------------------------------ | ------- | -------------------- |
| `auth`    | `true`, `false`, `{ enabled: bool }` | `false` | `NEON_AUTH_BASE_URL` |
| `dataApi` | `true`, `false`                      | `false` | `NEON_DATA_API_URL`  |

### `preview.functions`

Declares functions as a record keyed by slug. Each key is the function's permanent slug: its operational identity used in CLI commands, API paths, and the invocation URL. The `name` field is display-only (shown in `neonctl functions list` and the console).

```ts
preview: {
  functions: {
    "<slug>": {
      name: string,       // required: display name only, not used operationally
      source: string,     // required: path to entry file, relative to neon.ts (or absolute)
      env?: Record<string, string>,
      dev?: {
        port?: number,    // bind to this port in neonctl dev; omit for auto-assigned
      },
    },
  },
},
```

Slugs must match `^[a-z0-9]{1,20}$` and are immutable after the first deployment. See [Slugs](/docs/compute/functions/deploy#slugs) for the full rules. Because slugs can't use separators, use `name` for a human-readable label, for example `slug: "myrestapi"` with `name: "My REST API"`.

**`env`** values are resolved at deploy time (when `neonctl deploy` runs). Reading `process.env.X` here captures the value in your shell at deploy time, not at runtime inside the function. Use `neonctl deploy --env .env.production` to load a `.env` file before evaluation.

**`dev`** settings apply only to `neonctl dev`. They never affect deploy.

- `port`: the local server binds this exact port and fails if it's taken. When omitted, a free port is found automatically.

The `preview` block also accepts `aiGateway` and `buckets` fields, which enable the [AI Gateway](/docs/ai-gateway/overview) and [Object Storage](/docs/storage/overview) previews on the branch and inject their credentials into deployed functions. They aren't part of the Functions preview and aren't covered here.

## `branch` closure

The `branch` closure receives a `BranchTarget` and returns a `BranchTuning`.

### BranchTarget fields

| Field         | Type                  | Description                                         |
| ------------- | --------------------- | --------------------------------------------------- |
| `name`        | `string`              | Branch name                                         |
| `id`          | `string \| undefined` | Branch ID. `undefined` during pre-create evaluation |
| `exists`      | `boolean`             | `false` during pre-create evaluation                |
| `isDefault`   | `boolean`             | Whether this is the project's default branch        |
| `isProtected` | `boolean`             | Whether the branch is marked protected in Neon      |
| `parentId`    | `string \| undefined` | ID of the parent branch, if any                     |
| `expiresAt`   | `string \| undefined` | Branch expiry timestamp, if set                     |

### BranchTuning fields

| Field                                            | Type                              | Description                                                               |
| ------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------------- |
| `parent`                                         | `string`                          | Parent branch name or ID. Specifies which branch new branches derive from |
| `protected`                                      | `boolean`                         | Mark the branch as protected                                              |
| `ttl`                                            | `string \| number`                | Branch lifetime, e.g. `"7d"`, `"2h"`, or seconds as a number              |
| `postgres.computeSettings.autoscalingLimitMinCu` | `0.25 \| 0.5 \| 1 \| 2 \| 4 \| 8` | Minimum compute units                                                     |
| `postgres.computeSettings.autoscalingLimitMaxCu` | `0.25 \| 0.5 \| 1 \| 2 \| 4 \| 8` | Maximum compute units                                                     |
| `postgres.computeSettings.suspendTimeout`        | `false \| string \| number`       | Idle suspend timeout. `false` disables suspend                            |

## Apply to a branch

```bash
neonctl deploy
```

This is an alias for `neonctl config apply`. It reads `neon.ts` from the current directory, diffs it against the live branch state, and applies the changes.

To preview what would change without applying:

```bash
neonctl config plan
```

To inspect the current live state of a branch as a `neon.ts`-shaped config:

```bash
neonctl config status
```

When `neonctl checkout` creates a new branch and a `neon.ts` exists in your project, the CLI applies the policy to the new branch automatically, including deploying its functions. Checking out an existing branch doesn't trigger an apply.

<NeedHelp/>
