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
---

The `env` command manages a branch's Neon environment variables locally. [`neon link`](/docs/cli/link) and [`neon checkout`](/docs/cli/checkout) pull env variables automatically by default.

<CliSubcommands command="env" />

## neon env pull (#pull)

Writes the branch's Neon environment variables to a local `.env` file.

`neon env pull` works with or without a [`neon.ts`](/docs/reference/neon-ts) configuration file. Without one, it writes the branch's core variables (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_BRANCH`). With a `neon.ts`, it also writes credentials for each service you declare (Managed Better Auth, Data API, AI Gateway, Object Storage).

When your `neon.ts` declares functions, `neon env pull` also writes each one's invocation URL as `NEON_FUNCTION_<SLUG>_BASE_URL` (for example, `NEON_FUNCTION_DISCORD_BASE_URL`). The URL is derived from the branch, so the function doesn't have to be deployed yet; the value is the address it will answer at once you deploy it to that branch. Scoping the pull with `--service functions` instead writes URLs only for functions that are already deployed, so a declared-but-undeployed function appears in the default `neon.ts` pull but not with `--service functions`.

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

Pull only the variables for the services you name, ignoring `neon.ts`. Repeat `--service` or comma-separate the values (`postgres`, `auth`, `data-api`, `functions`, `object-storage`, `ai-gateway`):

```bash
neon env pull --service ai-gateway --service postgres
```
