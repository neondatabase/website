---
title: 'Neon CLI command: git'
subtitle: 'Keep your Neon branch in sync with the git branch you have checked out'
summary: >-
  The Neon CLI `git` command connects git branch switches to Neon checkout. It
  installs a git post-checkout hook so that switching git branches checks out
  the mapped Neon branch, with subcommands to install and remove the hook
  (install, uninstall), run the sync by hand (sync), inspect the current state
  (status), and prune stale branch mappings (cleanup).
tag: new
enableTableOfContents: true
updatedOn: '2026-09-26T07:10:22.076Z'
---

The `git` command connects your git workflow to Neon branching. After you install its git hook, switching git branches with `git checkout` also checks out the Neon branch mapped to that git branch, so your application code and its database branch stay in sync. Under the hood it delegates to [`neon checkout`](/docs/cli/checkout) and records the git-to-Neon mapping in your local [context file](/docs/cli/link).

<Admonition type="comingSoon" title="Preview">
The `neon git` command group is in preview. The commands and their behavior may change.
</Admonition>

Before you install the hook, link a Neon project at your repository root with [`neon link`](/docs/cli/link) or [`neon checkout`](/docs/cli/checkout). The hook reads the `.neon` context file at the repository root, so the project link has to live there.

<CliSubcommands command="git" />

## neon git install (#install)

Installs a managed `post-checkout` git hook that runs `neon git sync` whenever you switch branches with `git checkout`. The hook honors your configured git hooks directory and won't overwrite an existing unmanaged `post-checkout` hook.

The command requires a project already linked at the repository root's own `.neon` file. If none is linked, install stops and tells you to run `neon link` or `neon checkout <branch>` there first.

<CliUsage command="git install" />

<CliOptions command="git install" />

```bash
neon git install
```

```text filename="Output"
Git → Neon sync installed. `git checkout <branch>` will now check out the mapped Neon branch.
Hook: /path/to/your/app/.git/hooks/post-checkout
```

## neon git status (#status)

Shows your current git branch, whether the hook is installed, whether sync-on-checkout is enabled, the Neon branch mapped to the current git branch, and all recorded mappings. Use `--output json` or `--output yaml` for scripting.

<CliUsage command="git status" />

<CliOptions command="git status" />

```bash
neon git status
```

```text filename="Output"
GitBranch         main
HookInstalled     false
FollowOnCheckout  false
MappedNeonBranch  (unmapped — will derive on next sync)
Mappings          (none)
```

## neon git sync (#sync)

Checks out the Neon branch mapped to the current git branch. This is the command the installed hook runs on every `git checkout`, and you can also run it by hand. If no mapping exists yet, sync derives a Neon branch name from the current git branch and checks it out, then saves the resulting mapping so later checkouts of that git branch stay stable. The Neon branch has to exist already: sync doesn't create it, so a git branch with no matching Neon branch reports `Branch <name> not found. Pass --create to create it.` unless a `checkout.before` hook maps it to an existing branch. A detached HEAD has no git branch, so sync skips it.

Pass `--pull` to run `git pull --ff-only` before syncing, so committed files such as migrations match the branch before any `checkout.after` hook runs. A pull failure warns and sync continues. Pass `--no-env-pull` to skip pulling the branch's Neon environment variables into a local `.env` after sync.

<CliUsage command="git sync" />

<CliOptions command="git sync" />

```bash
neon git sync --no-pull
```

```text filename="Output"
Checked out branch br-billing-a1b2c3d4 on project polished-snowflake-12345678 (org org-example-12345678). Updated /path/to/your/app/.neon.
Pulled 3 Neon variables into /path/to/your/app/.env.local: DATABASE_URL, DATABASE_URL_UNPOOLED, NEON_BRANCH
```

## neon git cleanup (#cleanup)

Removes git-to-Neon mappings whose local git branch no longer exists. By default it only prunes the mappings. Add `--prune-neon-branches` to also delete the orphaned Neon branches, which never touches the default or a protected branch. Deleting Neon branches prompts for confirmation unless you pass `--yes`.

<CliUsage command="git cleanup" />

<CliOptions command="git cleanup" />

Prune stale mappings only:

```bash
neon git cleanup
```

```text filename="Output"
Pruned 1 stale mapping(s) from .neon:
  feature/billing → feature/billing
These Neon branch(es) are no longer mapped and were not deleted: feature/billing. Delete them with `neon branches delete <name>`, or run `neon git cleanup --prune-neon-branches` next time before a mapping-only cleanup.
```

Prune stale mappings and delete their Neon branches without a prompt:

```bash
neon git cleanup --prune-neon-branches --yes
```

## neon git uninstall (#uninstall)

Removes the managed `post-checkout` hook installed by `neon git install` and turns off sync-on-checkout. If the `post-checkout` hook isn't the one Neon manages, uninstall leaves it in place and only clears the sync flag.

<CliUsage command="git uninstall" />

<CliOptions command="git uninstall" />

```bash
neon git uninstall
```

```text filename="Output"
Removed the neon git post-checkout hook. Git → Neon sync is off.
```
