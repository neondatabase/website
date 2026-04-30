---
title: Neon and Databricks
description: A new chapter
excerpt: >-
  Four years ago, Stas, Heikki, and I got together with a vision to disrupt the
  database industry. We observed the unstoppable rise of Postgres as the number
  one choice for developers. At the same time, we saw the limitations of legacy
  monolithic architectures in the cloud era. So...
date: '2025-05-14T10:02:41'
updatedOn: '2025-05-16T22:46:55'
category: company
categories:
  - company
authors:
  - nikita-shamgunov
  - heikki-linnakangas
  - stas-kelvich
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-and-databricks/cover.png
  alt: null
isFeatured: true
seo:
  title: Neon and Databricks - Neon
  description: >-
    Together, we will build the best Postgres experience in the world and one of
    the most important pieces of the modern AI-native app stack.
  keywords: []
  noindex: false
  ogTitle: Neon and Databricks - Neon
  ogDescription: >-
    Together, we will build the best Postgres experience in the world and one of
    the most important pieces of the modern AI-native app stack.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-and-databricks/cover.png
source:
  wpId: 9619
  wpSlug: neon-and-databricks
  exportedAt: '2026-03-20T13:31:00.745Z'
---

Four years ago, Stas, Heikki, and I got together with a vision to disrupt the database industry. We observed the unstoppable rise of Postgres as the number one choice for developers. At the same time, we saw the limitations of legacy monolithic architectures in the cloud era.

So we came up with something new: an architecture that separates storage and compute and introduces a branchable, versioned storage system — enabling instant branching, time-travel, and serverless scale. The idea was simple: build a cloud-native Postgres that developers would love and that could power the next generation of modern applications, including AI-native ones.

Then we got to work.

## Neon Beginnings

Neon started as a research-heavy project, deep in the weeds of database internals. We took ideas from distributed systems, log-structured storage, and version control, and rebuilt the Postgres storage layer from scratch for the cloud. This wasn’t a wrapper around Postgres or just managed hosting. It was a fundamental rethink of how Postgres should work in the modern era. We got ideas from AWS Aurora and Microsoft Socrates papers and added on our own innovation: S3 integration and branches.

Heikki, one of the original Postgres committers, led the charge on integrating our storage engine with the upstream Postgres codebase. Stas built the storage layer and WAL streamer. I focused on the product and company-building side. The three of us knew that if we got the foundation right, the rest would follow.

## Launch and Organic Growth

We launched Neon publicly in 2022 with a simple promise: serverless Postgres that feels like magic. One connection string, instant provisioning, auto-scaling, usage-based pricing, branching, time-travel — and no config.

Developers immediately got it. We didn’t need to push; word spread organically. Open source stars flew up. Twitter lit up. We saw incredible usage from startups, solo devs, and even enterprise teams building internal tools.

We stayed focused on developer experience (DevEx), simplicity, and performance. Over time, Neon became one of the fastest-growing developer databases on the market. Our self-serve model scaled globally, and our team kept shipping: scale-to-zero, point-in-time recovery, storage autoscaling, better p99 latencies.

## Partnerships

From the beginning, we believed that Neon should be a great component in a modern app stack, not a walled garden. So we partnered with the best dev platforms: Vercel, Replit, Cloudflare, GitHub and Microsoft — companies that shared our obsession with developer experience and fast iteration.

These integrations helped bring Neon to where developers already were. Spin up a Postgres branch from a PR? Done. Build a serverless AI app on Replit with Neon behind it? Instant. Our API-first approach made Neon easy to embed and extend.

## AI Agents

In 2024, something shifted: AI-native apps started taking off. And we realized that our architecture was uniquely well-suited to power them. We leaned into agent-focused development, and within a few months, over 80% of databases were being created by AI agents rather than humans.

AI agents need state — they need to store context, embeddings, user interactions, intermediate plans, and more. But traditional Postgres setups weren’t built for this scale or dynamism. Neon was.

With branching and time-travel, you could run isolated agent sessions, fork state, snapshot knowledge graphs, and iterate without blowing up your prod DB. Our serverless, multi-tenant architecture made it affordable and fast. Neon quietly became the go-to Postgres backend for many LLM-powered apps and platforms.

## Databricks Acquisition

[Today, we’re thrilled to announce that Neon will be joining forces with Databricks after the transaction closes.](https://www.databricks.com/blog/databricks-neon) This is a proud moment and will be the beginning of an even more ambitious chapter. This acquisition will give us the scale and backing to accelerate our mission.

Databricks is a company we’ve long admired. They’ve built an incredible business on top of open source software and a relentless focus on data and AI. What Spark did for big data, they are now doing for the AI stack.

From early on, our teams have been aligned, culturally and technically. We have had regular coffee chats, traded notes on architecture, and shared a belief that the future of data is unified: analytics, ML, and now OLTP all belong in the same ecosystem. Personally, I helped kickstart their Belgrade office, and Stas was at the ribbon-cutting. We’ve had shared DNA from day one.

With this acquisition, we will be building together.

## Journey Continues

Neon isn’t going anywhere – we’re doubling down, and the entire team will stay focused on building the best database in the world. Our roadmap is accelerating, and our ambition is only growing. Together with Databricks, we will build the best Postgres experience in the world and maybe one of the most important pieces of the modern AI-native app stack.

To everyone who believed in us early — thank you. The Neon journey has been an incredible ride so far. But the truth is, we’re just getting started.

Let’s go.

<Admonition type="note" title="Try Neon - $100 on us">
If you haven't tried Neon yet, [sign up via this link](https://fyi.neon.tech/credits) and get $100 in credits.
</Admonition>
