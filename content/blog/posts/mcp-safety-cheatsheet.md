---
title: MCP Safety Cheatsheet
description: With great power comes great responsibility
excerpt: >-
  MCPs are powerful abstractions, but that power also means risk. A
  misconfigured or overly permissive MCP server can expose sensitive data,
  execute unintended actions, and simply ruin your day. We maintain an MCP
  server at Neon, but we want you to use it safely. Here’s a quick che...
date: '2025-11-19T19:44:35'
updatedOn: '2025-11-19T19:44:37'
category: ai
categories:
  - ai
authors:
  - ryan-vogel
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/mcp-safety-cheatsheet/cover.jpg
  alt: null
isFeatured: false
seo:
  title: MCP Safety Cheatsheet - Neon
  description: >-
    A quick cheatsheet on using MCP servers safely, covering data protection,
    tool limits, read-only mode, and safe AI workflows.
  keywords: []
  noindex: false
  ogTitle: MCP Safety Cheatsheet - Neon
  ogDescription: >-
    A quick cheatsheet on using MCP servers safely, covering data protection,
    tool limits, read-only mode, and safe AI workflows.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/mcp-safety-cheatsheet/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/mcp-safety-cheatsheet/neon-mcp-1-1-1024x576-16882717.jpg)

MCPs are powerful abstractions, but that power also means risk. A misconfigured or overly permissive MCP server can expose sensitive data, execute unintended actions, and simply ruin your day.

We maintain an [MCP server](https://mcp.neon.tech/) at Neon, but we want you to use it safely. Here’s a quick checksheet with advice we’ve gathered from experience:

## Keep MCP in dev only

MCP servers are much safer living in development environments and your IDE, not in an environment where they have access to things like a production database. In Neon, the best workflow is to connect the MCP server to a [development branch](https://neon.com/branching/branch-per-developer).

## Work with anonymized or sample data

Don’t connect your MCP server to a database that contains sensitive user data. This is will be already covered if you’re following the previous rule (staying in dev). In Neon, if you want to connect your agent or IDE to realistic datasets, you can use an [anonymized dev branch](https://neon.com/blog/branching-environments-anonymized-pii).

## Limit what tools are exposed

Every MCP server exposes a set of tools that define what it can do, from reading schemas to creating or dropping tables. You don’t need to expose all of them: you can keep your configuration minimal for what you’re trying to achieve. The fewer write-capable tools your MCP server exposes, the smaller your risk surface, and the less you’ll need to worry about an AI doing something it shouldn’t.

## Use read-only mode

It’s much safer if instead of making sure you’re not giving to much power to your MCP by hand, you have the option to use a pre-packaged read-only mode version. **We recently shipped this for the** [Neon MCP server](https://github.com/neondatabase/mcp-server-neon):

<figure>
<a href="https://mcp.neon.tech/">
<img src="https://cdn.neonapi.io/public/images/pages/blog/mcp-safety-cheatsheet/image-23-1024x241-a9e38dad.png" alt="Image" />
</a>
<figcaption>https://mcp.neon.tech/</figcaption>
</figure>

When the read-only mode is enabled, the server will only expose safe, non-destructive commands. Even if an LLM / IDE attempts to run a destructive operation, e.g.`CREATE TABLE`, `ALTER`, `UPDATE`, or `DELETE`, it will fail with a read-only transaction error.

## Supervise what the MCP does

Even with good configuration, your MCPs will execute real operations, they’re not simulations. Human reviews are important. When the AI suggests changes before implementing them, make sure it’s something you want. In Neon’s MCP server, every database operation is visible before it runs, giving you the opportunity to inspect and approve the SQL or action first. Don’t let the AI apply changes automatically.

## Protect your credentials

MCP configurations will include API keys / tokens. Treat them like any production secret: store them securely, rotate them regularly, never commit them to repos. If multiple people use MCP, give each their own key with the minimum permissions required.

## Monitor and audit usage

Lastly, remember to keep track of how your MCP server is being used: which tools are called, what queries are executed, which branches they touch. This visibility will help you spot issues before they escalate, e.g. if an agent repeatedly querying the wrong database. In Neon, most of this can be monitored directly through the project activity logs and branch history in the console, but if you’re running your MCP server locally, keep your own logs as well.

## Wrap up

MCPs make it possible to bridge the gap between natural language and real infra, but they should be used with the right guardrails.

**If you’re exploring ways to let your IDE or agent spin up and manage a real Postgres database, check out [Neon](https://neon.tech) and the** [Neon MCP Server](https://neon.com/docs/ai/neon-mcp-server)** – it’s the easiest way to give your tools a serverless Postgres backend.**
