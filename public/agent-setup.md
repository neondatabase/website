---
name: neon-agent-setup
title: Set up Neon for your AI coding agent
description: Install the Neon CLI and connect your coding agent to Neon (skills and MCP) once, account-free, for use across all your projects.
url: https://neon.com/agent-setup.md
---

# Set up Neon for your AI coding agent

Prepare the current agent for Neon: install the CLI, then connect the skills and
MCP server once, for use across projects. This is account-free setup. It does
not sign you in or create a project. Link a project later, when you build
something.

Perform these steps yourself when you have terminal access. Do not just print
commands for the user to copy.

## Rules
- Never print secrets or API keys, and never commit them.
- Do not launch sign-in or create a project here. This sets up tooling only.
- If a step is blocked, note why and continue with the rest.

## 1. Install the CLI
Requires Node.js 22.20 or newer.
```
neon --version                 # check for an existing install
npm install -g neon@latest     # install or upgrade if missing or outdated
```

## 2. Connect your agent to Neon
Replace `<agent>` with the editor id, for example `claude-code`, `cursor`,
`codex`, or `github-copilot-cli`.
```
neon plugins --global --agent <agent> -y
```
This installs the Neon skills and connects the MCP server, no account needed.
The command prints a status table; each row should read `installed`.

## 3. Confirm it works
```
neon --version                 # CLI is on the PATH
```
Report the CLI version and the install status from step 2, then tell the user
to restart the editor so the agent loads the skills and MCP server.

## Done
Tooling is ready. To build, just ask your agent: create a database, add login
and users (Auth), store files (Object Storage), run backend code (Functions),
add AI (AI Gateway), make it live (Realtime), or add search. It will create and
link a project then.
