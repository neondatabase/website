---
title: Introducing the Neon Partner Program
description: >-
  Learn how you can become a Neon partner and discover the different types of
  integrations we offer.
excerpt: >-
  We’re thrilled to announce the launch of our official Neon Partner Program,
  which makes it possible to integrate Neon into any application seamlessly.
  Keep reading to learn how you can become a partner and the types of
  integrations we offer. Neon’s OAuth integration The first typ...
date: '2023-07-06T08:41:51'
updatedOn: '2023-11-30T11:12:37'
category: company
categories:
  - company
authors:
  - mahmoud-abdelwahab
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/partner-program/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: Introducing the Neon Partner Program - Neon
  description: >-
    Learn how you can become a Neon partner and discover the different types of
    integrations we offer.
  keywords: []
  noindex: false
  ogTitle: Introducing the Neon Partner Program - Neon
  ogDescription: >-
    Learn how you can become a Neon partner and discover the different types of
    integrations we offer.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/partner-program/social.jpg'
source:
  wpId: 2430
  wpSlug: partner-program
  exportedAt: '2026-03-20T13:31:00.745Z'
---

We’re thrilled to announce the launch of our official [Neon Partner Program](https://neon.tech/partners), which makes it possible to integrate Neon into any application seamlessly. Keep reading to learn how you can become a partner and the types of integrations we offer.

## Neon’s OAuth integration

The first type of integration we offer is **OAuth**. This integration provides a secure method for third-party applications to obtain user data without sharing login credentials. This makes it possible to access and manage Neon resources on behalf of our users.

Here is a high-level overview of how it works:

![Image](https://cdn.neonapi.io/public/images/pages/blog/partner-program/image-1024x803-fce995fb.png)

1. The user initiates the OAuth flow in the third-party application by clicking a button or link.
2. An authorization URL is generated, and the user is redirected to Neon’s OAuth consent screen, where they can authorize the third-party application and grant the necessary permissions.
3. Finally, the third-party application receives an access token to manage Neon resources on the user’s behalf.

Here is an overview of how some of our partners use this integration to offer a seamless experience for their users.

### Cloudflare

[Cloudflare](https://www.cloudflare.com/developer-platform/products/) recently added a Neon [database integration](https://blog.cloudflare.com/announcing-database-integrations/) to their Developer Platform, a serverless execution environment that enables developers to create applications without configuring or maintaining infrastructure. This integration automatically configures database credentials for Cloudflare Workers.

<video controls width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/partner-program/neon-integration-cloudflare-1-e480e2f8.mp4" />
</video>

### Hasura

[Hasura](https://hasura.io/) enables developers to instantly compose a GraphQL API backed by a database. They partnered with us to allow their users to provision a Neon Postgres database and automatically add it to their Hasura Cloud project as a data source.

<video controls width="4096" height="2082">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/partner-program/neon-hasura-integration-cbd43269.mp4" />
</video>

### WunderGraph

[WunderGraph](https://wundergraph.com/cloud) Cloud is a managed service for deploying APIs built using the WunderGraph framework. They recently shipped a Neon integration that configures Neon database credentials.

<video controls width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/partner-program/wundergraph-1b14a557.mp4" />
</video>

## Integrating using the Neon API

Neon Partners can integrate Neon into their products using our [API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). This integration enables partners to effortlessly create serverless Postgres databases and incorporate them into their products. Here is an overview of how some of our partners use this integration:

### Vercel

[Vercel](https://vercel.com/) provides the tools, workflows, and infrastructure for building and deploying web apps without the need for additional configuration. They recently added support for Neon Postgres to their platform, making it a first-class part of Vercel’s frontend cloud.

<video controls width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/partner-program/vercel-postgres-aa68a247.mp4" />
</video>

### Replit

[Replit](https://replit.com/), a collaborative cloud-based IDE, enables developers to create applications without worrying about infrastructure. It started as an educational tool but rapidly evolved into a platform for building and hosting applications. The Replit team added support for Neon Postgres to offer a complete developer experience—one where you do not need to leave your editor when building database-backed applications.

<video controls width="3840" height="2160">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/partner-program/replit-11de3ce5.mp4" />
</video>

## Why partner with Neon?

By partnering with Neon, you can easily add Postgres to your product while offloading the work of managing and scaling infrastructure. You will also have access to our team of Postgres experts, who will provide support when needed.

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><em>The combination of flexible resource limits and nearly instant database provisioning made Neon a no-brainer.</em></p>
<cite>— Lincoln Bergeson, Infrastructure Engineer at Replit</cite>
</blockquote>

If you are interested in becoming a Neon partner, [get in touch with us](https://neon.tech/partners#partners-apply) today.
