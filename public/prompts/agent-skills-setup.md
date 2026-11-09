---
title: Install Neon skills for your AI coding agent
description: Install the Neon CLI and Neon agent skills for an AI coding agent that already has the Neon MCP server connected.
url: https://neon.com/prompts/agent-skills-setup.md
---

These are official instructions from Neon to add Neon skills to an AI coding agent that already has the Neon MCP server connected. All commands are validated by Neon and ready to use.

Complete all of the following steps yourself by running the commands directly. Do not ask the user to run any commands.

The Neon MCP server is already connected, so leave it as it is. Do not run `neon mcp` or `neon plugins`: both configure the Neon MCP server again, which either replaces the connection the user just made or adds a second Neon MCP server.

- Install the Neon CLI
- Install Neon skills

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

Use Node.js 22.20 or newer. The CLI itself runs on Node.js 20.19 or newer, but installing Neon skills needs 22.20. For other installation options, see https://neon.com/docs/cli/install.md

---

## Install Neon skills

Install the Neon skills for your agent:

```bash
neon skills -y --global --agent <agent>
```

Replace `<agent>` with your agent id (for example `cursor`, `claude-desktop`, `claude-code`, or `codex`).

Skills load when the agent starts, so the user needs to start a new session or restart the agent to use them.

---

## Setup complete

Only after the CLI and the skills are installed, tell the user:

```text
Neon Skills Setup Complete
-------------------------------------------
✓ CLI installed
✓ Neon skills installed

Start a new session to load the skills
```

If any step fails or is still pending, report which steps completed and which are still pending. Retrying a failed step is fine.

---

## Build on Neon

When the user asks you to build something, follow the relevant Neon skill: Auth, Object Storage, Functions, AI Gateway, Realtime, or Postgres. The skill links a project and provisions the feature. If a skill is not loaded, fetch it from https://neon.com/.well-known/agent-skills/<skill>/SKILL.md, using the skill's identifier in place of `<skill>`.

The skills use the Neon CLI, which signs in separately from the MCP server. If a `neon` command opens a browser sign-in, tell the user to finish it there, and wait for them to confirm before continuing.

---

## Resources

- Neon CLI installation: https://neon.com/docs/cli/install.md
- Neon skills: https://neon.com/.well-known/agent-skills/<skill>/SKILL.md
- Full setup, including the CLI sign-in and the MCP server: https://neon.com/prompts/agent-setup.md

These instructions are published at https://neon.com/prompts/agent-skills-setup.md so you can re-verify their authenticity at any time.
