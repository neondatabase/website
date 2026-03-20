---
title: 'AI Rules: Bring Neon Context into Your Editor'
description: Make AI tools like Cursor Neon-aware
excerpt: >-
  Using AI coding assistants like Cursor to build your full-stack apps makes for
  a powerful workflow, but they don’t always know the specifics of every tool –
  including Neon – and can do a little help. To give your editor Neon-specific
  context and help it generate better code from...
date: '2025-09-02T18:00:24'
updatedOn: '2025-10-17T16:59:13'
category: ai
categories:
  - ai
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/ai-rules-bring-neon-context-into-your-editor/cover.jpg
  alt: null
isFeatured: true
seo:
  title: 'AI Rules: Bring Neon Context into Your Editor - Neon'
  description: >-
    To give your editor Neon-specific context, we’ve created a set of rules you
    can add to your AI tool to teach it the right patterns for Neon.
  keywords: []
  noindex: false
  ogTitle: 'AI Rules: Bring Neon Context into Your Editor - Neon'
  ogDescription: >-
    To give your editor Neon-specific context, we’ve created a set of rules you
    can add to your AI tool to teach it the right patterns for Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/ai-rules-bring-neon-context-into-your-editor/social.jpg
source:
  wpId: 10787
  wpSlug: ai-rules-bring-neon-context-into-your-editor
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/ai-rules-bring-neon-context-into-your-editor/neon-ai-rules-1-1024x576-35afafdb.jpg)

Using AI coding assistants like Cursor to build your full-stack apps makes for a powerful workflow, but they don’t always know the specifics of every tool – including Neon – and can do a little help. To give your editor Neon-specific context and help it generate better code from the start, we’ve created a set of [rules](https://neon.com/docs/ai/ai-rules) you can add to your AI tool to teach it the right patterns for Neon.

## What Are AI Rules?

If you haven’t used AI rules before, they are small `.mdc` files that guide your coding assistant on how to handle specific contexts in your codebase. Each rule defines which file types it applies to, e.g.`*.tsx` or `schema.sql` and includes a brief description that explains when and why to use the rule. When the AI editor processes those files, it automatically adds the relevant rules as context, helping the assistant generate more accurate and helpful results.

For Neon in particular, these rules capture best practices and recommended patterns that are specific to our stack. Instead of generic Postgres or ORM advice, you get guidance that’s tailored to Neon.

## Available Neon Rules

We’ll be adding more rules overtime, but we started with three rules that cover some common areas where we observed AI assistants struggling often:

### Neon Auth

Authentication can be tricky to get right. In Neon particularly, you’re combining [Stack Auth](https://stack-auth.com/) on the frontend with [Neon Auth](https://neon.com/docs/neon-auth/overview) in the database, so some context really helps. The `neon-auth.mdc` rule teaches your AI assistant the right setup – including how to protect pages and how to safely join against the `neon_auth.users_sync` table, which is critical for your auth to work.

So you see an example of what the rule contains, here’s an excerpt from `neon-auth.mdc`:

```bash
## Page protection
- In Server Components, use `stackServerApp.getUser({ or: "redirect" })`.
- In Client Components, use `useUser({ or: "redirect" })`.

## Database usage
- Join against `neon_auth.users_sync` with LEFT JOIN.
- Always filter out rows where `deleted_at IS NOT NULL`.
- Never create FKs to `neon_auth.users_sync`; never insert directly.
```

Apart from this, `neon-auth.mdc` also includes guidelines on

- Initial setup of Stack Auth in your Next.js app
- Using pre-built components like `<SignIn />` and `<UserButton />`
- Protecting routes and middleware patterns

By including Neon Auth rules in your project, simple prompts like “add auth to the project” are much more likely to work seamlessly, allowing the AI assistant to automatically apply the correct authentication patterns and configurations for Neon.

[Read all the code in our docs.](https://neon.com/docs/ai/ai-rules-neon-auth)

### Neon Serverless Driver

Another area in which the AI could do some help is our serverless driver [(600k+ weekly downloads](https://www.npmjs.com/package/@neondatabase/serverless)). The `neon-serverless.mdc` rule will help your AI assistant suggest the right patterns when connecting to Neon from serverless environments, preventing mistakes you really want to avoid (e.g. hardcoding credentials).

The rule includes things like this (excerpt from `neon-serverless.mdc`):

```bash
## Connections
- Always use `import { neon } from '@neondatabase/serverless'`.
- Never hardcode DATABASE_URL credentials.
- Use template literals with the `sql` tag for parameters (avoid string concat).
- Open and close pools inside request handlers, not at module scope.
```

Other things to look for when handling serverless connections are:

- Using transactions correctly in serverless functions
- Handling WebSocket support in older Node.js runtimes
- Error handling for query failures and idle clients

This is all covered by `neon-serverless.mdc. ` [Check out the complete rule in our docs.](https://neon.com/docs/ai/ai-rules-neon-serverless)

### Neon + Drizzle ORM

Using Neon with Drizzle ORM is a favorite combo for many developers. To make sure everything works great, the `neon-drizzle.mdc` rule teaches your AI assistant how to set up Drizzle correctly with Neon – here’s what it covers (maybe it teaches you something as well):

- **Initial setup.** The rule prevents AI from defaulting to the Node Postgres adapter, which isn’t optimized for serverless. The rule ensures the AI selects the optimal Neon serverless driver, avoiding the default Node Postgres adapter, which isn’t ideal for serverless environments.
- **Schema design.** It encourages to use powerful Postgres-native types fully supported by Neon when schemas are being set up, like jsonb, enums (pgEnum), and arrays.
-
- **Query optimization.** This tells the AI to prevent inefficient one-by-one queries that slow down serverless apps, using batch inserts and use prepared statements where possible.
- **Branching.** Neon [branches](https://neon.com/branching) work wonderfully with Drizzle – this rule makes sure coding assistant knows how to properly handle Neon’s branching model, using branches when creating different environments vs hardcoding a single DB.
- **Error handling.** This section is set to capture some Neon-specific errors, like pool timeouts, in a way that’s easier to diagnose and fix.

## Get Started with AI Rules

Adding these rules to your editor is simple. You have two options:

1. **Copy the files into your project.** With Cursor, save the [rules](https://docs.cursor.com/context/rules-for-ai#project-rules-recommended) to .cursor/rules/neon-serverless.mdc and they’ll be automatically applied. If you’re using another editor, check their docs for the right method for loading rules manually.
2. **Or clone them from the repo.** You can also grab the rules directly [from our repo.](https://github.com/neondatabase-labs/ai-rules) Once they’re in your project, your editor will use them automatically, and you can also reference them explicitly in prompts when you want to guide the AI.
3. **Get them through Neon’s** [MCP Server](https://neon.com/docs/ai/neon-mcp-server). If you are already leveraging Neon’s MCP server for your development, simply prompt it with “Give me Neon specific AI rules,” and the server will provide the same rules we have in our repo.

---

_Neon is a serverless Postgres database designed to help you build reliable and scalable applications faster – from prototypes all the way to production – with minimal manual configuration._ [Start building for free with our free plan.](https://console.neon.tech/signup)
