---
title: AI tools for Agents
subtitle: AI-powered tools for development and database management
summary: >-
  Covers the integration of AI tools with Neon for database management,
  including setup instructions, Model Context Protocol (MCP) usage, and plugins
  for Claude Code and GitHub Copilot.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.712Z'
---

Neon provides several ways to integrate with AI tools and agents, from natural language database control to autonomous agent frameworks. Choose the tools that fit your workflow.

## Quick setup

The fastest way to get started with Neon and AI:

```bash
npx neonctl@latest init
```

This authenticates via OAuth, creates an API key, configures your editor (Cursor, VS Code, or Claude Code), and installs [agent skills](https://github.com/neondatabase/agent-skills). Then restart and ask your AI assistant **"Get started with Neon"**.

## MCP integration

The Model Context Protocol (MCP) is a standardized way for AI tools to interact with Neon databases using natural language, providing secure and contextual access to your data and infrastructure.

<DetailIconCards>
<a href="/docs/ai/neon-mcp-server" description="Learn about managing your Neon projects using natural language with Neon MCP Server" icon="github">Neon MCP Server</a>
<a href="/docs/ai/connect-mcp-clients-to-neon" description="Learn how to connect MCP clients like Cursor, Claude Code, and ChatGPT to your Neon database" icon="github">Connect MCP clients</a>
</DetailIconCards>

## Claude Code plugin

If you're using Claude Code, install the Neon plugin to get Skills, MCP integration, and all the context rules in one package.

<DetailIconCards>
<a href="/docs/ai/ai-claude-code-plugin" description="Includes Claude Code Skills for Neon, Neon MCP integration, and context rules" icon="github">Claude Code plugin for Neon</a>
</DetailIconCards>

## GitHub Copilot agents

Custom agents for GitHub Copilot that bring Neon's branching workflow directly into VS Code for safe migrations and query optimization.

<DetailIconCards>
<a href="/docs/ai/ai-github-copilot-agents" description="Safe database migrations and query optimization using Neon branching" icon="github">Neon agents for GitHub Copilot</a>
</DetailIconCards>

## AI rules

For other AI tools like Cursor, use these individual `.mdc` context rule files. Copy them to your AI tool's custom rules directory — the format is tool-agnostic and works with any AI assistant that supports context rules.

<DetailIconCards>
<a href="/docs/ai/ai-rules-neon-auth" description="AI rules for implementing authentication with Neon" icon="github">Neon Auth</a>
<a href="/docs/ai/ai-rules-neon-drizzle" description="AI rules for using Drizzle ORM with Neon" icon="github">Neon Drizzle</a>
<a href="/docs/ai/ai-rules-neon-serverless" description="AI rules for serverless database connections" icon="github">Neon Serverless Driver</a>
<a href="/docs/ai/ai-rules-neon-typescript-sdk" description="AI rules for using the Neon API TypeScript SDK" icon="github">Neon API TypeScript SDK</a>
<a href="/docs/ai/ai-rules-neon-python-sdk" description="AI rules for using the Neon Python SDK" icon="github">Neon Python SDK</a>
<a href="/docs/ai/ai-rules-neon-api" description="AI rules for using the Neon API" icon="github">Neon API</a>
<a href="/docs/ai/ai-rules-neon-toolkit" description="AI rules for using the Neon Toolkit" icon="github">Neon Toolkit</a>
</DetailIconCards>

## Natural language guides

Copy-paste prompts for Cursor and Claude Code. With the Neon MCP Server connected, your AI assistant can create projects, list branches, run SQL, and compare schema using natural language.

<DetailIconCards>
<a href="/docs/ai/natural-language-guides" description="Overview and prerequisites for natural language guides" icon="setup">Overview</a>
<a href="/docs/ai/natural-language-guide-get-started" description="Create a project and get a connection string via natural language" icon="gamepad">Get started with Neon</a>
<a href="/docs/ai/natural-language-guide-get-started-again" description="Reconnect, see your account, and choose your next step" icon="gamepad">Welcome back to Neon</a>
<a href="/docs/ai/natural-language-guide-learn-concepts" description="Learn Neon's core concepts; answers from our documentation" icon="setup">Learn Neon concepts</a>
<a href="/docs/ai/natural-language-guide-learn-plans-billing" description="Learn Neon plans and billing; answers from our Plans and billing docs" icon="setup">Learn Neon plans and billing</a>
<a href="/docs/ai/natural-language-guide-explore-sql" description="List projects, branches, tables, and run SQL" icon="transactions">Explore projects and run SQL</a>
<a href="/docs/ai/natural-language-guide-branches-schema" description="Create branches, change schema, and compare diffs" icon="branching">Branches and schema changes</a>
<a href="/docs/ai/natural-language-guide-connect-app" description="Set up a Neon project and app connection (Next.js, Drizzle, Neon Auth)" icon="gamepad">Connect your app</a>
<a href="/docs/ai/natural-language-guide-query-performance" description="Find slow queries, explain plans, and tune on a branch" icon="performance">Query performance</a>
<a href="/docs/ai/natural-language-guide-branching-workflow" description="Feature branch from production, develop, migrate back, and reset" icon="branching">Branching development workflow</a>
<a href="/docs/ai/natural-language-guide-branching-test-queries" description="Create a branch, test a query safely, then delete the branch" icon="branching">Test queries on a branch</a>
<a href="/docs/ai/natural-language-guide-time-travel" description="Query data at a point in time: create a branch at a timestamp, run read-only queries, then delete" icon="branching">Time Travel</a>
<a href="/docs/ai/natural-language-guide-cost-optimization" description="Assess compute, branches, storage, restore window, and connections for cost" icon="performance">Assess cost optimization</a>
</DetailIconCards>

## Build AI agents

Create autonomous agents that can manage and interact with your Neon databases programmatically. Build with our terse JavaScript client or the Neon API.

<DetailIconCards>

<a href="https://neon.com/use-cases/ai-agents" description="Read about Neon as a solution for agents that need backends." icon="openai">Neon for AI agent platforms</a>

<a href="https://github.com/neondatabase/toolkit" description="A terse JavaScript client for spinning up Postgres databases and running SQL queries" icon="github">@neondatabase/toolkit</a>

<a href="/docs/ai/ai-database-versioning" description="How AI agents and codegen platforms use Neon snapshot APIs for database versioning" icon="openai">Database versioning</a>

<a href="/docs/reference/api-reference" description="Integrate using the Neon API" icon="transactions">Neon API</a>

</DetailIconCards>

## Agent frameworks

Build AI agents using popular frameworks that integrate with Neon.

<DetailIconCards>
<a href="/guides/agentstack-neon" description="Build and deploy AI agents with AgentStack's CLI and Neon integration" icon="openai">AgentStack Integration</a>
<a href="/guides/autogen-neon" description="Create collaborative AI agents with Microsoft AutoGen and Neon" icon="openai">AutoGen Integration</a>
<a href="/guides/azure-ai-agent-service" description="Build enterprise AI agents with Azure AI Agent Service and Neon" icon="openai">Azure AI Agent Service</a>
<a href="/guides/composio-crewai-neon" description="Create multi-agent systems with CrewAI and Neon" icon="openai">Composio + CrewAI</a>
<a href="/guides/langgraph-neon" description="Build stateful, multi-actor applications with LangGraph and Neon" icon="openai">LangGraph Integration</a>
</DetailIconCards>
