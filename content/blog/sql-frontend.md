---
title: Is “SQL from the frontend” viable?
description: 'The answer is complicated, especially when it comes to security'
excerpt: >-
  I’ve worked on apps with a “SQL from the client” architecture and the
  development velocity was simply superb. At the same time, it comes with a lot
  of challenges in terms of security and scalability. So, what’s the deal? Is it
  viable or not? The tl;dr is that the technology is pe...
date: '2024-11-07T18:21:35'
updatedOn: '2025-09-11T18:58:50'
category: engineering
categories:
  - engineering
authors:
  - david-gomes
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/sql-frontend/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: Is "SQL from the frontend” viable? - Neon
  description: >-
    "SQL from the client" architectures are great for development velocity, but
    they come with challenges around security. So, what's the deal?
  keywords: []
  noindex: false
  ogTitle: Is "SQL from the frontend” viable? - Neon
  ogDescription: >-
    "SQL from the client" architectures are great for development velocity, but
    they come with challenges around security. So, what's the deal?
  image: 'https://cdn.neonapi.io/public/images/pages/blog/sql-frontend/social.jpg'
source:
  wpId: 7543
  wpSlug: sql-frontend
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/sql-frontend/neon-sql-from-frontend-1-1024x576-8da32a0d.jpg)

I’ve worked on apps with a “SQL from the client” architecture and the development velocity was simply superb. At the same time, it comes with a lot of challenges in terms of security and scalability. So, what’s the deal? Is it viable or not?

<EmbedTweet url="https://twitter.com/theo/status/1799356056239472899?ref_src=twsrc%5Etfw" text="Actual modern web dev: React -> Postgres https://t.co/3gjRpt0bKH pic.twitter.com/LuDRNwpDlE — Theo – t3.gg (@theo) June 8, 2024" />

The **tl;dr** is that the technology is perhaps not ready yet, but it makes a lot of sense for a large swath of apps – especially prototypes.**But** this is a complex topic, and I’ll go deeper into the security problems near the end of the blog post.

So, when you’re building an app, there’s usually three main components:

`Frontend <> Backend <> Database`

The backend is where most of the business logic lives, and it also serves to abstract the data in your database. Exposing your database directly to the client means that you won’t have a place for your sensitive business logic (more on this later), and it hinders you from evolving your database layer more freely since you won’t have that abstraction layer to cover for you.

What is “sensitive business logic”? Well, it could be many things, but a simple way to think about it is that you’ll typically want your application to integrate with other services and APIs, all of which require credentials which can’t be exposed to the client. Furthermore, there’s actual logic (like algorithms) that you don’t want the world to see.

## So doesn’t this mean that “SQL on the frontend” is dead-on-arrival?

No, it doesn’t. Having your frontend talk directly to your database does **not** mean that you don’t also have a backend. It simply means that there’s a way for the frontend to access data in a “direct” way.

With frameworks like Firebase or PostgREST, the client can directly interface with the data model, even if “database connections” are not being made. In the case of PostgREST, you get a REST API for your data which follows authorization rules that are enforced at the database level (RLS). This means that you probably don’t have an abstraction layer on top of your data (although you could technically achieve that with Postgres views).

And this is totally fine for many apps! By having your UI be able to retrieve and manipulate data directly, your development speed is probably going to skyrocket.

## Why do teams move faster with this architecture?

1. Less abstractions means less code which leads to faster implementation of new features.
2. A lot of companies have “frontend engineers” and “backend engineers”. The less inter-team dependencies, the faster the velocity.

## But could I go to production with an exposed database server?

There’s a few things that traditional databases will have to build in order to make it safe to do “SQL from the frontend”:

1. Some form of [query and query parameter allow-listing](https://neon.tech/docs/guides/neon-authorize-future#query-allow-listing). It’d be essential for developers to be able to dictate up front which query shapes can be sent to the database in production. Otherwise, your database instance will become a free for all crypto mining playground.
   1. This needs to be done _right_, which means that there needs to be really good tooling to automatically generate and maintain these allow-lists over time. (We have some ideas for how Neon could build this from [development branches](https://neon.tech/docs/introduction/branching).)
   2. SurrealDB [implements something like this](https://ddlele.com/posts/surreal-db-row-security#creating-the-users-scope).
2. [Rate limiting](https://neon.tech/docs/guides/neon-authorize-future#proxy-rate-limiting) of requests by IP to prevent DDoS-style attacks.
3. Authorization/Access Rules for the data. As an example, Postgres already has [Row-Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) for this.

## And now what?

As we were working on [Neon RLS](https://neon.tech/blog/introducing-neon-authorize), one of the use cases we considered was “SQL from the frontend” apps. And while it isn’t necessarily ready for that yet, we [wrote down our thoughts on the future of the feature](https://neon.tech/docs/guides/neon-authorize-future) and a lot of what’s in there is indeed geared towards that. This is definitely an area we’re interested in exploring more, so we’d love to get any feedback on it. Please [reach out to me](https://x.com/davidrfgomes) or send us a message on [our Discord server](https://neon.tech/discord) if you have any ideas.

<Admonition type="important" title="Update: Neon RLS is now part of the Neon Data API">
We’ve moved the functionality previously known as Neon RLS / Neon Authorize into the Neon Data API. You can [read more about the Data API here](https://neon.com/docs/data-api/get-started) and start using it in your projects today.
</Admonition>
