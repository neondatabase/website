---
title: Send feedback
subtitle: Share ideas and requests with the Neon team from the Console, your terminal, or your coding agent
summary: >-
  Send feedback to the Neon team from the Neon Console, the Neon CLI (`neon
  feedback`), your coding agent through the Neon MCP Server (`send_feedback`),
  or the Neon Discord server. The CLI and MCP Server send only your message, with
  no account, project, or connection details.
enableTableOfContents: true
---

You can send us feedback from the Neon Console, your terminal, your coding agent, or Discord. Tell us about a feature you'd like, an example you'd find useful in the docs, or anything else on your mind. Feedback isn't a support channel. If you need help with an issue, see [Support](/docs/introduction/support).

Don't include passwords, API keys, connection strings, or other secrets in your feedback.

## Neon Console

Open the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console, write your message, and submit it.

## Neon CLI

Run [`neon feedback`](/docs/cli/feedback) from your terminal. You don't need to be logged in.

```bash
neon feedback --message "I'd love a Python example for branching in the docs"
```

```text filename="Output"
Feedback received. Thank you!
```

The `feedback` command requires Neon CLI version 8.0.2 or later. Run `neon --version` to check your version, and [upgrade the CLI](/docs/cli/install#upgrade) if needed.

## Neon MCP Server

If your coding agent is connected to the [Neon MCP Server](/docs/ai/neon-mcp-server), ask it to send feedback. The agent uses the `send_feedback` tool. For example:

```text
Send Neon feedback that I'd love a TypeScript example for branching in the docs.
```

## Discord

Join the [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on the [Neon Discord server](https://neon.com/discord) to share ideas and see what other Neon users are building.

## What gets sent

The Neon CLI and the Neon MCP Server send only your message. No account, project, or connection details come with it.

<NeedHelp/>
