---
title: Bringing Postgres to Replit with Neon
description: >-
  Learn how Replit, a collaborative cloud-based IDE, added support for Postgres
  databases by leveraging Neon's API.
excerpt: >-
  Replit is a collaborative cloud-based IDE that enables its users to create
  applications without worrying about infrastructure. It started as an
  educational tool for developers but rapidly evolved into a platform for
  building and hosting applications. The Replit team recently ship...
date: '2023-01-24T00:09:38'
updatedOn: '2025-09-03T12:52:57'
category: case-study
categories:
  - case-study
authors:
  - nikita-shamgunov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-replit-integration/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Bringing Postgres to Replit with Neon - Neon
  description: >-
    Learn how Replit, a collaborative cloud-based IDE, added support for
    Postgres databases by leveraging Neon's API.
  keywords: []
  noindex: false
  ogTitle: Bringing Postgres to Replit with Neon - Neon
  ogDescription: >-
    Learn how Replit, a collaborative cloud-based IDE, added support for
    Postgres databases by leveraging Neon's API.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-replit-integration/social.png
source:
  wpId: 1050
  wpSlug: neon-replit-integration
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Neon, Replit](https://cdn.neonapi.io/public/images/pages/blog/neon-replit-integration/neon-replit-1024x538-88307aaf.png)

[Replit](https://replit.com) is a collaborative cloud-based IDE that enables its users to create applications without worrying about infrastructure. It started as an educational tool for developers but rapidly evolved into a platform for building and hosting applications.

The Replit team recently shipped a new feature in preview: **adding support for Postgres databases powered by Neon.** This new addition brings them closer to their goal of making Replit a platform for building full stack apps.

<video autoPlay muted loop width="3840" height="2160">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/neon-replit-integration/replit-11de3ce5.mp4" />
</video>

## Why Replit chose Neon

Since Replit has millions of users, adding Postgres support meant managing and scaling potentially millions of databases. Replit started to look for a partner that is aligned with their pursuit of great developer experience and can match their consumption based pricing mode.

This made Replit choose Neon so they can provide Postgres databases for their users powered by the modern serverless platform. Another added benefit is that Neon is built for the cloud and offers a usage-based pricing model, making it a cost-effective solution for companies like Replit which runs a large fleet of apps with variable usage. Since some of the apps only have episodic usage they really benefit from the ability of Neon to scale serverless Postgres to 0.

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>The combination of flexible resource limits and nearly instant database provisioning made Neon a no-brainer.</p>
<cite>Lincoln Bergeson, Infrastructure Engineer at Replit</cite>
</blockquote>

## Final thoughts

We are incredibly excited about our partnership with Replit and look forward to all the innovation they will bring to the cloud development space in the future.

Interested in integrating with Neon? [Get in touch with us](mailto:partnerships@neon.tech), we would love to chat.
