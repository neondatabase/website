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

For non-interactive use (scripts, CI, agents), pass `--update-existing` and `--allow-protected` to auto-confirm the corresponding prompts.

```bash
neon deploy --branch feature/auth --update-existing
```
