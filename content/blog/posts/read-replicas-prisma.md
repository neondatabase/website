---
title: Scaling Prisma applications with Neon read-only replicas
description: >-
  Learn what Neon read-only replicas are and how to leverage them to scale your
  Prisma applications.
excerpt: >-
  In this guide, we’ll cover what read replicas are, how they work in Neon, and
  how to leverage them to scale your Prisma applications. What is a read
  replica? A read replica is a read-only synchronized copy of your primary
  database. It offloads read traffic from your primary datab...
date: '2023-09-13T14:59:14'
updatedOn: '2025-10-14T06:26:36'
category: community
categories:
  - community
authors:
  - mahmoud-abdelwahab
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/read-replicas-prisma/cover.png
  alt: null
isFeatured: false
seo:
  title: Scaling Prisma applications with Neon read-only replicas - Neon
  description: >-
    Learn what Neon read-only replicas are and how to leverage them to scale
    your Prisma applications.
  keywords: []
  noindex: false
  ogTitle: Scaling Prisma applications with Neon read-only replicas - Neon
  ogDescription: >-
    Learn what Neon read-only replicas are and how to leverage them to scale
    your Prisma applications.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/read-replicas-prisma/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/read-replicas-prisma/neon-prisma-read-replicas-2-1024x576-31401c79.png)

In this guide, we’ll cover what read replicas are, how they work in Neon, and how to leverage them to scale your Prisma applications.

## What is a read replica?

A read replica is a read-only synchronized copy of your primary database. It offloads read traffic from your primary database to improve performance and scalability.

![Image](https://cdn.neonapi.io/public/images/pages/blog/read-replicas-prisma/what-is-a-read-replica-1024x316-dc225fe1.png)

Read replicas have several benefits:

- Increased throughput: By distributing read requests among multiple read replicas, you can achieve higher throughput for both read-write and read-only workloads.
- Workload offloading: Assign reporting or analytical workloads to a read replica to prevent any impact on the performance of read-write application workloads.
- Access control: Provide read-only data access to certain users or applications that do not need write access.
- Resource customization: Configure different CPU and memory resources for each read replica to cater to the specific needs of different users and applications.

## Neon read-only replicas

In traditional Postgres, read replica data is synchronized using log-based replication. In this process, changes to the primary database are recorded in a Write-Ahead Log (WAL) and are then replayed on the read replicas to ensure data consistency. This process works differently in Neon [due to its architecture](https://neon.tech/blog/architecture-decisions-in-neon), which separates storage and compute.

Read-only replicas in Neon are independent read-only compute instances that perform read operations on the same data as your read-write computes. Data is _not_ replicated across database instances, and read requests are directed to a single source.

![Image](https://cdn.neonapi.io/public/images/pages/blog/read-replicas-prisma/neon-read-only-replicas-1024x453-658aed22.png)

### Advantages of Neon’s read-only replicas

Neon’s read-only replica feature includes the following advantages:

1. Cost effectiveness: Since read-only computes read from the same source as your read-write compute, this means zero additional storage cost. Read-only computes also take advantage of Neon’s [Autoscaling](https://neon.tech/docs/introduction/autoscaling) and [Auto-suspend](https://neon.tech/docs/introduction/auto-suspend) features, which enable efficient compute resource management.
2. Data consistency: Read-write and read-only compute instances read data from a single source, ensuring a high degree of data consistency.
3. Instant availability. When a read replica starts up, it is instantly up to date with your read-write primary. You do not have to wait for updates.

### Creating a read-only replica

To create a read-only replica, you’ll need to sign up for Neon’s [Pro plan](https://neon.tech/docs/introduction/pro-plan). You can then select the branch where your database resides, click “Add Compute”, choose the read-only option, and configure the compute size.

<video autoPlay playsInline muted loop width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/read-replicas-prisma/read-replica-3d8d10f3.mp4" />
</video>

Alternatively, you can use the [Neon CLI](https://neon.tech/docs/reference/neon-cli) to create a read-only replica by running the following command:

```bash
neonctl branches add-compute mybranch --type read_only
```

## Connect to read-only replicas using @prisma/extension-read-replicas

Prisma Client doesn’t support read replicas out of the box. Fortunately, it [can be extended](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions/extension-examples) to add functionality to your models, result objects, and queries or to add client-level methods. The Prisma team just released [@prisma/extension-read-replicas](https://www.npmjs.com/package/@prisma/extension-read-replicas), a Prisma Client extension that adds read replica support. Check out the [launch blog post](https://prisma.io/blog/read-replicas-prisma-client-extension-f66prwk56wow) to learn more.

To connect to a Neon read-only replica using Prisma, first install [the extension](https://github.com/prisma/extension-read-replicas) in your Prisma project:

```bash
npm install @prisma/extension-read-replicas
```

Next, extend your existing Prisma Client instance and point it to the Neon read-only replica:

```javascript
import { PrismaClient } from '@prisma/client'
import { readReplicas } from '@prisma/extension-read-replicas'

const prisma = new PrismaClient()
  .$extends(
    readReplicas({
      url: DATABASE_REPLICA_URL,
    }),
  )
```

You can also pass an array of connection strings if you would like to connect to multiple read replicas.

```javascript
// lib/prisma.ts
const prisma = new PrismaClient()
 .$extends(
   readReplicas({
     url: [
       process.env.DATABASE_REPLICA_URL_1,
       process.env.DATABASE_REPLICA_URL_2,
     ],
   }),
 )
```

When your app runs, all read operations are sent to a database replica. If you specify multiple URLs, a read replica is selected randomly.

On the other hand, all write and [`$transaction`](https://www.prisma.io/docs/concepts/components/prisma-client/transactions#the-transaction-api) queries are forwarded to the primary compute endpoint.

If you would like to read from the primary compute endpoint and bypass read replicas, you can use the `$primary()` method on your extended Prisma Client instance:

```javascript
const posts = await prisma.$primary().post.findMany()
```

This Prisma Client query will always be routed to your primary database to ensure up-to-date data.

## Conclusion

Neon read-only replicas offer a robust solution to scale your Prisma applications efficiently. If you have any questions or feedback, please reach out to us in our [community forum](https://community.neon.tech/), we’d love to hear from you.

Also, make sure to subscribe below if you would like to be notified of new content we publish on our blog.
