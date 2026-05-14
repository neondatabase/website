---
title: 'A PostgREST-Compatible Data API, Now on Neon'
description: >-
  Query Postgres over HTTPS with JWT + RLS, with per-branch endpoints. Built for
  developers and agents
excerpt: >-
  The Neon Data API is now live, a PostgREST-compatible way to query Neon
  directly over HTTPS. If you’ve used PostgREST before (or you have a platform
  built on it), you’ll feel right at home: the protocol for the Neon Data API is
  identical, and migration is as simple as pointing yo...
date: '2025-10-02T15:34:34'
updatedOn: '2026-01-02T17:40:31'
category: app-platform
categories:
  - app-platform
  - product
authors:
  - ruslan-talpa
  - luis-tavares
  - luis-neves
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/a-postgrest-compatible-data-api-now-on-neon/cover.jpg
  alt: null
isFeatured: true
seo:
  title: 'A PostgREST-Compatible Data API, Now on Neon - Neon'
  description: >-
    The Neon Data API is now live, a re-implementation of PostgREST in Rust
    built directly into Neon’s proxy fleet.
  keywords: []
  noindex: false
  ogTitle: 'A PostgREST-Compatible Data API, Now on Neon - Neon'
  ogDescription: >-
    The Neon Data API is now live, a re-implementation of PostgREST in Rust
    built directly into Neon’s proxy fleet.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/a-postgrest-compatible-data-api-now-on-neon/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/a-postgrest-compatible-data-api-now-on-neon/neon-postgrest-2-1024x576-51b0e6e4.jpg)

