---
title: Teaching AI to Do Auth (So You Don’t Have To)
description: We built AI rules and MCP prompts for reliable end-to-end auth flows
excerpt: >-
  We just launched Neon Auth and of course the immediate follow-up task I had
  was “let’s teach my AI tools to use it for me”. So we’ve been wiring Neon Auth
  into our MCP so you can open Cursor, Claude, or your IDE or choice and let the
  AI build a backend for you. Here’s […]
date: '2025-12-17T17:26:10'
updatedOn: '2026-01-02T17:38:08'
category: product
categories:
  - product
authors:
  - pedro-figueiredo
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/teaching-ai-how-to-do-auth/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Teaching AI to Do Auth (So You Don’t Have To) - Neon
  description: >-
    Learn how to add Neon Auth to your app without leaving your IDE. Under the
    hood: AI rules and MCP prompts make this workflow reliable.
  keywords: []
  noindex: false
  ogTitle: Teaching AI to Do Auth (So You Don’t Have To) - Neon
  ogDescription: >-
    Learn how to add Neon Auth to your app without leaving your IDE. Under the
    hood: AI rules and MCP prompts make this workflow reliable.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/teaching-ai-how-to-do-auth/social.png
---

[We just launched Neon Auth](https://neon.com/blog/neon-auth-branchable-identity-in-your-database) and of course the immediate follow-up task I had was _“let’s teach my AI tools to use it for me”_. So we’ve been wiring Neon Auth into our MCP so you can open Cursor, Claude, or your IDE or choice and let the AI build a backend for you.

Here’s a short demo of the workflow in action. I start from an existing Vite + React + TypeScript app, ask the AI to add Neon Auth, and let it scaffold everything inside the editor. There’s very little manual work involved:

<YoutubeIframe embedId="yJFY-IZY9nk" isDocPost={false} />

This workflow doesn’t require to start from a template or a greenfield project, you can add use it with existing apps. As we’re about to see, under the hood the AI is guided by explicit rules instead of vague instructions, so it can integrate auth into an existing file structure and place new files exactly where they belong. This is what makes the workflow practical beyond demos. You’re incrementally upgrading a real codebase with a production-ready auth setup.

## How this works

In this workflow, the AI is following a set rules we’ve been building to make AI-assisted development with Neon reliable instead of letting the AI do magical-thinking:

- [Neon Auth guidelines in ai-rules](https://github.com/neondatabase-labs/ai-rules), which define the correct setup patterns
- [MCP prompt templates](https://github.com/neondatabase/ai-rules/blob/main/mcp-prompts/neon-js-setup.md), which let AI IDEs apply those rules consistently inside your project
- AI skills like the neon-auth [Claude skill](https://github.com/neondatabase-labs/ai-rules/blob/main/neon-plugin/skills/neon-auth/SKILL.md), which turn those rules into executable workflows, and external knowledge sources like [Context7](https://context7.com/), which give agents up-to-date SDK documentation when needed

Let’s walk through them from the bottom up.

### ai-rules for Neon Auth

The [neon-auth.mdc](https://github.com/neondatabase-labs/ai-rules/blob/main/neon-auth.mdc) in the ai-rules [repo](https://github.com/neondatabase-labs/ai-rules/blob/main/neon-plugin/skills/neon-auth/SKILL.md) is the source of truth that every AI tool reads from. It spells out every pattern you’d have to remember yourself, e.g.

- Which package to use (`@neondatabase/auth` vs `@neondatabase/neon-js`), depending on whether you only need authentication or want a unified client for auth and database queries.
- How to set up Auth in Next.js, React SPA, and Node.js
- The correct environment variables for each framework
- The UI components and the right way to import CSS (Tailwind vs no Tailwind)
- Critical rules like importing `BetterAuthReactAdapter` from the `/react/adapters` subpath and always calling it as a function
- Common mistakes developers run into and potential fixes

### MCP templates for Neon Auth (and neon-js)

The next layer is [MCP prompt templates,](https://github.com/neondatabase/ai-rules/blob/main/mcp-prompts/neon-js-setup.md) which make those rules usable inside AI-powered IDEs.

![Image](https://cdn.neonapi.io/public/images/pages/blog/teaching-ai-how-to-do-auth/image-10-1024x296-ff1aecf8.png)

These templates are intentionally lightweight, they don’t re-explain how Neon Auth works. Instead, they do two important things:

#### They give AI IDEs a structured way to interact with your project

Editors need more than “here’s how auth works.” They need instructions for how to

- inspect your file system
- detect your framework
- route to the right setup guide
- confirm each step worked
- escalate to troubleshooting when something fails

#### They always point to the latest rules

Instead of duplicating documentation into prompts (which would drift immediately), the templates pull everything from the ai-rules repo via raw GitHub URLs. That means whenever we update the Neon Auth guides, every IDE using these templates gets the update automatically.

### For Claude, there’s a skill

If you’re using Claude, this all comes together today is the neon-auth [Claude skill](https://github.com/neondatabase-labs/ai-rules/blob/main/neon-plugin/skills/neon-auth/SKILL.md).

![Image](https://cdn.neonapi.io/public/images/pages/blog/teaching-ai-how-to-do-auth/image-11-f646b1f5.png)

If ai-rules is the knowledge, the skill is the workflow:

- It detects whether you’re in a Next.js, Vite/React, or Node.js app
- Figures out which package manager you’re using
- Installs the correct package
- Creates files in the right places
- Enforces all conventions from ai-rules

### Using Context7 for up-to-date SDK knowledge

In addition to Neon’s own `ai-rules`, many agents rely on [Context7](https://context7.com/), a repository of LLM-friendly documentation for popular libraries. In the demo, perhaps you noticed how the AI knew what `neon-js` was in the first place via Context7. This is especially useful for [SDKs like `neon-js`](https://neon.com/docs/reference/javascript-sdk) that evolve quickly and are used across many projects.

![Image](https://cdn.neonapi.io/public/images/pages/blog/teaching-ai-how-to-do-auth/image-12-731x1024-1ae986b9.png)

## How to start building

You can try this workflow today from any AI-enabled editor that supports [MCP](https://neon.com/docs/ai/neon-mcp-server). Here’s the high-level flow:

1. Open an existing app (or an empty repo) in your editor
2. Make the [Neon Auth AI rules](https://github.com/neondatabase-labs/ai-rules) available to the agent
3. [Enable Neon Auth](https://neon.com/docs/auth/overview) for that project
4. Add the Auth URL to your environment variables
5. From there, you can give a prompt like, _“add Neon Auth to this app and set up sign-in and sign-up”_
6. Start your dev server and try the flow

If you have any questions, [ask us on Discord](https://discord.gg/92vNTzKDGp)!
