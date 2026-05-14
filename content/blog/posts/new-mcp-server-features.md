---
title: What’s New With MCP at Neon
description: A round-up of recent features
excerpt: >-
  The Neon MCP Server implements the specification introduced by Anthropic to
  expose a set of commands that wrap the Neon API (but also add some new
  workflows not exposed in the API). This gives AI agents an easy way to perform
  tasks like provisioning databases, inspecting query pl...
date: '2025-07-03T15:49:23'
updatedOn: '2025-08-19T18:15:52'
category: ai
categories:
  - ai
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/new-mcp-server-features/cover.jpg
  alt: null
isFeatured: false
seo:
  title: What’s New With MCP at Neon - Neon
  description: >-
    We’ve been quietly shipping improvements to our MCP server, making the
    server faster, more flexible, and easier to use.
  keywords: []
  noindex: false
  ogTitle: What’s New With MCP at Neon - Neon
  ogDescription: >-
    We’ve been quietly shipping improvements to our MCP server, making the
    server faster, more flexible, and easier to use.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/new-mcp-server-features/social.png
---

The [Neon MCP Server](https://neon.com/docs/ai/neon-mcp-server) implements the [specification introduced by Anthropic](https://github.com/anthropics/mcp) to expose a set of commands that wrap the Neon API (but also add some new workflows not exposed in the API). This gives AI agents an easy way to perform [tasks](https://neon.com/docs/ai/neon-mcp-server#supported-actions-tools) like provisioning databases, inspecting query plans, or managing projects.

If you haven’t used it before, the Neon MCP Server is available as both a [remote server](https://neon.com/docs/ai/neon-mcp-server#remote-hosted-server-preview) and a [local version](https://neon.com/docs/ai/neon-mcp-server#local-mcp-server) you can run on your machine or inside a tool. Since our initial launch way back in December 2024, we’ve been quietly shipping improvements, making the server faster, more flexible, and easier to use.

<YoutubeIframe embedId="grJKCH6i3Q8" isDocPost={false} />

## The Neon MCP Server: Recent Improvements

### Reference catalog

We launched a reference page for the Neon MCP Server at [mcp.neon.tech](https://mcp.neon.tech), so you can get a clear overview of what the MCP Server can do. It includes a reference catalog of every supported action and what each command returns.

<figure>
<video autoPlay muted loop width="2354" height="1802">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/new-mcp-server-features/neon-mcp-74e7ad95.mov" />
</video>
<figcaption>Check it out at https://mcp.neon.tech/</figcaption>
</figure>

### One-click install in Cursor

We built a one-click “Add to Cursor” button for our [docs](https://neon.com/docs/ai/connect-mcp-clients-to-neon#cursor) and [GitHub repo](https://github.com/neondatabase-labs/mcp-server-neon). Once installed, Cursor will route your commands through the Neon MCP Server, giving you a real-time interface to your database from the same place you write code. If you’re building workflows inside Cursor, this is the fastest way to connect.

![Image](https://cdn.neonapi.io/public/images/pages/blog/new-mcp-server-features/screenshot-2025-07-02-at-63954percente2percent80percentafpm-8c007fd0.png)

### Cursor can now connect to Neon without mcp-remote

The latest Cursor versions have native support for connecting directly to remote MCP servers over SSE, including Neon’s hosted MCP at `mcp.neon.tech`. This means you no longer need to install or run the `mcp-remote` bridge – Cursor now speaks the protocol directly. Great news.

### API key authentication

We also added [support for Neon API keys](https://neon.com/docs/ai/neon-mcp-server#api-key-based-authentication) in the remote MCP server. This makes it easier to connect agents, scripts, and CI jobs without needing OAuth – just use your personal or organization-level API key to authenticate.

```json
{
  "mcpServers": {
    "Neon": {
      "url": "https://mcp.neon.tech/mcp",
      "headers": {
        "Authorization": "Bearer <$NEON_API_KEY>"
      }
    }
  }
}
```

### Streamable HTTP support

In addition to Server-Sent Events (SSE), the Neon MCP Server now supports [streamable HTTP.](https://neon.com/docs/ai/neon-mcp-server#streamable-http-support) This makes it easier to consume streamed responses in environments where SSE doesn’t work well.

If you’re using the hosted MCP Server, you’ll automatically get support for HTTP streaming with no changes needed, but you have to point to `mcp.neon.tech/mcp` instead of `mcp.neon.tech/sse`. Just make sure your client can handle streamed responses.

```
{
  "mcpServers": {
    "Neon": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/mcp"]
    }
  }
}
```

### New actions for performance and visibility

We keep adding actions to the list, inspired by the requirements of our partners. The latest round of actions helps teams inspect resources, diagnose slow queries, and tune performance.

- **list_branch_computes:** you can use this action to inspect the compute resources attached to your database branches. `list_branch_computes` returns details like compute size, autoscaling settings, and status.
- **list_slow_queries:** this surfaces the slowest queries in your database, to help agents or humans spot performance bottlenecks quickly.
- **explain_sql_statement:** get a full execution plan for any query
- **prepare_query_tuning:** receive optimization suggestions (e.g. index changes)
- **complete_query_tuning:** apply or discard them based on your tests

### Quality-of-life improvements

In addition to the new actions, we’ve shipped a few smaller updates that improve how the MCP Server works behind the scenes

- **Smarter `list_projects`.** We’ve made `list_projects` more usable by adding a default limit of 10 projects and including helpful hints in the response. You’ll get cleaner output, especially when working in organizations with many active projects.
- **More informative auth dialogs**. When an agent or tool initiates authentication via the remote MCP Server, you’ll now see a clear dialog showing the client’s name, website, and redirect URIs before approving access. Your approvals are saved for future use, so you only have to approve once per tool.
- **Organization details in project actions.** The `list_projects` and `create_project` actions now return Neon organization details alongside project metadata, making it easier to manage multi-org setups and route requests appropriately.

## Try it out

The Neon MCP Server is ready for agents, tools, and humans alike. [Set it up](https://neon.com/docs/ai/neon-mcp-server#setup-options) if you haven’t already and share what you’re building by [mentioning us on X.](https://x.com/neondatabase)
