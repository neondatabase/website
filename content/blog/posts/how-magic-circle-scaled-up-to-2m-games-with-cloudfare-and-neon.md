---
title: How Magic Circle Scaled Up To 2M Games With Cloudflare and Neon
description: >-
  The team ships new iterations daily supported by their serverless infra. The
  cherry on top: Neon branching
excerpt: >-
  “We’re a small team, but we’re scaling quickly and doing a lot. We’re shipping
  multiple times a day— to do that, we need to test stuff quickly and merge to
  main very quickly as well. Neon branches are a game changer for this.” (Avi
  Romanoff, Founder at Magic Circle) Magic Circle...
date: "2024-12-12T18:28:46"
updatedOn: "2024-12-12T21:03:34"
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-magic-circle-scaled-up-to-2m-games-with-cloudfare-and-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How Magic Circle Scaled Up To 2M Games With Cloudflare and Neon - Neon
  description: >-
    The Magic Circle team ships new iterations of their games daily supported by
    their serverless infra running on Cloudflare and Neon.
  keywords: []
  noindex: false
  ogTitle: How Magic Circle Scaled Up To 2M Games With Cloudflare and Neon - Neon
  ogDescription: >-
    The Magic Circle team ships new iterations of their games daily supported by
    their serverless infra running on Cloudflare and Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-magic-circle-scaled-up-to-2m-games-with-cloudfare-and-neon/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-magic-circle-scaled-up-to-2m-games-with-cloudfare-and-neon/neon-magic-circle-1-1024x576-a2795d67.jpg)

<blockquote>
<p><strong>“We’re a small team, but we’re scaling quickly and doing a lot. We’re shipping multiple times a day— to do that, we need to test stuff quickly and merge to main very quickly as well. Neon branches are a game changer for this.”</strong> </p><p><em>(Avi Romanoff, Founder at Magic Circle)</em></p>
</blockquote>

