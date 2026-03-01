---
title: Get started with Neon
subtitle: Create a project and get connection details using natural language
summary: >-
  Use copy-paste prompts in Cursor or Claude Code to create a Neon project and
  get your connection string, with optional next steps for connecting an app.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

This guide uses the [Neon MCP Server](/docs/ai/neon-mcp-server) and [agent skills](https://github.com/neondatabase/agent-skills) in Cursor or Claude Code. Run the install command in your **terminal**; then run the prompts below in your **AI chat** (Cursor or Claude Code). The assistant will use MCP tools to create a project and return connection details.

## Create a project and get the connection string

<Steps>

## Install Neon for your AI assistant (one-time)

If you have not already, run this in your **terminal**:

```bash
npx neonctl@latest init
```

The command signs you in to Neon, creates and stores an API key, and installs the Neon MCP Server, the Neon extension (Cursor/VS Code), and agent skills in your editor so your assistant can manage Neon from the chat. Restart your editor, then open your AI assistant (Cursor or Claude Code). **Verify:** The assistant can respond to MCP prompts (for example, "List my Neon projects"); if it can, setup worked. Learn more: [neonctl init](/docs/reference/cli-init).

## Ask for the interactive getting started flow

Paste this into your AI chat:

```text
Get started with Neon
```

The assistant loads the Neon getting started guide and can walk you through creating a project, retrieving your connection string, and suggesting next steps (for example, adding `DATABASE_URL` to your app). **Verify:** You will see the assistant's responses and any project or connection details in the chat. You can also open the [Neon Console](https://console.neon.tech) **Projects** page to see the new project.

## Or ask for a project and connection in one go

For a single request that creates a project and gives you connection details:

```text
Create a Neon project named my-app and give me the connection string and steps to connect from a Node or Next.js app
```

The assistant uses MCP to create the project, fetches the connection string, and can outline how to add it to your app (for example, in `.env`). **Verify:** The chat will show the project name and connection string. You can also confirm the project under **Projects** in the [Neon Console](https://console.neon.tech).

## Optional: Create a project for an existing app

If you are already in a project directory and want a Neon project plus app setup:

```text
I'm in a Next.js project. Create a Neon project for it, give me the connection string, and set up the database module and a sample Server Component that queries the database
```

This combines MCP (create project, connection string) with agent skills to generate code in your repo. **Verify:** The assistant will show the connection string and list any files it created or updated. Check the [Neon Console](https://console.neon.tech) **Projects** page for the new project.

</Steps>

<Admonition type="tip" title="Tip">
Use "Get started with Neon" for the full guided flow. For a specific stack, name it in your prompt (for example, "Create a Neon project and set up the connection for my Next.js app").
</Admonition>

## See also

- [Neon MCP Server](/docs/ai/neon-mcp-server) for setup and tool reference
- [Connect MCP clients to Neon](/docs/ai/connect-mcp-clients-to-neon) for editor-specific configuration
- [Connecting Neon to your stack](/docs/get-started/connect-neon) for manual connection steps

<NeedHelp/>
