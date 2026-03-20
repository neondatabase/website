---
title: Manage Neon Databases from ChatGPT
description: >-
  Connect Neon’s MCP server to ChatGPT and query, monitor, and manage projects
  straight from your chat window
excerpt: >-
  OpenAI just launched support for MCP servers in ChatGPT, letting you connect
  external tools – including Neon! Via Neon’s MCP server, you can bring your
  Postgres projects into ChatGPT and ask questions about resource usage,
  database activity, branches, and more. ChatGPT Now Suppor...
date: '2025-09-11T23:00:12'
updatedOn: '2025-09-16T18:29:08'
category: product
categories:
  - product
  - ai
authors:
  - ryan-vogel
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/manage-neon-databases-from-chatgpt/cover.png
  alt: null
isFeatured: false
seo:
  title: Manage Neon Databases from ChatGPT - Neon
  description: >-
    Via Neon’s MCP server, you can bring your Neon projects into ChatGPT. Ask
    questions about usage, database activity, and branches.
  keywords: []
  noindex: false
  ogTitle: Manage Neon Databases from ChatGPT - Neon
  ogDescription: >-
    Via Neon’s MCP server, you can bring your Neon projects into ChatGPT. Ask
    questions about usage, database activity, and branches.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/manage-neon-databases-from-chatgpt/cover.png
source:
  wpId: 10884
  wpSlug: manage-neon-databases-from-chatgpt
  exportedAt: '2026-03-20T13:31:00.745Z'
---

OpenAI just launched support for MCP servers in ChatGPT, letting you connect external tools – including Neon! Via [Neon’s MCP server](https://neon.com/docs/ai/neon-mcp-server), you can bring your Postgres projects into ChatGPT and ask questions about resource usage, database activity, branches, and more.

<YoutubeIframe embedId="j44qwpStk7g" isDocPost={false} />

<Admonition type="warning" title="Neon MCP Server Security Considerations">
The Neon MCP Server is intended for local development and IDE integrations only. **We do not recommend using the Neon MCP Server in production environments.** It can execute powerful operations that may lead to accidental or unauthorized changes.<br />For more information, see [MCP security guidance →](https://neon.com/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## ChatGPT Now Supports MCP Servers

[MCP (Model Context Protocol)](https://modelcontextprotocol.io/docs/getting-started/intro) is the open standard that allows AI editors and assistants (including now ChatGPT) to talk directly to external services. Instead of writing custom connectors for every integration, you can connect any service that runs an MCP server and use it from within ChatGPT:

<EmbedTweet url="https://twitter.com/OpenAIDevs/status/1965807401745207708?ref_src=twsrc%5Etfw" text="We’ve (finally) added full support for MCP tools in ChatGPT. In developer mode, developers can create connectors and use them in chat for write actions (not just search/fetch). Update Jira tickets, trigger Zapier workflows, or combine connectors for complex automations. pic.twitter.com/1W0rTGGEnu — OpenAI Developers (@OpenAIDevs) September 10, 2025" />

## You Can Manage Neon Databases Directly from ChatGPT

> >

This turns ChatGPT into a command center for your infrastructure and apps. Once you enable Developer Mode and add an MCP connector, ChatGPT can call the tools that the MCP server exposes, whether that’s searching data, fetching insights, or managing resources.

With Neon’s MCP server, you can bring your Postgres databases into ChatGPT and interact with them in real time. Once connected, ChatGPT can call Neon’s API through the MCP server, giving you a simple way to do things like

- List your Neon projects without leaving the chat
- Inspect activity and usage, such as compute hours or branch performance
- Explore branches and monitor workloads
- Query project details or get quick insights on what’s running

### How to Set It Up

<YoutubeIframe embedId="LktfnIpTnEg" isDocPost={false} />

Setting it up is super easy:

1. **Copy the MCP URL**. Go to [mcp.neon.tech](https://mcp.neon.tech) and copy the server URL.
2. **Add a connector in ChatGPT**. In ChatGPT, open **Settings → Connectors → Create**, give it a name (e.g. Neon Postgres), and paste in the MCP server URL.
3. **Use OAuth for authentication**. Select OAuth, click I trust this application, and then complete the email verification step.
4. **Approve access in Neon**. You’ll be redirected to Neon to approve the request. Click Approve and then Authorize.
5. **Confirm in ChatGPT**. Once approved, ChatGPT will show a success screen. You’ll now see Neon’s MCP tools (list projects, create branches, etc.) available in Developer Mode.
6. **Start chatting.** From there, you can start asking ChatGPT about your Neon projects.

## Try It Out

Go try it! If you don’t have a Neon free account, you can create it [here](https://console.neon.tech/signup). If you have any questions, you’ll find us in Discord. Share your good prompts with us!
