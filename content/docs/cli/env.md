---
title: 'Neon CLI command: env'
subtitle: "Manage a branch's Neon environment variables locally"
summary: >-
  The Neon CLI `neon env pull` command writes a branch's Neon environment
  variables to a local .env file. By default it targets an existing .env file,
  otherwise .env.local, and only Neon-managed variables are rewritten; other
  lines in the file are preserved. Use --file to target a specific file,
  --branch to pull from a specific branch, and --service to pull only selected
  services.
enableTableOfContents: true
updatedOn: '2026-10-15T18:40:34.000Z'
---

The `env` command manages a branch's Neon environment variables locally. [`neon link`](/docs/cli/link) and [`neon checkout`](/docs/cli/checkout) pull env variables automatically by default.

<CliSubcommands command="env" />

## neon env pull (#pull)

Writes the branch's Neon environment variables to a local `.env` file.

`neon env pull` works with or without a [`neon.ts`](/docs/reference/neon-ts) configuration file. Without one, it writes everything the branch has: the core variables (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_BRANCH`, `NEON_BRANCH_ID`), credentials for each service provisioned on the branch, and the default AI Gateway credential. With a `neon.ts`, it writes the core variables plus credentials for each service you declare (Managed Better Auth, Data API, AI Gateway, Object Storage, [Realtime](/docs/cli/realtime)).

`neon env pull` also writes `NEON_BRANCH_ID` and `NEON_FUNCTION_HOST_SUFFIX`, the two variables the Functions runtime injects into every deployed [Neon Function](/docs/compute/functions/overview). Together they make up any function's URL on the branch, `https://<NEON_BRANCH_ID>-<slug><NEON_FUNCTION_HOST_SUFFIX>`, which `functionBaseUrl("<slug>")` from `@neon/env` builds for you (see [Call another function](/docs/compute/functions/environment-variables#call-another-function)). An unscoped pull writes both whether or not your `neon.ts` declares functions, and the function doesn't have to be deployed yet. `--service functions` writes only these two plus `NEON_BRANCH`.

Neon CLI 9.0.0 replaced the per-function `NEON_FUNCTION_<SLUG>_BASE_URL` variables that earlier releases wrote. An unscoped or `--service functions` pull removes those old lines, and `--env NEON_FUNCTION_<SLUG>_BASE_URL` fails with an error that points you at `functionBaseUrl`. Code that reads `env.functions` from `@neon/env` 1.x needs `@neon/env` 2 and `functionBaseUrl("<slug>")` instead.

Unset function env vars don't block a pull. If a declared function reads a `process.env.*` value that isn't set, `neon env pull` (and the pull that [`neon link`](/docs/cli/link) and [`neon checkout`](/docs/cli/checkout) run) skips that value and writes everything else instead of failing. The commands that actually build or run your functions still require every declared value: `neon deploy`, `neon dev`, and `neon-env run`.

<CliUsage command="env pull" />

<CliOptions command="env pull" />

Write the linked branch's Neon variables into `.env.local` (or `.env` if present):

```bash
neon env pull
```

Pull a specific branch into a specific file:

```bash
neon env pull --branch preview --file .env.preview
```

Pull only the variables for the services you name, ignoring `neon.ts`. Repeat `--service` or comma-separate the values (`postgres`, `auth`, `data-api`, `functions`, `object-storage`, `ai-gateway`, `realtime`):

```bash
neon env pull --service ai-gateway --service postgres
```

For [Realtime](/docs/realtime/overview), the pull writes `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET`. With `--service realtime`, if Realtime is still provisioning on the branch (for example, right after [`neon realtime enable`](/docs/cli/realtime#enable)) or [rotating its secret](/docs/cli/realtime#rotate-secret), the pull waits until it's ready. `--service realtime` on its own doesn't write `DATABASE_URL`, so name `postgres` too when you need both:

```bash
neon env pull --service postgres --service realtime
```

Use a specific `neon.ts` policy instead of the one in the project directory (next to the nearest `.neon`, or the current directory when there's no `.neon`):

```bash
neon env pull --config ./config/neon.ts
```
