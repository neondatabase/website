---
title: 'Neon CLI command: deploy'
subtitle: 'Apply a neon.ts policy to a branch'
summary: >-
  The Neon CLI `neon deploy` command applies a neon.ts policy to a branch. It
  is a top-level alias of `neon config apply` with the same options, so you can
  reconcile a branch without the `config` prefix.
enableTableOfContents: true
updatedOn: '2026-11-27T01:32:36.472Z'
---

The `deploy` command applies a `neon.ts` policy to a branch. It is a top-level alias of [`neon config apply`](/docs/cli/config#apply), with the same options.

<CliUsage command="deploy" />

<CliOptions command="deploy" />

In a terminal, `deploy` asks before it overrides branch settings that differ from `neon.ts` or applies to a branch marked protected on Neon. Declining applies nothing.

If `neon.ts` declares [Realtime](/docs/cli/realtime) under `preview.realtime`, `neon deploy` enables it on the branch, and the default env pull waits until it's ready and writes `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET`.

When `neon.ts` declares [functions](/docs/compute/functions/overview), `deploy` waits for their builds to finish before it returns, and prints `Waiting for Function builds to finish` with their names. Pass `--no-wait` to return once each deployment is accepted. If a build fails or doesn't finish in time, `deploy` exits with an error that lists the function deployments it couldn't confirm. Every other change in the plan is still applied.

Without a terminal, there's no prompt. This covers CI, runs with no TTY, and `-o json` or `-o yaml` output. In those cases, `deploy` stops before changing anything and names the flag to re-run with. For scripts, CI, and agents, pass `--update-existing` to allow the overrides, `--allow-protected` to allow a protected branch, or `-y` for both:

```bash
neon deploy --branch feature/auth -y
```
