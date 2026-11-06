---
title: Neon is now available in Grok Bot
description: Create Neon projects, branch databases and run SQL from your Grok Bot
excerpt: >-
  Neon is now available as a plugin in Grok Bot. You just have to connect your
  Neon account once and you'll be able to ask a Grok bot to build on Neon.
date: '2026-09-01T12:00:00'
updatedOn: '2026-08-31T20:55:00'
category: product
categories:
  - product
authors:
  - dominik-koch
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-is-now-available-in-grok-bot/cover.jpg
  alt: The Neon logo beside a Grok Bot window marked Neon connected, stepping through creating an isolated migration-test branch
isFeatured: false
seo:
  title: Neon is now available in Grok Bot - Neon
  description: Create Neon projects, branch databases and run SQL from your Grok Bot
  keywords: []
  noindex: false
  ogTitle: Neon is now available in Grok Bot - Neon
  ogDescription: Create Neon projects, branch databases and run SQL from your Grok Bot
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-is-now-available-in-grok-bot/cover.jpg
---

[Neon is now available as a plugin in Grok Bot.](https://neon.com/docs/ai/ai-grok-bot-plugin) You just have to connect your Neon account once and you'll be able to ask a Grok bot to build on Neon:

<video width="1920" height="1150" style={{ aspectRatio: '1920 / 1150' }} autoPlay loop muted playsInline src="https://cdn.neonapi.io/public/images/pages/blog/neon-is-now-available-in-grok-bot/neon-bot-demo.mp4"></video>

Under the hood, the plugin pairs Neon agent skills with the [Neon MCP Server](https://neon.com/docs/ai/ai-grok-bot-plugin). The skills give Grok Bot context for Neon workflows and MCP gives it authenticated tools to act on your account.

## What Grok Bot can do

We've been impressed with how good Grok Bot works. Once connected to Neon, Grok Bot will be able to

- Create a Neon project and return a connection string for your app
- Create an isolated branch before testing a migration
- List projects and identify databases you may no longer need
- Run SQL against your database
- Set up routines that summarize database usage
- Coordinate branch handoffs between bots

For example, you can ask things like: *I'm working on a new feature, but it requires a significant migration. Could you help by creating a new branch on our Neon database using the Neon connector, so that I can test it safely first?*

Grok Bot checks the Neon connector, lists your orgs and projects and asks which project to branch from. After you pick one, it creates an isolated copy of production (a Neon branch) and tests the migration there.

![Neon Bot creating a migration-test branch from production and returning the branch id, a pooled connection string, and an Open in console link](https://cdn.neonapi.io/public/images/pages/blog/neon-is-now-available-in-grok-bot/branch-migration-test.png)

The bot returned the branch id, a pooled connection string and an Open in console link. Then it asked whether to point the local `DATABASE_URL` at the new branch.

## Install the plugin

[Here's an install deep link](grokbot://app/v1/plugin/add?id=669) that will open the Neon plugin page in Grok Bot (you'll have to authorize Neon in the browser).

If the deep link above does not open Grok Bot, you can also install from the Plugins directory or simply ask Grok to connect the Neon plugin.

![The Grok Bot Plugins dialog with Neon searched, showing Neon Postgres as the first result with an Add button](https://cdn.neonapi.io/public/images/pages/blog/neon-is-now-available-in-grok-bot/plugins-directory.png)
