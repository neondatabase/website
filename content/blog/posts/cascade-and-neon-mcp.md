---
title: Using Windsurf Cascade and Neon MCP for Agent-Driven Database Interaction
description: Let Cascade deploy and manage your Neon databases
excerpt: >-
  Imagine an IDE that not only writes your code but also provisions, migrates,
  and queries your Postgres database. Stop imagining—this is possible today with
  Windsurf. In this blog post, we will explore how Windsurf can be integrated
  with the Neon MCP server to allow agents to inte...
date: '2025-03-24T16:50:27'
updatedOn: '2025-04-15T19:19:25'
category: community
categories:
  - community
authors:
  - akshat-agrawal
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/cascade-and-neon-mcp/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Using Windsurf Cascade and Neon MCP for Agent-Driven Database Interaction
    - Neon
  description: >-
    You can integrate Windsurf with the Neon MCP server to allow agents to
    interact directly with your database.
  keywords: []
  noindex: false
  ogTitle: >-
    Using Windsurf Cascade and Neon MCP for Agent-Driven Database Interaction
    - Neon
  ogDescription: >-
    You can integrate Windsurf with the Neon MCP server to allow agents to
    interact directly with your database.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/cascade-and-neon-mcp/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/cascade-and-neon-mcp/neon-mcp-1-1024x576-3c0aa326.jpg)

