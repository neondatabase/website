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

<PrivatePreviewEnquire/>

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
