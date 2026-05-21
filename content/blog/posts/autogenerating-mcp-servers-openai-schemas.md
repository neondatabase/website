---
title: 'Auto-generating MCP Servers from OpenAPI Schemas: Yay or Nay?'
description: 'OpenAPI to MCP: Shortcut or Short-Sighted?'
excerpt: >-
  Should we be generating Model Context Protocol (MCP) servers directly from
  existing API specs? MCP is designed to let AI agents like those in Claude,
  Cursor, and Windsurf interact with tools and APIs. So, can we just treat our
  existing REST APIs as the interface for LLMs and enti...
date: '2025-05-01T19:07:18'
updatedOn: '2025-10-17T17:03:50'
category: engineering
categories:
  - engineering
  - ai
authors:
  - david-gomes
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/autogenerating-mcp-servers-openai-schemas/cover.jpg
  alt: null
isFeatured: true
seo:
  title: 'Auto-generating MCP Servers from OpenAPI Schemas: Yay or Nay? - Neon'
  description: >-
    Should we be generating Model Context Protocol (MCP) servers directly from
    existing API specs? Here's our experience.
  keywords: []
  noindex: false
  ogTitle: 'Auto-generating MCP Servers from OpenAPI Schemas: Yay or Nay? - Neon'
  ogDescription: >-
    Should we be generating Model Context Protocol (MCP) servers directly from
    existing API specs? Here's our experience.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/autogenerating-mcp-servers-openai-schemas/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/autogenerating-mcp-servers-openai-schemas/neon-mcp-1-1024x576-a199dba0.jpg)

Should we be generating Model Context Protocol (MCP) servers directly from existing API specs? MCP is designed to let AI agents like those in Claude, Cursor, and Windsurf interact with tools and APIs. So, can we just treat our existing REST APIs as the interface for LLMs and entirely codegen an MCP server?

## Generating MCP from REST

The idea is certainly appealing. You’ve already invested time in building and documenting your REST API with an OpenAPI schema, why not transform that into an MCP server?

The thinking goes: if you create a 1-to-1 mapping, surely the MCP server will be comprehensive? Several projects have come out to help bridge the gap between APIs and LLMs. Tools like _openapisearch,_ for instance, allow agents to explore and understand existing APIs based on their OpenAPI specs. You could ask, “How do I create a repository using the GitHub API?”, and it would first find out which OpenAPI identifier it needs, get a summary of it in simple natural language, then find and return the appropriate endpoint allowing you to sift through the entire API using conversational queries.

There are also services like Tadata which offer a more direct approach, and discover all FastAPI endpoints then expose them automatically as MCP tools.

## The Pitfalls

<EmbedTweet url="https://twitter.com/zeeg/status/1913289979368796671?ref_src=twsrc%5Etfw" />

Cramer’s core argument hits on several fundamental mismatches.

First, LLMs struggle when faced with a large amount of choices, which is quite common when the typical enterprise REST API might expose dozens or hundreds of distinct operations via its OpenAPI spec. The GitHub API, for example, contains over 600! Simply dumping all of these into an MCP server as individual tools creates an overwhelming decision space for the LLM.

Even with a small set of _slightly_ similar tools, models often fail to select the right one without very specific instructions. At best, this is a very frustrating user experience where the MCP calls continuously fail or don’t work as expected. At worst, this can be potentially catastrophic. When you’re dealing with critical infrastructure like a database, getting the wrong tool call is no longer just an inconvenience.

Next, there’s the structure of the interaction itself. LLMs aren’t particularly great at navigating complex JSON payloads or figuring out which combination of optional parameters in an API call (like a generic _create_resource_ endpoint) is appropriate for a given task. It’s not interpretable for an LLM trying to understand the outcome and decide the next step, because it was never meant to be. You’re essentially asking the LLM to deal with formats and ambiguity it’s not well-suited for.

Finally, and perhaps most importantly, there’s a fundamental mismatch in the goal of a REST API and an MCP Server. REST API’s are typically built around resource-centric, low-level operations: create a user, fetch a record, update a field. MCP Servers operate on the level of tasks and workflows: “Onboard this new customer,” “Migrate the database schema,” “Summarize recent activity”. Simply mapping every granular API endpoint to an MCP tool forces the LLM to act like a traditional programmatic client, and this isn’t leveraging the LLM’s strengths.

Effective MCP design means thinking about the _workflows_ you want the agent to perform and potentially creating higher-level tools that encapsulate multiple API calls, rather than just exposing the raw building blocks of your entire API spec.

## A Hybrid Approach

So, if a direct 1:1 approach is problematic, does that mean we ditch the idea entirely and resign ourselves to writing every MCP server tool from scratch?

Probably not. Manually making every tool definition, input/output schema, and handler function, especially when you already have a well-defined API, is probably a huge time sink. This is where a more hybrid approach comes into play, where the codegen is not the final product, but the starting point.

I’d recommend looking at the tools for generating an MCP server from OpenAPI specs, then begin aggressively pruning and removing the vast majority of the generated tools, keeping only low-level operations that represent genuinely useful, distinct capabilities that an LLM might perform. Then, rewrite the descriptions of the remaining tools such that instead of just stating _what_ the tool does (like mirroring an API endpoint summary), focus on _when_ and _why_ an LLM should use it. Provide clear examples, outline expected workflows, and give guidance on how to handle common scenarios or parameters.

Finally, and most importantly, create new higher level tools that abstract away common multi-step workflows, calling several underlying API endpoints under the hood. (Be careful about making your MCP server stateful though!)

## Wrapping Up

For [our MCP server](https://github.com/neondatabase-labs/mcp-server-neon), we decided to use our [TypeScript API SDK](https://www.npmjs.com/package/@neondatabase/api-client) in order to make it really easy to replicate a lot of our API endpoints. However, we implemented only tools that we believe make sense for LLMs to use via Cursor/Windsurf, and then we built higher-level workflows that join together multiple endpoints to complete tasks. In fact, one of these higher-level workflows (running and testing database migrations in a streamlined, opinionated manner), was [the highlight of the release of our MCP Server back in December 2024](https://neon.tech/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here).

Finally, our MCP server is open-source and we continue to make lots of improvements to it. If you want to get involved, [check it out on GitHub](https://github.com/neondatabase-labs/mcp-server-neon)!
