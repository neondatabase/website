---
title: Grok Bot plugin for Neon
tag: new
tagTheme: green
summary: >-
  Connect Neon to Grok Bot so you can create projects, work with branches and
  run SQL from chat.
description: >-
  Install the Neon plugin in Grok Bot to create projects, work with branches
  and run SQL from chat.
enableTableOfContents: true
---

The Neon plugin for Grok Bot connects your Neon account. After you authorize it, you can create projects, work with branches and run SQL without leaving Grok Bot.

## Install the plugin

[Add the Neon plugin](grokbot://app/v1/plugin/add?id=669) in Grok Bot. The link opens the Neon Postgres plugin page.

If the link does not open Grok Bot, install from the plugins directory:

1. Launch Grok Bot.
2. Select **Plugins** in the sidebar.
3. Enter `neon` in the search field.
4. Select **Add** next to **Neon Postgres**.

![Plugins directory in Grok Bot, searching for Neon](/docs/ai/grok_bot_plugins_search.png 'no-border')

## Ask for the Neon connector

You can skip the plugins directory. In a Grok Bot chat, ask it to connect Neon:

```text
Can you connect Neon?
```

The bot finds the Neon Postgres plugin and asks you to confirm. Then it shows a connect card in the chat. Authorize Neon in the browser when that card appears.

## Connect your Neon account

After you add the plugin, Grok Bot asks you to authorize Neon in the browser. The plugin page then shows the default account as **Connected**.

To connect another Neon account, add it from the plugin page and authorize it the same way.

![Neon Postgres plugin in Grok Bot, with the default account Connected](/docs/ai/grok_bot_plugin.png 'no-border')

## Use Neon in Grok Bot

Once it's connected, you can ask a bot to:

- Create a project and get a connection string for your app
- Create an isolated branch to test a migration
- List projects and see which databases are unused
- Create a routine that summarizes database usage
- Coordinate a branch handoff between bots

![Grok Bot using the Neon plugin to list organizations](/docs/ai/grok_bot_chat.png 'no-border')

Try one of these:

Create a project and connect your app:

```text
Create a Neon project for this application and help me connect to it.
```

Create a branch for a migration:

```text
Create an isolated Neon branch for testing this migration.
```
