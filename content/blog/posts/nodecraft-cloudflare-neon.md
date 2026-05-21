---
title: How Nodecraft Built a Scalable Game Server Platform with Cloudflare and Neon
description: >-
  Hosting multiplayer games with serverless tools for scalability and
  performance
excerpt: >-
  “Moving from legacy infrastructure to a fully serverless stack has been a huge
  upgrade. We wanted our backend to be as hands-off as possible. Now we get all
  the power of Postgres, without having to think about it” (James Ross,
  Co-founder and CTO at Nodecraft) Nodecraft is a game...
date: '2025-03-20T18:33:57'
updatedOn: '2025-03-20T18:42:30'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/nodecraft-cloudflare-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    How Nodecraft Built a Scalable Game Server Platform with Cloudflare and Neon
    - Neon
  description: >-
    To improve their scalability and performance, Nodecraft transitioned to a
    serverless architecture built on Cloudflare and Neon.
  keywords: []
  noindex: false
  ogTitle: >-
    How Nodecraft Built a Scalable Game Server Platform with Cloudflare and Neon
    - Neon
  ogDescription: >-
    To improve their scalability and performance, Nodecraft transitioned to a
    serverless architecture built on Cloudflare and Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/nodecraft-cloudflare-neon/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/nodecraft-cloudflare-neon/neon-nodecraft-1-1024x576-2ba56f82.jpg)

<blockquote>
<p><strong>“Moving from legacy infrastructure to a fully serverless stack has been a huge upgrade. We wanted our backend to be as hands-off as possible. Now we get all the power of Postgres, without having to think about it”</strong> (James Ross, Co-founder and CTO at Nodecraft) <br></br></p>
</blockquote>

[Nodecraft](https://nodecraft.com/) is a game server hosting platform that makes it easy for players to spin up and manage multiplayer servers for over 30 games, including Minecraft, ARK, Rust, and more.

<figure>
<a href="https://nodecraft.com">
<img src="https://cdn.neonapi.io/public/images/pages/blog/nodecraft-cloudflare-neon/screenshot-2025-03-20-at-112825percente2percent80percentafam-1024x714-269dd240.png" alt="Image" />
</a>
<figcaption>Visit <a href="https://nodecraft.com">nodecraft.com</a> to explore their features</figcaption>
</figure>

Nodecraft serves both individual gamers and game studios, operating its own bare-metal infrastructure in data centers worldwide. To improve their scalability and performance, they’ve been transitioning much of their stack to a serverless architecture— let’s take a closer look at how they’re doing it.

## The Challenge: Scaling and Customizing Game Server Configurations

Nodecraft supports [30+ different games](https://nodecraft.com/games), each with its own unique requirements. Every game requires custom configurations, control panels, and server settings. Previously, the team hand-built bespoke control panels and in-house databases for each game—a process that worked but was time-consuming to maintain.

Adding to the complexity, Nodecraft’s player base spans the globe, and latency is a critical factor for multiplayer experiences. Their traditional backend setups weren’t fully optimized for distributed, low-latency access, requiring additional effort to meet performance requirements efficiently.

## Transitioning to Cloudflare Workers + Neon for a Fully Serverless Global Backend

Nodecraft now operates a serverless backend built on [Cloudflare Workers](https://workers.cloudflare.com/) and [Neon](https://neon.tech/home). This architecture eliminates the operational overhead of managing Postgres while simultaneously improving multi-region performance and scalability—a win-win.

<blockquote>
<p>“Scaling quickly used to be a challenge, but Neon gives us Postgres in a fully serverless setup. We don’t have to worry about provisioning or scaling, it just works”  (James Ross, Co-founder and CTO at Nodecraft) </p>
</blockquote>

Here’s the essence of their stack:

- Cloudflare Workers run game configuration logic at the edge, reducing latency for players across multiple regions.
- Neon serves as the central database, storing core user data such as game settings and mod configurations.
- Rulesmith, Nodecraft’s internal rules engine, dynamically builds game server UIs based on stored configurations in Neon.

## Hyperdrive ❤️ Neon

<blockquote>
<p><strong>“Hyperdrive lets us cache the game configuration data we need, making database queries super fast in Neon. It was essentially a one-click integration that worked out of the box” </strong> (James Ross, Co-founder and CTO at Nodecraft) </p>
</blockquote>

Because much of Nodecraft’s game configuration data rarely changes, caching plays a crucial role in optimizing performance. They’ve taken advantage of Cloudflare’s [Hyperdrive](https://v/) to reduce query times and improve the responsiveness of their setup. Beyond caching, Hyperdrive also optimizes connection handling, reducing latency for Nodecraft’s global users.

<Admonition type="note" title="about hyperdrive">
[Hyperdrive](https://developers.cloudflare.com/hyperdrive/) is a globally distributed connection pooler and caching service built by Cloudflare. It helps optimize database performance for serverless environments built on [Cloudflare Workers](https://workers.cloudflare.com/). If you’re not familiar with it, start [here](https://neon.tech/blog/hyperdrive-neon-faq).
</Admonition>

## Using Neon Branching for Faster Development (and Live Demos!)

Like many others, Nodecraft came to Neon for the serverless, and stayed for the branching. Branching in Neon allows Nodecraft to create fully isolated copies of their database in seconds, something that comes handy in multiple scenarios.

<blockquote>
<p><strong>“Neon branches save us so much time. We use them for development and also for conferences, where we can reset our demos with a single API call”</strong> (James Ross, Co-founder and CTO at Nodecraft)</p>
</blockquote>

A couple examples of how Nodecraft likes to use branching:

- Every developer gets their own isolated Neon branch to test changes without interfering with production data.
- PR branches ensure database migrations are tested before merging to production, reducing deployment risks.
- Live demos (e.g. the ones they’re running at [GDC](https://gdconf.com/)) use a dedicated branch that resets every hour, allowing a clean slate for showcasing their platform without hassle.

## Serverless for the win. Try it

By combining serverless Postgres with Neon and edge computing with Cloudflare, Nodecraft has transformed the way they manage infrastructure. If you’d like to try this stack, [get started with Neon’s Free Plan](https://console.neon.tech/signup) (no credit card required, no spam). And as you explore, don’t forget to [use Hyperdrive](https://neon.tech/docs/guides/cloudflare-hyperdrive) for an extra boost!

---

Remember to <a href="https://x.com/nodecraft"><em>follow Nodecraft on X</em></a><em> to see what they’re up to ✨</em>
