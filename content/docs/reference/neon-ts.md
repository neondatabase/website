---
title: neon.ts
subtitle: Configuration as code for your Neon project.
summary: >-
  neon.ts declares which Neon services exist on a project and how each branch is
  configured. Use it for branch policy alone, or add preview services like
  Functions, Storage, and AI Gateway. Works with neon deploy, neon dev,
  and neon checkout.
enableTableOfContents: true
redirectFrom:
  - /docs/compute/functions/reference/neon-ts/
updatedOn: '2026-07-10T13:40:50.458Z'
---

`neon.ts` is a TypeScript config file you commit to your repository. It declares which Neon services exist on your project and how each branch is configured.

Specifically:

- **Declares services**: which Neon services (`auth`, `dataApi`, preview services) exist on the project and are available on every branch.
- **Configures branches**: optional per-branch tuning (TTLs, compute sizing, protected status) via a `branch` closure.

Services and branch policy are independent. Use one, the other, or both.

```bash
npm install @neon/config
```

The package source is on [GitHub](https://github.com/neondatabase/neon-pkgs/tree/main/packages/config).

Link your working directory to a Neon project before using `neon.ts` commands:

```bash
neon link
```

## Config structure

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Services: what exists on every branch
  auth: true,

  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      // Default branch: no overrides, uses project defaults
      return {};
    }
    if (!branch.exists) {
      // New non-default branches: auto-expire
      return { ttl: "7d" };
    }
    // Existing branch: no changes
    return {};
  },
});
```

`defineConfig` takes two optional parts:

- **Static fields** (`auth`, `dataApi`, `preview`): declare which services exist. Same set on every branch.
- **`branch` closure**: receives a read-only `BranchTarget` and returns per-branch tuning. It can adjust settings, but can't add or remove services.

## Branch policy

The `branch` closure works on any Neon project. The examples below configure the default branch and apply TTL and compute to new branches at creation. Returning `{}` for existing branches is deliberate: it avoids overwriting settings on branches already in use:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  branch: (branch) => {
    if (branch.isDefault) {
      // Default branch: no overrides, uses project defaults
      return {};
    }
    if (!branch.exists) {
      // New non-default branches: minimum compute, auto-expire
      return {
        ttl: "7d",
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25,
            autoscalingLimitMaxCu: 0.25,
          },
        },
      };
    }
    // Existing branch: no changes
    return {};
  },
});
```

