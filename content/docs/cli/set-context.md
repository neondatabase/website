---
title: 'Neon CLI command: set-context'
subtitle: Set default project context for CLI sessions to avoid repeating project ID
summary: >-
  The `set-context` Neon CLI command saves a project ID, organization ID, or
  branch to a `.neon` context file so subsequent commands run against that
  project or org without requiring `--project-id` or `--org-id` flags each
  time. Use this command when working repeatedly against the same project to
  eliminate repetitive flag passing across a CLI session. Context is stored in a
  `.neon` file (or a named `--context-file`) found by walking up the directory
  tree to the project root, supports multiple independent named files, and
  persists until reset with `neonctl set-context` or deleted manually.
enableTableOfContents: true
updatedOn: '2026-06-11T23:50:21.258Z'
redirectFrom:
  - /docs/reference/cli-set-context
---

The `set-context` command sets a background context for your CLI sessions, so you don't have to specify the project ID in every command. The context is saved to a default `.neon` file in the current directory, or to a [named context file](#using-a-named-context-file) of your choice, and stays in place until you reset it or remove the file.

<Admonition type="tip" title="Prefer link or checkout">
For most workflows, use [`neonctl link`](/docs/cli/link) to bind a directory to a project or [`neonctl checkout`](/docs/cli/checkout) to switch branches. Use `set-context` when you need to set context values directly (for example, in scripts).
</Admonition>

<Admonition type="tip" title="How the CLI finds your `.neon` file">
When you run a command, the CLI starts in your current directory and checks for a `.neon` file. If it does not find one, it checks the parent directory, then the parent of that, and so on until it finds a `.neon` file or reaches your home directory. This means you can run commands from any subdirectory of a linked project without re-specifying `--project-id`.

To write context to a specific file or location, use `--context-file`.
</Admonition>

## Usage

<CliUsage command="set-context" />

To save the context to a file other than the default `.neon` file, add the global `--context-file <your_context_file>` option. You can switch contexts by providing different files.

## Options

<CliOptions command="set-context" />

Set at least one of these options.

## Using the default context file

Set the context to the default `.neon` file:

```bash
neonctl set-context --project-id patient-frost-50125040 --org-id org-bright-sky-12345678
```

List all branches for this project with `branches list`, without including `--project-id` or `--org-id`, even if you belong to multiple organizations or have multiple projects:

```bash
neonctl branches list
```

```text
┌──────────────────────────┬─────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                       │ Name        │ Default │ Created At           │ Updated At           │
├──────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-raspy-meadow-26349337 │ development │ false   │ 2023-11-28T19:19:11Z │ 2023-12-01T00:18:21Z │
├──────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-curly-bar-82389180    │ main        │ true    │ 2023-10-23T12:49:41Z │ 2023-12-01T00:18:21Z │
└──────────────────────────┴─────────────┴─────────┴──────────────────────┴──────────────────────┘
```

## Using a named context file (#using-a-named-context-file)

Set the context to the context file of your choice:

```bash
neonctl set-context --project-id plain-waterfall-84865553 --context-file Documents/MyContext
```

List all branches with `branches list`. The context file provides the project:

```bash
neonctl branches list --context-file Documents/MyContext
```

```text
┌─────────────────────────────┬─────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                          │ Name        │ Default │ Created At           │ Updated At           │
├─────────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-soft-base-86343042       │ development │ false   │ 2023-11-21T18:41:47Z │ 2023-12-01T00:00:14Z │
├─────────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-young-bush-89857627      │ main        │ true    │ 2023-11-21T18:00:10Z │ 2023-12-01T03:33:53Z │
├─────────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-billowing-union-41102466 │ staging     │ false   │ 2023-11-21T18:44:22Z │ 2023-12-01T08:32:40Z │
└─────────────────────────────┴─────────────┴─────────┴──────────────────────┴──────────────────────┘
```

<Admonition type="note">
These two `branches list` commands use independent contexts in the same account: the default `.neon` file points to `patient-frost-50125040`, while the named context file points to `plain-waterfall-84865553`. You can set as many context files as you'd like, using unique names or different directories.
</Admonition>

## Setting context when creating a new project

Use `--set-context` to set the project context at creation time:

```bash
neonctl projects create --name MyLatest --set-context
```

This creates a hidden `.neon` file by default with the following context:

```json
{
  "projectId": "quiet-water-76237589"
}
```

Commands that would normally require `--project-id` now default to this context.

## Reset or remove context

To clear the current context, either:

1. Run the `set-context` command with no options:

   ```bash
   neonctl set-context
   ```

2. Delete the `.neon` file (or your custom `--context-file`):

   ```bash
   rm .neon
   # Or for a custom context file:
   rm your_context_file
   ```

## `.gitignore` on first create

The first time a `.neon` file is created in a directory, the CLI adds `.neon` to `.gitignore` in that same folder:

- If no `.gitignore` exists, the CLI creates one with a single `.neon` line.
- If `.gitignore` already exists, the CLI appends `.neon` only if it is not already listed.

This keeps local project settings out of git by default. If you want to commit `.neon` and share context with your team, remove the entry from `.gitignore`. The CLI will not re-add it when updating an existing `.neon` file.

<Admonition type="note">
Neon does not save any confidential information to the context file (for example, auth tokens). You can safely commit this file to your repository or share with others.
</Admonition>
