---
title: We’re Cutting Storage Costs (Automatically)
description: We’ve implemented archive storage so you pay less for inactive branches
excerpt: >-
  Starting December 1st, many Neon users will see lower storage costs. Inactive
  branches—those idle for at least a day and older than 2 weeks—will now be
  charged at a reduced per-GB rate. If this applies to you, there’s nothing you
  need to do—it all happens automatically. Simply en...
date: '2024-11-21T00:26:43'
updatedOn: '2024-11-21T00:26:45'
category: company
categories:
  - company
authors:
  - anna-stepanyan
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/cutting-storage-costs/cover.jpg
  alt: null
isFeatured: false
seo:
  title: We’re Cutting Storage Costs (Automatically) - Neon
  description: >-
    All branches idle for at least one day and older than two weeks will now be
    charged a reduced per-GB rate, saving users money.
  keywords: []
  noindex: false
  ogTitle: We’re Cutting Storage Costs (Automatically) - Neon
  ogDescription: >-
    All branches idle for at least one day and older than two weeks will now be
    charged a reduced per-GB rate, saving users money.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/cutting-storage-costs/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/cutting-storage-costs/neon-cut-cost-1-1-1024x576-6733c820.jpg)

**Starting December 1st, many Neon users will see lower storage costs. Inactive branches—those idle for at least a day and older than 2 weeks—will now be charged at a reduced per-GB rate. If this applies to you, there’s nothing you need to do—it all happens automatically. Simply enjoy the savings.**

Here’s a deeper dive into what’s behind this price reduction, if you’re interested:

## What you get with our standard per-GB price

Neon uses a [custom storage engine](https://neon.tech/blog/get-page-at-lsn), so its “regular” per-GB price covers more than just basic storage. It also includes:

- **Cache for high performance**. Neon is built for speed, with a cache component we’re calling the [Pageserver](https://neon.tech/blog/get-page-at-lsn). The Pageserver stores frequently accessed data on high-performance SSDs to ensure low latencies. For HA, Neon also runs secondary Pageservers in different availability zones that maintain up-to-date copies of the project’s data.
- **Safekeepers for WAL**. Neon’s storage also includes Safekeepers, which capture [every change made to your database through WAL.](https://neon.tech/blog/what-you-get-when-you-think-of-postgres-storage-as-a-transaction-journal) This is how Neon can offer features like branching and [time travel queries](https://neon.tech/docs/guides/time-travel-assist).
- **Object storage for the long term**. While the Pageserver handles fast access, Neon uses cloud object storage (Amazon S3 or Azure Blob Storage) as the durable layer that holds the bulk of your data.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/cutting-storage-costs/screenshot-2024-11-20-at-94720percente2percent80percentafam-1024x594-a3d44708.png" alt="Image" />
<figcaption><em>The Neon storage architecture. Diagram shows how failures of Safekeeper or Pageserver services are recovered across Availability Zones in case of failure.</em></figcaption>
</figure>

This design allows us to offer a better developer experience (with performance, durability, branching, and HA). But reflecting on our architecture, we asked ourselves—is it necessary to keep all these components fully operative all the time?

The answer, of course, is that certain components (Pageservers, Safekeepers) are not active if this data is not being accessed, which leads us to the introduction of archive storage.

## Archive storage: What changes

Now, when a branch has been inactive for at least one day and is older than two weeks, Neon will automatically “archive” it. **This process doesn’t involve transferring data; rather, the Pageserver simply evicts the branch’s data from its SSD cache.**

The branch remains stored in cloud object storage, but it no longer uses the high-performance SSD cache. When you query an archived branch again, it’s “reactivated” automatically. Once reactivated, the Pageserver pulls the branch’s data back into SSD storage, restoring it to full performance.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/cutting-storage-costs/screenshot-2024-11-20-at-94818percente2percent80percentafam-1024x318-508640a0.png" alt="Image" />
<figcaption><em>Since Archive storage is hosting inactive branches, we can lower storage costs by deactivating pageserver and safekeepers. These elements are automatically reactivated once branches get accessed.</em></figcaption>
</figure>

Here’s the tradeoff (there’s always one): while the branch’s data remains securely in cloud storage, accessing it will come with a small performance delay _the first time you query it_ as it’s reloaded to the Pageserver again.

But this tradeoff is well worth it. By implementing achive storage, we can lower down the costs of our storage infrastructure, passing down this price reduction to our customers. We’ll bill archive storage at a reduced rate—$0.1 per GB-month. Plus, your monthly subscription for the Launch, Scale, and Business plans will include a substantial amount of archive storage. We’ll share more details soon.

## Wrap up

This storage model enables us to pass down storage savings to our customers with minimal consequences. Once again, no action is required from you—you can just enjoy the savings when they come. If you have questions, [ask us in Discord](https://discord.gg/92vNTzKDGp), we’ll be happy to chat.
