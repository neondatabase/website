---
title: 'Postgres for Everything: Why Vecstore Replaced Pinecone and RDS with Neon'
description: A single serverless database for vectors and relational data
excerpt: >-
  “We replaced both Pinecone and RDS with Neon, and latency dropped from 200ms
  to 80ms with a much simpler setup. Neon also gave us a smoother developer
  experience across multiple regions. It just works” (Giorgi Kenchadze, Founder
  & CEO at Vecstore) Vectstore is a new AI search pla...
date: '2025-07-17T15:30:28'
updatedOn: '2026-02-18T01:54:13'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/vecstore-replacing-pinecone-and-rds-with-neon/cover.jpg
  alt: null
isFeatured: true
seo:
  title: >-
    Postgres for Everything: Why Vecstore Replaced Pinecone and RDS with Neon -
    Neon
  description: >-
    Vectstore unified relational and vector data in Neon, simplifying their
    stack while boosting performance and developer experience.
  keywords: []
  noindex: false
  ogTitle: >-
    Postgres for Everything: Why Vecstore Replaced Pinecone and RDS with Neon -
    Neon
  ogDescription: >-
    Vectstore unified relational and vector data in Neon, simplifying their
    stack while boosting performance and developer experience.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/vecstore-replacing-pinecone-and-rds-with-neon/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/vecstore-replacing-pinecone-and-rds-with-neon/neon-vectsore-1-1024x576-660b5a37.jpg)

<blockquote>
<p><strong>“We replaced both Pinecone and RDS with Neon, and latency dropped from 200ms to 80ms with a much simpler setup. Neon also gave us a smoother developer experience across multiple regions. It just works”</strong> (Giorgi Kenchadze, Founder & CEO at <a href="https://vecstore.app/">Vecstore</a>)</p>
</blockquote>

