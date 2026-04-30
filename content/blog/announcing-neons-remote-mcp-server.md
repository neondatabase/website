---
title: Announcing Neon’s Remote MCP Server
description: 'Bringing MCP Servers to the cloud: Powering AI workflows with Neon'
excerpt: >-
  At Neon, we like to be on top of things, especially when it comes to AI. We
  first announced our MCP server back on December 3rd, 2024. That was a long
  time before MCP really took off, and we’ve been iterating on our MCP server’s
  capabilities ever since. You can read more about ou...
date: '2025-04-04T13:08:34'
updatedOn: '2025-05-01T00:15:55'
category: ai
categories:
  - ai
authors:
  - david-gomes
  - shridhar-deshmukh
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-neons-remote-mcp-server/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Announcing Neon’s Remote MCP Server - Neon
  description: Bringing MCP Servers to the cloud
  keywords: []
  noindex: false
  ogTitle: Announcing Neon’s Remote MCP Server - Neon
  ogDescription: Bringing MCP Servers to the cloud
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-neons-remote-mcp-server/social.jpg
source:
  wpId: 9062
  wpSlug: announcing-neons-remote-mcp-server
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/announcing-neons-remote-mcp-server/neon-remote-mcp-server-cover-v2-1024x576-93231306.jpg)

At Neon, we like to be on top of things, especially when it comes to AI. We first announced our MCP server [back on December 3rd, 2024](https://neon.tech/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here). That was a long time before MCP really took off, and we’ve been iterating on our MCP server’s capabilities ever since. You can read more about our MCP server [in our docs](https://neon.tech/docs/ai/neon-mcp-server).

As such, we’ve been closely following the [Model Context Protocol specification](https://spec.modelcontextprotocol.io/specification/2025-03-26/) and waiting anxiously for the protocol to be ready for **remote hosting.** Today, we’re pleased to announce that we’ve got a hosted version of our MCP server ready for our users to use.

A remote MCP Server greatly simplifies setting it up through any client such as Cursor or Windsurf, without having to create API keys in our service. Furthermore, as we add new features to our MCP server, our users will automatically get them without having to upgrade their local setup.

![Workflow diagram of Neon's hosted MCP server](https://cdn.neonapi.io/public/images/pages/blog/announcing-neons-remote-mcp-server/neon-hosted-mcp-server-1024x640-e091dcf3.jpg)

## How to use Neon’s remote MCP Server

Because the MCP specification for OAuth is still very new, we’re launching this under a preview state. It’s likely that we have to make some changes to the setup and things might break in unexpected ways during the first few weeks. Nevertheless, the following instructions should be simple to **try today**.

1. Go to your MCP Client’s settings and register a new MCP Server
2. As an example, if you’re using Cursor, add the following to the “MCP Servers” configuration in the “Cursor Settings”:

```bash
"Neon": {
  "command": "npx",
  "args": ["-y", "mcp-remote", "https://mcp.neon.tech/sse"]
}
```

That’s it, our hosted MCP Server is running at [https://mcp.neon.tech](https://mcp.neon.tech).

Here’s a video of everything from start to finish using Windsurf:

<video playsInline controls width="1740" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/announcing-neons-remote-mcp-server/neon-hosted-mcp-server-3572c23e.mp4" />
</video>

<br />If you’re looking for instructions for different clients, here they are:

- [Claude Desktop](https://neon.tech/guides/neon-mcp-server)
- [Cursor](https://neon.tech/guides/cursor-mcp-neon)
- [Cline](https://neon.tech/guides/cline-mcp-neon)
- [Windsurf](https://neon.tech/guides/windsurf-mcp-neon)

Note that these instructions might still refer to the self-managed version of our MCP Server, but in time they will all be updated to have both methods.

## How is it built?

Well, everything is open-source of course. Soon, we’ll be writing more about how we implemented this. For now, you can refer to the source code that’s [available on GitHub here](https://github.com/neondatabase/mcp-server-neon). The pull request with the bulk of the work can be [found here](https://github.com/neondatabase-labs/mcp-server-neon/pull/36). Notice that for now, we’re using the [geelen/mcp-remote](https://github.com/geelen/mcp-remote) Node package to make this all work (this will almost definitely change in the near future).

The MCP Server communicates with clients via SSE (Server-sent events), and it can be deployed on many different cloud providers.

## What’s next?

Our remote MCP Server is just the beginning. As the MCP specification evolves, we’re committed to refining and expanding our offering to provide a reliable experience for developers. By bringing MCP to the cloud, we’re making AI workflows more accessible, scalable, and future-proof. We can’t wait to see what you build with it. Try it out today, and let us know your feedback on [Discord](https://discord.com/invite/92vNTzKDGp)—we’re listening.
