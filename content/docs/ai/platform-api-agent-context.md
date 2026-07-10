---
title: Agent context for the Platform API
subtitle: How to give AI assistants accurate context for the Neon Platform API and @neon/sdk
summary: >-
  Guide for developers and agent builders on providing AI context for the Neon
  Platform API: Agent Skills, Markdown URLs, OpenAPI, MCP vs docs, and starter
  packs for TypeScript apps, raw REST, and agent platforms.
enableTableOfContents: true
updatedOn: '2026-07-10T09:41:23.024Z'
---

Neon docs, skills, and APIs are built for agents. This page helps you choose the right **context** (what your agent should know) and **tools** (what it can do on a live account) when building with the [Neon Platform API](/docs/reference/api).

<Admonition type="important" title="Context vs capability">
**Context** teaches an agent how the API and SDK work (docs, skills, OpenAPI). **Capability** lets it act on your Neon account from chat ([Neon MCP Server](/docs/ai/neon-mcp-server)). Use both when coding with an AI assistant; use MCP when you want natural-language operations without writing integration code.
</Admonition>

## Quick setup for coding assistants

The fastest path when you are building an app or script:

```bash
npx neon@latest init
```

This installs [Agent Skills](/docs/ai/agent-skills) and configures the [Neon MCP server](/docs/ai/neon-mcp-server). Restart your editor, then ask **"Get started with Neon"**.

For Platform API work specifically, also give your agent these Markdown URLs:

- [Neon API TypeScript SDK](/docs/reference/typescript-sdk.md) if you use `@neon/sdk`
- [Neon Platform API reference](/docs/reference/api.md) for every REST endpoint

## Choose your approach

| Goal                                    | What to provide                       | Links                                                                                                                                  |
| --------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Build a TypeScript app with `@neon/sdk` | Agent Skills + SDK docs               | [typescript-sdk.md](/docs/reference/typescript-sdk.md), [SDK README](https://github.com/neondatabase/neon-pkgs/tree/main/packages/sdk) |
| Call the REST API (any language)        | API reference Markdown + key concepts | [api.md](/docs/reference/api.md), [key-concepts.md](/docs/reference/api/key-concepts.md)                                               |
| Exact request/response schemas          | OpenAPI spec                          | [api_spec/release/v2.json](https://neon.com/api_spec/release/v2.json)                                                                  |
| Discover all API operations             | API llms index                        | [api/llms.txt](/docs/reference/api/llms.txt)                                                                                           |
| Operate Neon from chat                  | MCP (not pasted API docs)             | [Neon MCP Server](/docs/ai/neon-mcp-server)                                                                                            |
| Multi-tenant agent platform             | Agent-platforms skill                 | [neon-postgres-agent-platforms](https://skills.sh/neondatabase/neon-for-agent-platforms/neon-postgres-agent-platforms)                 |

## Starter packs

Copy these into a system prompt, rules file, or agent config.

### TypeScript app (`@neon/sdk`)

```text
Use @neon/sdk with createNeonClient for the Neon Platform API.
SDK docs: https://neon.com/docs/reference/typescript-sdk.md
REST reference: https://neon.com/docs/reference/api.md
Method tables: https://github.com/neondatabase/neon-pkgs/tree/main/packages/sdk
```

Install skills for tighter integration:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres -y
```

The `neon-postgres` skill includes compact references for the [REST API](/docs/ai/skills/neon-postgres/references/neon-rest-api.md) and [TypeScript SDK](/docs/ai/skills/neon-postgres/references/neon-typescript-sdk.md).

### Raw REST (any language)

```text
Neon Platform API base URL: https://console.neon.tech/api/v2/
Auth: Authorization: Bearer $NEON_API_KEY
API reference: https://neon.com/docs/reference/api.md
OpenAPI: https://neon.com/api_spec/release/v2.json
Key concepts (async ops, limits): https://neon.com/docs/reference/api/key-concepts.md
```

To fetch one operation only, use per-endpoint Markdown, for example:

`https://neon.com/docs/reference/api/projects/create-project.md`

### Full API catalog for RAG

1. Start with the [API operation index](/docs/reference/api/llms.txt).
2. Pull only the `.md` pages you need, or use [llms-full.txt](/docs/reference/api/llms-full.txt) for the full corpus (large).
3. See [Getting Neon docs as Markdown](/docs/community/llms-markdown-guide) for site-wide discovery via [llms.txt](/docs/llms.txt).

## Agent Skills vs Markdown URLs

| Method                                                                | Best for                                                                                       |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Agent Skills** (`npx skills add neondatabase/agent-skills`)         | Cursor, Claude Code, Codex, and other skills-compatible assistants; curated, always-on context |
| **Markdown URLs** (append `.md` or `Accept: text/markdown`)           | Custom agents, RAG pipelines, one-off prompts                                                  |
| **Copy prompt** on [API get started](/docs/reference/api/get-started) | First API key + first curl call                                                                |

Skills are the easiest default for IDE agents. Markdown URLs and OpenAPI are better when you control the agent runtime or need machine-readable schemas.

## MCP: when to use it

Use the [Neon MCP server](/docs/ai/neon-mcp-server) when you want your assistant to **create branches, run SQL, or manage projects** from chat without you writing API calls.

Use **docs and `@neon/sdk`** when you are **building an integration** in your own codebase (CI, provisioning per user, internal tools).

`npx neon@latest init` sets up both.

## Agent platforms (provision Neon per user)

If you are building a codegen tool or multi-tenant product that provisions Neon for end users, install the agent-platforms skill:

```bash
npx skills add neondatabase/neon-for-agent-platforms -s neon-postgres-agent-platforms -y
```

It documents `@neon/sdk` management patterns, snapshots, and sample scripts. See also [Database versioning](/docs/ai/ai-database-versioning) and [Neon for AI agent platforms](https://neon.com/use-cases/ai-agents).

## Related docs

- [AI tools for Agents](/docs/ai/ai-agents-tools) — MCP, plugins, and skills overview
- [Agent Skills](/docs/ai/agent-skills) — install and browse all skills
- [Get started with the Neon API](/docs/reference/api/get-started) — API keys and first request
- [Neon API TypeScript SDK](/docs/reference/typescript-sdk) — `@neon/sdk` reference
- [Getting Neon docs as Markdown](/docs/community/llms-markdown-guide) — llms.txt and `.md` URLs site-wide
