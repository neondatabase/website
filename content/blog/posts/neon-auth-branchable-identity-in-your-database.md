---
title: "Meet the New Neon Auth: Branchable Identity in Your Database"
description: >-
  A fully managed auth layer that stores users, roles, and sessions directly in
  Neon and clones with every branch
excerpt: >-
  Today we’re launching a major overhaul of Neon Auth, using Better Auth as the
  foundation and integrated deeply into the Neon platform. All authentication
  data is now stored directly in your Neon database, making Neon Auth fully
  branch-compatible so you can test real authenticatio...
date: "2025-12-10T18:25:00"
updatedOn: "2026-01-02T17:38:41"
category: product
categories:
  - product
authors:
  - brian-holt
  - shridhar-deshmukh
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-auth-branchable-identity-in-your-database/social.png
  alt: null
isFeatured: true
seo:
  title: "Meet the New Neon Auth: Branchable Identity in Your Database - Neon"
  description: >-
    We rebuilt Neon Auth on a new foundation. It now stores identity directly in
    your Neon database, making auth fully branch-compatible.
  keywords: []
  noindex: false
  ogTitle: "Meet the New Neon Auth: Branchable Identity in Your Database - Neon"
  ogDescription: >-
    We rebuilt Neon Auth on a new foundation. It now stores identity directly in
    your Neon database, making auth fully branch-compatible.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-auth-branchable-identity-in-your-database/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-auth-branchable-identity-in-your-database/neon-better-auth-1024x576-9e58649f.jpg)

