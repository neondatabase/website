---
title: Neon Functions environment variables
subtitle: Neon-injected variables and how to set your own secrets.
summary: >-
  Neon injects branch-scoped variables like DATABASE_URL into deployed
  functions automatically. Set your own variables with --env at deploy time or
  in neon.ts, and pull branch variables locally with neonctl env pull.
enableTableOfContents: true
updatedOn: '2026-06-24T15:13:00.240Z'
---

<PrivatePreviewEnquire/>

## Neon-injected variables

Neon injects connection strings, credentials, and service URLs automatically at runtime. You don't declare these in `neon.ts` or pass them at deploy time. They're resolved from the branch the function is deployed to. This is what makes Postgres, the AI Gateway, and Object Storage zero-config from inside a function: enable the service, and its credentials are there in `process.env`.

Each variable is present only when its service is enabled on the branch. `DATABASE_URL` and `DATABASE_URL_UNPOOLED`, for example, are undefined on a functions-only branch with no Postgres database.

| Variable                                     | Service        | Description                                                                                                                                        |
| -------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                               | Postgres       | Pooled connection string. Use this for most queries.                                                                                               |
| `DATABASE_URL_UNPOOLED`                      | Postgres       | Direct connection string. Use for migrations, `LISTEN`/`NOTIFY`, and multi-round-trip transactions.                                                |
| `NEON_BRANCH`                                | Core           | Branch name (e.g. `main`, `preview/foo`). Present on all branches.                                                                                 |
| `NEON_AUTH_BASE_URL`                         | Neon Auth      | Base URL for Neon Auth.                                                                                                                            |
| `NEON_AUTH_JWKS_URL`                         | Neon Auth      | JWKS endpoint for verifying Neon Auth JWTs. See [Authentication](/docs/compute/functions/authentication).                                          |
| `NEON_DATA_API_URL`                          | Data API       | Base URL for the Neon Data API (PostgREST). Present when the Data API is provisioned on the branch.                                                |
| `OPENAI_API_KEY`                             | AI Gateway     | Gateway key, under the OpenAI-standard name so the OpenAI SDKs pick it up automatically.                                                           |
| `OPENAI_BASE_URL`                            | AI Gateway     | OpenAI **Responses API** endpoint (`/ai-gateway/openai/v1`). An OpenAI SDK reading these two variables reaches `responses.create()` with no setup. |
| `NEON_AI_GATEWAY_TOKEN`                      | AI Gateway     | Gateway token. Same value as `OPENAI_API_KEY`.                                                                                                     |
| `NEON_AI_GATEWAY_BASE_URL`                   | AI Gateway     | Gateway host root. Append a dialect route, e.g. `/ai-gateway/mlflow/v1` for Chat Completions.                                                      |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Object Storage | S3-compatible credentials for the branch's buckets.                                                                                                |
| `AWS_ENDPOINT_URL_S3`, `AWS_REGION`          | Object Storage | S3 endpoint and region. The `AWS_*` names mean the AWS SDKs work with no setup.                                                                    |

These variables are branch-scoped: each branch injects its own values. A function deployed to a preview branch connects to that branch's database, not the default branch's.

<Admonition type="note" title="Two AI Gateway endpoints">
`OPENAI_BASE_URL` targets the gateway's OpenAI **Responses API** (`/ai-gateway/openai/v1`), so an OpenAI SDK that reads `OPENAI_BASE_URL` and `OPENAI_API_KEY` from the environment works with `responses.create()` and no setup. The **Chat Completions** endpoint is at a different path: point the SDK's base URL at `${NEON_AI_GATEWAY_BASE_URL}/ai-gateway/mlflow/v1` (see [Chat completions](/docs/ai-gateway/chat-completions)). The [`@neondatabase/ai-sdk-provider`](/docs/compute/functions/agents) handles this routing for you.
</Admonition>

<Admonition type="note" title="Local pull vs. deployed runtime">
A deployed function gets credentials injected automatically for every service enabled on its branch, so you don't ship a `.env`. For local development, `neonctl env pull` writes credentials for the services you **declare in `neon.ts`**, which can be a subset. Declare a service (`auth: true`, `dataApi: true`, `aiGateway: true`, `buckets: { ... }`) to pull its credentials locally and to get type-safe access.
</Admonition>

For type-safe access, the [`@neondatabase/env`](https://www.npmjs.com/package/@neondatabase/env) package ships `parseEnv`. It takes your `neon.ts` config and returns a typed env object validated against the services the config declares:

```ts
import { parseEnv } from '@neondatabase/env';
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

Pass `--env KEY=VALUE` to `neonctl functions deploy`. The flag is repeatable:

```bash shouldWrap
neonctl functions deploy hello --src functions/hello.ts --env RESEND_API_KEY=re_...
```

Don't define variables under the names Neon injects (`DATABASE_URL`, `OPENAI_*`, `AWS_*`). Those are provided by the platform when the matching service is enabled on the branch, and setting your own collides with the injected values. The `NEON_` prefix is reserved (see [Constraints](#constraints)).

A deploy doesn't wipe variables set by earlier deploys. The `--env` flags you pass are merged into the existing set:

- `--env KEY=value` adds or updates `KEY`
- `--env KEY=` (empty value) deletes `KEY`
- Variables you don't mention carry over unchanged

### In neon.ts

Declare variables under the function's `env` field. Values are resolved when `neonctl deploy` runs, so you can read from `process.env` to avoid hardcoding secrets:

```ts filename="neon.ts"
import { defineConfig } from "@neondatabase/config/v1";

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

Load a `.env` file before running `neonctl deploy` to make secrets available during config evaluation:

```bash
neonctl deploy --env .env.production
```

The file isn't forwarded to the function directly. Only variables declared in the `env` field are deployed; `--env` just controls what `process.env` contains when `neon.ts` is evaluated.

## Pull variables locally

`neonctl link` and `neonctl checkout` pull the branch's Neon-injected variables into a local `.env` file automatically (pass `--no-env-pull` to skip). To re-pull at any time:

```bash
neonctl env pull
```

By default this writes to `.env` if it exists, otherwise `.env.local`. Use `--file` to write to any file:

```bash
neonctl env pull --file .env.preview
```

To pull from a different branch, switch with `neonctl checkout`; it pulls the new branch's variables as part of the switch.

`env pull` writes only the Neon-managed variables and preserves every other line in the file. That's `DATABASE_URL` and `DATABASE_URL_UNPOOLED`, `NEON_BRANCH`, plus the variables for each service **declared in `neon.ts`**: the Neon Auth URLs, the Neon Data API URL, the AI Gateway credentials (`OPENAI_API_KEY`, `OPENAI_BASE_URL`, `NEON_AI_GATEWAY_*`), and the Object Storage credentials (`AWS_*`). Neon mints the AI Gateway key itself and uses the OpenAI-standard names so the OpenAI SDKs work from the environment without configuration.

## Constraints

| Constraint                   | Value                                                               |
| ---------------------------- | ------------------------------------------------------------------- |
| Max variables per deployment | 1,000                                                               |
| Max total size               | 64 KiB                                                              |
| Reserved prefix              | `NEON_` (reserved for platform use, can't be set by user functions) |

<NeedHelp/>
