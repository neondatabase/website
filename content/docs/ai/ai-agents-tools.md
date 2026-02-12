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
