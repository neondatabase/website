---
title: Save tokens with Neon Function templates
description: Introducing the Neon Function Registry
excerpt: >-
  Agents can already bootstrap a Neon Function on their own, but they spend
  tokens researching best practices first. A template from the Neon Function
  Registry lets them skip that and start from working code.
date: '2026-11-05T12:00:00'
category: product
categories:
  - product
authors:
  - dominik-koch
draft: true
isFeatured: false
seo:
  title: Save tokens with Neon Function templates - Neon
  description: >-
    Introducing the Neon Function Registry. Add a template to your project with
    one command so your agent starts from working code.
  keywords: []
  noindex: false
  ogTitle: Save tokens with Neon Function templates - Neon
  ogDescription: >-
    Introducing the Neon Function Registry. Add a template to your project with
    one command so your agent starts from working code.
---

A few weeks ago we launched [Neon Functions](/blog/neon-functions-backend-logic-next-to-your-data), Node.js functions that run in your Neon project in the same region as your Postgres database, with enough runtime for agents that stream for minutes or WebSockets that stay open.

Today we're introducing the [Neon Function Registry](/functions/templates), a collection of ready-made functions you add to a project with one command.

Agents can already bootstrap a function on their own, but before they write any code they read the docs, look up best practices, figure out [`neon.ts`](/docs/reference/neon-ts) and pick package versions. All of that costs tokens and time.

With the registry, your agent starts from a working template and spends its time on something more useful like building your app.

## Templates worth trying

Here is a small collection of some of my favorite templates, built with [Vercel's Chat SDK](https://chat-sdk.dev/), [Mastra](https://mastra.ai/), [Context.dev](https://www.context.dev/), [WorkOS](https://workos.com/) and [AI Inbx](https://aiinbx.com/):

<FunctionRegistryShowcase />

The rest of the collection uses the Neon services you may already use for your project:

- **Postgres** [`rest-api-postgres`](/functions/templates/rest-api-postgres) and [`mcp-postgres`](/functions/templates/mcp-postgres) read and write your database through the `DATABASE_URL` Neon injects.
- **AI Gateway** [`openai-agents`](/functions/templates/openai-agents) runs a streaming [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/) agent with tools and handoffs on models from the [Neon AI Gateway](/docs/ai-gateway/overview).
- **Object Storage** [`image-generation`](/functions/templates/image-generation) creates an image with the AI Gateway and stores it in [Neon Object Storage](/docs/storage/overview).
- **Auth** [`authenticated-api`](/functions/templates/authenticated-api) checks callers with [Managed Better Auth](/docs/auth/overview).

Because those services live in the same project as the function, you don't need to sign up for a separate database, storage provider or AI Gateway to use a template.

## Why templates work so well for agents

A template hands an agent pre-built code it would otherwise have to write itself, in a form it can install without stopping to ask you questions:

- `neon functions templates list` returns every available template's ID, so the agent can pick one without browsing the website.
- `neon functions new <id> -y` installs the recommended setup and the pinned dependency versions without any prompts.
- `neon functions new` doesn't need a linked project or a signed-in CLI, so an agent can add a template before anyone has logged in.

Each template comes with a README that lists the services it needs and how to make an example request, so the agent knows how to call the function once it's running.

## How to get going

This section walks through adding a template, from the first command to a deployed function. You need [Neon CLI](/docs/cli/install) 8.11.0 or later and a directory [linked](/docs/cli/link) to a Neon project to deploy:

```bash
neon functions templates list
neon functions new chat-sdk
```

After that, a template usually needs a few more steps:

1. Let the CLI install the dependencies when it asks, or pass `-y` to skip the question. If you decline, run the `npm install` lines it prints under `Next:`.
2. Add the services the README lists, for example with `neon config add ai-gateway`.
3. Put the values for the template's environment variables into your local `.env.local` or `.env` file.
4. If you added services, deploy once with `neon deploy --env .env.local` so Neon provisions them and writes their credentials to your local env file.

You can then run the function locally with `neon dev`, make changes and deploy it again.

Keep `--env .env.local` on the deploy command for any template with its own variables, because the deploy fails when those variables are undefined. The [function templates docs](/docs/compute/functions/templates) cover each step in more detail.

Once installed, the files are yours to edit. The CLI won't overwrite them with a newer version of the template. Also keep in mind that most templates don't check who is calling them, so add [authentication](/docs/compute/functions/authentication) before you share the URL of anything that calls a paid service.

## Next steps

Pick whichever of these fits where you are:

- Browse every template on [neon.com/functions/templates](/functions/templates) and add one to a project you already have.
- Read [Use function templates](/docs/compute/functions/templates) for the full setup, including services and environment variables.
- Publish your own template with a pull request on [`neondatabase/examples`](https://github.com/neondatabase/examples), following [Contribute a function template](/docs/compute/functions/registry).
- Tell us which template you want next in the [Neon Discord](https://neon.com/discord).
