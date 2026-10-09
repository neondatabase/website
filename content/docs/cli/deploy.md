---
title: 'Neon CLI command: deploy'
subtitle: 'Apply a neon.ts policy to a branch'
summary: >-
  The Neon CLI `neon deploy` command applies a neon.ts policy to a branch. It
  is a top-level alias of `neon config apply` with the same options, so you can
  reconcile a branch without the `config` prefix.
enableTableOfContents: true
---

The `deploy` command applies a `neon.ts` policy to a branch. It is a top-level alias of [`neon config apply`](/docs/cli/config#apply), with the same options.

<CliUsage command="deploy" />

<CliOptions command="deploy" />

In a terminal, `deploy` asks before it overrides branch settings that differ from `neon.ts` or applies to a branch marked protected on Neon. Declining applies nothing.

Without a terminal, there's no prompt. This covers CI, runs with no TTY, and `-o json` or `-o yaml` output. In those cases, `deploy` stops before changing anything and names the flag to re-run with. For scripts, CI, and agents, pass `--update-existing` to allow the overrides, `--allow-protected` to allow a protected branch, or `-y` for both:

```bash
neon deploy --branch feature/auth -y
```
