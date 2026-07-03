---
title: 'Neon CLI command: bootstrap'
subtitle: Scaffold a new project from a Neon starter template
summary: >-
  Covers the usage of the `bootstrap` command in the Neon CLI to scaffold a
  new application from a Neon starter template, including the interactive
  template picker, the `--default` quick start, post-scaffold setup steps
  (dependency install, git init, project linking), and the `--agent` JSON
  output mode for AI agents.
enableTableOfContents: true
---

The `bootstrap` command scaffolds a new application from a Neon starter template. By default it runs interactively: it prompts you to pick a template, scaffolds it into the target directory, then offers the usual setup steps (install dependencies, initialize git, link the directory to a Neon project). Requires neon 2.25.0 or later; check your version with `neon --version`.

## Usage

<CliUsage command="bootstrap" />

The directory argument is optional. Use `.` to scaffold into the current directory, or leave it out and bootstrap prompts you for one. The target directory must be empty unless you pass `--force`.

## Options

<CliOptions command="bootstrap" />

Run with `--list-templates` to see the available templates, and pass one with `--template` to skip the interactive picker.

The post-scaffold steps (`--install`, `--git`, `--link`) all default to on. In interactive mode, bootstrap asks about each one; use the negated form (`--no-install`, `--no-git`, `--no-link`) to skip a step without being asked. With `--link`, bootstrap runs [`neon link`](/docs/cli/link) in the scaffolded directory after installing.

Use `--default` (alias `-y`) for a quick start: it scaffolds the default template (or the one you pass with `--template`) and runs dependency install and git init without prompting. Linking is left to you, since it needs a project choice.

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

## Agent mode

Pass `--agent` to skip the prompts and emit a JSON state-machine response designed for AI agents. The output is a single JSON object with a discriminated `status` field describing the next step.

```bash
neon bootstrap my-app --template hono --agent
```
