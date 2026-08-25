---
title: Get started with your AI agent
subtitle: Set up Neon in your project using your AI coding assistant
summary: >-
  `neon init` sets up Neon for your project through your AI coding
  assistant: it installs the Neon CLI, signs you in, installs agent
  skills, and can configure the MCP server, so your agent can create a
  project and connect your app.
enableTableOfContents: true
updatedOn: '2026-08-25T02:37:06.867Z'
---

Set up Neon for your project without leaving your editor. `neon init` installs the Neon CLI, signs you in, installs Neon-specific agent skills, and can set up the [Neon MCP server](/docs/ai/neon-mcp-server). Together these give your agent what it needs to create a Neon project, connect your app, and use Neon features as you build. For Cursor and VS Code, it also installs the Neon Local Connect extension for in-editor schema browsing.

New to the platform? The [backend overview](/docs/get-started/backend-overview) shows how Postgres, Managed Better Auth, Object Storage, Functions, and the AI Gateway fit together. For a hands-on walkthrough, see [Build a full backend](/docs/get-started/full-backend-quickstart).

## Before you start

You'll need:

- [Node.js 20+](https://nodejs.org/)
- A supported AI coding assistant, such as Cursor or Claude Code (see [supported clients](/docs/ai/connect-mcp-clients-to-neon#supported-agents-add-mcp))

## Let your agent set it up

The fastest path is to let your agent do the whole setup, from running `init` to proving the connection works. Paste this prompt into your editor's AI chat:

```text shouldWrap filename="AI assistant prompt"
Help me get set up with Neon, based on my project:

1. Run `npx neon@latest init --agent` and work through the steps it returns to install the CLI, sign in, and connect my project. If it opens a browser for sign-in, ask me to confirm before continuing.
2. Run it through verification and show me the real query result, not just "setup complete." Give me a command to re-check it myself (e.g. `neon psql`), and never print secrets.
3. Then suggest next steps for my project, such as a schema or migrations, branching for previews, or Neon's other services (Object Storage, Functions, Managed Better Auth, AI Gateway).
```

Your agent installs the Neon CLI and runs its setup for you, so there's no switching between the terminal and the chat. It:

- Signs you in to Neon (finish the browser step if it prompts), creates an API key, optionally configures the [Neon MCP server](/docs/ai/neon-mcp-server), and installs [agent skills](/docs/ai/agent-skills)
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

<Admonition type="note">
`neon init` installs or updates the Neon CLI and sets up your editor tooling: authentication, agent skills, and optionally the MCP server. It doesn't create a Neon project, though; your agent does that when you ask it to get started.
</Admonition>

The wizard asks which editor to configure, then signs you in, creates an API key, installs [agent skills](/docs/ai/agent-skills), optionally configures the [Neon MCP server](/docs/ai/neon-mcp-server), and (for Cursor and VS Code) installs the [Neon Local Connect extension](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect). Run it from your project root so the skills land in the right place. For details and manual setup, see the [`neon init` reference](/docs/cli/init).

If you only want the MCP server, without the skills or extension, run [`npx neon@latest mcp`](/docs/cli/mcp) instead.

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
