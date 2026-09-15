---
title: 'Neon CLI command: ask'
tag: new
tagTheme: green
subtitle: 'Ask the Neon assistant a question from the terminal'
summary: >-
  The Neon CLI `ask` command sends a question to the Neon assistant and prints
  the answer in your terminal. It answers from Neon's documentation and needs no
  login; use `--output json` for machine-readable output when scripting or
  calling it from an agent.
enableTableOfContents: true
---

The `ask` command sends a question to the Neon assistant and prints the answer to your terminal: `neon ask --prompt "<question>"`. The assistant answers from Neon's documentation, so keep questions scoped to Neon and Lakebase Postgres rather than general chat. No login is required, and it doesn't touch your projects or account.

The answer is natural-language text, not structured data. By default it streams as markdown, use `--output json` to get the answer back as a single `text` field you can parse.

## Usage

<CliUsage command="ask" />

Pass your question with `--prompt`. It's the only required option.

## Options

<CliOptions command="ask" />

`--output json` and `--output yaml` both return the full answer at once as a single `text` field, instead of streaming markdown.

## Examples

Ask a question:

```bash
neon ask --prompt "How do schema-only branches work?"
```

Get the answer as JSON so you can process it in a script:

```bash
neon ask --prompt "What is a Neon project?" --output json
```
