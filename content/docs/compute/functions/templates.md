---
title: Use function templates
subtitle: Add a ready-made Neon Function to your project with one command, then run and deploy it.
summary: >-
  How to find and use Neon Function Registry templates: browse the catalog at
  neon.com/functions/templates or with neon functions templates list, add a
  template with neon functions new, enable the services it needs, run it
  locally with neon dev, and deploy it. Also explains how registry templates
  differ from neon bootstrap starter apps.
enableTableOfContents: true
---

Function templates are ready-made [Neon Functions](/docs/compute/functions/overview) you can add to your project instead of writing one from scratch. There are templates for REST APIs, MCP servers, authenticated APIs, AI agents, image generation and analysis, and chat bots. Some are built by Neon and some by partners such as Mastra, TanStack, and Telegram.

A template adds one function to the project in your current directory. The source lands in your repo, so you can read it, change it, and deploy it like any function you wrote yourself.

## Browse the templates

Browse the full catalog at [neon.com/functions/templates](/functions/templates). You can search and filter by category. Each template has a page with its install command and a link to its source on GitHub.

<DetailIconCards>
<a href="/functions/templates" description="Search and filter every template in the Function Registry" icon="code">Browse function templates</a>
</DetailIconCards>

You can also list them from the terminal:

```bash
neon functions templates list
```

```text filename="Output"
ID                 Title                                                Provider     Description
basic              Basic function                                       Neon         A minimal Neon Function with a JSON response.
mcp-postgres       MCP server backed by Postgres                        Neon         A Hono MCP server exposing create, list, update, and delete tools backed by a Postgres database.
rest-api-postgres  REST API with Hono and Postgres                      Neon         A CRUD REST API on Neon Functions with Hono, backed by Lakebase Postgres.
image-generation   AI image generation API                              Neon         Generate an image with AI Gateway, store it in Object Storage, and return a presigned URL.
...
```

The `ID` column is what you pass to `neon functions new`.

## Before you start

Templates need the [Neon CLI](/docs/cli/install) 8.11.0 or later. To deploy one, you also need a Neon project and a directory [linked](/docs/cli/link) to it.

Read the template's README before you install it. Open **Template source** on the template's page, or browse [`registry/`](https://github.com/neondatabase/examples/tree/main/registry) in `neondatabase/examples`. The README lists what the template needs, such as other Neon services or third-party API keys, and how to call the function once it's running.

<Steps>

## Add the template

From your project directory, run `neon functions new` with the template ID:

```bash
neon functions new image-generation
```

The command copies the template into `functions/<slug>/` and declares the function in [`neon.ts`](/docs/reference/neon-ts), creating the file if needed. The slug is the template ID with hyphens removed, so this example creates `functions/imagegeneration/`. Pass `--slug` to choose a different one.

Leave out the ID to pick a template interactively. If a template has several operations, the command asks which ones to include. Pass `-y` to take the recommended ones and install dependencies without prompting. See [`neon functions new`](/docs/cli/functions#new) for all options.

The command ends with a `Next:` list of the exact commands for that template:

```text filename="Output"
Next:
  npm install @neon/config @neon/env
  npm install -E @aws-sdk/client-s3@3.1156.0 @aws-sdk/s3-request-presigner@3.1156.0 @neon/ai-sdk-provider@1.1.0 ai@7.0.150
  neon dev
  neon config apply
```

Run the `npm install` lines. Dependencies are pinned to the versions Neon reviewed.

## Enable the services the template uses

The `Next:` list doesn't enable other Neon services for you. If the template uses [AI Gateway](/docs/ai-gateway/overview), [Object Storage](/docs/storage/overview), or [Managed Better Auth](/docs/auth/overview), declare them in `neon.ts`. The template's README says which ones it needs. For `image-generation`, that's AI Gateway and a private bucket named `images`:

```bash
neon config add ai-gateway
neon config add bucket images
```

See [`neon config add`](/docs/cli/config#add) for the other services you can add.

If the template reads its own environment variables, such as an API key for a third-party service, `neon functions new` declares them in `neon.ts` and adds their names to `.env.example`. Set the values in `.env.local`.

## Deploy to provision services

If you added services in the previous step, deploy once so Neon provisions them on your branch:

```bash
neon deploy
```

After deploying, Neon writes the new services' credentials, such as the `NEON_AI_GATEWAY_*` and `AWS_*` variables, to your local env file. `neon dev` needs them to run the function. If the template has no extra services or variables, you can skip this step and run it locally first.

If you set your own variables in `.env.local`, deploy with `neon deploy --env .env.local`. Without `--env`, the deploy fails because those variables are undefined.

## Run it locally

```bash
neon dev
```

`neon dev` serves the function at `http://localhost:8787` by default and loads `.env` and `.env.local`. Call it with the request shown in the template's README. For `image-generation`:

```bash
curl -X POST http://localhost:8787/ \
  -H "content-type: application/json" \
  -d '{"prompt":"An astronaut drinking coffee in a neon-lit cafe"}'
```

## Deploy

When it works locally, deploy it to your branch:

```bash
neon deploy
```

`neon config apply` does the same thing, which is why the `Next:` list may end with it. To find the function's URL and manage it after deploy, see [Deploy and manage functions](/docs/compute/functions/deploy).

</Steps>

## Customize a template

The template's files are now part of your project, so edit them like any other code. The CLI doesn't track changes or update installed templates.

Many templates don't authenticate requests, so anyone with the function URL can call them. This matters for templates that call paid services like AI Gateway. Check the README, and add your own check before you share the URL. See [Authentication](/docs/compute/functions/authentication).

## Function templates vs. starter apps

Neon has two kinds of templates:

|              | Function templates                                   | Starter apps                                                                                                 |
| ------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| What you get | One function, added to your existing project         | A complete app in a new directory                                                                            |
| Command      | `neon functions new <id>`                            | [`neon bootstrap --template <id>`](/docs/cli/bootstrap)                                                      |
| Browse       | [neon.com/functions/templates](/functions/templates) | [Starter templates](/docs/compute/functions/overview#starter-templates) or `neon bootstrap --list-templates` |

Use a function template to add a capability to a project you already have. Use a starter app when you're starting from an empty directory.

## Publish your own template

Anyone can propose a template by opening a pull request on `neondatabase/examples`. Neon reviews each one before it's published. See [Create a Function Registry template](/docs/compute/functions/registry).

<NeedHelp/>
