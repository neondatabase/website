---
title: Neon skills landed in the Vercel CLI
description: One CLI command = Neon + agent skills on your Vercel project
excerpt: >-
  Vercel just gave their CLI a new trick: when you install a Marketplace
  integration from the terminal, it also installs that provider's agent skills.
  A single command now provisions a Neon database on your Vercel project and
  hands your coding agent the instructions it needs to actually use it.
date: '2026-08-14T12:00:00'
updatedOn: '2026-08-13T13:58:00'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: Neon skills landed in the Vercel CLI - Neon
  description: One CLI command = Neon + agent skills on your Vercel project
  keywords: []
  noindex: false
  ogTitle: Neon skills landed in the Vercel CLI - Neon
  ogDescription: One CLI command = Neon + agent skills on your Vercel project
  image: null
---

[Vercel just gave their CLI a new trick](https://vercel.com/changelog/vercel-marketplace-agent-skills): when you install a Marketplace integration from the terminal, it also installs that provider's agent skills. A single command now provisions a Neon database on your Vercel project and hands your coding agent the instructions it needs to actually use it:

```
vercel integration add neon
```

**[ADD CLIP 1]**

## Provision Neon from the Vercel CLI

If you deploy to Vercel, you've probably used the CLI mostly for vercel deploy or vercel env pull. The part that matters here is a different subcommand, [vercel integration](https://vercel.com/changelog/vercel-cli-for-marketplace-integrations-optimized-for-agents), which manages [Marketplace integrations](https://vercel.com/marketplace) from the terminal. You can use this command to provision a resource from a Marketplace integration (e.g. a Neon backend), and if that integration isn't installed on your team yet, it installs it first. (It's also available as vercel install (alias vercel i), so vc i neon gets you to the same place.)

If you run the command plain, it prompts you for the choices it needs, like the billing plan and region - but if you run it with flags, it skips the prompts entirely, which is what makes it perfect for agents:

```
vercel integration add neon \
  --name my-database \
  --plan pro \
  -e production \
  -e preview
```

This command would:

- Provision a Neon database ([Lakebase Postgres](https://neon.com/docs/postgres/overview)) from the Vercel Marketplace
- Connect it to your Vercel project, injecting connection variables like `DATABASE_URL`
- Pull those variables into your local environment via `vercel env pull`, so your agent can start using the connection string right away
- Install Neon's agent skills from `skills.sh` into the project, so the agent knows how to work with what it just provisioned (more about this later)

<Admonition type="note" title="On billing and account shape">
vercel integration add neon installs the [Vercel-Managed Integration](https://neon.com/docs/guides/vercel-managed-integration). If you don't already have a Neon account, it creates one for you, and billing runs through your Vercel invoice.

If you already have a Neon account and want to keep billing with Neon, use the [Neon-Managed Integration](https://neon.com/docs/guides/vercel-managed-integration) instead.
</Admonition>

There’s more integration subcommands you can run without leaving the terminal, e.g.

- vercel integration discover browses available providers
- vercel integration categories lists how they're grouped (databases, AI, observability, and so on)
- vercel integration guide neon prints setup snippets,
- and vercel integration open neon opens the Neon console

## Preview branches, included

Once Neon is connected with Preview enabled, [every Vercel Preview Deployment gets its own isolated Neon branch](https://neon.com/blog/neon-vercel-native-integration). A Neon branch is an instant, isolated copy of your backend: same Postgres schema, same data, ready in about a second. Under the hood it starts as a pointer to existing storage - data is only copied when that branch diverges from its parent, so you can spin up many short-lived environments without paying for full copies each time.

That maps cleanly onto how Vercel already works with PRs. If you push a feature branch, Vercel opens a Preview Deployment, and Neon opens a matching database branch for it - so any tests or migrations all run against that copy. Reviewers hit a real URL with a real database behind it; when the PR ships or the preview goes away, you clean up the branch the same way you'd clean up the deployment.

<Admonition type="note" title="Cleaning up branches">
Cleanup timing depends on which path you chose. The Vercel-Managed path follows Vercel's deployment retention policy, while the Neon-Managed path can follow Git branch deletion. The details, and a few ways to tighten it up, are in [Managing Vercel preview branch cleanup](https://neon.com/docs/guides/vercel-branch-cleanup).
</Admonition>

PS: If you've turned on Managed Better Auth on the production branch, preview deployments also receive NEON_AUTH_BASE_URL, [so auth works in each isolated preview too](https://neon.com/guides/vercel-neon-auth-branching).

## Skills now load automatically

When you tell your agent to deploy Neon via Vercel, you’d want your agent to know Neon already and what to do with it. To make sure this is the case, now when you install a Marketplace integration from the CLI, it now also pulls that provider's agent skills from [skills.sh](https://skills.sh/neondatabase/agent-skills):

**[ADD CLIP 2]**

Instead of guessing and reinventing workflows, your agent will gets Neon's own guidance on how to work with Postgres and the rest of the primitives.

By the way if you ever want the skills without provisioning anything, you can also install them directly:

```
npx skills add neondatabase/agent-skills -y
```

## Tell your agent to deploy Neon

Agents are the first-class interface for deploying Neon. There’s a few ways to get Neon context and tooling in front of an agent - the Vercel CLI adds one more:

| Path | Provisions a database? | MCP / tooling | Best when |
| --- | --- | --- | --- |
| Vercel CLI `vercel integration add neon` | Yes - on your Vercel project | No MCP setup. Connection vars via vercel env pull | You’re working on Vercel |
| Cursor plugin [cursor.com/marketplace/neon](https://cursor.com/marketplace/neon) | No - waits for your input | Neon MCP server | You’re in Cursor and want live Neon access |
| Claude Code plugin `claude plugin install neon@claude-plugins-official` | No - waits for your input | Neon MCP server | You’re in Claude Code and want live Neon |
| `npx neon@latest init` | No - waits for your input | OAuth auth, API key, MCP config, plus the Neon extension for Cursor/VS Code when applicable | You want a full Neon setup for a project |

Try it, and if you get stuck, you'll find us in the [Discord](https://neon.com/discord).
