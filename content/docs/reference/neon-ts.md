---
title: neon.ts
subtitle: Configuration as code for your Neon project.
summary: >-
  neon.ts declares which Neon services exist on a project and how each branch is
  configured. Use it for branch policy alone, or add services like
  Functions, Object Storage, and AI Gateway. Works with neon deploy, neon dev,
  and neon checkout.
enableTableOfContents: true
redirectFrom:
  - /docs/compute/functions/reference/neon-ts/
updatedOn: '2026-09-21T08:27:00.804Z'
---

`neon.ts` is a TypeScript config file you commit to your repository. It declares which Neon services exist on your project and how each branch is configured.

Specifically:

- **Declares services**: which Neon services (`auth`, `dataApi`, `aiGateway`, `functions`, `buckets`) exist on the project and are available on every branch.
- **Configures branches**: optional per-branch tuning (TTLs, compute sizing, protected status) via a `branch` closure.

Services and branch policy are independent. Use one, the other, or both.

The fastest way to create a `neon.ts` is [`neon config init`](/docs/cli/config#init), which scaffolds a starter policy and installs the config packages. To set it up by hand instead, install the package:

```bash
npm install @neon/config
```

`@neon/config` provides `defineConfig` and is all you need to author a `neon.ts`; you apply it with `neon deploy`. Two optional packages extend it:

- [`@neon/env`](#type-safe-environment-variables): type-safe access to the injected variables.
- [`@neon/config-runtime`](/docs/reference/config-runtime): run the `inspect` / `plan` / `apply` logic yourself instead of through the CLI.

The package [source is on GitHub](https://github.com/neondatabase/neon-pkgs/tree/main/packages/config).

`neon.ts` is declarative: it describes the policy but doesn't apply it. `neon deploy` (an alias for `neon config apply`) applies it to the linked branch. It provisions or updates the declared services, applies your branch tuning, and pulls the branch's variables into your local `.env`. Run it whenever you change `neon.ts`.

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

- **Static fields** (`auth`, `dataApi`, `aiGateway`, `functions`, `buckets`): declare which services exist. Same set on every branch.
- **`branch` closure**: receives a read-only `BranchTarget` and returns per-branch tuning. It can adjust settings, but can't add or remove services.

## Services

Declare services as top-level keys in `defineConfig`; declare only the ones you use. Every branch always has Postgres, so `DATABASE_URL` is injected without being declared here. After `neon deploy`, `neon env pull` writes any injected URLs and credentials to your local `.env` file automatically.

| Field       | Values / type                                | Default | What it enables                                                                                                                                                                                                                                |
| ----------- | -------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth`      | `true`, `false`, `{ enabled: bool }`         | `false` | [Managed Better Auth](/docs/auth/overview). Injects `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`                                                                                                                                                 |
| `dataApi`   | `true`, `false`, [`DataApiConfig`](#dataapi) | `false` | [Neon Data API](/docs/data-api/overview). Injects `NEON_DATA_API_URL`                                                                                                                                                                          |
| `aiGateway` | `true`, `false`, `{ enabled: bool }`         | `false` | [Neon AI Gateway](/docs/ai-gateway/overview). Injects `NEON_AI_GATEWAY_TOKEN`, `NEON_AI_GATEWAY_BASE_URL`                                                                                                                                      |
| `functions` | Record of slug → [function def](#functions)  | (none)  | [Neon Functions](/docs/compute/functions/overview). Long-running Node.js compute. The branch's service variables (`DATABASE_URL` and more) are injected at runtime; see [Environment variables](/docs/compute/functions/environment-variables) |
| `buckets`   | Record of name → [bucket def](#buckets)      | (none)  | [Neon Object Storage](/docs/storage/overview). S3-compatible object storage, branched with your database. Injects `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`                                            |
| `triggers`  | Record of name → [trigger def](#triggers)    | (none)  | [Function Triggers](/docs/compute/functions/triggers/overview). Invoke a function on a schedule or when an object is created in a bucket. Reconciled by `neon deploy`                                                                          |

<Admonition type="note" title="preview is deprecated">
`@neon/config` 1.6.0 and later accept `aiGateway`, `functions`, `buckets`, and `triggers` as the top-level keys shown here. Declaring them under a `preview` block still works but logs a deprecation warning on `neon deploy`, so keep `preview` only if you're on a version earlier than 1.6.0. See [Troubleshooting](#troubleshooting) if a top-level config fails to apply on an older install.
</Admonition>

### dataApi (#dataapi)

`dataApi: true` uses Managed Better Auth as the JWT verifier (the default). When using this form, `auth: true` must also be set. Omitting it raises a TypeScript error at the `dataApi` field that includes the fix:

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

### functions (#functions)

Each key is the function's slug, the permanent identifier used in CLI commands and the invocation URL:

<CodeTabs labels={["Top level (@neon/config 1.6.0+)", "preview (deprecated)"]}>

```ts
functions: {
  "<slug>": {
    name: string,       // display name shown in neon functions list and the console
    source: string,     // path to entry file, relative to neon.ts
    env?: Record<string, string>,
    bundler?: "esbuild" | "none" | ((fn) => Promise<FunctionBundle>),  // default "esbuild"
    dev?: {
      port?: number,    // local port for neon dev; fails if taken; auto-assigned if omitted
    },
    customDomains?: string[],  // hostnames to serve this function; default branch only
  },
},
triggers: {             // separate top-level key; see below
  "<name>": {
    type: "schedule" | "storage_object_created",
    function: string,   // slug of the function to invoke
    cron?: string,      // schedule only: five-field UTC expression
    bucket?: string,    // storage only: bucket to watch
    prefix?: string,    // storage only: object-key prefix filter
    functionPath?: string,  // default "/"
    enabled?: boolean,      // default true
  },
},
```

```ts
preview: {
  functions: {
    "<slug>": {
      name: string,
      source: string,
      env?: Record<string, string>,
      bundler?: "esbuild" | "none" | ((fn) => Promise<FunctionBundle>),
      dev?: { port?: number },
      customDomains?: string[],  // hostnames to serve this function; default branch only
    },
  },
},
```

</CodeTabs>

Slugs must match `^[a-z0-9]{1,20}$` and are immutable after first deployment. Because slugs can't use separators, use `name` for a human-readable label. For example, `slug: "myrestapi"` with `name: "My REST API"`. See [Deploy and manage functions](/docs/compute/functions/deploy#slugs).

`env` values are resolved at deploy time when `neon deploy` runs. Reading `process.env.X` here captures the value in your shell at deploy time, not at function runtime. Every value must be a defined string; use a fallback to avoid a type error:

```ts
env: {
  API_KEY: process.env.API_KEY ?? "",
}
```

Use `neon deploy --env .env.production` to load a `.env` file before evaluation. For typed access to these variables inside your function at runtime, see [Environment variables](/docs/compute/functions/environment-variables).

`bundler` controls how `source` becomes the deployed archive. The default, `"esbuild"`, bundles your source (TypeScript is compiled here). Set `"none"` to ship a prebuilt directory or file as-is, in which case the entry must be named `index.mjs` or `index.js`. This is the config form of the CLI's [`--no-bundle`](/docs/compute/functions/deploy#deploy-with-neon-functions-deploy) flag. To use your own build system, set `bundler` to a function that receives the resolved function config and returns the files to deploy (a `FunctionBundle`, a record of path to file contents), so a framework that already emits its own build output can deploy it unchanged.

`dev` settings apply only to `neon dev` and never affect deploy.

Triggers are declared in a separate top-level `triggers` record. Each key is the trigger's name, unique across the branch, and each entry's `function` field references a function slug declared under `functions`. `neon deploy` reconciles triggers as the declarative counterpart to [`neon triggers`](/docs/cli/triggers), applying them after the functions they target. `cron` is a five-field UTC expression. See [Schedule a function](/docs/compute/functions/triggers/schedule) and [Trigger on an object upload](/docs/compute/functions/triggers/object-storage).

```ts filename="neon.ts"
functions: {
  reports: {
    name: "Reports",
    source: "./functions/reports.ts",
  },
},
triggers: {
  nightly: {
    type: "schedule",
    function: "reports",
    cron: "0 6 * * *",
  },
},
```

`customDomains` lists hostnames you own that serve the function, such as `["api.example.com"]`. `neon deploy` registers them, and each hostname can point at only one function on one branch. Static `customDomains` apply on the default branch only. For DNS setup, per-branch domains, status checks, and TLS verification, see [Custom domains for Neon Functions](/docs/compute/functions/custom-domains).

### triggers (#triggers)

Each key is the trigger's name, unique across the branch. Each entry's `function` field references a function slug declared under `functions`.

```ts
triggers: {
  "<name>": {
    type: "schedule" | "storage_object_created",
    function: string,       // slug of the function to invoke
    cron?: string,          // schedule only: five-field UTC expression
    bucket?: string,        // storage only: bucket name declared under buckets
    prefix?: string,        // storage only: object-key prefix filter
    functionPath?: string,  // request path sent to the function; default "/"
    enabled?: boolean,      // default true
  },
},
```

| Field          | Required                 | Description                                                                                     |
| -------------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| `type`         | Yes                      | `"schedule"` or `"storage_object_created"`                                                      |
| `function`     | Yes                      | Slug of the function to invoke. The API and CLI call this `function_slug`                       |
| `cron`         | `schedule`               | Five-field UTC cron expression                                                                  |
| `bucket`       | `storage_object_created` | Bucket to watch. The API and CLI call this `storage_object_created.bucket_name`                 |
| `prefix`       | No                       | Only objects whose key starts with this prefix fire the trigger (`storage_object_created` only) |
| `functionPath` | No                       | Request path sent to the function. Default `/`                                                  |
| `enabled`      | No                       | Default `true`                                                                                  |

Triggers that exist remotely but are omitted from `neon.ts` are left alone. Inherited triggers on a child branch start disabled; deploying a `neon.ts` that declares the same trigger enables the inherited copy. See [Function Triggers overview](/docs/compute/functions/triggers/overview) for branching behavior, delivery payloads, and the Console, CLI, and API alternatives.

### buckets (#buckets)

<CodeTabs labels={["Top level (@neon/config 1.6.0+)", "preview (deprecated)"]}>

```ts
buckets: {
  "<name>": {
    access?: "private" | "public_read",  // default: "private"
  },
},
```

```ts
preview: {
  buckets: {
    "<name>": {
      access?: "private" | "public_read",
    },
  },
},
```

</CodeTabs>

Bucket names follow S3 naming rules. `public_read` makes objects accessible without credentials at the branch's storage endpoint.

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

When `neon checkout` creates a new branch, the closure runs with `branch.exists === false`, so TTL, compute settings, and services take effect at creation. Checking out an existing branch doesn't apply or reconcile the policy.

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

| Field                                            | Type                        | Description                                                                                                                                                      |
| ------------------------------------------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parent`                                         | `string`                    | Parent branch name or ID                                                                                                                                         |
| `protected`                                      | `boolean`                   | Mark the branch as protected                                                                                                                                     |
| `ttl`                                            | `string \| number`          | Branch lifetime: `"7d"`, `"2h"`, or seconds as a number. Maximum 30 days. Validated at deploy time, not by TypeScript                                            |
| `postgres.computeSettings.autoscalingLimitMinCu` | `ComputeUnit`               | Minimum compute units. Any size Neon offers: 0.25, 0.5, every integer 1 to 16, and even sizes 18 to 56                                                           |
| `postgres.computeSettings.autoscalingLimitMaxCu` | `ComputeUnit`               | Maximum compute units. For an autoscaling range, keep both bounds at 16 or below and no more than 8 CU apart; sizes above 16 are fixed-size (`min` equals `max`) |
| `postgres.computeSettings.suspendTimeout`        | `false \| string \| number` | Idle suspend timeout. `false` disables suspend                                                                                                                   |

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
env.branch.name;                  // NEON_BRANCH             (when NEON_BRANCH is set)
env.auth.baseUrl;                 // NEON_AUTH_BASE_URL       (env.auth when auth: true)
env.auth.jwksUrl;                 // NEON_AUTH_JWKS_URL
env.dataApi.url;                  // NEON_DATA_API_URL        (env.dataApi when dataApi enabled)
env.aiGateway.apiKey;             // NEON_AI_GATEWAY_TOKEN    (env.aiGateway when aiGateway enabled)
env.aiGateway.baseUrl;            // NEON_AI_GATEWAY_BASE_URL
env.storage.accessKeyId;          // AWS_ACCESS_KEY_ID        (env.storage when buckets declared)
env.storage.secretAccessKey;      // AWS_SECRET_ACCESS_KEY
env.storage.endpoint;             // AWS_ENDPOINT_URL_S3
env.storage.region;               // AWS_REGION
env.functions['<slug>'].baseUrl;  // a deployed function's URL, keyed by slug (env.functions when functions declared)
```

Each namespace exists only when its service is declared: `env.auth` when `auth: true`, `env.storage` when you declare `buckets`, and so on. If you access a namespace your config doesn't declare, TypeScript catches it.

`env.functions` (plural) is a map of every declared function's slug to its `baseUrl`. It's distinct from `env.function` (singular), which you get from `parseEnv(config, '<slug>')`: the scoped env for code running inside that function, exposing the `env` vars declared in its `neon.ts` definition.

Pass an array of keys to validate and return only a subset. Useful when a process needs just one or two variables:

```ts
const { postgres } = parseEnv(config, ["DATABASE_URL"]);
postgres.databaseUrl; // string (databaseUrlUnpooled is absent)
```

The key list autocompletes from your config, so selecting a variable from a service you haven't declared is a type error.

### Inject env at runtime without a file

`@neon/env` also ships a `neon-env` binary for the cases where you don't want the branch's variables written to disk. It resolves them from your `neon.ts` policy at runtime:

```bash
# Run a command with the branch's Neon env vars injected into its environment.
# Use `--` to separate the command:
neon-env run -- npm run dev

# Print the branch's Neon env vars to stdout, as dotenv lines or JSON,
# for piping into another env manager:
neon-env export
neon-env export --format json
```

Use `neon-env run` as the runtime counterpart to the on-disk [`neon env pull`](/docs/cli/env) when you'd rather not keep secrets in the working tree, and `neon-env export` when another tool (for example [varlock](https://varlock.dev)) should ingest the values.

### Resolve env in code with `fetchEnv`

`parseEnv` reads variables already present in `process.env`. `fetchEnv` is its programmatic runtime sibling: it fetches a branch's env from Neon and returns the same typed, namespaced shape, so code can resolve a branch's env without shelling out or writing a file first. Unlike the `neon-env` CLI, `fetchEnv` reads no environment variables or credential files on your behalf. Pass a Neon API key explicitly as `apiKey`, or it throws.

```ts
import { fetchEnv } from '@neon/env';
import config from './neon';

const env = await fetchEnv(config, {
  projectId: 'patient-art-12345',
  branch: 'main',
  apiKey: process.env.NEON_API_KEY,
});
env.postgres.databaseUrl;
```

## CLI commands

| Command                                     | What it does                                                                                              |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [`neon config init`](/docs/cli/config#init) | Scaffold a starter `neon.ts` and install the config packages                                              |
| [`neon link`](/docs/cli/link)               | Connect the current directory to a Neon project. Required to use linked branch defaults in other commands |
| [`neon deploy`](/docs/cli/config)           | Apply `neon.ts` to the linked branch (alias for `neon config apply`)                                      |
| [`neon config plan`](/docs/cli/config)      | Preview what `neon deploy` would change, without applying                                                 |
| [`neon config status`](/docs/cli/config)    | Show the current live state of the branch as a `neon.ts`-shaped config                                    |
| [`neon env pull`](/docs/cli/env)            | Write the branch's Neon-managed variables to `.env.local` (or `.env` if it already exists)                |
| [`neon checkout`](/docs/cli/checkout)       | Switch to or create a branch; new branches are created from the `neon.ts` policy (TTL, compute, services) |
| [`neon dev`](/docs/cli/dev)                 | Run functions locally against the linked branch; watches for changes and hot-reloads                      |

`neon deploy` is an alias for `neon config apply`. For its flags (`--branch`, `--project-id`, `--config`, `--env`, `--update-existing`, and more), see the [`neon config`](/docs/cli/config) reference.

## Full stack example

All services combined. `neon deploy` provisions everything and writes credentials to `.env.local`.

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,

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

## Troubleshooting

### "keys can be lifted out of preview" warning

```text
These neon.ts keys are now GA and can be lifted out of preview: preview.aiGateway → aiGateway, preview.functions → functions, preview.buckets → buckets.
```

Informational, not an error: your services still deploy. You're declaring GA services under the deprecated `preview` block on `@neon/config` 1.6.0 or later. Move those keys to the top level to clear it, or keep `preview` if you also run on installs older than 1.6.0.

### "unknown keys" error

```text
ConfigValidationError: Invalid Neon config:
  - unknown keys: "aiGateway", "functions"
```

Your `@neon/config` is older than 1.6.0, which introduced top-level `aiGateway`, `functions`, and `buckets`. Upgrade with `npm install @neon/config@latest` (and `npm install -g neon@latest`), or keep the services under `preview`.

<NeedHelp/>
