---
title: Neon’s MCP Server is Here
description: >-
  We've shipped a Model Context Protocol server which allows any LLM to easily
  interact with Neon
excerpt: >-
  Anthropic recently introduced an open protocol to enable LLMs to more easily
  integrate with external data sources and tools. Model Context Protocol can
  thus be used to expose all kinds of products and services to LLMs and agents
  alike. We’re excited to announce that we’ve already...
date: "2024-12-03T16:06:15"
updatedOn: "2025-03-06T21:15:02"
category: product
categories:
  - product
authors:
  - david-gomes
  - pedro-figueiredo
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Neon's MCP Server is Here - Neon
  description: >-
    We've built an MCP Server for Neon, meaning that LLMs can easily communicate
    with Neon’s API to manage your databases for you.
  keywords: []
  noindex: false
  ogTitle: Neon's MCP Server is Here - Neon
  ogDescription: >-
    We've built an MCP Server for Neon, meaning that LLMs can easily communicate
    with Neon’s API to manage your databases for you.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here/neon-claude-1024x576-090fa20f.jpg)

<br />Anthropic recently introduced an open protocol to enable LLMs to more easily integrate with external data sources and tools. [Model Context Protocol](https://modelcontextprotocol.io/introduction) can thus be used to expose all kinds of products and services to LLMs and agents alike.

We’re excited to announce that we’ve already created a [MCP server for Neon’s platform](https://github.com/neondatabase/mcp-server-neon). It’s open source, and available today!

[https://github.com/neondatabase/mcp-server-neon](https://github.com/neondatabase/mcp-server-neon)

## See it in action: Claude can run (and test) migrations via the Neon API

Using Claude’s Desktop application, we can now interact with Neon’s platform using AI. At its core, this means that Claude can easily communicate with Neon’s API. For example, on the image below, we asked Claude to perform a database migration on a Neon project for us.

![Image](https://cdn.neonapi.io/public/images/pages/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here/ad4nxfq9wbgjl8ff4qoo0pzutmouegz07db1nwtulmrlybh5ima1tncqhbchlwpcexkqyv2gm8m8hrsvnixpnro5wlgtbf5ulgurlqktawaomczouq7ezep5jxm0-altxdvk5rrsf0zq-ba3638aa.png)

Claude figured out the migration SQL code to write, and it also leveraged Neon’s [instant copy-on-write branching feature](https://neon.tech/docs/introduction/branching) to perform the migration safety by applying it first in a temporary branch (that got deleted in the end).

Here’s a clip showcasing the entire experience:

<figure>
<video autoPlay controls width="960" height="1080" src="https://cdn.neonapi.io/public/videos/pages/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here/cleanshot-2024-12-03-at-151319-6ed5c6c7.mp4"></video>
</figure>

## Available actions (so far)

As part of this initial release, we’re exposing the following actions via MCP:

- list_projects
- describe_project
- create_project
- delete_project
- create_branch
- delete_branch
- describe_branch
- run_sql
- run_sql_transaction
- get_database_tables
- describe_table_schema
- start_database_migration
- commit_database_migration

These _mostly_ map to [Neon API](https://neon.tech/docs/reference/api-reference) endpoints. However, certain tools such as the database migration related ones are tailored specifically for the usage we expect from AI agents and LLMs. As we showed above, these help the model by running the expected SQL on a side branch first and _then_ hinting the agent to test the migration and commit it as it sees fit.

## Try it

We put this project together very quickly following the announcement from Anthropic, so we know there’s a lot to improve. You can check out [our GitHub repository](https://github.com/neondatabase/mcp-server-neon), and give us any feedback on [our Discord server](https://neon.tech/discord)!
