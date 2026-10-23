---
title: Set up Neon for your AI coding agent
description: Install the Neon CLI and connect your coding agent to Neon (skills and MCP) for use across all your projects.
url: https://neon.com/prompts/agent-setup.md
---

These are official instructions from Neon to set up your AI coding agent for Neon. All commands are validated by Neon and ready to use.

Complete these steps yourself by running the commands directly. Do not ask the user to run them. This installs tooling only. It does not sign you in or create anything in a Neon account; that comes later, only if the user asks you to build.

## 1. Install the Neon CLI

Requires Node.js 22.20 or newer. Check for an existing install, then install or upgrade to the latest:

```bash
neon --version
npm install -g neon@latest
```

For other install options, see https://neon.com/docs/cli/install.md

## 2. Install the Neon skills and MCP server

Replace `<agent>` with your agent's id, for example `claude-code`, `cursor`, or `codex`. The full set is antigravity, cline, cline-cli, claude-code, claude-desktop, codex, cursor, gemini-cli, goose, github-copilot-cli, grok-build, opencode, vscode, windsurf, and zed (aliases: `claude`, `copilot`, `gemini`). Passing an unknown agent stops the command and prints the current supported list. If you cannot tell which agent you are, ask the user.

```bash
neon skills -y --global --agent <agent>
neon mcp -y --oauth --agent <agent>
```

`--oauth` means the MCP server authorizes in the browser on first use, not during setup.

## Setup complete

Once the CLI is installed and the skills and MCP server are configured, tell the user:

```
Neon Setup Complete
-------------------------------------------
✓ Skills installed
✓ MCP configured (authorizes on first use)

⚡ Restart your agent to load the skills and MCP server
→ Then ask it to build on Neon: auth, file uploads, functions, AI, or realtime
```

If a step failed, report what is still pending instead. If the user also asked you to build something, do not stop at the restart message; continue now with the section below, fetching any skill you need from its URL rather than waiting for a restart.

## When the user asks you to build

Building creates real resources, so it needs the user's Neon account. If the user already asked you to build something, treat that as the go-ahead; do not ask them to repeat it.

1. Sign in (one human step). Run `neon login` (`neon auth` is an alias). It opens a browser, so pause and ask the user to confirm once they have signed in. Do not attempt it yourself or handle their credentials.
2. Follow the Neon skill for what they asked for (Auth, Object Storage, Functions, AI Gateway, Realtime, or Postgres). Each skill links a project in a supported region and provisions the feature. If a skill is not loaded yet, fetch it at `https://neon.com/.well-known/agent-skills/<skill>/SKILL.md`.
