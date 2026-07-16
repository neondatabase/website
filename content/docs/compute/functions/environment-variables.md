---
title: Neon Functions environment variables
subtitle: Neon-injected variables and how to set your own secrets.
summary: >-
  Neon injects branch-scoped variables like DATABASE_URL into deployed
  functions automatically. Set your own variables with --env at deploy time or
  in neon.ts, and pull branch variables locally with neon env pull.
enableTableOfContents: true
updatedOn: '2026-07-15T17:54:41.160Z'
---

<FeatureBetaProps feature_name="Neon Functions" />

## Neon-injected variables

Neon injects connection strings, credentials, and service URLs automatically at runtime. You don't declare these in `neon.ts` or pass them at deploy time. They're resolved from the branch the function is deployed to. This is why a function doesn't configure Postgres, the AI Gateway, or Object Storage itself: enable the service, and its credentials are there in `process.env`.

Each variable is present only when its service is enabled on the branch. `DATABASE_URL` and `DATABASE_URL_UNPOOLED`, for example, are undefined on a functions-only branch with no Postgres database.

| Variable                                     | Service             | Description                                                                                                                                           |
| -------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                               | Postgres            | Pooled connection string. Use this for most queries.                                                                                                  |
| `DATABASE_URL_UNPOOLED`                      | Postgres            | Direct connection string. Use for migrations, `LISTEN`/`NOTIFY`, and multi-round-trip transactions.                                                   |
| `NEON_BRANCH`                                | Core                | Branch name (e.g. `main`, `preview/foo`). Present on all branches.                                                                                    |
| `NEON_AUTH_BASE_URL`                         | Managed Better Auth | Base URL for Managed Better Auth.                                                                                                                     |
| `NEON_AUTH_JWKS_URL`                         | Managed Better Auth | JWKS endpoint for verifying Managed Better Auth JWTs. See [Authentication](/docs/compute/functions/authentication).                                   |
| `NEON_DATA_API_URL`                          | Data API            | Base URL for the Neon Data API (PostgREST). Present when the Data API is provisioned on the branch.                                                   |
| `NEON_AI_GATEWAY_TOKEN`                      | AI Gateway          | Gateway bearer token.                                                                                                                                 |
| `NEON_AI_GATEWAY_BASE_URL`                   | AI Gateway          | Gateway host root. Append a dialect route, e.g. `/ai-gateway/mlflow/v1` for Chat Completions or `/ai-gateway/openai/v1` for the OpenAI Responses API. |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Object Storage      | S3-compatible credentials for the branch's buckets.                                                                                                   |
| `AWS_ENDPOINT_URL_S3`, `AWS_REGION`          | Object Storage      | S3 endpoint and region. The `AWS_*` names mean the AWS SDKs work with no setup.                                                                       |

These variables are branch-scoped: each branch injects its own values. A function deployed to a preview branch connects to that branch's database, not the default branch's.

<Admonition type="note" title="Two AI Gateway endpoints">
`NEON_AI_GATEWAY_BASE_URL` is the bare gateway host: append a dialect path yourself. Use `/ai-gateway/openai/v1` for the OpenAI **Responses API** and `/ai-gateway/mlflow/v1` for **Chat Completions** (see [Chat completions](/docs/ai-gateway/chat-completions)). The [`@neon/ai-sdk-provider`](/docs/compute/functions/agents) handles this routing for you.
</Admonition>

<Admonition type="note" title="Local pull vs. deployed runtime">
A deployed function gets credentials injected automatically for every service enabled on its branch, so you don't ship a `.env`. For local development, `neon env pull` writes credentials for the services you **declare in `neon.ts`**, which can be a subset. Declare a service (`auth: true`, `dataApi: true`, `aiGateway: true`, `buckets: { ... }`) to pull its credentials locally and to get type-safe access.
</Admonition>

For type-safe access, the [`@neon/env`](https://www.npmjs.com/package/@neon/env) package ships `parseEnv`. It takes your `neon.ts` config and returns a typed env object validated against the services the config declares:

```ts
import { parseEnv } from '@neon/env';
import config from './neon';

const env = parseEnv(config);
env.postgres.databaseUrl;          // DATABASE_URL
env.postgres.databaseUrlUnpooled;  // DATABASE_URL_UNPOOLED
env.auth.baseUrl;                  // NEON_AUTH_BASE_URL (only when auth: true)
env.auth.jwksUrl;                  // NEON_AUTH_JWKS_URL (only when auth: true)
```

TypeScript narrows the shape based on your config: `env.auth` is only present when `auth: true` is set in `neon.ts`.

## User-defined variables

Each deployment carries its own snapshot of user-defined variables. To change one, deploy again.

### At deploy time

Pass `--env KEY=VALUE` to `neon functions deploy`. The flag is repeatable:

```bash shouldWrap
neon functions deploy hello --src functions/hello.ts --env RESEND_API_KEY=re_...
```

Neon injects variables like `DATABASE_URL`, `NEON_AI_GATEWAY_*`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, and `AWS_REGION` when the matching service is enabled on the branch. These are defaults, not reserved names: if you define a variable with the same name, your value overrides the injected one.

A deploy doesn't wipe variables set by earlier deploys. The `--env` flags you pass are merged into the existing set:

- `--env KEY=value` adds or updates `KEY`
- `--env KEY=` (empty value) deletes `KEY`
- Variables you don't mention carry over unchanged

### In neon.ts

Declare variables under the function's `env` field. Values are resolved when `neon deploy` runs, so you can read from `process.env` to avoid hardcoding secrets:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  preview: {
    functions: {
      hello: {
        name: "My first function",
        source: "./functions/hello.ts",
        env: {
          RESEND_API_KEY: process.env.RESEND_API_KEY!,
        },
      },
    },
  },
});
```

Load a `.env` file before running `neon deploy` to make secrets available during config evaluation:

```bash
neon deploy --env .env.production
```

The file isn't forwarded to the function directly. Only variables declared in the `env` field are deployed; `--env` only controls what `process.env` contains when `neon.ts` is evaluated.

## Pull variables locally

`neon link` and `neon checkout` pull the branch's Neon-injected variables into a local `.env` file automatically (pass `--no-env-pull` to skip). To re-pull at any time:

```bash
neon env pull
```

By default this writes to `.env` if it exists, otherwise `.env.local`. Use `--file` to write to any file:

```bash
neon env pull --file .env.preview
```

To pull from a different branch, switch with `neon checkout`; it pulls the new branch's variables as part of the switch.

`env pull` writes only the Neon-managed variables and preserves every other line in the file. That's `DATABASE_URL` and `DATABASE_URL_UNPOOLED`, `NEON_BRANCH`, plus the variables for each service **declared in `neon.ts`**: the Managed Better Auth URLs, the Neon Data API URL, the AI Gateway credentials (`NEON_AI_GATEWAY_TOKEN`, `NEON_AI_GATEWAY_BASE_URL`), and the Object Storage credentials (`AWS_*`).

## Constraints

| Constraint                   | Value  |
| ---------------------------- | ------ |
| Max variables per deployment | 1,000  |
| Max total size               | 64 KiB |

<NeedHelp/>
