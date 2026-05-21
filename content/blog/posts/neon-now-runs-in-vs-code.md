---
title: Neon Now Runs in VS Code
description: "Branch, test, and reset from your IDE using Neon Local Connect"
excerpt: >-
  Developers love using Neon branches for a local development, due to the
  agility they provide (e.g. fast resets, isolated environments, and the ability
  to test without polluting production data). But using Neon branches still
  requires you to manage separate connection strings for...
date: "2025-07-21T15:33:32"
updatedOn: "2025-08-14T09:40:36"
category: product
categories:
  - product
  - workflows
authors:
  - jeff-christoffersen
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-now-runs-in-vs-code/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Neon Now Runs in VS Code - Neon
  description: >-
    Neon Local Connect is a new VS Code extension that lets you connect to any
    Neon branch over localhost, no local Postgres setup required.
  keywords: []
  noindex: false
  ogTitle: Neon Now Runs in VS Code - Neon
  ogDescription: >-
    Neon Local Connect is a new VS Code extension that lets you connect to any
    Neon branch over localhost, no local Postgres setup required.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-now-runs-in-vs-code/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-now-runs-in-vs-code/neon-runs-in-vs-1-1024x576-927712c9.jpg)

Developers love using Neon branches for a local development, due to the agility they provide (e.g. fast resets, isolated environments, and the ability to test without polluting production data). But using Neon branches still requires you to manage separate connection strings for different branches and ensure your application and its environment is properly set up to connect.

Today, that gets a lot easier, especially if you’re a VS Code user! **We’re launching** [Neon Local Connect](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect)**, a new VS Code extension that connects your Neon database to your local dev environment using a static `localhost` connection string.**

You can browse your tables, create or reset branches, launch ephemeral test environments, and run queries all from inside your IDE.Behind the scenes, the extension builds on [Neon Local](https://neon.com/blog/make-yourself-at-home-with-neon-local), our open-source Docker proxy for connecting to Neon over `localhost`. But now, it’s fully integrated into VS Code, no CLI setup required.

<figure>
<video autoPlay muted controls width="1920" height="1080" style={{ aspectRatio: "1920 / 1080" }} src="https://cdn.neonapi.io/public/videos/pages/blog/neon-now-runs-in-vs-code/neon-local-connect-vs-code-extension-180b910b.mp4" playsInline></video>
</figure>

## Branching That Feels Local

Running Postgres locally works – until you need it to stay in sync with the rest of your team.

You’re responsible for installing the right version, managing credentials, seeding realistic data, resetting state between test runs, and isolating changes from other projects on your machine. If you’re working in a team, there’s no guarantee your local database matches production or even your teammate’s dev environment. Schema drift is common. Rollbacks are manual. Spinning up a clean environment means rebuilding everything from scratch.

That’s why [Neon branches](https://neon.com/flow) help so much with this workflow. In case you’re not familiar with them, a [branch](https://neon.com/docs/introduction/branching) in Neon is a full, isolated copy of your database created instantly from any parent. It has great potential for improving local workflows:

- It gives you a clean slate for every feature, test, or teammate
- With zero risk of corrupting production or shared dev data (branches are isolated and have their own compute endpoint)
- You can reset instantly to a known schema and data snapshot, avoiding drift
- They let you test migrations in isolation, then throw them away (they’re great as ephemeral environments)

This is all great, but if you want to start using Neon branches as your “local” Postgres, connecting your app to those branches required a bit of work (wiring up credentials, managing TLS, switching tools). We first built [Neon Local](https://neon.com/blog/make-yourself-at-home-with-neon-local) to help, but it still required Docker setup and scripting. [With Neon Local Connect,](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect) you can connect to any branch directly from your editor, using a static localhost connection string. It behaves exactly like a local Postgres instance, but backed by Neon’s serverless cloud and branching engine.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-now-runs-in-vs-code/ad4nxd2v9ejtxnqjlipbseaaqvyt8th1krvvnupfwgjaze6zdqdugknqdvvrhx3byv16b2heogtrsuakrkr-lobw1z58quf8u01xrpwiun5bw2zc50ghxywpmcolupu72jqgbf-e1c9f7fd.png)

## How Neon Local Connect Works

Behind the scenes, this extension is using a Docker-based local proxy (via [Neon Local](https://neon.com/blog/make-yourself-at-home-with-neon-local)) to route traffic from localhost to your Neon database branch. The extension handles authentication, networking, and branch selection for you. All you have to do is select which branch you want to connect to and run your application.

Here’s what the workflow looks like: First, you install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect). Once you’ve done that, you sign in with your Neon account. You can use OAuth for a fast, one-click login using your browser, or provide an API key if you want finer-grained access or plan to use ephemeral branches (which require long-lived credentials for cleanup). Once authenticated, the extension fetches your Neon projects and branches so you can quickly connect to an existing environment or create a new one on the fly.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-now-runs-in-vs-code/ad4nxf9sulywemr04k32s3k-w14g1it6h7jdzpkvrcrm8vfe0xvweybknaspy9rsbask1xpyv6qyaqqhqto3exo71hrwdx5d9abpccusqtv2ga4p73ejiqmjckrwnvov4kjv6hjxeq-c61cca07.png)

Once you’re in, you can pick a branch from your Neon project or create a new one directly from the extension by choosing a parent branch and giving it a name:

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-now-runs-in-vs-code/ad4nxcp-vv0ecpkgynpwcvh9gtbc5lre-b9xfztjg9cxaay3tv0u7csy3tfbpknf7-w6tvbzs7zgevalhu4xv6mgbfph4tejtvzhplefkwvlis6c-ses0yge-cjpfqu-dr0ye-oew-c06b66be.png)

Then, click Connect:

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-now-runs-in-vs-code/ad4nxd6rzn0ujzf5ziqob3ef5xvdz8d1rdg3yc0kdgrsfxi7dqpoxzfmqjjbliaaceb7tf-wjrpqkrmnn4jdgaqfrb6a0y4-ve2qj93quzawuxdzi8vxyzy-rjydnn0xavb5zmk65q-a27f9894.png)

The extension launches a local Docker container that exposes a static Postgres connection at `localhost:5432`. Your app connects using a fixed connection string:

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-now-runs-in-vs-code/ad4nxfu95j-ef6qkuyydghpbrpjztsjr2zhx8uriswjzkruon3n74ke4wgfbpti5r8rb5yh9ynpw1vmld8x78wbssxmnjahj-axapapaq8t2khu9h3mw3tqfedu3cgr1mbwkuroykz8a-f4414469.png)

