---
title: 'Neon CLI command: config'
subtitle: 'Manage a branch with a neon.ts policy: init, status, plan, and apply'
summary: >-
  The Neon CLI `neon config` command manages a branch declaratively with a
  neon.ts policy file. Use `neon config init` to scaffold a starter neon.ts
  and install the config packages, `neon config status` to show the branch's
  live Neon state (`neon status --current-branch` prints the pinned branch
  offline for shell prompts), `neon config plan` for a dry run of what an
  apply would change, and `neon config apply` (or its top-level alias
  `neon deploy`) to apply the policy to the branch. Supports --config to
  point at a neon.ts file, --env to load environment variables before
  evaluating it, and --allow-protected and --update-existing confirmation flags
  for non-interactive use.
enableTableOfContents: true
---

The `config` command manages a branch declaratively with a `neon.ts` policy file: scaffold a starter config, inspect the branch's live state, preview what an apply would change, and apply the policy. For the `neon.ts` file format, see the [neon.ts reference](/docs/reference/neon-ts).

<CliSubcommands command="config" />

The top-level [`neon deploy`](/docs/cli/deploy) command is an alias for `config apply`, and [`neon status`](/docs/cli/status) is an alias for `config status`.

## neon config init (#init)

Scaffolds a starter `neon.ts` policy file in the current project and installs the `@neon/config` and `@neon/env` packages, so you can start managing a branch declaratively. If a `neon.ts`, `neon.mts`, `neon.js`, or `neon.mjs` file already exists, it is left untouched.

`config init` runs entirely locally and does not call the Neon API. It detects your package manager (npm, pnpm, yarn, or bun) from how the command was invoked. Pass `--no-install` to skip installation and just print the command to run.

<CliUsage command="config init" />

<CliOptions command="config init" />

```bash
neon config init
```

<Admonition type="tip">
After running an interactive [`neon link`](/docs/cli/link), the CLI offers to run `config init` as its final step, unless the project already has a `neon.ts` file.
</Admonition>

## neon config status (#status)

Shows the branch's live Neon state.

<CliUsage command="config status" />

<CliOptions command="config status" />

```bash
neon config status
```

The top-level `neon status` command is an alias for `config status` and accepts the same options.

### Print the current branch offline (#current-branch)

Pass `--current-branch` to print _only_ the branch pinned in the local `.neon` file. This variant makes no network request and requires no login or analytics, so it is cheap enough to drive a shell prompt.

It prints the branch name to stdout and exits `0`. When no branch is pinned, it prints nothing to stdout, writes a `neon checkout <branch>` hint to stderr, and exits with a non-zero status, so a prompt can guard on the command directly.

```bash
neon status --current-branch
```

For example, add your current Neon branch to a [starship](https://starship.rs) prompt. Append this `[custom.neon]` module to `~/.config/starship.toml`. The `command` prints the pinned branch, and `when` hides the segment (exits non-zero) whenever you are not in a Neon project:

```toml
# ~/.config/starship.toml
[custom.neon]
description = "Current Neon branch"
command = "neon status --current-branch"   # prints the branch pinned in .neon (no network)
when = "neon status --current-branch"       # exits non-zero when no branch -> segment is hidden
symbol = "🌿 "
style = "bold green"
format = "[$symbol$output]($style) "
```

<Admonition type="tip" title="Faster outside Neon projects">
The `when` above runs the CLI on every prompt everywhere. To skip it unless a `.neon` file exists somewhere up the tree, replace `when` with a pure-shell walk-up and add `shell = ["sh"]` so it runs under `sh` even if your interactive shell is fish or PowerShell:

```toml
shell = ["sh"]
when = '''
d="$PWD"
while [ "$d" != "$HOME" ] && [ "$d" != / ]; do
  if [ -e "$d/.neon" ]; then
    neon status --current-branch >/dev/null 2>&1
    exit $?
  fi
  d=$(dirname "$d")
done
exit 1
'''
```

</Admonition>

For a full copy-paste (and agent-ready) walkthrough, including prerequisites and troubleshooting, see this [Starship + Neon branch setup gist](https://gist.github.com/thisistonydang/0b6c03ec9aa9b619ffecd48f58fd40c7).

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
