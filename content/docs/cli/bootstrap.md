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

The `bootstrap` command scaffolds a new application from a Neon starter template. By default it runs interactively: it prompts you to pick a template, scaffolds it into the target directory, then offers the usual setup steps (install dependencies, initialize git, install agent tooling, and link the directory to a Neon project).

<Admonition type="note" title="Behavior changed in Neon CLI 5.0.0">
Before 5.0.0, `bootstrap --default` prompted for a project and left the branch unpinned. From 5.0.0, the [`neon link`](/docs/cli/link) step writes a complete context (org, project, and branch), and `--default` uses your only org and project or, when you have several, prints the IDs and exits. Pass `--org-id`/`--project-id` in unattended runs.
</Admonition>

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

Use `--default` (alias `-y`) for a quick start: it scaffolds the default template (or the one you pass with `--template`), then runs dependency install, git init, agent tooling, and `neon link --yes` without prompting. `link --yes` selects your only organization and project, or prints the IDs and exits when you have several (pass `--org-id`/`--project-id` to choose).

## Examples

Create `./my-app` from an interactively chosen template:

```bash
neon bootstrap my-app
```

Scaffold a specific template into the current directory:

```bash
neon bootstrap . --template hono
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
