---
title: 'Neon CLI command: config'
subtitle: 'Manage a branch with a neon.ts policy: init, add, status, plan, and apply'
summary: >-
  The Neon CLI `neon config` command manages a branch declaratively with a
  neon.ts policy file. Use `neon config init` to scaffold a starter neon.ts
  and install the config packages, `neon config add` to declare a service,
  function, or bucket in an existing neon.ts, `neon config status` to show the branch's
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

Scaffolds a starter `neon.ts` policy file in the current project and installs the `@neon/config` and `@neon/env` packages, so you can start managing a branch declaratively. The generated file uses the standard named `defineConfig` import from `@neon/config/v1` and exports the result as the module default, for example:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Declare your Neon services here
  auth: false,
  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      // Default branch: no overrides, uses project defaults
      return {};
    }
    if (!branch.exists) {
      // New non-default branches: auto-expire
      // Run `neon checkout <name>` to create a new branch with these settings
      return { ttl: "7d" };
    }
    // Existing branch: no changes
    return {};
  },
});
```

If a `neon.ts`, `neon.mts`, `neon.js`, or `neon.mjs` file already exists, `config init` is idempotent: it leaves that file untouched instead of overwriting hand-written policy.

`config init` runs entirely locally and does not call the Neon API. It detects your package manager (npm, pnpm, yarn, or bun) from how the command was invoked. Before installing, it makes sure `node_modules/` is listed in your `.gitignore`, appending it if it's missing. Pass `--no-install` to skip installation and just print the command to run.

<CliUsage command="config init" />

<CliOptions command="config init" />

```bash
neon config init
```

Pass `--services` to declare services in the file it scaffolds, for example `neon config init --services auth,functions`. This applies only when creating a new `neon.ts`; to add services to a file that already exists, use [`config add`](#add).

For non-interactive setup, run it with package installation disabled, then install the printed dependencies yourself (or add them to your lockfile in a separate step):

```bash
neon config init --no-install
npm install @neon/config @neon/env
```

Use `config init` when you want a trusted starter artifact and package list. Hand-write `neon.ts` instead when you need a different filename/module format or want to avoid modifying files in the current directory.

<Admonition type="tip">
After running an interactive [`neon link`](/docs/cli/link), the CLI prompts you to run `config init` as its final step, unless the project already has a `neon.ts` file.
</Admonition>

## neon config add (#add)

Declares a service, function, or bucket in your `neon.ts`, creating the file if there isn't one. Where [`config init`](#init) scaffolds a starter policy and leaves an existing file alone, `config add` edits an existing policy for you, including creating and registering a handler for a function. To declare services while first scaffolding the file, use [`config init --services`](#init) instead.

<CliUsage command="config add" />

<CliSubcommands command="config add" anchorParts="add" />

`config add` runs entirely locally: it edits files, and never authenticates or resolves a project. Provisioning stays a separate [`neon config apply`](#apply) step.

It looks for your config in the project directory: the directory holding the nearest `.neon` file (found by searching up from the current directory), or the current directory when there's no `.neon`. A `neon.ts` in a parent directory no longer applies. When it finds none, it creates `neon.ts` there and installs the `@neon/config` and `@neon/env` packages; pass `--no-install` to print the install command instead. Editing an existing file never installs packages. Pass `--config <path>` to target a specific file; a path that doesn't exist is an error.

It edits the file in place, keeping your comments and formatting. It refuses edits it can't make safely, such as a service declared under the deprecated `preview` block, and prints the lines to add by hand instead. Re-adding an already-enabled service exits `0` with "nothing to change"; a duplicate function slug or bucket name exits `1`; a bare `neon config add` exits `1` and lists what you can add.

### neon config add auth (#add-auth)

Enables Neon Auth by setting `auth: true`.

<CliUsage command="config add auth" />

<CliOptions command="config add auth" />

```bash
neon config add auth
```

### neon config add data-api (#add-data-api)

Enables the Data API by setting `dataApi: true`, and enables Neon Auth, which the default provider requires (it flips `auth: false` to `true`). An existing external auth provider is left unchanged.

<CliUsage command="config add data-api" />

<CliOptions command="config add data-api" />

```bash
neon config add data-api
```

### neon config add ai-gateway (#add-ai-gateway)

Enables the AI Gateway by setting `aiGateway: true`.

<CliUsage command="config add ai-gateway" />

<CliOptions command="config add ai-gateway" />

```bash
neon config add ai-gateway
```

### neon config add function (#add-function)

Declares a [Neon Function](/docs/cli/functions) and creates its handler file. The handler defaults to `functions/<slug>.ts` (`.js` for a JavaScript config). A slug is 1 to 20 lowercase letters and digits, with no hyphens. Pass `--name` to set a display name (it defaults to the slug), or `--source` to register an existing handler relative to `neon.ts` without overwriting it.

<CliUsage command="config add function" />

<CliOptions command="config add function" />

Adding a function to a directory with no `neon.ts` creates both the config and the handler:

```bash
neon config add function sendemail
```

```text
INFO: Created functions/sendemail.ts.
INFO: Created neon.ts: added functions.sendemail.
INFO: Install the Neon config packages to use neon.ts: npm install @neon/config @neon/env
INFO: Next: `neon dev` to run it locally, `neon config apply` to deploy.
```

### neon config add bucket (#add-bucket)

Declares a [Neon Object Storage](/docs/cli/buckets) bucket. Pass `--access public_read` to allow anonymous reads; the default is `private`.

<CliUsage command="config add bucket" />

<CliOptions command="config add bucket" />

```bash
neon config add bucket assets --access public_read
```

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
neon config apply --branch feature/auth --update-existing --allow-protected
```
