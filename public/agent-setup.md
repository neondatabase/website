---
name: neon-get-started
title: Set up Neon for your AI coding agent
description: Install the Neon CLI, sign in, and connect your agent to Neon (skills and MCP), once, for all your projects.
url: https://neon.com/get-started.md
---

# Set up Neon for your AI coding agent

Use this to prepare the current agent for Neon: install the CLI, sign in, and
connect the skills and MCP server once, for use across projects. Link a project
later, when you build something.

Perform actions yourself when you have terminal access. Do not just return
commands for the user to copy. Pause only for sign-in or approvals you cannot do
yourself.

## Rules
- Never print secrets or API keys, and never commit them.
- Do not launch browser sign-in yourself. Ask the user to run it and confirm.
- If a step is blocked, note why and continue with the rest.

## 1. Install the CLI
Requires Node.js 22.20 or newer.
```
neon --version                 # check for an existing install
npm install -g neon@latest     # install or upgrade if missing or outdated
```

## 2. Sign in
Check whether the user is already signed in:
```
neon profile list -o json
```
If no account is present, ask the user to run `neon login` (it opens a browser),
then wait. Do not launch it yourself.

## 3. Connect your agent to Neon
Replace `<agent>` with the editor id, for example `claude-code`, `cursor`,
`codex`, or `github-copilot-cli`.
```
neon plugins --global --agent <agent> -y
```
This installs the Neon skills and connects the MCP server. Tell the user to
restart the editor so the agent loads them.

## 4. Confirm it works
Run read-only checks and report what you find. Do not create a project here.
```
neon --version
neon orgs list -o json
```

## Done
Report the verified state: CLI version, signed-in account, skills and MCP
connected. To build, just ask your agent: create a database, add login and users
(Auth), store files (Object Storage), run backend code (Functions), add AI (AI
Gateway), make it live (Realtime), or add search. It will create and link a
project then.
