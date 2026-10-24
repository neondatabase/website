---
title: 'Neon CLI command: bootstrap'
subtitle: Scaffold a new project from a Neon starter template
summary: >-
  Covers the usage of the `bootstrap` command in the Neon CLI to scaffold a
  new application from a Neon starter template, including the interactive
  template picker, the `--default` quick start, and post-scaffold setup steps
  (dependency install, git init, agent tooling, and project linking).
enableTableOfContents: true
---

The `bootstrap` command scaffolds a new application from a Neon starter template. By default it runs interactively: it prompts you to pick a template, scaffolds it into the target directory, then offers the usual setup steps (install dependencies, initialize git, install agent tooling, and link the directory to a Neon project). To add a single function to an existing project from a template, use [`neon functions new`](/docs/cli/functions#new) instead.

## Usage

<CliUsage command="bootstrap" />

The directory argument is optional. Use `.` to scaffold into the current directory, or leave it out and bootstrap prompts you for one. The target directory must be empty unless you pass `--force`.

## Options

<CliOptions command="bootstrap" />

Run with `--list-templates` to see the available templates (add `--output json` for a machine-readable catalog), and pass one with `--template` to skip the interactive picker.

The post-scaffold steps all default to on. In interactive mode, bootstrap asks about each one; pass the negated flag to skip it without being asked:

- `--install` / `--no-install`: install dependencies.
- `--git` / `--no-git`: initialize a git repository.
- `--agent-setup` / `--no-agent-setup`: install agent tooling, either the Neon plugin, or agent skills and the MCP server. Pass `--agent` (alias `-a`, repeatable) to name the agents and skip the picker, for example `neon bootstrap my-app --agent cursor`.
- `--link` / `--no-link`: run [`neon link`](/docs/cli/link) in the scaffolded directory.

Use `--default` (alias `-y`) for a quick start: it scaffolds the default template (or the one you pass with `--template`), then runs git init, agent tooling, dependency install, and `neon link --yes` without prompting.

`link --yes` picks your only organization and project and writes a `.neon` context file. If you have several, the other steps still finish, then the command lists the IDs and exits with an error. Bootstrap doesn't accept `--org-id` or `--project-id`, so link from the new directory:

```bash
neon link --yes --org-id <org-id> --project-id <project-id>
```

Outside an interactive terminal (no TTY, or in CI), bootstrap only scaffolds the template. It skips every post-scaffold step, even one you pass explicitly like `--install`, and its summary lists the commands to run next. Use `--default` to run the steps unattended.

## Examples

Create `./my-app` from an interactively chosen template:

```bash
neon bootstrap my-app
```

When the steps finish, bootstrap prints a summary. This run linked a project and skipped agent tooling:

```text
Project scaffolded.
-------------------

  Template      REST API
  Directory     my-app
  Dependencies  installed with npm
  Git           initialized
  Agents        skipped
  Project       linked

Next:
  cd my-app
  See the README to run it.
```

Scaffold a specific template into the current directory:

```bash
neon bootstrap . --template hono
```

Scaffold the [Realtime](/docs/realtime/overview) React starter, a todo app with live queries and optimistic updates. Its `neon.ts` declares Realtime, so run `neon deploy` in the new directory to enable it:

```bash
neon bootstrap my-app --template realtime-react
```

Quick start: scaffold the default template and run setup without prompting:

```bash
neon bootstrap my-app --default
```

List the template catalog as JSON, for scripting or driving `bootstrap` from an agent. Each entry's `id` is what you pass to `--template`:

```bash
neon bootstrap --list-templates --output json
```

The command prints an array of template objects, each shaped like:

```json
{
  "id": "hono",
  "title": "REST API",
  "description": "A Hono REST API on Neon Functions, backed by Lakebase Postgres via Drizzle.",
  "services": ["Postgres", "Functions"]
}
```
