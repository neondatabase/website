---
title: How Supergood unlocked their Postgres developer productivity
description: No more waiting for slow-moving infra or stressing over test data
excerpt: >-
  “Neon allows us to develop much faster than we’ve even been used to. In
  traditional setups, you’re just trying to get the data that is representative
  of real customers—but now, when we build a feature, we’re actually testing it
  on real data in a matter of minutes. We can get feat...
date: '2024-02-20T18:01:16'
updatedOn: '2024-05-14T20:03:19'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-supergood-unlocked-their-postgres-developer-productivity/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How Supergood unlocked their Postgres developer productivity - Neon
  description: >-
    Neon allows Supergood to ship faster than ever by removing the delays caused
    by slow-moving servers and database copies.
  keywords: []
  noindex: false
  ogTitle: How Supergood unlocked their Postgres developer productivity - Neon
  ogDescription: >-
    Neon allows Supergood to ship faster than ever by removing the delays caused
    by slow-moving servers and database copies.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-supergood-unlocked-their-postgres-developer-productivity/social.jpg
source:
  wpId: 4738
  wpSlug: how-supergood-unlocked-their-postgres-developer-productivity
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-supergood-unlocked-their-postgres-developer-productivity/neon-supergood-1024x576-5214749c.jpg)

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“Neon allows us to develop much faster than we’ve even been used to. In traditional setups, you’re just trying to get the data that is representative of real customers—but now, when we build a feature, we’re actually testing it on real data in a matter of minutes. We can get features shipped way faster”</p>
<cite>Alex Klarfeld, CEO and co-founder of Supergood.ai</cite>
</blockquote>