[Vectstore](https://vecstore.app) is a new AI search platform built on Rust that helps developers build intelligent, multimodal search into their applications. Its core APIs support visual search (find images by text or photo), semantic text search (hybrid context-aware + keyword), and content moderation (identify unsafe or explicit content).

<YoutubeIframe embedId="cRCNESCThsU" isDocPost={false} />

## Building on AWS RDS and Pinecone: What Wasn’t Working

Vectsore’s platform relies on both structured and unstructured data: user accounts, analytics, and metadata need a relational store, while their vector-based search APIs (like “find images that look like this” or “search for sunsets in the mountains”) depend on fast embedding lookups.

Before Neon, that meant combining AWS RDS for the relational side with Pinecone for vector search. This setup worked, but it created unnecessary complexity and friction – plus, it was getting increasingly slow and expensive.

### Too many moving parts

<blockquote>
<p><strong>“Having two separate databases for one product was inefficient in every way: cost, performance, and developer experience”</strong> (Giorgi Kenchadze, Founder & CEO at Vecstore)</p>
</blockquote>

Managing a single relational database is already a challenge – adding a specialized database to the stack on top of it only increases the burden on a small team. For Vectsore, running both RDS and Pinecone meant maintaining separate clients, deployments, and integration paths. Each new feature required boilerplate just to stitch everything together. It didn’t help that Pinecone’s Rust SDK was incomplete and poorly documented, making the whole setup even harder to work with.

### Performance was not great

Performance in real-world deployments rarely matches clean benchmark results. Pinecone is built for high-performance vector search, but in practice, many factors (e.g. network latency between services or region mismatches) often have a higher weight on overall performance vs the database itself. In Vecstore’s case, they saw latencies that often hit the 200ms range, since every search required two separate calls – one to RDS and one to Pinecone.

### Rising costs, less flexibility

Cost was another factor. Pinecone’s pricing had recently doubled (it was now at $50/month minimum) and running both services at scale was getting expensive fast. On top of that, Pinecone’s limited regional availability made multi-region deployments more difficult to optimize.

## The Solution? Postgres for Everything

After all this friction with RDS and Pinecone, Vectsore re-evaluated their architecture and looked for a way to unify their backend. The answer was [Neon](https://neon.com/) – a developer-friendly serverless Postgres database that could handle both relational and vector workloads via the [pgvector](https://neon.com/docs/extensions/pgvector) extension.

<blockquote>
<p><strong>“Moving everything to Postgres was just the right solution. Neon immediately stood out – it was intuitive, it had branching, and latency dropped from 200ms to 80ms. Just having everything in a single SQL query made a huge difference” </strong>(Giorgi Kenchadze, Founder & CEO at Vecstore)</p>
</blockquote>

Once the team switched to Neon, they started seeing the benefits right away:

- **Simpler setup.** Neon’s support for pgvector meant Vectsore could consolidate both their user data and search embeddings into a single database. This unified model reduced architectural overhead and eliminated the need to sync state across services – plus, it made it much easier to interact with the database (hello, SQL).<br />
- **Faster query speeds.** This simpler setup with pgvector also resulted in lower latencies. “This is a misconception people have about pgvector,” said Giorgi Kenchadze, “it’s just as fast as Pinecone, if not faster.”<br />
- **Better developer experience.** The shift to Neon unlocked a smoother workflow. The team got an easy-to-maintain multi-region setup, with branching for development and testing, and autoscaling to account for any load spikes.<br />
- **Lower infra costs.** The deployment in Neon ended up being considerably more cost-effective than maintaining separate RDS and Pinecone instances.

## Inside Vectsore’s Neon Setup

The team has designed a clean, multi-region Neon architecture that takes full advantage of branching model, autoscaling capabilities, and native support for vector search. Here’s how their setup looks:

- **One Neon project per region.** Vectsore operates across four global regions. For each one, they’ve provisioned a separate [Neon project](https://neon.com/docs/manage/overview) (the equivalent of a logical Postgres instance).<br />
- **Main and dev branches per project.** Within each project, Vectsore maintains two primary branches: main (production) and dev. These branches are isolated environments with separate compute, enabling safe development and testing without needing to replicate data manually.
- **Autoscaling across branches.** Vectsore configures each branch with autoscaling tailored to its workload. For example, their production branches are provisioned with higher CPU caps, while dev branches scale down aggressively to reduce cost. This is especially valuable for embedding workloads, which can be compute-intensive and bursty – particularly during indexing or large-scale similarity searches. Neon’s autoscaling ensures they don’t have to manually tune resources for these spikes.

<blockquote>
<p><strong>“The embedding search is quite spiky and hard to predict. Autoscaling in Neon just handles it automatically” </strong>(Giorgi Kenchadze, Founder & CEO at Vecstore)</p>
</blockquote>

- **Instant restore and time-travel for safety.** Neon’s branching and restore features allow the Vectsore team to revert to a known state with a single click or API call. This is especially useful when deploying new features or tuning vector indexes.<br />
- **pgvector for fast hybrid search.** Vectsore stores vector embeddings and relational data together in Neon. This allows them to streamline their search logic and reduce latency by handling both types of queries (vector similarity and structured lookups) within the same system.<br />
- **Connection pooling with SQLx in Rust.** The team uses the [SQLx](https://docs.rs/sqlx/latest/sqlx/) crate in Rust for query execution and pooling. This gives them full control over connection limits and query performance tightly integrated with Neon.
- **Multi-tenancy handled natively.** Unlike Pinecone, which requires managing multiple tenants within individual indexes, Neon lets Vectstore manage multiple tenants efficiently using standard Postgres patterns like separate databases or schemas per tenant.

## One Database, No Regrets

By consolidating relational and vector data into a single Postgres database, Vectstore simplified their architecture while improving performance and making their developer experience dramatically better. If you’re also building AI applications that rely on vector search or similarity queries, [give Neon a try](https://console.neon.tech/signup).

---

_A big thank you to [Vecstore](https://vecstore.app/) for sharing their story!_
