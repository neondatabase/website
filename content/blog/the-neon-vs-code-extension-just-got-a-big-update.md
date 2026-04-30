---
title: The Neon VS Code Extension Just Got a Big Update
description: 'It brings Neon projects, branches, and DB management directly to VS Code'
excerpt: >-
  If you’ve a VS Code user, you might remember the Neon extension under its
  earlier name, Neon Local Connect. We recently shipped an update for the
  extension with much more complete functionality: it now understands the
  repository you have open, detects real Neon connection strings...
date: '2026-01-23T17:00:37'
updatedOn: '2026-01-23T17:00:38'
category: product
categories:
  - product
authors:
  - jeff-christoffersen
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-neon-vs-code-extension-just-got-a-big-update/cover.jpg
  alt: null
isFeatured: false
seo:
  title: The Neon VS Code Extension Just Got a Big Update - Neon
  description: >-
    We recently shipped an update for the Neon VS code extension: it now brings
    Neon projects, branches, and DB management directly to VS Code.
  keywords: []
  noindex: false
  ogTitle: The Neon VS Code Extension Just Got a Big Update - Neon
  ogDescription: >-
    We recently shipped an update for the Neon VS code extension: it now brings
    Neon projects, branches, and DB management directly to VS Code.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-neon-vs-code-extension-just-got-a-big-update/social.jpg
source:
  wpId: 12282
  wpSlug: the-neon-vs-code-extension-just-got-a-big-update
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-neon-vs-code-extension-just-got-a-big-update/neon-vs-code-1-1024x576-fc0fc6bc.jpg)

If you’ve a VS Code user, you might remember the Neon extension under its earlier name, [Neon Local Connect](https://neon.com/blog/neon-now-runs-in-vs-code). We recently shipped an update for the extension with much more complete functionality: it now understands the repository you have open, detects real Neon connection strings in your project, and lets you connect to the corresponding Neon project and branch with a click. You can explore schemas, manage tables, run queries, and switch branches, all without leaving VS Code.

**Get it** [here](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect).

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-neon-vs-code-extension-just-got-a-big-update/screenshot-2026-01-22-at-60418-pm-1024x752-750ba20e.png)

## How the extension evolved

The first version of the Neon VS Code extension was built around the idea of [making Neon branches feel like a local Postgres database](https://neon.com/guides/neon-local). It relied on a [Docker-based local proxy](https://neon.com/blog/make-yourself-at-home-with-neon-local) that exposed a static localhost connection string. Your application always connected to the same local endpoint, while the extension handled routing traffic to different Neon branches behind the scenes.

This made it easy to switch branches and reset environments without touching application configuration, but over time we realized this model wasn’t the best foundation. The local proxy added friction – it required Docker to be running, introduced another moving piece in the development loop, and didn’t always play well with newer serverless drivers and connection patterns.

VS Code users also wanted a tighter integration with Neon, so **we rebuilt the extension to make working with Neon feel native to your editor.** In the updated extension, the local proxy layer is gone. Instead, the extension looks at the workspace you have open in VS Code, detects whether your application is already configured to use Neon, and connects you directly to the corresponding cloud project and branch. Branch switching, database inspection, and management now happen at the Neon level vs through an emulated local endpoint.

## The updated experience

<video autoPlay muted loop width="2376" height="1512">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/the-neon-vs-code-extension-just-got-a-big-update/connect-and-see-data-91118d61.mov" />
</video>

Whether you’re starting from scratch or opening an existing project, the flow is intentionally lightweight:

### Authenticate and connect to Neon

The first step is signing in. Authentication happens through an OAuth flow in your browser, after which the extension stores an API token and stays connected to your Neon account. From then on, your editor has access to the Neon organizations, projects, and branches you can work with (you don’t need to login again).

### Connect an app to Neon (or detect an existing setup)

Once your editor is authenticated, the extension looks at the current workspace and guides you based on what it finds:

- If your project isn’t using Neon yet, you click on “Get started with Neon” – a guided setup will pop up. You’ll choose a Neon organization and project (or create a new one), and the extension will handle provisioning and configuration.
- If your project is already configured with a Neon connection string, the extension detects it automatically, it calls Neon’s APIs to determine which project and branch that connection belongs to, and lets you connect to it with one click.

<video autoPlay muted loop width="2394" height="1512">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/the-neon-vs-code-extension-just-got-a-big-update/get-started-ea533240.mov" />
</video>

<Admonition type="info" title="Behind the scenes">
Under the hood, this uses the [neon init](https://neon.com/blog/one-command-to-bridge-cursor-and-neon) flow: creating a project if needed, creating a branch, and retrieving the appropriate connection string. That connection is then written directly into your project (such as into a .env file) so your app is ready to run.
</Admonition>

### Manage your database

Once connected, the extension turns VS Code into a window onto your Neon database. You can browse databases, schemas, tables, create and modify database objects, and inspect columns, indexes, constraints, and policies. The built-in SQL editor includes syntax highlighting and linting, and lets you run queries against the connected branch and export results as CSV or JSON. There’s also a table view for inspecting and editing data directly. All of this happens against a real Neon branch in the cloud now, without a local proxy.

## Working with Neon branches

[Branching](https://neon.com/docs/introduction/branching) is one of Neon’s key features ([more like a core primitive](https://neon.com/docs/get-started/dev-experience#workflows)), and in the updated VS Code extension it’s treated as a first-class workflow.

Once you’re connected, the extension shows which Neon project and branch your editor is currently working against. From there, you can move beyond a single environment. The extension isn’t limited to the branch wired into your app – you can browse all available projects and branches and connect to any of them directly:

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-neon-vs-code-extension-just-got-a-big-update/image-12-1024x704-9aaf2fab.png)

Switching branches (e.g. for moving between dev, staging, or testing work) happens at the Neon level and is immediately reflected in the editor:

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-neon-vs-code-extension-just-got-a-big-update/image-13-1d434095.png)

The “All branches” view lets you inspect and connect to branches across projects:

<video autoPlay muted loop width="1326" height="1040">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/the-neon-vs-code-extension-just-got-a-big-update/all-branches-9568f430.mov" />
</video>

From the branch view, you can also use the Neon Console for deeper actions like [resetting a branch back to its parent](https://neon.com/docs/guides/reset-from-parent):

<video autoPlay muted loop width="2384" height="1512">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/the-neon-vs-code-extension-just-got-a-big-update/reset-branch-f37cedd3.mov" />
</video>

## Built-In MCP support

Another update with the new version: when you authenticate the Neon VS Code extension, it now automatically configures the [Neon MCP server](https://neon.com/docs/ai/neon-mcp-server). The extension also manages this configuration for you over time, e.g. if the MCP server configuration is missing or removed, the extension detects it and offers to reconfigure it.

MCP support can also be disabled entirely from the extension settings, in which case the configuration is removed and won’t be reinstalled automatically, or [switched to ‘read-only’ mode to ensure that any potentially destructive actions are disabled in the MCP server.](https://neon.com/blog/mcp-safety-cheatsheet#use-read-only-mode)

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-neon-vs-code-extension-just-got-a-big-update/image-15-1024x460-448dab42.png)

## Try the new workflow

This update turns the Neon VS Code extension into a more direct, editor-native way to work with Neon. [Install or update the Neon VS Code extension](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect) and give it a try. We’d also love your feedback – tell us on [Discord](https://discord.gg/92vNTzKDGp).
