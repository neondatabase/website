---
title: One Command to Bridge Cursor and Neon
description: Run neonctl init to enable the Neon integration in Cursor
excerpt: >-
  We’ve built a new way to connect your app to Neon right from Cursor. You can
  now run a single command to set up your Neon project, configure the MCP
  server, and enable the Neon integration: With this one command, Cursor gains
  full Neon project context: connection details, schema,...
date: '2025-11-05T17:25:23'
updatedOn: '2025-11-28T21:34:53'
category: product
categories:
  - product
authors:
  - rodney-sherwin-shibu
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/one-command-to-bridge-cursor-and-neon/cover.jpg
  alt: null
isFeatured: true
seo:
  title: One Command to Bridge Cursor and Neon - Neon
  description: >-
    Run npx neonctl init to set up Neon in Cursor. This one command connects
    your app, configures MCP, and enables a full integration instantly.
  keywords: []
  noindex: false
  ogTitle: One Command to Bridge Cursor and Neon - Neon
  ogDescription: >-
    Run npx neonctl init to set up Neon in Cursor. This one command connects
    your app, configures MCP, and enables a full integration instantly.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/one-command-to-bridge-cursor-and-neon/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/one-command-to-bridge-cursor-and-neon/neon-one-command-1-1024x576-25f153c0.jpg)

**We’ve built a new way to connect your app to Neon right from Cursor.** You can now run a single command to set up your Neon project, configure the MCP server, and enable the Neon integration:

```bash
npx neonctl@latest init
```

With this one command, Cursor gains full Neon project context: connection details, schema, and best practices – so you can confidently rely on it for complex tasks like database migrations.

Let’s walk you through it.

<Admonition type="important" title="Update [Nov 28, 2025]">
neon init now supports VS Code with GitHub Copilot and Claude Code CLI in addition to Cursor. [See our changelog.](https://neon.com/docs/changelog/2025-11-28)
</Admonition>

## What neonctl init Does

When you run `npx neonctl@latest init` the CLI walks you through a short guided setup that handles everything automatically:

```bash
Adding Neon to your project
Authentication successful
Installed Neon MCP Server

Success! Neon is now ready to use with Cursor

Restart Cursor and ask Cursor to "Get started with Neon using MCP Resource" in the chat
```

Behind the scenes, neon init is bootstrapping the bridge between your local app and Neon, and between Neon and Cursor:

### Configures the Neon MCP Server

Sets up the remote MCP (Model Context Protocol) server so your IDE or agent can interact directly with Neon’s API. This provides Cursor with structured access to your Neon project, allowing it to create branches, migrate schemas, or debug queries through chat.

### Gives Cursor context on your project

When you run npx neonctl init, the Neon MCP Server automatically registers a Get Started resource inside your IDE. This resource helps Cursor gain full awareness of your Neon project through the MCP integration, including setup guidance like how to configure your connection string, Postgres driver, and environment variables, plus best practices tailored to your specific project context.

### Validates your Neon credentials

The CLI also checks your authentication and project configuration, automatically linking your local environment with your Neon account.

## How to Set it Up

Once initialization is complete, your workspace will be fully set up (this is very quick). The only thing left to do is to restart Cursor, open your Cursor chat, and say,

**“Get started with Neon using MCP Resource”**

Cursor will now understand your database setup and start guiding you with Neon-specific suggestions.

## Use Case Example: Migrating from Supabase to Neon

To demonstrate how useful this command can be, we tested the setup to migrate a simple Notes app originally running on Supabase. **We managed to migrate the app to Neon directly from Cursor, using only natural language to confirm actions, following the setup created by `neonctl init`.**

<YoutubeIframe embedId="j4Wc0DLLgfI" isDocPost={false} />

You can follow the entire process in the demo clip above. It is very simple: once the command finishes initializing and Neon and Cursor are connected, everything happens in chat.

You see in the demo how, guided by the context it now has, Cursor is able to help you with the migration by executing all the steps:

1. **Detects the existing setup.** Cursor first inspects the codebase and recognizes Supabase configuration files like `supabase.ts` and SQL migrations.
2. **Creates a new Neon project.** It then calls the Neon API through the MCP server to provision a new database and returns a connection string.
3. **Updates the environment.** Cursor automatically adds the new `DATABASE_URL` to `.env.local`
4. **Installs the Neon driver.** Adds the lightweight serverless client for Postgres.
5. **Migrates your schema and data.** Cursor then runs your SQL migrations and imports any existing data into the new Neon project.
6. **Replaces the Supabase client.** It also creates a new `lib/neon.ts` using the Neon driver and updates your API routes (like `/api/notes`) to use it.
7. **Adjusts the frontend.** Updates the React components or fetch calls to point to the new endpoints.
8. **Verifies success.** Lastly, it confirms that the app is connected, the data matches, and everything runs on Neon.

Once the migration is complete, Cursor tells us it’s done with a checklist like this:

```bash
✅ Schema migrated  
✅ Data imported  
✅ Supabase client replaced  
✅ Environment updated  
✅ App running on Neon
```

<Admonition type="note" title="What makes this powerful">
Once `neonctl init` connects your app to Neon, Cursor gains full project context. It can guide you through migrations, environment setup, and database best practices conversationally without making you switch tools or copy-pasting anything.
</Admonition>

## Try it

If you’re a Cursor user, you can try this today, and [tell us in Discord how it went](https://discord.gg/92vNTzKDGp). You can also email us at [feedback@neon.com](mailto:feedback@neon.com) – we read every single email and truly appreciate your input.

<Admonition type="tip" title="Coming soon to other IDEs">
`neonctl init` is currently in beta for Cursor, but VS Code and Claude Code support is coming soon. [Keep an eye on our changelog.](https://neon.com/docs/changelog)
</Admonition>
