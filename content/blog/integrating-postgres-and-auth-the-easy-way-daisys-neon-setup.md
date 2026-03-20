---
title: 'Integrating Postgres and Auth the Easy Way: Daisy’s Neon Setup'
description: >-
  A look at how a generative media studio built a unified backend for its
  generative media apps
excerpt: >-
  “Using Neon with Neon Auth just made everything simpler. Our database and auth
  live in the same place, and it’s the kind of backend you forget it exists.
  That’s exactly how it should be” Gabriel Tumlos, Founder of Daisy Daisy is a
  generative media studio building tools that make...
date: '2025-11-18T19:13:50'
updatedOn: '2026-01-02T17:39:02'
category: app-platform
categories:
  - app-platform
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/integrating-postgres-and-auth-the-easy-way-daisys-neon-setup/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Integrating Postgres and Auth the Easy Way: Daisy’s Neon Setup - Neon'
  description: >-
    Daisy built a simple, peformant backend with Neon and Neon Auth: one
    database, one auth layer, and a smooth path to frequent releases.
  keywords: []
  noindex: false
  ogTitle: 'Integrating Postgres and Auth the Easy Way: Daisy’s Neon Setup - Neon'
  ogDescription: >-
    Daisy built a simple, peformant backend with Neon and Neon Auth: one
    database, one auth layer, and a smooth path to frequent releases.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/integrating-postgres-and-auth-the-easy-way-daisys-neon-setup/social.jpg
source:
  wpId: 11563
  wpSlug: integrating-postgres-and-auth-the-easy-way-daisys-neon-setup
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/integrating-postgres-and-auth-the-easy-way-daisys-neon-setup/neon-daisy-1-1024x576-c6faef41.jpg)

> **“Using Neon with Neon Auth just made everything simpler. Our database and auth live in the same place, and it’s the kind of backend you forget it exists. That’s exactly how it should be”**<br /><br />_Gabriel Tumlos, Founder of [Daisy](https://daisy.so/)_

[Daisy](https://app.daisy.so/) is a generative media studio building tools that make creativity instant. Their main app lets anyone generate and remix images or videos, with a growing collection of smaller “mini apps” that focus on specific formats and ideas. Each mini app is self-contained, simple to use, and designed to capture a moment in its best light. Simply upload a [headshot](https://linkedinpro.daisy.so), a [product](https://easypdp.daisy.so), or an idea for an [outfit](https://ssenseless.daisy.so), a [poster](https://posterfy.daisy.so), or a [meal](https://dashify.daisy.so), and Daisy takes it from there.

That rhythm of constant release defines Daisy’s philosophy. The team builds for what they call “the generation that refuses to wait” – creators who expect expressive tools to work as fast as they think.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/integrating-postgres-and-auth-the-easy-way-daisys-neon-setup/screenshot-2025-11-18-at-110913-am-1024x638-b000fea0.png" alt="Image" />
<figcaption>Try it: https://app.daisy.so/</figcaption>
</figure>

## Picking a Backend That Just Works

For Daisy, the backend has to be as seamless as their creative process. Every new app they launch needs access to the same user accounts, generations, and referral data without extra setup or configuration. The team’s stack reflects that balance of automation and simplicity – [Ingest](https://www.inngest.com/) manages job queues, [Railway](https://railway.com/) handles deployments, and [Neon](https://neon.com/) powers the database and authentication.

When they first came across Neon, they adopted it almost immediately. Setup was fast, automation was easy, and the experience matched the team’s preference for tools that get out of the way. Once integrated, Neon became part of Daisy’s weekly release rhythm. New mini apps can plug into the same shared database and auth layer with minimal work.

> **“It was pretty quick to get started, and once we automated the setup, Neon just became part of how we ship”** _(Gabriel Tumlos, Founder of [Daisy](https://daisy.so/))_

## Unified Login with Neon Auth

Authentication was one of the trickiest parts of Daisy’s early setup. Each new app needed to manage user signups, sessions, and permissions, but rebuilding that flow for every release would become unmanageable. So Daisy wanted a single authentication system that could cover every app in their ecosystem without extra services or synchronization.

That’s where [Neon Auth](https://neon.com/docs/neon-auth/overview) comes in. It lets Neon developers manage users and sessions within the same database that stores their application data, avoiding them to setup a separate auth database or API proxy and simplifying their setup.

> **“Neon Auth was already part of our database, so it just made sense. It speeds things up and keeps everything in one place”** _(Gabriel Tumlos, Founder of [Daisy](https://daisy.so/))_

For Daisy, this structure solved three problems at once:

- **Unified flow:** Every Daisy app uses the same Google login through Neon Auth, ensuring users only sign in once across the entire platform.
- **Simplified onboarding:** Auth data lives in the same database as generations and referrals, so no schema duplication or sync logic is needed.
- **Faster rollout:** Adding a new mini app is as simple as approving it inside Neon Auth’s configuration list. Once added, it inherits the same secure OAuth flow automatically.

Here’s what that looks like in practice for them:

- Daisy maintains a single Neon project where both app data and user identities live.
- When a new mini app launches, it’s registered with Neon Auth by adding its domain or client ID to the approved apps list.
- The app then automatically connects to the shared login system, reusing the same Postgres-backed sessions and user table.

## Wrap Up

Daisy’s setup is simple and effective – one database, one auth layer, and a smooth backend that allows them to keep their rhythm of steady releases. Try a similar setup for your own app with the [Neon Free Plan](https://console.neon.tech/signup), and don’t forget to explore [Neon Auth](https://neon.com/docs/neon-auth/overview).

**A big thank-you to Daisy for sharing their stack with us. Explore their platform:** [[https://app.daisy.so/](https://app.daisy.so/)](https://app.daisy.so/)
