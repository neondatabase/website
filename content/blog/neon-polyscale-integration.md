---
title: Speed up your global queries with caching for Serverless Postgres
description: Introducing the PolyScale Integration
excerpt: >-
  We’re excited to announce we have rolled out a new integration with PolyScale
  to distribute and cache your data globally, ensuring low-latency read queries
  no matter where in the world you are. The integration achieves this without
  the complexities of cross-regional replication o...
date: '2023-12-04T15:56:39'
updatedOn: '2024-03-01T14:23:44'
category: community
categories:
  - community
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-polyscale-integration/cover.png
  alt: null
isFeatured: false
seo:
  title: Speed up your global queries with caching for Serverless Postgres - Neon
  description: Introducing the PolyScale Integration
  keywords: []
  noindex: false
  ogTitle: Speed up your global queries with caching for Serverless Postgres - Neon
  ogDescription: >-
    We’re excited to announce we have rolled out a new integration with
    PolyScale to distribute and cache your data globally, ensuring low-latency
    read queries no matter where in the world you are. The integration achieves
    this without the complexities of cross-regional replication or extensive
    coding and infrastructure changes. Let’s dive in and see what this […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-polyscale-integration/social.png
source:
  wpId: 3838
  wpSlug: neon-polyscale-integration
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-polyscale-integration/image-2-1024x576-450f0c4d.png)

We’re excited to announce we have rolled out a new integration with PolyScale to distribute and cache your data globally, ensuring low-latency read queries no matter where in the world you are. The integration achieves this without the complexities of cross-regional replication or extensive coding and infrastructure changes.

Let’s dive in and see what this integration means for you and your projects.

<video autoPlay muted loop width="1904" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/neon-polyscale-integration/export-1701965589429-6ec809a6.mp4" />
</video>

## What’s PolyScale?

PolyScale is more than just a data caching solution; it’s a gateway to global data accessibility. By leveraging a low-latency edge network, PolyScale allows you to distribute and cache data across the globe, ensuring your applications run faster and more efficiently.

Think of PolyScale as a simple yet powerful alternative to cross-regional replication. It offers data availability and performance improvements without the extra complexity. The best part? You don’t need to change a single line of code or tweak your infrastructure to start using PolyScale.

## Get started with PolyScale on Neon

Integrating PolyScale with your Neon project is simple. Here’s how you can get started:

1\. **Add PolyScale Integration**: Navigate to the Integrations page in your Neon Console, find PolyScale, and click “Add”.

2\. **Sign In and Authorize**: Sign into PolyScale using your preferred account (Google, GitHub, or email), select your workspace, and authorize Neon access. You can create an account if you don’t already have a one. PolyScale has a free tier, and no credit card is necessary.

3\. **Manage Your Cache**: Once added, you can manage your PolyScale cache directly from the Neon Console.

The integration automatically creates a global cache for your project and provides a unique PolyScale connection string. This string directly replaces your Neon connection string in your applications. What’s remarkable is that PolyScale caches all queries by default, meaning your data access becomes faster over time without extra effort.

## How PolyScale Works Under the Hood

Once you’re connected via the PolyScale connection string, the magic starts. PolyScale automatically caches all queries passing through it. This means your subsequent data fetches are much quicker.

Additionally, PolyScale intelligently identifies caching opportunities by recognizing patterns in your query traffic. Typically, cache hits begin after the third query, optimizing your data access progressively. You can also monitor traffic and caching behavior through PolyScale’s Observability tab.

If you need to purge your cache (like after direct database modifications bypassing PolyScale), it’s just a few clicks in the Neon Console.

## Conclusion

We believe the Neon and PolyScale integration will improve your user experience for global applications. It simplifies the complexity of data distribution and caching, allowing you to focus on what you do best: building great applications.

Sign up with Neon, try it, and experience the seamless integration that can take your projects to the next level.

## Additional Resources

To dive deeper into PolyScale and Neon, check out the [detailed documentation](https://neon.tech/docs/guides/polyscale-integration) and join the [Neon community forum](https://community.neon.tech/) for insights and support.