On paid plans, you can also protect the default branch and control suspend timeouts:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  branch: (branch) => {
    if (branch.isDefault) {
      // Protect and size for production
      return {
        protected: true,
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.5,
            autoscalingLimitMaxCu: 4,
          },
        },
      };
    }
    if (!branch.exists) {
      // New non-default branches: minimum compute, auto-expire, suspend on idle
      return {
        ttl: "7d",
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25,
            autoscalingLimitMaxCu: 0.25,
            suspendTimeout: "5m",
          },
        },
      };
    }
    // Existing branch: no changes
    return {};
  },
});
```

Run `neon deploy` to apply. When `neon checkout` creates a new branch, the closure runs with `branch.exists === false`, so TTL, compute settings, and services take effect at creation. Checking out an existing branch doesn't apply or reconcile the policy.

### BranchTarget fields

| Field         | Type       | Description                                                                          |
| ------------- | ---------- | ------------------------------------------------------------------------------------ |
| `name`        | `string`   | Branch name                                                                          |
| `id`          | `string?`  | Branch ID. Not set during pre-create evaluation                                      |
| `exists`      | `boolean`  | `false` during pre-create evaluation                                                 |
| `isDefault`   | `boolean?` | Whether this is the project's default branch. Not set during pre-create evaluation   |
| `isProtected` | `boolean?` | Whether the branch is marked protected in Neon. Not set during pre-create evaluation |
| `parentId`    | `string?`  | ID of the parent branch. Not always present                                          |
| `expiresAt`   | `string?`  | Branch expiry timestamp. Not always present                                          |

### BranchTuning fields

| Field                                            | Type                              | Description                                                                                                           |
| ------------------------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `parent`                                         | `string`                          | Parent branch name or ID                                                                                              |
| `protected`                                      | `boolean`                         | Mark the branch as protected                                                                                          |
| `ttl`                                            | `string \| number`                | Branch lifetime: `"7d"`, `"2h"`, or seconds as a number. Maximum 30 days. Validated at deploy time, not by TypeScript |
| `postgres.computeSettings.autoscalingLimitMinCu` | `0.25 \| 0.5 \| 1 \| 2 \| 4 \| 8` | Minimum compute units                                                                                                 |
| `postgres.computeSettings.autoscalingLimitMaxCu` | `0.25 \| 0.5 \| 1 \| 2 \| 4 \| 8` | Maximum compute units                                                                                                 |
| `postgres.computeSettings.suspendTimeout`        | `false \| string \| number`       | Idle suspend timeout. `false` disables suspend                                                                        |

## Services

`auth` and `dataApi` declare which Neon services exist on every branch. After `neon deploy`, running `neon env pull` writes their URLs to your local `.env` file automatically.

| Field     | Values                               | Default | What it enables                                               |
| --------- | ------------------------------------ | ------- | ------------------------------------------------------------- |
| `auth`    | `true`, `false`, `{ enabled: bool }` | `false` | Neon Auth. Injects `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL` |
| `dataApi` | `true`, `false`, `DataApiConfig`     | `false` | Neon Data API. Injects `NEON_DATA_API_URL`                    |

### `dataApi` config

`dataApi: true` uses Neon Auth as the JWT verifier (the default). When using this form, `auth: true` must also be set. Omitting it raises a TypeScript error at the `dataApi` field that includes the fix:

```text
Type 'true' is not assignable to type '"`dataApi` with Neon Auth (the default
`authProvider: 'neon'`) requires Neon Auth, so add `auth: true`. To enable the
Data API WITHOUT Neon Auth, verify a third-party IdP instead: `dataApi: {
authProvider: 'external', jwksUrl: 'https://your-idp/.well-known/jwks.json' }`"'
```

To use the Data API with an external identity provider instead, pass the object form:

```ts
dataApi: {
  authProvider: "external",
  jwksUrl: "https://your-idp/.well-known/jwks.json",
}
```

## Type-safe environment variables

`@neon/env` gives you type-safe access to your branch's injected variables. It reads `process.env` at runtime and validates each variable against the services declared in your `neon.ts` config. Missing or empty variables throw with a clear error.

```bash
npm install @neon/env
```

```ts
import { parseEnv } from '@neon/env';
import config from './neon';

const env = parseEnv(config);

