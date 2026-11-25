---
title: 'Every app needs an MCP server, and you can build it with Neon'
description: 'An MCP server lets your users work in your app from any AI assistant (i.e. ChatGPT, Claude, and Cursor)'
excerpt: >-
  Not long ago, using software meant clicking through its UI. That's still a
  great model for some software, but increasingly, that's not how people want to
  work: users want to ask their agent to do a task and let the agent handle
  it...
date: '2026-11-25T09:00:00'
category: product
categories:
  - product
authors:
  - tony-dang
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/every-app-needs-an-mcp-server/cover.jpg
  alt: Every app needs an MCP server
isFeatured: false
seo:
  title: 'Every app needs an MCP server, and you can build it with Neon - Neon'
  description: 'An MCP server lets your users work in your app from any AI assistant (i.e. ChatGPT, Claude, and Cursor)'
  keywords: []
  noindex: false
  ogTitle: 'Every app needs an MCP server, and you can build it with Neon - Neon'
  ogDescription: 'An MCP server lets your users work in your app from any AI assistant (i.e. ChatGPT, Claude, and Cursor)'
  image: https://cdn.neonapi.io/public/images/pages/blog/every-app-needs-an-mcp-server/social.jpg
---

Not long ago, using software meant clicking through its UI. That's still a great model for some software, but increasingly, that's not how people want to work: users want to ask their agent to do a task and let the agent handle it. If the agent can't reach a tool, there's a good chance users will switch to one their agent can work with.

That's why your app needs an MCP server.

## Agents need a way into your app

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro) is an open standard for connecting AI clients to external systems:

- An AI assistant like ChatGPT, Claude, or Cursor is the MCP client
- Your app runs an MCP server
- The client connects to the server and learns what it can do there

Without a standard, connecting your app to AI assistants would mean building a separate integration for each one. With MCP, you build one server, and any AI client that supports the protocol can use it.

**[ADD IMAGE 1]**

