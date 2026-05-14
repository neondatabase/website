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
date: "2025-09-11T23:00:12"
updatedOn: "2025-09-16T18:29:08"
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
---

OpenAI just launched support for MCP servers in ChatGPT, letting you connect external tools – including Neon! Via [Neon’s MCP server](https://neon.com/docs/ai/neon-mcp-server), you can bring your Postgres projects into ChatGPT and ask questions about resource usage, database activity, branches, and more.

<YoutubeIframe embedId="j44qwpStk7g" isDocPost={false} />

<div className="admonition not-prose my-9 rounded-none border-l-2 bg-gray-new-98 py-4 pr-5 pl-[1.125rem] dark:bg-gray-new-8 border-[#E2301D] dark:border-[#FF5645] [&_pre]:px-4 [&_pre]:py-3 [&_pre_code]:text-sm! [&_pre[data-language]]:bg-white! [&_pre[data-language]]:dark:bg-gray-new-8!">
  <div className="flex items-center gap-1 text-[#E2301D] dark:text-[#FF5645]">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" className="shrink-0">
      <path fill="currentColor" d="M8.005 11.999a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667"></path>
      <path stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1.333" d="M8 8.667V6M6.782 2.707l-5.266 9.188A1.405 1.405 0 0 0 2.736 14h10.532a1.405 1.405 0 0 0 1.22-2.105L9.22 2.707a1.405 1.405 0 0 0-2.439 0Z"></path>
    </svg>
    <h4 className="font-mono text-[13px] leading-none font-medium -tracking-snug uppercase">Neon MCP Server Security Considerations</h4>
  </div>
  <div className="admonition-text mt-2.5 text-base leading-normal tracking-extra-tight text-gray-new-20 dark:text-gray-new-85 [&_a]:rounded-sm [&_li]:text-base [&_li]:leading-snug [&_li]:tracking-extra-tight [&_ul]:my-0 [&_ol]:my-0">The Neon MCP Server is intended for local development and IDE integrations only. <strong>We do not recommend using the Neon MCP Server in production environments.</strong> It can execute powerful operations that may lead to accidental or unauthorized changes.<br />For more information, see <a href="https://neon.com/docs/ai/neon-mcp-server#mcp-security-guidance">MCP security guidance →</a>.</div>
</div>

## ChatGPT Now Supports MCP Servers

[MCP (Model Context Protocol)](https://modelcontextprotocol.io/docs/getting-started/intro) is the open standard that allows AI editors and assistants (including now ChatGPT) to talk directly to external services. Instead of writing custom connectors for every integration, you can connect any service that runs an MCP server and use it from within ChatGPT:

<EmbedTweet url="https://twitter.com/OpenAIDevs/status/1965807401745207708?ref_src=twsrc%5Etfw" />

## You Can Manage Neon Databases Directly from ChatGPT

> This turns ChatGPT into a command center for your infrastructure and apps. Once you enable Developer Mode and add an MCP connector, ChatGPT can call the tools that the MCP server exposes, whether that’s searching data, fetching insights, or managing resources.

With Neon’s MCP server, you can bring your Postgres databases into ChatGPT and interact with them in real time. Once connected, ChatGPT can call Neon’s API through the MCP server, giving you a simple way to do things like

- List your Neon projects without leaving the chat
- Inspect activity and usage, such as compute hours or branch performance
- Explore branches and monitor workloads
- Query project details or get quick insights on what’s running

### How to Set It Up

<YoutubeIframe embedId="LktfnIpTnEg" isDocPost={false} />

Setting it up is super easy: 

<ol>
  <li><strong>Copy the MCP URL</strong>. Go to <a href="https://mcp.neon.tech">mcp.neon.tech</a> and copy the server URL.</li>
  <li><strong>Add a connector in ChatGPT</strong>. In ChatGPT, open <strong>Settings → Connectors → Create</strong>, give it a name (e.g. Neon Postgres), and paste in the MCP server URL.</li>
  <li><strong>Use OAuth for authentication</strong>. Select OAuth, click I trust this application, and then complete the email verification step.</li>
  <li><strong>Approve access in Neon</strong>. You’ll be redirected to Neon to approve the request. Click Approve and then Authorize.</li>
  <li><strong>Confirm in ChatGPT</strong>. Once approved, ChatGPT will show a success screen. You’ll now see Neon’s MCP tools (list projects, create branches, etc.) available in Developer Mode.</li>
  <li><strong>Start chatting. </strong>From there, you can start asking ChatGPT about your Neon projects.</li>
</ol>

## Try It Out

Go try it! If you don’t have a Neon free account, you can create it [here](https://console.neon.tech/signup). If you have any questions, you’ll find us in Discord. Share your good prompts with us! 
