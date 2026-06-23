---
title: Neon API
summary: >-
  Use the Neon REST API to create and manage projects, branches, databases,
  roles, compute endpoints, API keys, and other Neon resources
  programmatically. Learn how to create an API key, authenticate requests,
  make your first API call, browse all endpoints, and handle common API
  patterns such as pagination, rate limits, and asynchronous operations.
enableTableOfContents: true
redirectFrom:
  - /docs/reference
  - /docs/reference/api-reference
  - /docs/reference/about
  - /docs/api/about
---

<CopyPrompt src="/prompts/neon-api-prompt.md" title="AI prompt: Get started with the Neon API" description="Copy into your AI assistant to get an API key and make your first API call."/>

The Neon API lets you manage Neon programmatically. You can create and manage projects, branches, databases, roles, compute endpoints, API keys, and more. Everything you can do in the Neon Console, you can do with the API.

## Make your first API request

Create an API key in the Neon Console under **Account settings** > **API keys**. Then set it as `NEON_API_KEY` and call the `/projects` endpoint:

```bash
export NEON_API_KEY="your-api-key-here"

curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" | jq
```

All API requests use `https://console.neon.tech/api/v2/` as the base URL and authenticate with `Authorization: Bearer $NEON_API_KEY`. For API key types, response examples, and next steps, see [Get started with the Neon API](/docs/reference/api/get-started).

## Search and browse all endpoints

Use the endpoint index to search every generated API operation, or browse by resource below.

<ApiResourceGrid />

## Related interfaces

If you don't need to call the REST API directly, use one of these interfaces instead.

<DetailIconCards>

<a href="/docs/cli" description="Use neonctl for terminal, CI/CD, and agent workflows." icon="cli">CLI</a>

<a href="/docs/reference/sdk" description="Use official SDKs for app development or Neon API automation." icon="neon">SDKs</a>

<a href="/docs/ai/connect-mcp-clients-to-neon" description="Connect AI assistants to Neon with MCP." icon="sparkle">MCP server</a>

</DetailIconCards>

## Learn more

<DetailIconCards>

<a href="/docs/reference/api/get-started" description="Create an API key, authenticate requests, and list your projects with curl." icon="code">Get started</a>

<a href="/docs/reference/api/key-concepts" description="Understand asynchronous operations, rate limits, pagination, and important constraints." icon="research">Key concepts</a>

<a href="https://neon.com/api_spec/release/v2.json" description="Download the OpenAPI 3.0 specification for code generation and tooling." icon="download">OpenAPI spec</a>

</DetailIconCards>
