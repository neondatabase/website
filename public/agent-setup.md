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
- Never print or commit secrets or API keys.
- Do not sign in or create a project during setup (steps 1 to 4). That happens
  later, only if the user asks you to build.
- If a step fails, report the error without secrets and continue only with steps
  that do not depend on it. Do not report setup complete unless the CLI and the
  requested agent tooling installed successfully.

## 1. Install the CLI
Requires Node.js 20.19 or newer. Check for an existing install, then install or
upgrade to the latest (Neon's onboarding uses `@latest`):
```
neon --version
npm install -g neon@latest
```

## 2. Read the Neon skill now (no account needed)
Fetch the Neon skill and use it to guide the rest of setup. This works
immediately, with zero install, and is how you always find Neon's guidance even
if the next step is unavailable:
```
https://neon.com/.well-known/agent-skills/neon/SKILL.md
```

## 3. Connect your agent to Neon (persistent)
This installs the Neon skills and MCP server into your editor so they load every
session. Use the id for the agent you are setting up, for example `claude-code`,
`cursor`, `codex`, or `github-copilot-cli`. If you cannot tell which agent you
are, ask the user. Do not configure unrelated agents.
```
neon plugins --global --agent <agent> -y
```
No account needed. The command prints a status table; it should report `installed` when it succeeds. If your agent does not support this command, skip it and rely on
the skill URL from step 2.

## 4. Confirm it works
```
neon --version
```
Report the CLI version and the per-component install results from step 3. If the
editor must restart before the skills or MCP server load, say "installed;
restart required," not "ready to use."

## Setup complete
Report the actual outcome; do not announce success unconditionally. If the CLI
installed and either the skill is readable (step 2) or the plugin installed
(step 3), tell the user the agent is set up for Neon, and that restarting the
editor loads the installed skills and MCP server. This set up the agent, not a
Neon account; nothing was created in Neon. If anything failed, report what is
still pending instead.

## When you're ready to build
Build only when the user asks for it (for example "add login", "store uploads",
"make a live feed"). If the user's current request already includes building
something, that request counts: do not ask them to repeat it.

To build, sign in first (one human step): check with `neon me`, and if no one is
signed in, run `neon login`. It opens a browser, so pause and ask your human to
confirm once they have signed in. Do not attempt it yourself or handle their
credentials.

Then follow the Neon skill for what the user asked for (installed from step 3,
or fetched at its well-known URL from step 2). The skill links a project in a
supported region, provisions the feature, and carries any prerequisites that
feature needs.
