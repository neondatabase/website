---
title: Set up your AI agent for Neon
subtitle: Connect Neon to your coding agent or chat app
summary: >-
  Set up Neon in an AI coding agent (Claude Code, Cursor, Codex, VS Code with
  GitHub Copilot, and more) or a chat app (ChatGPT, Claude.ai, Grok Bot). Copy
  the Set up agent prompt so your agent installs the Neon CLI and the Neon
  plugin (agent skills plus the Neon MCP Server), or run `npx neon@latest init` in
  your project. Per-agent pages cover chat apps, manual installs, and MCP-only
  setup.
redirectFrom:
  - /docs/ai/ai-agents-tools
  - /docs/get-started/with-an-agent
---

<AgentPrompt title="Set up with your agent" src="/prompts/agent-setup-landing.md" buttonText="Copy prompt" />

That's all most coding agents need: your agent installs the Neon CLI, signs you in, and installs the Neon plugin. Restart it afterward. Prefer a terminal? Run [`npx neon@latest init`](/docs/cli/init) instead.

## Set up a specific agent

Use these pages to connect a chat app like ChatGPT or Claude.ai, to run the install yourself, or for MCP-only and API key setup.

<TechCards>

<a href="/docs/ai/agent-setup/claude-code" title="Claude Code" description="Neon plugin" icon="claude-code"></a>

<a href="/docs/ai/agent-setup/cursor" title="Cursor" description="Neon plugin" icon="cursor"></a>

<a href="/docs/ai/agent-setup/codex" title="Codex" description="Neon plugin" icon="codex"></a>

<a href="/docs/ai/agent-setup/vscode" title="VS Code and GitHub Copilot" description="Neon plugin and Copilot custom agents" icon="copilot"></a>

<a href="/docs/ai/agent-setup/chatgpt" title="ChatGPT" description="Neon plugin" icon="chatgpt"></a>

<a href="/docs/ai/agent-setup/claude-ai" title="Claude.ai and Claude Desktop" description="Official Neon connector" icon="claude-code"></a>

<a href="/docs/ai/agent-setup/grok-bot" title="Grok Bot" description="Neon plugin" icon="grok-bot"></a>

<a href="/docs/ai/connect-mcp-clients-to-neon" title="Other agents" description="Windsurf, Cline, Zed, Gemini CLI, and more" icon="mcp"></a>

</TechCards>

## What gets installed

<NeonPluginContents/>

## Building agents on Neon?

<DetailIconCards>

<a href="/docs/introduction/agent-plan" description="A pricing tier for platforms that provision databases for their users" icon="wallet">Agent plan</a>

<a href="/docs/guides/ai-agent-integration" description="Provision per-tenant databases and versions with the Neon API" icon="puzzle">AI agent integration</a>

<a href="/docs/ai/ai-database-versioning" description="Snapshot APIs for codegen and agent platforms" icon="branching">Database versioning</a>

<a href="/docs/reference/claimable-neon" description="Provision a project now; your user claims it later" icon="handshake">Claimable Neon</a>

</DetailIconCards>

<NeedHelp/>
