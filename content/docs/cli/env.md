---
title: 'Neon CLI command: env'
subtitle: "Manage a branch's Neon environment variables locally"
summary: >-
  The Neon CLI `neon env pull` command writes a branch's Neon environment
  variables to a local .env file. By default it targets an existing .env file,
  otherwise .env.local, and only Neon-managed variables are rewritten; other
  lines in the file are preserved. Use --file to target a specific file and
  --branch to pull from a specific branch.
enableTableOfContents: true
---

The `env` command manages a branch's Neon environment variables locally. [`neon link`](/docs/cli/link) and [`neon checkout`](/docs/cli/checkout) pull env variables automatically by default.

<CliSubcommands command="env" />

## neon env pull (#pull)

Writes the branch's Neon environment variables to a local `.env` file.

<CliUsage command="env pull" />

<CliOptions command="env pull" />

Write the linked branch's Neon variables into `.env.local` (or `.env` if present):

```bash
neon env pull
```

Pull a specific branch into a specific file:

```bash
neon env pull --branch preview --file .env.preview
```