Imagine an IDE that not only writes your code but also provisions, migrates, and queries your Postgres database. Stop imagining—this is possible today with [Windsurf](https://codeium.com/windsurf).

In this blog post, we will explore how Windsurf can be integrated with the [Neon MCP server](https://neon.tech/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here) to allow agents to interact directly with your database. We’ll walk through an example where we build a simple Todo application using Next.js, Typescript, Drizzle ORM, and Neon, and then see how [Cascade](https://codeium.com/cascade) can iterate on the project, **adding features and managing migrations without writing a line of code**.

## What is MCP?

If you’ve been anywhere near the internet lately, you probably know this by now. MCP, or the Model Context Protocol, is [an open standard developed by Anthropic](https://www.anthropic.com/news/model-context-protocol) designed to help AI models integrate with and receive context from external data sources. Similar to how a USB port is a standardised way to connect with other devices, MCP is a standardised way for LLMs to connect with other services.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/cascade-and-neon-mcp/ad4nxdkxgr7wnjuuqymthmu5e5x5qqcaescnjeuxmvovebp1dpfdjqknwel1omjynswlajod9jwuucjnlc5lofpd6eyuisbfotsyxnv2fzrif9orgzyxeo-elbz6cp2f7so1v1emrz-9b2cb87a.png)

In our case today, Windsurf is set up as an _MCP client_, meaning it can send commands and interpret feedback from Neon, which acts as an _MCP server,_ allowing Windsurf to securely interact with your Postgres database.

## Setting up Neon MCP in Windsurf

The first step to manage databases from Windsurf is configuring Neon’s MCP server.

The process is simple: you’ll first need to head over to the [Neon Console](https://console.neon.tech/app/projects) and grab an API key by going to `Settings > API Keys > Create new API key`, then naming the key anything you’d like and copying it to clipboard.

Next, boot up Windsurf and open up [Cascade](https://codeium.com/cascade) by hitting `Ctrl + L`, then hit configure `MCP Server` to open up your `mcp_config.json` and add the following:

```json
  "mcpServers": {
    "neon": {
      "command": "npx",
      "args": [
"-y",
"@neondatabase/mcp-server-neon",
"start",
"<YOUR_NEON_API_KEY>"
]
    }
  }
```

If you’re more of a visual learner, follow this quick video to see how to set everything up in just 30 seconds!

![Post image](https://cdn.neonapi.io/public/images/pages/blog/cascade-and-neon-mcp/ad4nxfmguspwqnw7xlqjkpupwxj1fwlnfkzb2osumzlek-bsjnb84ihtdxtjjf6qeqauv55k-kmpveutg34lzvfx5zbagm4h9ycikdiyqnp5hakbnfq8w4tv7c4gk7mnmpjabu4ucaq-0a5547c0.gif)

Once you’ve done this, your Neon MCP server is up and running in Windsurf.

## Using the Neon MCP Server to deploy databases with Cascade

Now, it’s time to put MCP into action. Let’s build a simple Todo application to demonstrate how smoothly Cascade interacts with Neon.

Open the Cascade AI Agent in Windsurf, then prompt it to:

<blockquote>
<p>Create a todo application using Next.js, Typescript, Drizzle ORM, Tailwind, and Neon Postgres.</p>
</blockquote>

![Post image](https://cdn.neonapi.io/public/images/pages/blog/cascade-and-neon-mcp/ad4nxeyhtw3qcjpkxjxfoxymosbw4b8fso4ro0d0zzgtwnlwtl1gmz1fedqdfaw96zk7avdhwidh-i4lxcmlibpz66c5yxxgefkxuoofuy4uzbbeee-jsf-euqjqz4bjpuc0w2mu-ad3db9cd.gif)

As soon as the request is sent, Windsurf’s MCP Client kicks into gear.

Just as a developer would iteratively create an application, Cascade breaks the prompt down into a series of more clearly defined tasks, tackling them each one by one. In the case of our prompt, Cascade does the following:

- **Project initialization:** Sets up the Next.js project, and all the npm packages that will be used
- **Database provisioning:** Creates a new Neon Postgres database instance using the Neon MCP server
- **Schema creation:** Designs and applies the schema directly to your database
- **API and UI generation**: Creates the API routes, then connects those to the frontend components, and styles everything using Tailwind CSS

In just moments, your application has been taken from a single prompt into a working Next.js application connected to a Postgres database:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/cascade-and-neon-mcp/ad4nxd25uzyxdxw7to7hlx6nxq3aqdb6gchqtm7lv8w87tdigbduwpv4yea2oj2oj4i3ejjn5fs0dsny8hi9tkdxexcwnzxs6ttqrhrx550ynqgb5hollsivwwgvdrjh8241sgkua-c6d3049b.gif)

## Adding features

After your Todo application is up and running, it’s time to take it a step further and add a feature.

We’ll instruct Cascade to integrate a priority label to the todos, and watch how it’s able to develop this feature, create a migration file, and apply it to the database using MCP.

No more than 1 minute later, Cascade developed a plan and executed on it start to finish:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/cascade-and-neon-mcp/ad4nxdrgjb4dmtyrsf4kll-sotkdanuitmiczxoxnbybmqwjyz9xlq8oqai7apn0dms6w5bd3tkuzmfbhdd0aud93rxsewkcs1yplpnakt6dpvherdxteme901buxjh7nywbqdvg-394bd7ca.gif)

What’s more, if we look at the generated migration files, we can see Cascade created a custom enum type for priorities instead of just using plain text. This small detail shows the agent’s ability to generate clean and thoughtful schemas.

```sql
CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high');
ALTER TABLE "todos" ADD COLUMN "priority" "priority" DEFAULT 'medium' NOT NULL;
```

And looking over in the Neon console, the database changes were successfully applied with the new priority column.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/cascade-and-neon-mcp/ad4nxctx8qp6gng2t0rs5dbyayhblfdmbyl7yzqotksahmvijpedgv2kpvwrz6lt5x80idldxxll2llopdacdq689a54p7kekoyxxbqdlyomjt2hfqyhnult8wwhmj-likyzowvrk3q-45e7bd75.png)

## Wrap up

Using Windsurf together with Neon MCP makes database management accessible for any developer. Cascade can automatically provision Postgres databases, run schema migrations, execute queries, and more. This tight integration means your database remains completely synchronized with your application, guaranteeing consistency, while also reducing the amount of manual work you need to worry about.

If you haven’t tried Windsurf yet, [get started with the Free plan](https://codeium.com/pricing)!
