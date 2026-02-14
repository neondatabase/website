---
title: Natural language guides
subtitle: Copy-paste prompts for Cursor and Claude Code with the Neon MCP Server
summary: >-
  Step-by-step guides that use natural language commands you copy into your AI
  assistant. With the Neon MCP Server connected, the assistant performs the
  actions for you.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

Natural language guides are short, task-based docs. Each guide gives you **copyable prompts** to paste into your AI assistant (Cursor or Claude Code). If the [Neon MCP Server](/docs/ai/neon-mcp-server) is installed and connected, the assistant can run Neon operations for you: create projects, list branches, run SQL, compare schemas, and more.

## Prerequisites

1. **Install Neon for your AI assistant** (one-time). In your **terminal**, from your project or home directory:

   ```bash
   npx neonctl@latest init
   ```

   The command signs you in to Neon, creates and stores an API key, and installs the Neon MCP Server, the [Neon Local Connect extension](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect) (Cursor/VS Code), and [agent skills](https://github.com/neondatabase/agent-skills) in your editor so your assistant can manage Neon from the chat. Because your API key is stored, you also get full access to the Neon platform API and any SDKs or CLI commands that depend on it. Learn more: [neonctl init](/docs/reference/cli-init).

   If you only want the MCP server (for example, you already have an API key or prefer OAuth in the browser each time), use [Connect MCP clients to Neon](/docs/ai/connect-mcp-clients-to-neon) for MCP-only options.

2. **Restart your editor** so it picks up the MCP server and extension.

3. **Open your AI chat** (Cursor or Claude Code) and use the prompts in the guides below. The assistant will call Neon MCP tools as needed.

## Guides

Each guide is one topic with a scenario, steps, and copyable natural language prompts.

<DetailIconCards>

<a href="/docs/ai/natural-language-guide-get-started" description="Create your first Neon project and get a connection string using natural language" icon="gamepad">Get started with Neon</a>

<a href="/docs/ai/natural-language-guide-get-started-again" description="Reconnect to your account, see what you have, and choose your next step" icon="gamepad">Welcome back to Neon</a>

<a href="/docs/ai/natural-language-guide-learn-concepts" description="Learn Neon's core concepts by asking your assistant; answers from our documentation" icon="setup">Learn Neon concepts</a>

<a href="/docs/ai/natural-language-guide-learn-plans-billing" description="Learn Neon plans and billing; answers from our Plans, Manage billing, and Monitor usage docs" icon="setup">Learn Neon plans and billing</a>

<a href="/docs/ai/natural-language-guide-explore-sql" description="List projects, branches, tables, and run SQL via your AI assistant" icon="transactions">Explore projects and run SQL</a>

<a href="/docs/ai/natural-language-guide-branches-schema" description="Create branches, change schema, and compare diffs using natural language" icon="branching">Branches and schema changes</a>

<a href="/docs/ai/natural-language-guide-connect-app" description="Set up a Neon project and app connection (Next.js, Drizzle, Neon Auth) with natural language" icon="gamepad">Connect your app</a>

<a href="/docs/ai/natural-language-guide-query-performance" description="Find slow queries, explain plans, and tune on a branch with natural language" icon="performance">Query performance</a>

<a href="/docs/ai/natural-language-guide-branching-workflow" description="Feature branch from production, develop, migrate back, and reset using natural language" icon="branching">Branching development workflow</a>

<a href="/docs/ai/natural-language-guide-branching-test-queries" description="Create a branch, test a query safely, then delete the branch using natural language" icon="branching">Test queries on a branch</a>

<a href="/docs/ai/natural-language-guide-time-travel" description="Query data at a point in time: create a branch at a timestamp, run read-only queries, then delete the branch" icon="branching">Time Travel</a>

<a href="/docs/ai/natural-language-guide-cost-optimization" description="Assess compute, branches, storage, restore window, and connections for cost optimization" icon="performance">Assess cost optimization</a>

</DetailIconCards>

## How to use these prompts

- Copy the prompt from the code block (the part that looks like `> ...`).
- Paste it into your Cursor agent or Claude Code chat.
- The AI uses the Neon MCP Server to perform the action (list projects, run SQL, create a branch, etc.). If it needs your project or branch name, it may ask or use context from the conversation.
- Replace any placeholder like `[project-name]` with your actual project name or ID.

## Verifying results

The assistant displays MCP tool output directly in the chat (for example, a list of projects, a connection string, or a schema diff). That response is usually enough to confirm the step worked. For extra confidence, you can open the [Neon Console](https://console.neon.tech) and check the same resource there: **Projects**, **Branches**, **Tables**, or the **SQL Editor** depending on what you created or changed. Each guide below notes what you will see in the chat and, where useful, where to confirm in the Console.

<NeedHelp/>
