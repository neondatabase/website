---
title: 'Neon CLI command: open'
subtitle: 'Open the linked project in the Neon Console in your browser'
summary: >-
  The Neon CLI `open` command opens your linked project's dashboard in the Neon
  Console in your default browser. It resolves the project from your local `.neon`
  context file, or from an explicit `--project-id`. Use it to jump from the
  terminal to the Console without looking up the project URL.
enableTableOfContents: true
---

The `open` command opens the linked project's dashboard in the [Neon Console](https://console.neon.tech) in your default browser. It resolves the project from your local `.neon` [context file](/docs/cli/set-context), so run [`neon link`](/docs/cli/link) or [`neon set-context`](/docs/cli/set-context) first, or pass `--project-id` to target a project directly. If no project is linked and you don't pass `--project-id`, the command tells you to run `neon link`.

## Usage

<CliUsage command="open" />

## Options

<CliOptions command="open" />

## Examples

Open the project linked in the current directory's `.neon` context file:

```bash
neon open
```

```text
INFO: Opening https://console.neon.tech/app/projects/cold-grass-40154007 in your browser.
```

Open a specific project without relying on the linked context:

```bash
neon open --project-id cold-grass-40154007
```
