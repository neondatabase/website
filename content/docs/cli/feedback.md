---
title: 'Neon CLI command: feedback'
subtitle: 'Send feedback about the Neon CLI and docs to the Neon team'
summary: >-
  The Neon CLI `feedback` command sends a short message to the Neon team without
  leaving your terminal. Pass your note with `--message`. It needs no login and
  doesn't touch your projects or account. Don't include passwords, API keys,
  connection strings, or other personal information.
enableTableOfContents: true
updatedOn: '2026-10-03T12:43:38.865Z'
---

The `feedback` command sends a short message to the Neon team from the terminal: `neon feedback --message "<your feedback>"`. Use it to report a confusing command, a docs gap, or anything else about the CLI you'd like the team to see. To ask the Neon assistant a question instead, use [`neon ask`](/docs/cli/ask).

No login is required, and the command doesn't read or change your projects or account. Don't put passwords, API keys, connection strings, or other personal information in the message.

## Usage

<CliUsage command="feedback" />

Pass your note with `--message`. It's the only required option.

## Options

<CliOptions command="feedback" />

## Examples

```bash
neon feedback --message "The branch docs were unclear about default branch names"
```

```text filename="Output"
Feedback received. Thank you!
```
