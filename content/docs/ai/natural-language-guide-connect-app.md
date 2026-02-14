---
title: Connect your app
subtitle: Set up a Neon project and app connection using natural language
summary: >-
  Use copy-paste prompts in Cursor or Claude Code to create a Neon project,
  get a connection string, and generate app connection code with the Neon MCP
  Server and agent skills.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

This guide uses the [Neon MCP Server](/docs/ai/neon-mcp-server), the [Neon extension](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect) (for Cursor/VS Code), and [agent skills](https://github.com/neondatabase/agent-skills). Run the install command in your **terminal**; then run the prompts below in your **AI chat** (Cursor or Claude Code). The assistant uses MCP to create projects and fetch connection details, and skills to generate connection code in your app.

## Create a project and set up your app

<Steps>

## Install Neon for your AI assistant (one-time)

If you have not already, run this in your **terminal** from your project directory or home directory:

```bash
npx neonctl@latest init
```

The command signs you in to Neon, creates and stores an API key, and installs the Neon MCP Server, the Neon extension (Cursor/VS Code), and agent skills in your editor so your assistant can manage Neon from the chat. Restart your editor so the assistant can recommend connection methods and generate framework-specific code. **Verify:** Ask the assistant "List my Neon projects" or "Get started with Neon"; if it responds with MCP data, setup worked. Learn more: [neonctl init](/docs/reference/cli-init).

## Ask for a project plus app setup

Open your AI chat in your app's project directory, then paste one of the prompts below. Replace the framework name if you use something different.

**Next.js:**

```text
I'm in a Next.js project. Create a Neon project for it, give me the connection string, and set up the database module and a sample Server Component that queries the database
```

**Drizzle ORM:**

```text
Set up Drizzle ORM with Neon for this project
```

The assistant uses the Drizzle skill to install packages, configure Drizzle, and add schema and connection code. It may use MCP to create a Neon project or ask you to provide a connection string. **Verify:** The assistant will show the connection string and list created or updated files in the chat. You can confirm the project in the [Neon Console](https://console.neon.tech) **Projects** page and that the new files exist in your repo.

**Neon Auth (Next.js):**

```text
Set up Neon Auth for my Next.js app
```

The assistant uses the Neon Auth skill and can provision Neon Auth via MCP if needed.

## Get a connection recommendation only

If you already have a Neon project and want a recommendation for your stack:

```text
Recommend a connection method for this project
```

The assistant considers your runtime (serverless, Node, edge), framework, and dependencies, then suggests a driver and connection pattern (for example, `@neondatabase/serverless` for Vercel).

</Steps>

<Admonition type="tip" title="Tip">
Run these prompts from your app's root directory so the assistant can create or update files (for example, `lib/db.ts`, `drizzle.config.ts`, or `.env`). Agent skills provide the code patterns; MCP provides project creation and connection strings when needed.
</Admonition>

## See also

- [Get started with Neon](/docs/ai/natural-language-guide-get-started) to create a project and get a connection string only
- [Neon MCP Server](/docs/ai/neon-mcp-server) for setup and tools
- [Connect Neon to your stack](/docs/get-started/connect-neon) for manual connection steps
- [Agent skills](https://github.com/neondatabase/agent-skills) for supported frameworks and ORMs

<NeedHelp/>
