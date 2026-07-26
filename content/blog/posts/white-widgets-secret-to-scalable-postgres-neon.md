---
title: 'White Widget’s secret to scalable Postgres: Neon'
description: How a leading software agency optimized Postgres for dynamic demand
excerpt: >-
  “Neon perfectly meets our needs for a Postgres solution that scales with
  demand. We can push the boundaries of what’s possible in our projects without
  compromising efficiency or costs” Technical Director at White Widget White
  Widget is an award-winning software design and enginee...
date: '2024-03-21T16:15:41'
updatedOn: '2024-03-21T16:15:43'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/white-widgets-secret-to-scalable-postgres-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'White Widget’s secret to scalable Postgres: Neon - Neon'
  description: >-
    How an award-winning software agency uses Neon to dynamically scale Postgres
    according to demand, getting top performance with reduced costs.
  keywords: []
  noindex: false
  ogTitle: 'White Widget’s secret to scalable Postgres: Neon - Neon'
  ogDescription: >-
    How an award-winning software agency uses Neon to dynamically scale Postgres
    according to demand, getting top performance with reduced costs.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/white-widgets-secret-to-scalable-postgres-neon/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/white-widgets-secret-to-scalable-postgres-neon/neon-white-widget-1-1024x576-922eaaac.jpg)

<blockquote>
<p>“Neon perfectly meets our needs for a Postgres solution that scales with demand. We can push the boundaries of what’s possible in our projects without compromising efficiency or costs”</p>
<cite>Technical Director at White Widget</cite>
</blockquote>

[White Widget](https://whitewidget.com/) is an award-winning software design and engineering agency. They focus on building beautiful and efficient custom web and mobile apps, emphasizing user-centric design, cutting-edge AI, and robust cybersecurity measures.

With a broad client base ranging from startups to multinational corporations, White Widget has a proven track record. They’ve built everything from data lakes to AI solutions, ride-sharing platforms, chat platforms, e-commerce solutions, games, and finance software. Their apps have reached 50 million users and counting.

## The search for efficient scalability in Postgres

White Widget uses Neon as the backend for many different applications. As developers of diverse types of software, they value Neon’s flexibility and smooth developer experience; White Widget likes using tools that facilitate —not complicate— the development process.

Before finding Neon, White Widget relied on managed Postgres instances from GCP’s Cloud SQL, but the rigidity of this service made it hard to automatically scale resources to match varying traffic. White Widget either overpaid for underutilized resources or faced insufficient resources during peak demand.

So, the White Widget team started to look for a more efficient Postgres, with two main requirements:

- They wanted a Postgres solution capable of dynamically scaling compute in response to fluctuating application demands. This was essential to ensure performance during traffic spikes without overprovisioning.
- They wanted a service with usage-based pricing to emphasize cost efficiency.

Together with Neon, White Widget considered Amazon Aurora Serverless, which indeed seemed to improve the scalability problem—but the opacity of the pricing model did not convince the team. Costs seemed to rise quickly.

## Scalable Postgres with optimized costs: using autoscaling and read replicas

What first set Neon apart for White Widget was its architecture: by separating storage from compute, Neon facilitates serverless scalability and supports the connection of multiple ephemeral compute endpoints to a single storage entity.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/white-widgets-secret-to-scalable-postgres-neon/screenshot-2024-03-21-at-90553percente2percent80percentafam-1024x455-62a33715.png" alt="Image" />
<figcaption><em>Neon architecture decouples storage and compute in Postgres, introducing a custom storage engine to support a serverless experience.</em></figcaption>
</figure>

This architecture is a game-changer for scalability. It enables a system where the core read-write (R/W) database operations are managed by a primary compute endpoint that dynamically adjusts CPU and memory in response to demand; concurrently, read-only (R/O) operations are handled by ephemeral read replicas, which are designed to scale down and become idle when not in use.

This is precisely what White Widget is doing:

- Via [autoscaling](https://neon.tech/docs/introduction/autoscaling), their main compute dynamically scales between the minimum and maximum CPU/memory limits they have defined. This ensures optimal performance and cost-efficiency without the manual work or the downtimes often associated with instance resizing.
- By directing their read queries to [read replicas](https://neon.tech/docs/introduction/read-replicas) during periods of high traffic, White Widget liberates load in the main compute and ensures optimal performance.

Read replicas automatically scale to zero once traffic slows down. Unlike traditional database setups, Neon’s architecture allows all these compute endpoints to share access to the same storage, which makes the deployment very affordable.

## The future is bright: keep scaling with Neon

White Widget has giant ambitions. Some of the things they’re currently working on: releasing a productivity platform built on the decentralized Matrix protocol and developing innovative projects within the AI space. To dive deeper into their work, [visit their website.](https://whitewidget.com/work) And if you’re also looking for a serverless Postgres solution to simplify your scalability, [try out Neon.](https://console.neon.tech/signup)
