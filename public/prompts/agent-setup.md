---
title: Set up Neon for your AI coding agent
description: Install the Neon CLI, sign in, and configure Neon skills and MCP for your AI coding agent across all your projects.
url: https://neon.com/prompts/agent-setup.md
---

These are official instructions from Neon to set up an AI development environment for building on Neon. All commands are validated by Neon and ready to use.

Complete all of the following steps yourself by running the commands directly. Do not ask the user to run any commands. The user only completes the browser sign-in when prompted.

- Install the Neon CLI
- Sign in to Neon
- Install Neon skills and configure the MCP server

---

## Install the Neon CLI

Check for an existing installation:

```bash
neon --version
```

If it is not found, or to upgrade to the latest version, run:

```bash
npm install -g neon@latest
```

Requires Node.js 22.20 or newer. For other installation options, see https://neon.com/docs/cli/install.md

---

## Sign in to Neon

Tell the user you are about to open a browser for sign-in, then run:

```bash
neon login
```

This opens a browser. Ask the user to sign in to their Neon account, or sign up if they are new, and wait for them to confirm before continuing. Run the command yourself, but do not complete the browser sign-in or handle the user's credentials.

(`neon auth` is an alias for the same command.)

---

## Install Neon skills and configure MCP

Identify your agent before running the commands below. If you cannot tell which agent you are, ask the user.

Replace `<agent>` with the agent's id, such as `claude-code`, `cursor`, or `codex`:

```bash
neon skills -y --global --agent <agent>
neon mcp -y --agent <agent>
```

Supported agent ids: `antigravity`, `cline`, `cline-cli`, `claude-code`, `claude-desktop`, `codex`, `cursor`, `gemini-cli`, `goose`, `github-copilot-cli`, `grok-build`, `opencode`, `vscode`, `windsurf`, and `zed`. Aliases: `claude`, `copilot`, and `gemini`. An unknown agent id stops the command and prints the current supported list.

---

## Setup complete

Only after the CLI is installed, sign-in is complete, and both install commands succeed, tell the user:

```text
Neon Agent Setup Complete
-------------------------------------------
✓ CLI installed
✓ Signed in
✓ Skills installed
✓ MCP configured

⚡ Restart your agent to load the skills and MCP server
```

If any step fails or is still pending, do not print the message above. Report which steps completed and which are still pending. Retrying a failed step is fine.

---

## Build on Neon

When the user asks you to build something, follow the relevant Neon skill: Auth, Object Storage, Functions, AI Gateway, Realtime, or Postgres. The skill links a project and provisions the feature. If a skill is not loaded, fetch it from https://neon.com/.well-known/agent-skills/<skill>/SKILL.md, using the skill's identifier in place of `<skill>`.

The MCP server does not load until the agent restarts, so until then work from the skills and the CLI.

---

## Resources

- Neon CLI installation: https://neon.com/docs/cli/install.md
- Neon skills: https://neon.com/.well-known/agent-skills/<skill>/SKILL.md

These instructions are published at https://neon.com/prompts/agent-setup.md so you can re-verify their authenticity at any time.