[Magic Circle](https://magiccircle.studio/) is a new game studio that helps you connect with friends online through a collection of fun multiplayer games, available on the web and inside Discord. They’re building a relaxed, wonderfully silly low-pressure environment where friend groups hang out online and take a break from their busy schedules.

<figure>
<video autoPlay loop width="640" height="360" src="https://cdn.neonapi.io/public/videos/pages/blog/how-magic-circle-scaled-up-to-2m-games-with-cloudfare-and-neon/magic-circle-2-1a9ce55c.mov" playsInline></video>
</figure>

Last July, Magic Circle won [Discord’s “Best Chill/Party Game” competition](https://discord.com/blog/discord-app-pitches-2024-category-winners#heading-5). Their games are now accessible from any Discord server, private messages, or even group video calls—perfect for when you and your team need a break:

<figure>
<a href="https://discord.gg/yqWUuTAtS9">
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-magic-circle-scaled-up-to-2m-games-with-cloudfare-and-neon/screenshot-2024-12-12-at-102019percente2percent80percentafam-1024x745-f4cc1180.png" alt="Image" />
</a>
<figcaption><em>Magic Circle also has a Discord server (duh). Join it </em><a href="https://discord.gg/yqWUuTAtS9"><em>here</em></a></figcaption>
</figure>

## Scaling to millions of games with an infra bill below $500

<blockquote>
<p>“I’ve been building multiplayer games for a long time, and the database question has always been an interesting one. Traffic is often spikey, so in an ideal world, you’d have many small servers that spin up and down based on demand—but the challenge is creating a database that matches that setup, yet still acts as a single source of truth. The solution for us has been Neon and Cloudflare Durable Objects.” </p><p><em>(Avi Romanoff, Founder at Magic Circle) </em></p>
</blockquote>

Magic Circle’s entire infrastructure is designed to be lightweight and cost-efficient: a serverless architecture was a no-brainer. **By combining Cloudflare and Neon, Magic Circle facilitates millions of game sessions and requests at a fraction of the cost of traditional setups.**

<figure>
<a href="https://www.linkedin.com/posts/aviromanoff_one-million-magic-circle-games-played-activity-7247211972990033924-XVxF?utm_source=share&utm_medium=member_desktop">
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-magic-circle-scaled-up-to-2m-games-with-cloudfare-and-neon/screenshot-2024-12-12-at-102258percente2percent80percentafam-727x1024-599a5aa6.png" alt="Image" />
</a>
<figcaption><a href="https://www.linkedin.com/posts/aviromanoff_one-million-magic-circle-games-played-activity-7247211972990033924-XVxF?utm_source=share&amp;utm_medium=member_desktop">Source</a></figcaption>
</figure>

This is how they do it:

- [Cloudflare Workers](https://workers.cloudflare.com/) **for game logic.** These edge workers minimize latency for players across 30+ countries by processing requests and responses closer to users.
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) **for session management.** Durable Objects are a cornerstone of Magic Circle’s architecture. They handle state management for multiplayer sessions, allowing each game session to act effectively as a “tiny server”.
- [Routing](https://developers.cloudflare.com/workers/configuration/routing/routes/) **for versioning**. Cloudflare also plays a role in routing players to the correct version of the game. This allows different groups to play on different versions simultaneously, essential for Magic Circle’s fast development cycles (more about this below).
- [Neon](https://neon.tech/home) **as the relational database.** Neon is the serverless Postgres database storing core player data like accounts, game progress, stats, and in-game currency. Gameplay logic is managed at the edge, and Neon handles all persistent info.

## Bringing fast software lifecycles to gaming

<blockquote>
<p>“While games typically ship on multi-week release cycles, we want to ship as fast as possible — so we built a pretty cool in-house game platform on top of Cloudflare and Neon that lets us deploy multiple times a day, in minutes, with zero downtime.” </p><p><em>(Avi Romanoff, Founder at Magic Circle)</em></p>
</blockquote>

**Something unique about Magic Circle’s development approach is how they bring a rapid iteration strategy—typically seen in web development—to the world of multiplayer gaming.** Their workflow enables them to ship updates multiple times a day, with [Neon branches](https://neon.tech/docs/introduction/branching) serving as a cornerstone of this process.

In Neon, users can instantly create database branches, which act as fully isolated copies of the database, including both data and schema. These branches are widely used for [creating development and testing environments](https://neon.tech/use-cases/dev-test) that are ephemeral and cost-effective, allowing teams to iterate quickly on features, fix bugs, or test database schema changes.

This is exactly how Magic Circle uses branching. Not only do they iterate multiple times a day, but they also frequently ship entirely new games in under a week. This process involves updating game logic, introducing new UI elements, and modifying database structures to support new gameplay mechanics. Such speed would be nearly impossible with a traditional managed database setup tied to a monolithic server, but Neon brings them a more modern workflow where the database is no longer a bottleneck.

## How Magic Circle uses Neon branches to ship faster

<blockquote>
<p>“We have a bot that comments on every pull request on GitHub every time there’s a new PR branch. We get a totally isolated copy to test code changes even when they include database migrations. We can test all changes in real data and ensure that by the time we actually merge the PR to main, things really work”  </p><p><em>(Avi Romanoff, Founder at Magic Circle)</em></p>
</blockquote>

Let’s take a closer look at Magic Circle’s branching workflows.

**1/ A Neon branch is created per every PR using the GitHub Integration.**

- Each pull request in GitHub automatically triggers the creation of a dedicated Neon branch via a GitHub Action.
- Any schema migrations included in the PR are executed against this branch, ensuring they work as intended without disrupting production.
- A GitHub bot comments on the PR with the branch details.

**2/ End-to-end testing is done against a Neon branch first.**

- Neon branches are fully integrated into Magic Circle’s infrastructure, enabling end-to-end testing in environments that mimic production.
- The testing setup includes the PR code, live game servers, and the isolated Neon branch, ensuring thorough validation of new features and database changes.
- This allows the team to validate multiplayer features and gameplay mechanics before merging to prod, ensuring smooth operation across all components without the hiccups associated with testing on seed data.

**3/ Every developer gets their own Neon branch as an isolated environment.**

- Each developer in the team also has access to a dedicated Neon branch for their dev needs.
- These branches are linked to personal development environments using [Cloudflare Tunnel,](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) allowing developers to run fully isolated versions of the game with a live database backend.
- Developers can test their changes without interfering with others, and each dev environment can be personalized while ensuring that every branch mirrors the production database.

**4/ Rollbacks are executed fast via branches.**

- Even if this is not needed often (🤞) Neon’s [Branch Restore](https://neon.tech/docs/guides/branch-restore) makes rollbacks straightforward and reliable without downtime.
- In the very rare case when a problematic commit is indeed merged to production, Magic Circle creates a new Neon branch from a specific point in time to revert to a known good state.
- This process is ready immediately, minimizing potential downtime—something essential in gaming.

## Try it yourself

Database branching workflows might seem a bit outlandish at first, but once you try them, [you’ll be converted](https://neon.tech/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle). With Neon’s Free Plan, you can create up to 10 branches per project to get a feel for it—sign up [here](https://console.neon.tech/signup). It only takes seconds and you don’t need a credit card.

Once you’re set up, don’t forget to play Magic Circle with your friends [in Discord](https://discord.com/application-directory/1227719606223765687) or on the web at [magiccircle.gg](https://magiccircle.gg/). To learn more about them and their company, [give this podcast a listen](https://a16z.com/podcast/next-gen-gaming-ai-souls-real-time-culture-personalized-avatars/).
