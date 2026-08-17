---
title: Auth That Just Works in Vercel Previews
description: Our Vercel integration now automatically provisions auth for every preview
excerpt: >-
  If you’re integrating your Vercel preview deployments with Neon, you’re
  already getting an isolated Postgres branch per preview. We just extended the
  same automation to authentication. When you use Neon through the Vercel
  integration and enable Auth, every Vercel deployment gets...
date: "2026-01-19T17:43:45"
updatedOn: "2026-01-19T18:27:32"
category: product
categories:
  - product
authors:
  - shridhar-deshmukh
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/auth-that-just-works-in-vercel-previews/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Auth That Just Works in Vercel Previews - Neon
  description: Our Vercel integration now automatically provisions auth for every preview
  keywords: []
  noindex: false
  ogTitle: Auth That Just Works in Vercel Previews - Neon
  ogDescription: >-
    If you’re integrating your Vercel preview deployments with Neon, you’re
    already getting an isolated Postgres branch per preview. We just extended
    the same automation to authentication. When you use Neon through the Vercel
    integration and enable Auth, every Vercel deployment gets its own isolated
    authentication endpoint, with URLs injected automatically and trusted
    domains already configured […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/auth-that-just-works-in-vercel-previews/social.jpg
---

**If you’re** [integrating your Vercel preview deployments with Neon](https://neon.com/docs/guides/vercel-overview)**, you’re already getting an isolated Postgres branch per preview. We just extended the same automation to authentication**. When you use Neon through the Vercel integration and enable [Auth](https://neon.com/docs/auth/overview), every Vercel deployment gets its own isolated authentication endpoint, with URLs injected automatically and trusted domains already configured for you. Just check a box, push a branch, and auth works:

<img src="https://cdn.neonapi.io/public/images/pages/blog/auth-that-just-works-in-vercel-previews/image-10-1024x1014-a91e9230.png" alt="Post image" />
## A quick refresher on the Neon &lt;&gt; Vercel integrations

[Neon](https://neon.com/) supports two different ways to integrate with Vercel, depending on how you prefer to manage ownership and billing:

- [Vercel-managed integration (Vercel Marketplace):](https://neon.com/docs/guides/vercel-managed-integration) You add Neon directly to your Vercel project via the Vercel Marketplace. Vercel manages the connection, and Neon resources are provisioned automatically as part of your Vercel workflow.
- [Neon-managed integration (Connected Accounts):](https://neon.com/docs/guides/neon-managed-vercel-integration) You connect an existing Neon project to Vercel from the Neon side. This is often used by teams that want to keep billing and project management in Neon, while still enabling features like branch-per-preview deployments.

Both integrations support the same core workflow:

- In Vercel, every commit creates a deployment, with preview deployments designed to be safe to test in isolation.
- When you connect a Vercel project to Neon via either integration and enable branching for previews,
  - Every Vercel preview deployment gets its own Neon database branch
  - This branch is a copy of the production database, but isolated. This gives you a realistic preview to work against without manual migrations, schema changes, or data mocks
  - These branches are very affordable: they incur no additional storage charges, and you only pay for compute while they’re running
  - When a preview deployment is removed, the corresponding database branch is cleaned up automatically.

The Auth update we’re discussing in this blog post applies to both integrations, but more about that in a minute.

## What is Neon Auth?

Before we dive into how the Neon &lt;&gt; Vercel integration now works with auth, it’s worth a quick step back. You might already be using Neon purely as a database through Vercel, and not be familiar with Neon Auth yet.

[Neon Auth](https://neon.com/docs/auth/overview) is a fully managed authentication layer built directly into Neon. It’s [powered by Better Auth under the hood](https://neon.com/blog/neon-auth-branchable-identity-in-your-database), but deeply integrated into Neon’s platform so authentication behaves like a first-class part of your database, not a separate service you have to provision, sync, and maintain.

<figure><video autoPlay muted loop width="1152" height="720" src="https://cdn.neonapi.io/public/videos/pages/blog/auth-that-just-works-in-vercel-previews/neon-auth-web-e2e5b359.mp4" playsInline></video></figure>

All authentication data lives directly in your Neon database. Users, sessions, roles, organizations, and configuration are stored in the `neon_auth.*` schema, which makes Auth fully compatible with Neon’s branching model. When you enable Neon Auth on a project, every Neon branch gets its own auth endpoint:

- Each branch has its own Auth URL
- Auth data (users, sessions, OAuth config, JWKS) is scoped to that branch
- Branching your database also branches your entire authentication state<br />

**So when you create a Neon branch, you’re not just cloning schema and data now – you’re also cloning identity.** On its own, [this already makes it much easier to test real authentication flows safely](https://neon.com/blog/stop-mocking-auth-its-breaking-your-tests) – but when Neon Auth is wired into Vercel previews, that model becomes automatic, which is where the integration update comes in next.

## What’s new: Neon Auth now follows your Vercel deployments

**With this update, the Neon &lt;&gt; Vercel integration links database branching and auth provisioning into a single, automatic workflow.** When you enable the Auth toggle while connecting Neon to your Vercel project, authentication becomes part of the deployment lifecycle, just like previews and databases already are:

<figure><video autoPlay muted loop width="3092" height="1788" src="https://cdn.neonapi.io/public/videos/pages/blog/auth-that-just-works-in-vercel-previews/neon-auth-vercel-1-8ba761d4.mov" playsInline></video></figure>

### How it works

<figure className="image-with-link"><a href="https://neon.com/guides/vercel-neon-auth-branching"><img src="https://cdn.neonapi.io/public/images/pages/blog/auth-that-just-works-in-vercel-previews/image-11-1024x640-4535aa05.png" alt="Post image" /></a></figure>

When your Vercel project is connected to Neon with Auth enabled,

1. Neon provisions Auth on your production branch
2. On the next deployment,
   1. `NEON_AUTH_BASE_URL` is injected automatically into your Vercel environment variables
   2. Your production deployment URL is added as a trusted origin
   3. Any custom production domains are also added as trusted origins
3. When you push a commit and Vercel creates a preview deployment, the full flow is triggered:
   1. Vercel creates the preview deployment
   2. Neon creates a matching database branch
   3. Neon Auth provisions a dedicated auth instance for that branch
   4. `NEON_AUTH_BASE_URL` is injected into that preview deployment
   5. The preview URL plus any matching custom preview domains are added as trusted origins
4. Cleanup follows the same rules: when a preview deployment is removed,
   1. Vercel deletes the deployment
   2. Neon deletes the corresponding database branch
   3. The associated Auth instance is removed automatically

### Using it in your code

Nothing changes in your application code. The integration injects the correct environment variables for each deployment automatically.

```typescript
import { createAuthClient } from "better-auth/client";

const auth = createAuthClient({
  baseURL: process.env.NEON_AUTH_BASE_URL,
});

// Real authentication, scoped to the current deployment
await auth.signIn.email({ email, password });
```

### What this unlocks: testing auth changes safely

This integration between previews, databases, and auth enables workflows that are usually quite awkward. For example, imagine you’re adding a new OAuth provider or changing part of your login flow – you can now:

1. Push a commit to a feature branch
2. Vercel builds a preview deployment
3. You open the preview URL, authentication already works
4. In the Neon Console, you configure the new OAuth provider for the preview branch
5. You can test your new flow end to end: initiation, callback, token exchange, session creation.
6. When you’re happy with the changes,
   1. Merge the code
   2. And apply the same auth configuration to the production branch

## Try it now

To try it, [connect your Vercel project to Neon](https://neon.com/docs/guides/vercel-overview), enable Auth, and start building. Preview deployments will come up with fully working authentication automatically. [Here’s a complete guide for you to follow](https://neon.com/guides/vercel-neon-auth-branching), and if you have any questions, reach out to us on [Discord](https://discord.gg/92vNTzKDGp).
