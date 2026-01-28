---
title: AI tools for Agents
subtitle: AI-powered tools for development and database management
enableTableOfContents: true
updatedOn: '2026-01-22T15:48:50.611Z'
---

Neon provides several ways to integrate with AI tools and agents, from natural language database control to autonomous agent frameworks. Choose the tools that fit your workflow.

## Agent Skills

Install the Neon agent skill to give AI tools like Cursor and Claude Code context-aware guidance for working with Neon:

```bash
npx add-skill neondatabase/agent-skills
```

Topics covered include Neon Auth, Drizzle ORM, serverless connections, API usage, and more. See [Agent Skills](/docs/ai/agent-skills) for the full list.

For Claude Code, you can also install via the [Claude Code plugin](/docs/ai/ai-claude-code-plugin) which includes Agent Skills and MCP integration.

## MCP integration

The Model Context Protocol (MCP) is a standardized way for AI tools to interact with Neon databases using natural language, providing secure and contextual access to your data and infrastructure.

<DetailIconCards>
<a href="/docs/ai/neon-mcp-server" description="Learn about managing your Neon projects using natural language with Neon MCP Server" icon="github">Neon MCP Server</a>
<a href="/docs/ai/connect-mcp-clients-to-neon" description="Learn how to connect MCP clients like Cursor, Claude Code, and ChatGPT to your Neon database" icon="github">Connect MCP clients</a>
</DetailIconCards>

## GitHub Copilot agents

Custom agents for GitHub Copilot that bring Neon's branching workflow directly into VS Code for safe migrations and query optimization.

<DetailIconCards>
<a href="/docs/ai/ai-github-copilot-agents" description="Safe database migrations and query optimization using Neon branching" icon="github">Neon agents for GitHub Copilot</a>
</DetailIconCards>

## Build AI agents

Create autonomous agents that can manage and interact with your Neon databases programmatically. Build with our terse JavaScript client or the Neon API.

<DetailIconCards>

<a href="https://neon.com/use-cases/ai-agents" description="Read about Neon as a solution for agents that need backends." icon="openai">Neon for AI agent platforms</a>

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