From your app’s point of view, it’s talking to a local Postgres database – but in reality, all traffic is routed to the Neon branch you selected hosted in the cloud.

You can commit the static `localhost` connection string to your project’s repo or CI config, and easily swap between branches in your IDE as needed.

## What You Can Do With It

This extension turns your editor into a control panel for your Neon database.

### Create new branches on the fly

Need a fresh environment for a new feature, teammate, or experiment? You can create a new branch directly in the extension UI. Just give it a name and choose a parent branch (e.g. main). Your new branch will be provisioned instantly, with the same schema and data as the parent. This is a frictionless way to isolate work without stepping on shared environments.

### Query your database

If you need to inspect or debug data, you can launch a psql shell right in your terminal or open the Neon SQL Editor in your browser. You’ll always be querying the currently connected branch, so it’s easy to stay in context.

### Launch ephemeral test databases

One of the coolest things about this extension is that it supports ephemeral branches – disposable, short-lived environments created for test runs, previews, or one-off scripts. When you disconnect, the branch is automatically deleted.

<Admonition type="important">
Ephemeral branches require an API key for auth to ensure cleanup works even after the session ends. [See the docs.](https://neon.com/docs/local/neon-local-vscode)
</Admonition>

### Branch, reset, and iterate

The extension also lets you quickly reset your database branch to its parent state. This is perfect for rerunning tests, reverting schema changes, or wiping stale data. Just click Reset, and your branch rolls back to a clean snapshot.

## Try it Out

You can install Neon for VS Code today. All you need is:

- A Neon account (sign up [here](https://console.neon.tech/signup))
- Docker running locally
- VS Code
- And [installing the extension](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect) from the marketplace

We’d love to hear what you build with it. Drop feedback in [our Discord](https://discord.gg/92vNTzKDGp)!