env.postgres.databaseUrl;         // DATABASE_URL
env.postgres.databaseUrlUnpooled; // DATABASE_URL_UNPOOLED
env.auth.baseUrl;                 // NEON_AUTH_BASE_URL  (env.auth only present when auth: true)
env.auth.jwksUrl;                 // NEON_AUTH_JWKS_URL
env.dataApi.url;                  // NEON_DATA_API_URL   (env.dataApi only present when dataApi is enabled)
```

`env.auth` only exists when `auth: true`, `env.dataApi` only when `dataApi` is enabled. If you access a namespace your config doesn't declare, TypeScript will catch it.

Pass an array of keys to validate and return only a subset. Useful when a process needs just one or two variables:

```ts
const { postgres } = parseEnv(config, ["DATABASE_URL"]);
postgres.databaseUrl; // string (databaseUrlUnpooled is absent)
```

The key list autocompletes from your config, so selecting a variable from a service you haven't declared is a type error.

## CLI commands

| Command                                  | What it does                                                                                              |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [`neon link`](/docs/cli/link)            | Connect the current directory to a Neon project. Required to use linked branch defaults in other commands |
| [`neon deploy`](/docs/cli/config)        | Apply `neon.ts` to the linked branch (alias for `neon config apply`)                                      |
| [`neon config plan`](/docs/cli/config)   | Preview what `neon deploy` would change, without applying                                                 |
| [`neon config status`](/docs/cli/config) | Show the current live state of the branch as a `neon.ts`-shaped config                                    |
| [`neon env pull`](/docs/cli/env)         | Write the branch's Neon-managed variables to `.env.local` (or `.env` if it already exists)                |
| [`neon checkout`](/docs/cli/checkout)    | Switch to or create a branch; new branches are created from the `neon.ts` policy (TTL, compute, services) |
| [`neon dev`](/docs/cli/dev)              | Run functions locally against the linked branch; watches for changes and hot-reloads                      |

## Flags for `neon deploy`

| Flag                | Default        | Description                                                                                          |
| ------------------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| `--config`          | (auto)         | Path to the `neon.ts` file. When omitted, the CLI walks up from cwd stopping at `.git`               |
| `--env`             | (none)         | Path to a `.env` file loaded before `neon.ts` is evaluated, so function `env` values resolve from it |
| `--branch`          | linked branch  | Target branch ID or name                                                                             |
| `--project-id`      | linked project | Project ID                                                                                           |
| `--update-existing` | `false`        | Auto-confirm overriding existing remote settings                                                     |
| `--allow-protected` | `false`        | Auto-confirm applying to a protected branch                                                          |

## Preview services

<Admonition type="info" title="Private preview">
Functions, Storage, and AI Gateway are in private preview. They require a new project in AWS us-east-2. See [Preview access](/docs/compute/functions/preview-access) to request access.
</Admonition>

Preview services are declared under the `preview` block. All three are optional and independent:

| Field               | Type                                 | What it enables                                                                                                   |
| ------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `preview.functions` | Record of slug → function def        | Neon Functions. Long-running Node.js compute on the branch                                                        |
| `preview.buckets`   | Record of name → bucket def          | Neon Storage. S3-compatible object storage, branched with your database                                           |
| `preview.aiGateway` | `true`, `false`, `{ enabled: bool }` | Neon AI Gateway. Injects `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `NEON_AI_GATEWAY_TOKEN`, `NEON_AI_GATEWAY_BASE_URL` |

### `preview.functions`

Each key is the function's slug, the permanent identifier used in CLI commands and the invocation URL:

```ts
preview: {
  functions: {
    "<slug>": {
      name: string,       // display name shown in neon functions list and the console
      source: string,     // path to entry file, relative to neon.ts
      env?: Record<string, string>,
      dev?: {
        port?: number,    // local port for neon dev; fails if taken; auto-assigned if omitted
      },
    },
  },
},
```

Slugs must match `^[a-z0-9]{1,20}$` and are immutable after first deployment. Because slugs can't use separators, use `name` for a human-readable label. For example, `slug: "myrestapi"` with `name: "My REST API"`. See [Deploy and manage functions](/docs/compute/functions/deploy#slugs).

`env` values are resolved at deploy time when `neon deploy` runs. Reading `process.env.X` here captures the value in your shell at deploy time, not at function runtime. Every value must be a defined string; use a fallback to avoid a type error:

```ts
env: {
  API_KEY: process.env.API_KEY ?? "",
}
```

Use `neon deploy --env .env.production` to load a `.env` file before evaluation. For typed access to these variables inside your function at runtime, see [Environment variables](/docs/compute/functions/environment-variables).

`dev` settings apply only to `neon dev` and never affect deploy.

### `preview.buckets`

```ts
preview: {
  buckets: {
    "<name>": {
      access?: "private" | "public_read",  // default: "private"
    },
  },
},
```

Bucket names follow S3 naming rules. `public_read` makes objects accessible without credentials at the branch's storage endpoint.

### Full stack example

All services combined. `neon deploy` provisions everything and writes credentials to `.env.local`.

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,

  preview: {
    aiGateway: true,
    buckets: {
      uploads: {},
    },
    functions: {
      api: {
        name: "API",
        source: "./functions/api.ts",
      },
    },
  },

  branch: (branch) => {
    if (branch.isDefault) {
      // Protect and size for production
      return {
        protected: true,
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.5,
            autoscalingLimitMaxCu: 4,
          },
        },
      };
    }
    if (!branch.exists) {
      // New non-default branches: minimum compute, auto-expire, suspend on idle
      return {
        ttl: "7d",
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25,
            autoscalingLimitMaxCu: 0.25,
            suspendTimeout: "5m",
          },
        },
      };
    }
    // Existing branch: no changes
    return {};
  },
});
```

<NeedHelp/>