If you’ve felt frustrated with your third party APIs, you’re not alone. Before starting [Supergood](https://supergood.ai/), [Alex Klarfeld](https://www.linkedin.com/in/alex-klarfeld-a2706848/) was a co-founder in [Divvy Homes](https://www.divvyhomes.com/), a market leader in the proptech industry. While focusing on the platform during the day, he (forcefully) held a second job at night: dealing with the dozens of API vendors they were integrating with.

Third-party APIs often failed in ways that traditional observability tools couldn’t detect, and it was impossible to write code to handle every conceivable way that an API could fail. Monthly invoices from these vendors would come back way higher than expected, and auditing usage was far from straightforward.

[Supergood](https://supergood.ai/) was born to bring transparency to dealing with third-party APIs. “It’s essentially one line of code that you drop into your code base and makes sure all your third-party APIs don’t take down your business or break your bank”, said Alex, now CEO and co-founder of Supergood. It alerts you to anomalies like subtly changing response payloads, unexpected value fields, or slow response times before they affect your customers, and helps you understand the costs associated with API vendors.

## Building Supergood using Neon, Redis, and TimescaleDB

Under the hood, Supergood is powered by Neon as their mission-critical database. Supergood collects a constant stream of API metrics and ingests them into Neon, using Redis as a cache and Google Pub/Sub to streamline the high data volume.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-supergood-unlocked-their-postgres-developer-productivity/screenshot-2024-02-20-at-10436percente2percent80percentafpm-1024x522-f962ad19.png)

Supergood splits their architecture into staging and production environments, with both environments having their isolated databases, Redis caches, workers running scheduled jobs, and a data worker and server handling API calls.<br /><br />To optimize performance for time series data, Supergood [enables the TimescaleDB extension in Neon.](https://neon.tech/docs/extensions/pg-extensions) Supergood’s time series data are stored in hypertables, which are Postgres tables with automatic partitioning.

## How database branching allowed Supergood to ship faster

Before Neon, the team at Supergood was using the Timescale platform, but they were not impressed by the experience. They decided to switch to Neon, and they were amazed by how much their developer productivity improved.

<EmbedTweet url="https://twitter.com/AlexKlarfeld/status/1754888943580090388?ref_src=twsrc%5Etfw" text="It’s actually nuts how much @neondatabase has increased developer productivity for me and my team. Truly a step change. https://t.co/38XfyQxlfW — Alex Klarfeld (@AlexKlarfeld) February 6, 2024" />

One Neon feature was behind this productivity boost: database branching. Being able to use Postgres branches increased Supergood’s engineering velocity in three ways:

### Development and staging databases are immediately available

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“We use one branch per team member and another dedicated to our staging environment. We even launched a new data science project, and we’re offloading our heavier tasks to a separate branch. Our data scientists can run heavy queries without worrying about interfering with production”</p>
<cite>Alex Klarfeld, CEO and co-founder of Supergood.ai</cite>
</blockquote>

Neon branches use a copy-on-write mechanism under the hood, meaning that they don’t require to spin up a new storage instance with a separate copy of the production data. Branches are ready immediately after you create them, _with all your production data._

Instead of spinning up new instances and waiting for them to be available, something that might take many minutes or even hours if your database is somewhat large, you can start working right away. Branches allows you to create development, staging, and testing environments in seconds with full security—without leaving your VPC and [with additional security features like IP Allow](https://neon.tech/docs/introduction/ip-allow).

Supergood first realized this potential when onboarding their different team members to Neon. “Onboarding engineers became so easy as soon as we started using Neon. I just spin up a branch of Postgres for them and they can get onboard on the platform in 2 seconds”, said Alex. Soon, every developer was using their own branch. Their staging environment also runs on a dedicated branch.

Now, Supergood is even using a branch for data science, allowing data scientists to experiment and run heavy queries on their own branch. Branches in Neon have resource isolation, there’s no danger to the production database.

And since Neon branches don’t require their own copy of storage, and they use ephemeral compute endpoints that scale to zero when inactive, they’re also very affordable. “The Neon bill is lower than I expect it to be every time”, said Alex.

### Instead of testing locally, you can test in a database branch

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“Balancing development in local environments when you have actual production data with PII [Personal Identifiable Information] is tricky. In previous companies, we had to put a lot of effort into getting a synthetic dataset resembling production data that we could reliably run tests with in Docker or local Postgres. We don’t have to do that now – we just test in a Neon branch, with a perfect copy of production data without leaving our VPC”</p>
<cite>Alex Klarfeld, CEO and co-founder of Supergood.ai</cite>
</blockquote>

Another advantage of branches that might not be evident at first is that they’re a great candidate to substitute local testing. For security and compliance reasons, sensitive information cannot be used in local databases, forcing developers to create synthetic datasets for testing. But in databases, edge cases are everything: what might work locally, might not work in prod.

When using branches for testing, none of these worries are necessary. You’re never leaving your cloud, so security is covered, and you’re actually testing in production data. Everything is done and ready to ship in a matter of minutes.

This also avoids the need to move data outside of your private, secure network onto local machines, which could risk exposure of PII. It enhances security and compliance by ensuring sensitive data is not transferred to less secure environments.

### Read replicas are ephemeral and affordable

Neon’s serverless architecture with decoupled compute and storage gave Supergood one more advantage. In Neon, Supergood can spin up many read replicas, and they’re available immediately – just like branches. They only add to their compute bill when they’re running, and they imply no extra storage charges. They’re a great way to offload the primary database from heavy read queries, improving performance.

For Supergood, this experience with read replicas was a great improvement compared to other Postgres products, where adding read replicas takes time and doubles your bill.

## “Try Neon: it’s objectively better”

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“Once you start using branching, it feels crazy that you were doing Postgres any other way. Now I’m spoiled by Neon! Even if your architecture is not serverless, it doesn’t matter. Just try Neon, it’s objectively better”</p>
<cite>Alex Klarfeld, CEO and co-founder of Supergood.ai</cite>
</blockquote>

If you’re building on Postgres and this picked your curiosity, [run some experiments in our free tier](https://console.neon.tech/realms/prod-realm/protocol/openid-connect/registrations?client_id=neon-console&redirect_uri=https%3A%2F%2Fconsole.neon.tech%2Fauth%2Fkeycloak%2Fcallback&response_type=code&scope=openid+profile+email&state=nOF8hvjg6cniLoGNTMeymg%3D%3D%2C%2C%2C).

Neon makes Postgres _just work_, and Supergood is ready to make your third-party APIs _just work_ as well. If you have some vendor horror stories, [reach out to Alex on Twitter](https://twitter.com/AlexKlarfeld) – the Supergood team wants to hear them all! [You can also sign up for their private beta](https://supergood.ai/contact) and get an early sneak peek of what they’re building.