**Today we’re launching a major overhaul of** [Neon Auth](https://neon.com/docs/auth/overview)**, using Better Auth as the foundation and integrated deeply into the Neon platform. All authentication data is now stored directly in your Neon database, making Neon Auth fully branch-compatible so you can test real authentication workflows in isolated environments**. [Try it in your Free account.](https://console.neon.tech/signup)

<figure>
<video height="720" width="1152" autoPlay muted loop playsInline src="https://cdn.neonapi.io/public/videos/pages/blog/neon-auth-branchable-identity-in-your-database/neon-auth-web-e2e5b359.mp4"></video>
</figure>

## Auth was the last part of Neon that didn’t yet branch

Our first implementation of Auth worked well for many users, but it relied on an external identity provider and webhook-based synchronization. This setup wasn’t fully compatible with the [branching workflows](https://neon.com/blog/practical-guide-to-database-branching) that sit at the core of our platform. We wanted authentication to be fully compatible with branching: if user data lived inside your Neon database and could clone automatically with each branch, Neon users could test their actual auth flows safely and reliably, just as they already do with the rest of their backend.

Relying on an external auth service also introduced friction we weren’t happy with. Managing a separate auth project, rotating API keys, or debugging webhook failures added unnecessary complexity. And because user data lived outside your database, foreign keys felt awkward and modeling relationships was harder. It simply wasn’t possible to manage your users directly in Postgres. On our side, managing auth through a third party also made it harder to guarantee the seamless experience Neon users expect.

<YoutubeIframe embedId="Tosp_NsWBF4" isDocPost={false} />

## So we rebuilt it

We explored different options to improve this, including building our own Auth from scratch – but who were we kidding, there’s no better auth than [Better Auth](https://www.better-auth.com/). Better Auth would give us a robust, extensible foundation that (after some tweaks backed by the support of the Better Auth team) would align perfectly with how Neon works.

With this new implementation, Auth is no longer a syncing layer between two systems but a fully managed, first-class service that runs directly on Neon.

The developer experience is dramatically simpler:

- **Auth lives in your database.** All users, sessions, and organizations live in the `neon_auth.*` schema.
- **Session and JWT handling is automatic.** Session cookies are http-only and exclusively managed by neon auth server, while NeonJS manages JWT for Data API integration.
- **Fast and reliable by default.** Neon Auth runs on the same regional infrastructure as Neon compute, with cached connection strings for consistently low-latency requests.
- **Works with your own tables and RLS automatically.** Your RLS policies can reference the authenticated user directly, without maintaining duplicate identity tables or event sync.
- **Your auth branches with your data.** When you branch your database, your entire auth state (users, sessions, orgs, config, JWKS) branches too, each branch with its own isolated endpoint.
- **No drift.** OAuth settings, email verification rules, and other auth configuration clone with your branch, so staging and preview environments work exactly like production.
- **Data API integration.** JWTs from Neon Auth are validated by the [Data API](https://neon.com/docs/data-api/get-started), so authenticated .select(), .insert(), etc work with your RLS policies.
- **Better Auth foundation.** Neon Auth exposes the same APIs and schema as Better Auth, so you can leverage better-auth UI libraries with the Neon Auth client.

<Admonition type="important" title="Note for Better Auth users">
Neon Auth is powered by Better Auth under the hood, but **it isn’t a drop-in replacement for a self-hosted Better Auth setup**. Because Neon Auth implements the server-side layer for you, it requires using the Neon SDKs, and it doesn’t yet support bringing your own Better Auth plugins or custom server-side handlers.

We’re actively exploring ways to make it easier to bring existing Better Auth apps to Neon Auth, stay tuned. And if this is something you need, let us know on [Discord](https://discord.gg/92vNTzKDGp) or [X](https://x.com/neondatabase).
</Admonition>

## Identity belongs in your database

Beyond branching, keeping your auth model where your data lives gives you a cleaner and more consistent way to design your system:

- A role check or ownership check becomes a join on neon_auth.user, not a round trip to a third-party API
- Your RLS policies can reference the current user directly from the JWT, enforcing row-level rules in the database itself
- Creating a user, creating their first record, and assigning roles can all happen in a single transaction
- The user schema, relationships, and business logic evolve with your migrations

This principle (placing identity where the rest of your architecture lives) is central to Better Auth’s philosophy. Their framework is built around the idea that you should own your user model, your schema, and the relationships that define your system, while the machinery of authentication runs behind the scenes.

If your application already runs on a Neon database, it only makes sense to bring auth closer.

**_Read the blog post:_** _[The Case for Owning Your Auth](https://neon.com/blog/the-case-for-owning-your-auth)_**_, by Better Auth creator_**

## Deploying an entire backend with neon-js

Another big advantage of this reimplementation is that every piece of the Neon backend now speaks the same language. **This is where [neon-js](https://github.com/neondatabase/neon-js) comes in, our new unified SDK that brings the Neon database, Data API, and Auth into one developer-friendly (and agent-friendly!) package.**

- Neon.js uses an adapter-based architecture, so you can choose between different surface APIs while keeping the same Neon Auth and Data API under the hood
- It supports Neon Auth natively (session handling, JWTs, OAuth, and RLS all work out of the box)
- The Neon Data API also integrates directly – authenticated .select(), .insert(), .update() operations work the same way across branches
- For [agent builders](https://neon.com/use-cases/ai-agents), neon.js is a foundational piece: agents can programmatically provision full environments (DB + Auth + Data API), test changes in branches, and tear them down instantly

If you’re coming to Neon looking for a BaaS-like experience, we want to give you that convenience without locking you into a single stack or limiting how your system evolves.

We’ll be publishing more about neon.js in the next few days, but in the meantime, [you can explore our docs and start building.](https://neon.com/docs/reference/javascript-sdk)

<blockquote>
<p><strong><em>Note that neon.js or JavaScript is not required to use Neon Auth.</em></strong><em> You can integrate with Neon Auth using the API or any HTTP client. neon.js is simply the easiest way to use Auth, Data API, and the database together.</em></p>
</blockquote>

## The Neon Auth architecture

At a high level, Neon Auth is a managed REST service built on Better Auth that talks directly to your Neon database:

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-auth-branchable-identity-in-your-database/image-11-972x1024-2ea57b8a.jpeg)

Here’s what happens under the hood:

1. When you enable Neon Auth for a branch, Neon automatically initializes the neon_auth schema to store users, manage sessions, and power secure authentication API.
2. Neon then deploys an auth service in the same region as your compute, ensuring ultra-low-latency communication with your database.
3. Each branch gets its own isolated Auth URL, with the authentication configuration and data scoped to that branch.
4. The branch’s authentication configuration lives directly in your database – including enabled providers, trusted origins, and other options – and every auth request is validated against this configuration.
5. Your frontend application communicates with your Neon Auth instance using [the official @neondatabase/auth SDK](https://www.npmjs.com/package/@neondatabase/auth). It connects to your branch’s Auth URL and provides high-level methods for creating users, signing in, handling OAuth flows, and managing sessions.
6. When you branch out, Neon spins up a fresh auth instance for it. It begins with the parent’s auth data but remains fully isolated.

## How branchable auth changes the way you build

[When authentication lives in your database and you can branch it quickly](https://neon.com/docs/auth/branching-authentication), every branch becomes a complete copy of your app. This makes workflows that used to be painful (or straight impossible) very easy to implement:

### If you’re a fast-moving startup

With one Neon API call, you can spin up a database branch to power a preview environment that mirrors production exactly: same users, same roles, same permissions. You can test full signup, login, password reset, Google/GitHub sign-in, and deletion flows before a release without touching production data. Your previews have real authentication vs mocked tokens, making it easier to catch auth-related bugs before they reach production.

### If you’re building a B2B, multi-tenant platform

If you have a SaaS product with complex org and role hierarchies, branching auth means you can test those relationships safely. You clone your environment, invite fake organizations or users, modify access rules, and confirm that permissions propagate correctly, all without risking data leaks or cross-tenant issues and without adding days of manual QA.

### If you’re operating in a compliance-sensitive industry

If you work in a regulated space, Neon Auth allows you to test the real, full user lifecycle in CI/CD without ever touching production. Each branch includes a real authentication but you’d keep a clean separation between test and production environments. And since Auth events are recorded directly in your database as transactions, you could get an automatic audit trail to simplify compliance reviews.

### If you’re building an agent / codegen platform

Agent platforms like [Replit](https://replit.com/), [Riff](https://riff.ai/), or [Anything](https://neon.com/blog/from-idea-to-full-stack-app-in-one-conversation-with-create) create thousands of full-stack apps per day – they need speed, automation, and cost efficiency built-in for their backends. If you’re [building your agent on the Neon backend](https://neon.com/use-cases/ai-agents), your agent can create and destroy complete environments instantly using branches. Let the AI spin up a new environment for every user-generated app, [version](https://neon.com/blog/checkpoints-for-agents-with-neon-snapshots), or test run while keeping costs at minimum thanks to [scale to zero](https://neon.com/docs/introduction/scale-to-zero).

<Admonition type="tip" title="Apply to the Agent Plan">
If you’re building a full-stack codegen platform, [check out our Agent Plan](https://neon.com/use-cases/ai-agents) for special pricing, resource-limits, and support.
</Admonition>

## Get started

Neon Auth is now a first-class part of the Neon platform, fully aligned with the developer experience we want to offer across our stack. Getting started is simple: follow the Quick Starts in our docs for Next.js, React, and TanStack, [explore our Quickstarts](https://neon.com/docs/auth/quick-start/nextjs), and if you have any questions, you’ll find us in [Discord](https://discord.gg/92vNTzKDGp).

<Admonition type="important" title="Note for existing Neon Auth users">
If you’re using the previous implementation of Neon Auth via Stack Auth, there’s no need to make changes right now. **Your version will continue to work.** When it’s time to migrate to the new implementation, we’ll reach out with clear instructions and tools to make the transition smooth. In the meantime, [we've prepared this migration guide](https://neon.com/docs/auth/migrate/from-stack-auth) if you'd like to transition to the new Auth. If you have questions, ask us [on Discord.](https://discord.gg/92vNTzKDGp)
</Admonition>
