---
title: We’re sunsetting pg_embedding in favor of pgvector
description: A new chapter for vector search
excerpt: >-
  pg_embedding has introduced the Hierarchical Navigable Small World (HNSW)
  index to Postgres, allowing vector search to scale in Postgres. But with the
  addition of HNSW to pgvector 0.5.0, we see little benefit to the community to
  have to choose between two vector search extensions...
date: '2023-09-29T15:11:41'
updatedOn: '2023-10-10T12:50:09'
category: community
categories:
  - community
authors:
  - raouf-chebri
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/sunset-pgembedding/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: We’re sunsetting pg_embedding in favor of pgvector - Neon
  description: A new chapter for vector search
  keywords: []
  noindex: false
  ogTitle: We’re sunsetting pg_embedding in favor of pgvector - Neon
  ogDescription: >-
    pg_embedding has introduced the Hierarchical Navigable Small World (HNSW)
    index to Postgres, allowing vector search to scale in Postgres. But with the
    addition of HNSW to pgvector 0.5.0, we see little benefit to the community
    to have to choose between two vector search extensions for Postgres. After
    careful consideration, we believe it is in the […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/sunset-pgembedding/social.jpg
source:
  wpId: 3394
  wpSlug: sunset-pgembedding
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/sunset-pgembedding/neon-pgvector-1024x576-e86881f0.jpg)

`pg_embedding` has introduced the Hierarchical Navigable Small World (HNSW) index to Postgres, allowing vector search to scale in Postgres. But with the addition of HNSW to pgvector 0.5.0, we see little benefit to the community to have to choose between two vector search extensions for Postgres.

After careful consideration, we believe it is in the best interest of our users and the broader Postgres community to sunset `pg_embedding` and continue our efforts in the vector search space by contributing to `pgvector`.

As a result, we will no longer be committing to `pg_embedding`, and will direct our efforts toward `pgvector` instead.

For those of you who are using `pg_embedding`, rest assured, you will still be able to continue to use it on Neon. However, we highly encourage you to migrate to `pgvector`. You can find the migration guide to pgvector in our documentation.

## Why are we sunsetting pg_embedding?

Here are our primary reasons for sunsetting pg_embedding:

1. **Innovation and Competition**: We want Postgres and its users to win in the vector search space, and the best way to achieve that is to contribute to one single project, `pgvector`.
2. **Serving the Postgres Community**: Our commitment to the Postgres users drives us. Having two similar open-source projects can be confusing, and we want to streamline the experience for our users.`pg_embedding`’s goal was to show that vector search can scale with Postgres.`pgvector` 0.5.0 has proven to work well with larger workloads.
3. **Overlap with pgvector**: Both extensions offer HNSW. Given the rising popularity and broad adoption of `pgvector`, we found maintaining two parallel extensions with similar functionalities redundant.

## What’s Next?

Our focus on improving vector search in Postgres remains the same. We’re currently experimenting with the Vamana index and working on parallel index building, filters, and real-time updates that can solve some of the problems developers face with larger datasets. We’re actively joining discussions on `pgvector` and are developing new techniques to address these challenges. Our aim is precise: make vector search better and more efficient for Postgres users.

## How can you prepare?

- Migration: Here is a [comprehensive migration guide](https://neon.tech/docs/extensions/pg_embedding) to assist you in transitioning from `pg_embedding` to `pgvector`.
- Share your feedback: Your feedback is invaluable. Please share your thoughts, concerns, or questions, helping us ensure a smooth transition for everyone.
- Stay updated: Keep an eye on our blog and official channels for further updates and details.

## In Closing

While it’s always tough to bid farewell to a project, we believe doing what’s right for the Postgres user is more important. And are optimistic about the future of vector search at Neon with `pgvector`. We thank each of you for your continued support, understanding, and trust. Our commitment to delivering top-notch solutions remains unwavering, and we’re excited about the future of pgvector.
