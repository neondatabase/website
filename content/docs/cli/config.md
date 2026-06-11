---
title: 'Neon CLI command: config'
subtitle: 'Manage a branch with a neon.ts policy: status, plan, and apply'
summary: >-
  The Neon CLI `neonctl config` command manages a branch declaratively with a
  neon.ts policy file. Use `neonctl config status` to show the branch's live
  Neon state, `neonctl config plan` for a dry run of what an apply would
  change, and `neonctl config apply` (or its top-level alias `neonctl deploy`)
  to apply the policy to the branch. Supports --config to point at a neon.ts
  file, --env to load environment variables before evaluating it, and
  --allow-protected and --update-existing confirmation flags for
  non-interactive use.
enableTableOfContents: true
---

The `config` command manages a branch declaratively with a `neon.ts` policy file: inspect the branch's live state, preview what an apply would change, and apply the policy. For the `neon.ts` file format, see the [neon.ts reference](/docs/compute/functions/reference/neon-ts).

## Subcommands

<CliUsage command="config" />

<CliSubcommands command="config" />

The top-level [`neonctl deploy`](#deploy) command is an alias for `config apply`.

## neonctl config status (#status)

Shows the branch's live Neon state.

<CliUsage command="config status" />

<CliOptions command="config status" />

```bash
neonctl config status
```

## neonctl config plan (#plan)

Shows what `config apply` would change, as a dry run. Nothing is modified.

<CliUsage command="config plan" />

<CliOptions command="config plan" />

```bash
neonctl config plan --config ./neon.ts --env .env.local
```

## neonctl config apply (#apply)

Applies a `neon.ts` policy to the branch.

<CliUsage command="config apply" />

<CliOptions command="config apply" />

For non-interactive use (scripts, CI, agents), pass `--update-existing` and `--allow-protected` to auto-confirm the corresponding prompts.

```bash
neonctl config apply --branch feature/auth --update-existing
```

## neonctl deploy (#deploy)

Top-level alias for [`config apply`](#apply), with the same options.

<CliUsage command="deploy" />

<CliOptions command="deploy" />

```bash
neonctl deploy --branch feature/auth
```
