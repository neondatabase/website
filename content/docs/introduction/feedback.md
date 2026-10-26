---
title: Send feedback
subtitle: Share ideas, requests, and problems with the Neon team
summary: >-
  Send feedback to the Neon team with the Neon CLI (`neon feedback`), an HTTP
  POST to https://feedback.neon.tech/, the Neon MCP Server (`send_feedback`),
  the Neon Console, or the Neon Discord server. People and coding agents use the
  same channels. Also served at https://neon.com/feedback.md.
enableTableOfContents: true
redirectFrom:
  - /feedback
---

Tell us about a docs page that's wrong or out of date, a command or API call that doesn't behave as documented, a confusing error, a feature you'd like, or an example you'd find useful. People and coding agents can use the same channels.

Feedback isn't a support channel. If you need help with an issue, see [Support](/docs/introduction/support).

Don't include passwords, API keys, connection strings, or other secrets in your feedback.

## Where to send it

If you're a coding agent, use the first option your environment supports.

### Neon CLI

Run [`neon feedback`](/docs/cli/feedback) from your terminal. You don't need to be logged in.

```bash
neon feedback --message "I'd love a Python example for branching in the docs"
```

```text filename="Output"
Feedback received. Thank you!
```

The `feedback` command requires Neon CLI version 8.0.2 or later. Run `neon --version` to check your version, and [upgrade the CLI](/docs/cli/install#upgrade) if needed.

### HTTP

Send a POST request with a JSON body to `https://feedback.neon.tech/`. No authentication is required.

```bash
curl -X POST https://feedback.neon.tech/ \
  -H 'Content-Type: application/json' \
  -d '{"feedback": "describe the issue", "source": "neon_website", "path": "/docs/connect/choose-connection"}'
```

| Field      | Required | Value                                                                                       |
| ---------- | -------- | ------------------------------------------------------------------------------------------- |
| `feedback` | Yes      | Your feedback, up to 10,000 characters                                                      |
| `source`   | Yes      | `neon_website`                                                                              |
| `path`     | No       | The docs path, command, API endpoint, or tool the feedback is about, up to 2,048 characters |

A rejected request returns a 4xx status with an `error` message in the JSON body, such as `{"error": "feedback is required"}`.

### Neon MCP Server

If your coding agent is connected to the [Neon MCP Server](/docs/ai/neon-mcp-server), ask it to send feedback. The agent uses the `send_feedback` tool. It's available on every connection, including the no-login `https://mcp.neon.tech/mcp?category=docs` endpoint. For example:

```text
Send Neon feedback that I'd love a TypeScript example for branching in the docs.
```

### Neon Console

In the [Neon Console](https://console.neon.tech), select **Feedback** at the bottom of the left sidebar. Enter your message under **Share your thoughts** and select **Send**. You can also open the form directly with this [Feedback](https://console.neon.tech/app/projects?modal=feedback) link.

### Discord

Join the [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on the [Neon Discord server](https://neon.com/discord) to share ideas and see what other Neon users are building.

## What gets sent

The Neon CLI and the Neon MCP Server send only your message. No account, project, or connection details come with it.

Feedback from the Neon Console is linked to your Neon user ID, so the Neon team can see which account sent it.

## Write a useful report

- Say what you tried, what you expected, and what happened.
- Name the page URL, command, API endpoint, or tool involved.
- Quote error messages exactly.
- Send one issue per report.

<NeedHelp/>
