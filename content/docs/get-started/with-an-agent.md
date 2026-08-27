---
title: Get started with your AI agent
subtitle: Set up Neon in your project using your AI coding assistant
summary: >-
  Set up Neon for your project with your AI coding assistant. Let your agent
  install the Neon tooling and connect your project, or run `neon init`
  yourself in a terminal, then ask your agent to get started.
enableTableOfContents: true
updatedOn: '2026-08-27T22:59:15.528Z'
---

Set up Neon for your project without leaving your editor. You have two options: let your AI coding assistant install the Neon tooling and connect your project for you, or run `neon init` yourself in a terminal and then hand off to your agent. Either way, your agent ends up with the [agent skills](/docs/ai/agent-skills) and [Neon MCP server](/docs/ai/neon-mcp-server) it needs to create a Neon project, connect your app, and use Neon features as you build.

New to the platform? The [backend overview](/docs/get-started/backend-overview) shows how Postgres, Managed Better Auth, Object Storage, Functions, and the AI Gateway fit together. For a hands-on walkthrough, see [Build a full backend](/docs/get-started/full-backend-quickstart).

## Before you start

You'll need:

- [Node.js 20+](https://nodejs.org/)
- A supported AI coding assistant, such as Cursor or Claude Code (see [supported clients](/docs/ai/connect-mcp-clients-to-neon#supported-agents-add-mcp))

## Let your agent set it up

The fastest path is to let your agent do the whole setup, from installing the tooling to proving the connection works. Paste this prompt into your editor's AI chat:

```text shouldWrap filename="AI assistant prompt"
Help me get set up with Neon, based on my project:

1. Install or upgrade the Neon CLI: `npm install -g neon@latest`.
2. Install the Neon agent tooling for your editor, replacing `<agent>` with your editor id (for example `cursor`, `claude-code`, or `codex`): run `neon plugins --agent <agent>` (recommended, installs the Neon plugin), or `neon skills --agent <agent> -s neon -s neon-postgres`. If sign-in opens a browser, ask me to confirm before continuing, and never print secrets.
3. Using the installed Neon skill, create a Neon project (or connect an existing one), link it, and pull my DATABASE_URL into my env file. Add a Postgres driver for my stack.
4. Prove it works: run a real query and show me the result, not just "setup complete." Give me a command to re-check it myself (e.g. `neon psql`).
5. Then suggest next steps, such as a schema or migrations, branching for previews, or Neon's other services (Object Storage, Functions, Managed Better Auth, AI Gateway).
```

Your agent installs the Neon CLI and tooling and does the setup for you, so there's no switching between the terminal and the chat. It:

- Installs either the Neon plugin, or [agent skills](/docs/ai/agent-skills) and the [Neon MCP server](/docs/ai/neon-mcp-server), for your editor, and signs you in (finish the browser step if it prompts)
- Creates or connects a Neon project, writes your `DATABASE_URL` into your env file, and adds a Postgres driver for your stack
- Uses the connection and shows you a real result so you can see it's working

To confirm it yourself, run the command the agent gives you (e.g., `neon psql`), or open your project in the [Neon Console](https://console.neon.tech).

## Prefer to run it yourself?

You can run the setup manually and then hand off to your agent.

<Steps>

## Run the init command

From your project root, run:

```bash
npx neon@latest init
```

`neon init` is interactive, so run it in a terminal. It asks how your coding agents should get Neon (either a plugin, or skills and the MCP server), links a Neon project, and writes a `neon.ts` config. In an empty directory, it scaffolds a starter template first. For the full flow, and a non-interactive setup for agents and CI, see the [`neon init` reference](/docs/cli/init).

If you only want the MCP server, without the skills or plugin, run [`npx neon@latest mcp`](/docs/cli/mcp) instead. If you only want agent skills, run [`npx neon@latest skills`](/docs/cli/skills).

## Tell your agent

In your editor's AI chat, send:

```text
Get started with Neon
```

Your agent reads the installed skill to create or connect a Neon project, pull your `DATABASE_URL` into your env file, add a Postgres driver, and run a real query to confirm the connection. The exact flow depends on your project.

</Steps>

## What's next

- [How a Neon backend fits together](/docs/get-started/backend-overview)
- [Build a full backend with Next.js and Neon](/docs/get-started/full-backend-quickstart)
- [About branching](/docs/introduction/branching)

<NeedHelp/>
