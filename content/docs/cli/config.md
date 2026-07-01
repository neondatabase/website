---
title: 'Neon CLI command: config'
subtitle: 'Manage a branch with a neon.ts policy: status, plan, and apply'
summary: >-
  The Neon CLI `neon config` command manages a branch declaratively with a
  neon.ts policy file. Use `neon config status` to show the branch's live
  Neon state, `neon config plan` for a dry run of what an apply would
  change, and `neon config apply` (or its top-level alias `neon deploy`)
  to apply the policy to the branch. Supports --config to point at a neon.ts
  file, --env to load environment variables before evaluating it, and
  --allow-protected and --update-existing confirmation flags for
  non-interactive use.
enableTableOfContents: true
---

The `config` command manages a branch declaratively with a `neon.ts` policy file: inspect the branch's live state, preview what an apply would change, and apply the policy. For the `neon.ts` file format, see the [neon.ts reference](/docs/reference/neon-ts).

<CliSubcommands command="config" />

The top-level [`neon deploy`](/docs/cli/deploy) command is an alias for `config apply`, and [`neon status`](/docs/cli/status) is an alias for `config status`.

## neon config init (#init)

Scaffolds a `neon.ts` policy and installs the Neon config packages.

<CliUsage command="config init" />

<CliOptions command="config init" />

```bash
neon config init
```

## neon config status (#status)

Shows the branch's live Neon state.

<CliUsage command="config status" />

<CliOptions command="config status" />

```bash
neon config status
```

## neon config plan (#plan)

Shows what `config apply` would change, as a dry run. Nothing is modified.

<CliUsage command="config plan" />

<CliOptions command="config plan" />

```bash
neon config plan --config ./neon.ts --env .env.local
```

## neon config apply (#apply)

Applies a `neon.ts` policy to the branch.

<CliUsage command="config apply" />

<CliOptions command="config apply" />

For non-interactive use (scripts, CI, agents), pass `--update-existing` and `--allow-protected` to auto-confirm the corresponding prompts.

```bash
neon config apply --branch feature/auth --update-existing
```
