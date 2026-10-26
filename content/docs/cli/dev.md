---
title: 'Neon CLI command: dev'
subtitle: 'Run Neon Functions locally with a dev server'
summary: >-
  The Neon CLI `neon dev` command runs Neon Functions locally with a dev
  server and hot reload. Pass --source to serve a single function entry module
  (optionally with --port for an explicit port), or omit --source to serve
  every function declared in neon.ts, each on its own dev server.
enableTableOfContents: true
---

The `dev` command runs [Neon Functions](/docs/compute/functions/overview) locally with a dev server and hot reload. Serve one function from its entry module, or every function declared in your `neon.ts` policy.

## Usage

<CliUsage command="dev" />

## Options

<CliOptions command="dev" />

## Examples

Serve one function on a free port with hot reload:

```bash
neon dev --source ./functions/hello.ts
```

Serve every function declared in `neon.ts` (one dev server each):

```bash
neon dev
```

Serve one function on an explicit port (fails if the port is taken):

```bash
neon dev --source ./functions/hello.ts --port 3000
```

## Environment variables

Before evaluating `neon.ts`, `neon dev` loads your project's `.env` and then `.env.local` into the environment. Values in `.env.local` override `.env`, and a variable already set in your shell wins over both. This lets function `env` values that read `process.env` resolve locally the same way they do for [`neon deploy --env`](/docs/cli/deploy). Pass `--env` to load only one file instead, resolved from the current directory:

```bash
neon dev --env .env.staging
```

Local functions inherit every loaded variable, including ones `neon.ts` doesn't declare. A deployed function only gets the variables `neon.ts` declares plus the ones Neon injects, so check that anything your code needs is declared before you deploy. The dev server's startup banner lists which env files it loaded and how many variables each one set.

`neon dev` never writes to these files. To reuse the branch credential behind the AI Gateway and Object Storage, it reads the file [`neon env pull`](/docs/cli/env) writes. Without that file, it resolves the credential again on every start, so run `neon env pull` once if you restart often.

## WebSockets

`neon dev` serves WebSocket upgrades locally, so you can test real-time functions before you deploy. Connect a client to the dev server's `ws://localhost:<port>` URL. See [WebSockets and SSE](/docs/compute/functions/websockets) for the function-side code.
