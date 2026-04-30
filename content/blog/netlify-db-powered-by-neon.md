---
title: Netlify is Now a One-Stop Shop for Building with AI Agents
description: >-
  Developers and agents can now provision Postgres in one command on Netlify.
  Powered by Neon
excerpt: >-
  Netlify DB is now live – a production-ready Postgres database you can
  provision in one click or CLI command, directly from your Netlify project.
  Powered by Neon, it spins up in seconds with no external signup required. When
  you’re ready, you can claim the database to link it to y...
date: '2025-06-05T21:02:53'
updatedOn: '2025-06-05T21:26:29'
category: ai
categories:
  - ai
  - company
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/netlify-db-powered-by-neon/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Netlify is Now a One-Stop Shop for Building with AI Agents - Neon
  description: >-
    Netlify DB is now live - a free, production-ready Postgres database you can
    provision in one click or CLI command from your Netlify project.
  keywords: []
  noindex: false
  ogTitle: Netlify is Now a One-Stop Shop for Building with AI Agents - Neon
  ogDescription: >-
    Netlify DB is now live - a free, production-ready Postgres database you can
    provision in one click or CLI command from your Netlify project.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/netlify-db-powered-by-neon/social.jpg
source:
  wpId: 9966
  wpSlug: netlify-db-powered-by-neon
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/netlify-db-powered-by-neon/neon-netlify-1-1024x576-0e9dbcb0.jpg)

[Netlify DB is now live](https://www.netlify.com/blog/netlify-db-database-for-ai-native-development/)** – a production-ready Postgres database you can provision in one click or CLI command, directly from your Netlify project**. Powered by Neon, it spins up in seconds with no external signup required. When you’re ready, you can claim the database to link it to your Neon account.

<video autoPlay muted loop width="1904" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/netlify-db-powered-by-neon/netlify-db-clip-449bd1a2.mp4" />
</video>

This launch is part of Netlify’s [Agent Week](https://www.netlify.com/blog/agent-week-2025/), a series of releases focused on making Netlify the best platform for AI-native development. Netlify gives agents and developers instant access to the infrastructure they need, now including the database.

## The Bigger Picture: Netlify for AI-Native Development

AI agents are reshaping how developers build, but great ideas need more than just a model and an API. Just like developers, agents need a great experience. They need fast infrastructure, global hosting, serverless functions, and of course a database.

That’s what the concept of [Agent Experience](https://www.netlify.com/agent-experience/) _(_ or AX) is all about: building an environment that works not just for the humans writing the code, but also for the AI agents interacting with the infrastructure itself – and this is the thinking behind Netlify DB. Agents need databases, but not just any database – they need something that is fast, ephemeral, scalable, and programmatically accessible. [Neon](https://neon.tech/home) checks those boxes, being a perfect fit to power Netlify DB under the hood.

## Why Neon For Agents

**Fast provisioning.** Traditional Postgres services can take minutes to spin up a new instance, and that might be fine when a human is cooking – but AI agents generate code and deploy in seconds. With Neon, [databases are ready almost instantly](https://neon.tech/instant-postgres), which makes real-time provisioning viable even at scale.

**Scale to zero.** Most often than not, AI agents create short-lived databases. In most platforms, that would lead to an explosion in idle resources and cost – but in Neon, unused databases automatically scale to zero.

**API-first management.** Neon’s API lets platforms, developers, and agents create and manage databases programmatically. Everything from provisioning to resource limits to telemetry is accessible via well-documented endpoints [tested at scale](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases).

**100% Postgres.** Neon is Postgres, the world’s most-loved database and the best backend for modern apps. Agents and developers can interact using standard SQL, rely Postgres’ extensive documentation and training data, and take advantage of popular extensions like pgvector for embeddings.

## What It’s Like to Use Netlify DB

Netlify DB is designed to feel like a natural part of your Netlify workflow. You can trigger Netlify DB via the [Netlify CLI](https://docs.netlify.com/cli/get-started/) using `netlify init db` or via the Netlify Dashboard (it takes one click):

![Image](https://cdn.neonapi.io/public/images/pages/blog/netlify-db-powered-by-neon/ad4nxfe5x7yokuq6hbiejt6nl2yr5szocsuejahu4covuqytj-v7by5fsc9khlwga3fn2imcffs9ctdqzqkwx8vsk5pcco2no5akm8tvdkswkqxqcn346yuep9l5zdajdpbbi8sbyvew-b3de808d.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/netlify-db-powered-by-neon/netlify-cli-da3270a6.gif)

When you add a database, Netlify instantly provisions an anonymous Neon database in the background, in a region that matches your deployed functions so you get low-latency out of the box. Your environment variables are automatically set up and secured. You can start querying the database right away, without a signup flow or credentials to manage.

![Image](https://cdn.neonapi.io/public/images/pages/blog/netlify-db-powered-by-neon/ad4nxfa7xv-jgl8jext-plg8l9qg7l7pyowel8bonigm2oul1kyv4xvzxbydbunek4pfw3deh-8pzcqxzcphduynxh1i3cd1-ixumbxdnsxavo9eu1rk76qt1h8kxtxcx8zlo9snov4-bc0e0439.png)

At any time, you can claim your database (click on “Connect Neon”). From there, you’ll be able to claim your database by creating a (free) Neon account. [If you already have a Neon account](https://console.neon.tech/signup), your new database will connect to your account automatically.

## Try It Out

**Netlify DB is available now.** [Explore the docs](https://docs.netlify.com/storage/netlify-db/) and get started by deploying your first Postgres database right from your Netlify project.