An MCP server can offer [three kinds of things](https://modelcontextprotocol.io/docs/learn/server-concepts):

- Tools: actions the model can call, like "create a task" or "book a flight"
- Resources: data the AI client can read for context, like a file or a database schema
- Prompts: reusable instruction templates the user can pick

To let agents do things in your app, you need tools, so the rest of this post focuses on them.

## How an agent uses an MCP server

Say your app is [a shared grid that anyone can paint,](https://github.com/thisistonydang/mcp-place-demo) and a user asks ChatGPT to paint a square red.

**[ADD IMAGE 2]**

Here's what actually happens behind the scenes:

- Discovery. When ChatGPT connects, it asks your server which tools it offers. Each tool comes back with a name, a plain-language description, and the inputs it accepts - e.g. `paint_square`, which takes inputs such as a column, a row, and a color.
- Decision. If you type "paint A1 red", the model reads the tool descriptions, picks `paint_square`, and fills in the inputs
- Call. ChatGPT sends the tool call to your server, along with a token that identifies the user. Your server checks who the user is and what they're allowed to do, then runs your code - e.g. it updates one row in the database
- Response. Your server returns the result. ChatGPT tells the user it's done, or calls another tool if the task needs more steps.

**[ADD IMAGE 3]**

## Why not let agents use the UI or the database directly?

Take an app whose state lives in a database. An agent would have a few ways to change that state.

The first would be to use the app the way a person would. Some agents can operate a browser - they take screenshots, find buttons, and click them. But this is slow, and a small redesign can break it. UIs were built for people, not for agents.

You also could, in theory, give the agent a database connection string, but this is a problem. Your app sits between users and the database - it checks who's signed in, what they're allowed to change, and whether the input makes sense. By giving the agent a connection string directly, all these security steps are skipped - an agent might log in with a database role that can read and write every user's rows, and it could run any query, without anything stopping it from changing or deleting data that belongs to other users.

**[ADD IMAGE 4]**

The third way is to call tools that your app exposes, and that's what an MCP server is for. You decide which actions exist and what each one accepts. The agent sees a list of tools and can only do what they allow, and your code stays between the agent and your data.

## What a production MCP server needs

Now let's look at how an MCP server is built, and what you need to build one for your app.

An MCP server you run on your laptop, just for yourself, can be very simple. It doesn't need sign-in, because you're the only user, and it doesn't need to be on the internet if you're using a local AI client that runs on the same machine.

A server your users connect to from ChatGPT or Claude is different. It has to be reachable from anywhere, it has to know who each user is, and it has to keep each user's data separate. That adds four pieces:

### A public endpoint

ChatGPT and Claude run in the cloud, not on your computer, so they can't reach a server on `localhost`. Your MCP server needs a public URL served over HTTPS, usually ending in `/mcp`. Users give this URL into their AI assistant to connect.

### A way to know who the user is

ChatGPT will send a token with every tool call, and your server will use it to check who the user was. That token has to come from somewhere, and in MCP it comes from OAuth, the same standard behind "Sign in with Google".

The first time a user connects from ChatGPT, your server replies that they need to sign in and points ChatGPT to an authorization server. ChatGPT opens your sign-in page, the user logs in with their existing account, and a consent page asks whether they want to let ChatGPT act for them. If they approve, the authorization server gives ChatGPT a token. From then on, every tool call carries that token, and your server knows exactly which user it's acting for.

To make this work, you need an authorization server that knows your users, plus sign-in and consent pages that live in your app on a public HTTPS domain. The authorization server also has to recognize the AI client themselves. ChatGPT and Claude identify themselves with [Client ID Metadata Documents](https://neon.com/docs/auth/guides/plugins/oauth-provider#client-id-metadata-documents): a public file that describes the client, so you don't have to register each one by hand.

### Access to your data

Once your server knows who the user is, each tool reads and writes your database on that user's behalf. That means your MCP server needs a connection to the same database your app uses, and a way to match the user from the token to their rows.

### Tool annotations, to get listed in the plugin stores

If you want your server to appear in the ChatGPT or Claude plugin stores, each tool also needs annotations: short labels that tell the AI app what the tool does to your data. Does it only read? Can it overwrite or delete something? Does it reach outside your app? AI clients use these labels to decide when to ask the user for confirmation before calling the tool.

## Build your MCP server on Neon

**[ADD IMAGE 5]**

Put together, most of that list is infrastructure. You need a place to run the server, an identity provider that already knows your users, and a database those two can share. You can find all these elements with [Neon](https://neon.com/).

Neon is a backend platform that comes with all the pieces you need to build and scale apps, including the primitives we'll use to build an MCP:

- [Neon Functions](https://neon.com/docs/compute/functions/overview) - long-running serverless functions that run next to your database. This is where your MCP server runs.
- [Managed Better Auth](https://neon.com/docs/auth/overview) - authentication built on [Better Auth](https://www.better-auth.com/) and run by Neon. It handles sign-up, sign-in, sessions for your app's users as well as OAuth protection for your MCP server.
- [Lakebase Postgres](https://neon.com/docs/introduction/architecture-overview) - the Neon database, serverless Postgres that scales with your traffic and branches with your app. This is where the data lives for tool call reads and writes.

### The server runs next to your data

Your MCP server is code that has to run somewhere: it receives tool calls from ChatGPT or Claude, checks the user, and talks to your database. On Neon, that code runs on a [Neon Function](https://neon.com/docs/compute/functions/overview).

A Neon Function is deployed onto a branch of your Neon project. It runs in the same region as that branch's database, and Neon gives it the database connection string automatically as `DATABASE_URL`. You don't set up a server or copy credentials around. Every tool call reaches your data without a trip to another region.

Functions are also long-running, which helps with MCP: some AI clients keep a connection open and stream results while a task runs, and a short execution limit would cut them off.

### Your existing users sign in

Earlier we saw that an AI client needs a token to act for a user, and that the token comes from an authorization server. If your app already uses Managed Better Auth, you don't need to build or run that server, you turn it on.

The [OAuth provider plugin](https://neon.com/docs/auth/guides/plugins/oauth-provider) turns Managed Better Auth into an OAuth 2.1 authorization server. In Neon, you give it three URLs: your sign-in page, your consent page, and your MCP server. From then on, when a user connects ChatGPT to your app, ChatGPT sends them to your sign-in page, they log in with the account they already have, they approve access, and Managed Better Auth gives ChatGPT a token for that user.

Client ID Metadata Documents are on by default, so ChatGPT and Claude can connect without you registering each one by hand. On the server side, the `@neon/oauth` SDK checks each token in a few lines of code and hands your tools the user's ID.

### Identity and data share a database

Once your server has a token, it still needs to answer one question: which rows belong to this user?

Many apps keep users in a separate identity service and the app data in a database, and keep the two in sync. [Managed Better Auth](https://neon.com/docs/auth/overview) stores your users in your own database, in a schema called `neon_auth`, next to your app's tables. The token's `sub` field is the user's ID, the same ID your tables already reference. Your tool filters by it, and that's the whole check.

**[ADD IMAGE 6]**

### You can branch

At some point you'll want to change your MCP server, for example by adding a tool or changing how sign-in works. You don't want to test that on the server your users are connected to.

**[ADD IMAGE 7]**

On Neon, a [branch](https://neon.com/docs/introduction/branching) is an isolated copy of your backend. When you create one, it gets its own database, its own functions, and its own auth setup, with separate OAuth settings and a separate auth URL. Tokens issued on one branch don't work on another. You can connect an AI client to a development branch's MCP server, try the new tool against a copy of your data, and merge the change once it works.

### Your coding agent can build it

**This is the best part: you don't have to write all of this by hand.** We follow our own advice here :) We know you probably don't want to build all of this yourself, so Neon itself is ready to have agents work with it. Your coding agent can interact with Neon through our very own [Neon MCP server](https://neon.com/docs/ai/neon-mcp-server) plus the Neon [agent skills](https://neon.com/docs/ai/agent-skills).

**With the skills installed, a prompt like this can build you an MCP server, the sign-in and consent pages, and the OAuth settings:**

```
Add an MCP server to my app using Neon Functions. Use the Better Auth OAuth provider plugin for MCP server authentication, and add a paint_square tool that agents can call to paint squares on the grid.
```

## How to build your MCP server: an end-to-end demo

The prompt above comes from a demo app we built, with its own MCP server on Neon. This video walks through the whole build, and every step is a prompt to a coding agent:

<YoutubeIframe embedId="xwgdvbpVMG8" isDocPost={false} />

### The demo app

[mcp/place](https://github.com/thisistonydang/mcp-place-demo) is a shared 5 by 5 grid that anyone can paint. Its UI has no buttons or color pickers, so the only way to paint a square is to ask an agent. That makes it a small, clear test of an MCP server: if a square changes color, an agent did it through a tool.

<video autoPlay muted loop playsInline width="708" height="398" aria-label="Demo app with an MCP server on Neon">
<source src="https://cdn.neonapi.io/public/images/pages/blog/every-app-needs-an-mcp-server/demo-app.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/every-app-needs-an-mcp-server/demo-app.mp4" type="video/mp4" />
</video>

Under the hood, the app is simple. Each square has a corresponding row in a Lakebase Postgres table called `canvas_squares`, with each row storing an x and y coordinate and a color. The frontend is a Vite and React app on Vercel. [Neon Realtime](https://neon.com/docs/realtime/overview) watches the table and updates the browser UI as soon as the color of a row changes.

### How we built the MCP server

The goal was to let any user connect the grid to ChatGPT, sign in with their own account, and paint squares by asking in plain-language. The MCP server has a single tool, `paint_square`, which takes a column, a row, and a color and writes them to the database as the signed-in user.

The build takes four prompts to a coding agent:

- Install the Neon agent skills, so the agent knows how to build on Neon
- Turn on Managed Better Auth, using a prompt you copy from the Neon Console. This adds sign-up and sign-in to the app
- Add the MCP server as a Neon Function, with the OAuth provider plugin and the `paint_square` tool. The agent also writes the sign-in and consent pages and configures the OAuth settings
- Deploy the frontend to Vercel and update the OAuth page URLs, so ChatGPT and Claude can reach the sign-in and consent pages over HTTPS

**[ADD IMAGE 8]**

Beyond building the MCP server, we also test it:

- [MCPJam](https://www.mcpjam.com/) runs the tool in ChatGPT, Claude, and Cursor side by side, to confirm sign-in works and the tool behaves the same in each
- [Manufact](https://manufact.com/) then checks the server against the ChatGPT and Claude plugin store requirements. Its first run flagged one gap: the tool had no annotations. A fifth prompt, copied from Manufact's checklist, adds them
- After that, the server connects to ChatGPT, and asking it to "change B4 to blue" paints the square

The same steps are written up [in this guide](https://neon.com/guides/mcp-server-neon-functions). It covers the code the agent wrote at each step and links to the matching commit in the [demo repo](https://github.com/thisistonydang/mcp-place-demo), so you can check your work as you go.

## More resources

- [Build an MCP server with Managed Better Auth](https://neon.com/docs/compute/functions/mcp-server): another guide teaching you to build a per-user to-do MCP server by hand, with the Neon CLI and Next.js
- [Neon Functions](https://neon.com/docs/compute/functions/overview): learn how functions work, deploy, and connect to your database
- [Neon agent skills](https://neon.com/docs/ai/agent-skills): install the Neon skills for your coding agent
- [OAuth provider plugin](https://neon.com/docs/auth/guides/plugins/oauth-provider): see the full reference for MCP server authentication with Managed Better Auth