The [Neon Data API](https://neon.com/docs/data-api/get-started) is now live, a PostgREST-compatible way to query Neon directly over HTTPS. If you’ve used PostgREST before (or you have a platform built on it), you’ll feel right at home: the protocol for the Neon Data API is identical, and migration is as simple as pointing your client to a new endpoint and updating your auth configuration.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/a-postgrest-compatible-data-api-now-on-neon/image-10-1024x435-51855e36.png)

![Post image](https://cdn.neonapi.io/public/images/pages/blog/a-postgrest-compatible-data-api-now-on-neon/image-11-1024x419-c6ead81b.png)

Under the hood, the Data API is a re-implementation of PostgREST in Rust built directly into Neon’s proxy fleet. We built it this way to make it an integrated part of the Neon platform so that it is seamless, reliable and performant for customers. This Data API is CPU/memory efficient, multi-tenant, and designed to scale across thousands of databases without extra moving parts.

The Data API is another building block in the Neon toolbox. If what you need is to stand up a full backend quickly (say you’re building an AI agent) **Neon now gives you [auth](https://neon.com/docs/neon-auth/overview) + a REST API + a Postgres database in 1 minute.** All of it comes with autoscaling, branching, and scale-to-zero built in.

<YoutubeIframe embedId="miTUf5NVMU8" isDocPost={false} />

## PostgREST is great, but sometimes, you need more scale

[PostgREST](https://docs.postgrest.org/en/v13/) is one of the most beloved open-source projects in the Postgres ecosystem, and we’re happy to be a sponsor. It turns your database into a REST API automatically – tables, views, and functions become endpoints, standard HTTP verbs (GET, POST, PATCH, DELETE) map directly to SQL operations, and access control flows through Postgres RLS. You can go straight from schema to API.

This model has powered thousands of apps and even entire platforms. It’s elegant, it’s simple, and it’s battle-tested.

But if you’re running a platform like Neon, [where we serve many agent platforms that spin up tens of thousands of new databases every day](https://neon.com/use-cases/ai-agents), PostgREST starts to show its limits. Each PostgREST instance is compute-heavy and generally runs on a per-project basis, which works fine for individual apps but starts getting harder to operate efficiently for large multi-tenant environments that need tens of thousands of lightweight APIs at once.

## How Neon’s Data API works

This is the challenge we set out to solve with the latest implementation of Neon’s Data API. After starting the beta in PostgREST and hitting some friction, we decided to move forward with a solution that’s much more integrated into the rest of our platform, while keeping everything PostgREST-compatible to make life easier for developers. This updated version of the Data API is a Rust-based re-implementation of PostgREST built to run as a shared service across the Neon fleet.

This gives us some important benefits:

- **Lighter footprint.** This new Rust implementation is leaner vs PostgREST, consuming less CPU and memory. We can scale to far more databases without wasting resources or raising prices.
- **Multi-tenant by design.** Traditional PostgREST deployments run one process per project. At Neon scale (tens of thousands of active databases at any given time) this becomes fragmented and very compute-heavy. Neon’s Data API now runs as a shared service, much simpler to manage. We’ve also implemented safeguards that help us deliver consistent performance for everyone without having to keep up with PostgREST limits for thousands of separate processes.
- **Every branch is an API.** This implementation also allows us to offer dedicated Data API endpoints for each Neon branch, something that supports the most common Neon workflow – where developers and agents are [using branches](https://neon.com/branching) to build previews, [versioning / checkpoints](https://neon.com/blog/checkpoints-for-agents-with-neon-snapshots), dev environments, and so on.
- **Scale-to-zero.** In Neon databases, compute scales down to zero when the database is not in use – something crucial to save costs at scale, not only for us but for our customers managing very large Postgres fleets. However, we keep the REST service always available so your apps can connect anytime, even if you only pay for compute when it’s active.
- **Auth.** As we saw earlier, the Data API works out-of-the-box with [Neon Auth](https://neon.com/docs/neon-auth/overview), making it simple to build your backend around Neon. But you’re not locked in: you can also bring your own auth provider by pointing the Data API to any JWKS (Auth0, Clerk, Keycloak, etc.).

<Admonition type="tip" title="Migrate from Supabase">
If you’re interested in trying out Neon and have a full backend to migrate, we’ve put together this [complete migration guide](https://neon.com/guides/complete-supabase-migration) for you to follow. Battle-tested by many customers.
</Admonition>

## A kit for full-stack agent platforms

AI agents are expected to work across diverse environments and spin infrastructure up and down on the fly. They need to query data and store results with almost no setup, often in places where developers can’t pre-configure drivers, TCP connections, or credentials.

We’re working to give agent platforms the tools they need to build a backend quickly, with elements that follow the Neon principles of speed of provisioning, flexibility, and no-hands serverless management. So far, you can deploy

- Neon Auth for authentication and user management, issuing JWTs that tie directly into Postgres RLS – or bring your own auth provider by pointing the Data API to any JWKS.
- Neon Data API for a PostgREST-compatible REST layer
- Serverless Postgres underneath it all, with autoscaling, branching, scale-to-zero, and instant restore

The Data API is a great latest addition to the stack, as it removes the friction of connecting agents to Postgres:

- The Data API speaks HTTPS, just like calling OpenAI or Stripe
- Agents can use fetch() or curl, no Postgres client libraries needed
- JWT + RLS ensure each agent has only the access it needs
- Every Neon branch comes with its own endpoint
- While database compute idles down when not in use and wakes up instantly when traffic comes back, the REST service itself is always available, so requests never fail

## Try it

The Data API is out in beta. [Check out our docs](https://neon.com/docs/data-api/get-started) for instructions and [create a free account](https://console.neon.tech/signup) if you don’t have one already. If you have any questions, reach out to us in our [Discord](https://discord.gg/92vNTzKDGp).

<Admonition type="info" title="Building an agent?">
If you’re building a full-stack AI Agent, apply to our Agents Program for higher resource limits, special pricing, and exclusive features. Fill out the form [here](https://neon.com/use-cases/ai-agents) and we’ll respond shortly.
</Admonition>

## A note for Neon RLS users

Neon RLS (previously called Neon Authorize) was a project we launched in 2024 to make it easier to work with Postgres RLS by letting you query the database over HTTP with JWT + RLS.

Going forward, we recommend users start using either the Neon Data API or Postgres RLS directly instead of Neon RLS. The Data API offers a PostgREST-compatible REST surface, while direct Postgres RLS can be used via the serverless driver with JWT self-verification ([docs here](https://neon.com/docs/serverless/serverless-driver#using-transactions-with-jwt-self-verification)).

If you are currently using Neon RLS, we recommend you begin planning a migration. Depending on your setup, this may be very simple, but some setups require changes to your queries. [Here’s a SQL-to-PostgREST translation helper](https://neon.com/docs/data-api/sql-to-rest) to help you convert existing SQL into PostgREST syntax.

_Finally, note that Neon RLS is not the same as Postgres Row-Level Security (RLS). Postgres RLS is a core database feature and it will remain fully supported on Neon._
