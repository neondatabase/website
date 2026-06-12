---
title: Environment variables
subtitle: Neon-injected variables and how to set your own secrets.
summary: >-
  Neon injects branch-scoped variables like DATABASE_URL into deployed
  functions automatically. Set your own variables with --env at deploy time or
  in neon.ts, and pull branch variables locally with neonctl env pull.
enableTableOfContents: true
---

<PrivatePreviewEnquire/>

## Neon-injected variables

Neon injects connection strings and service URLs automatically at runtime. You don't declare these in `neon.ts` or pass them at deploy time. They're resolved from the branch the function is deployed to.

`DATABASE_URL` and `DATABASE_URL_UNPOOLED` are only present when the branch has a Postgres database. On a functions-only branch, they're undefined.

| Variable                | Description                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | Pooled Postgres connection string. Use this for most queries.                                                                |
| `DATABASE_URL_UNPOOLED` | Direct (unpooled) connection string. Use for migrations, `LISTEN`/`NOTIFY`, and transactions that span multiple round-trips. |
| `NEON_AUTH_BASE_URL`    | Base URL for Neon Auth. Present only when Neon Auth is enabled on the branch.                                                |
| `NEON_DATA_API_URL`     | URL for the Neon Data API. Present only when the Data API is enabled on the branch.                                          |

These variables are branch-scoped: each branch injects its own values. A function deployed to a preview branch connects to that branch's database, not the default branch's.

For type-safe access, the [`@neondatabase/env`](https://www.npmjs.com/package/@neondatabase/env) package ships `parseEnv`. It takes your `neon.ts` config and returns a typed env object validated against the services the config declares:

```ts
import { parseEnv } from '@neondatabase/env/v1';
import config from './neon';

const env = parseEnv(config);
env.postgres.databaseUrl; // typed, validated
```

## User-defined variables

Each deployment carries its own snapshot of user-defined variables. To change one, deploy again.

### At deploy time

Pass `--env KEY=VALUE` to `neonctl functions deploy`. The flag is repeatable:

```bash shouldWrap
neonctl functions deploy hello --path . --entry functions/hello.ts --env RESEND_API_KEY=re_...
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

`env pull` writes only the Neon-managed variables and preserves every other line in the file. That's `DATABASE_URL` and `DATABASE_URL_UNPOOLED`, plus the variables for every service enabled on the branch: the Neon Auth and Data API URLs, the AI Gateway credentials (`OPENAI_API_KEY`, `OPENAI_BASE_URL`, `NEON_AI_GATEWAY_*`), and the object storage credentials (`AWS_*`, `NEON_STORAGE_*`). Neon mints the AI Gateway key itself and uses the OpenAI-standard names so the OpenAI SDKs work from the environment without configuration.

## Constraints

| Constraint                   | Value                                                               |
| ---------------------------- | ------------------------------------------------------------------- |
| Max variables per deployment | 1,000                                                               |
| Max total size               | 64 KiB                                                              |
| Reserved prefix              | `NEON_` (reserved for platform use, can't be set by user functions) |

<NeedHelp/>
