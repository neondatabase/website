---
title: Create Read Replicas in The Free Plan
description: Our free tier keeps expanding.
excerpt: >-
  We keep bringing you new things, following up on the 10/10 spirit. Today’s
  news: read replicas are now available in the Free Plan. This is particularly
  great if you’ve been curious to test out how awesome they are. Why are we
  doing this? Read Replicas are just another way to use...
date: '2024-10-23T16:02:29'
updatedOn: '2024-10-24T15:56:12'
category: company
categories:
  - company
authors:
  - brad-van-vugt
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/create-read-replicas-in-the-free-plan/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Create Read Replicas in The Free Plan - Neon
  description: >-
    You can now create read replicas in the Neon Free plan. Use them as
    read-only access points for your branches.
  keywords: []
  noindex: false
  ogTitle: Create Read Replicas in The Free Plan - Neon
  ogDescription: >-
    You can now create read replicas in the Neon Free plan. Use them as
    read-only access points for your branches.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/create-read-replicas-in-the-free-plan/social.jpg
source:
  wpId: 7345
  wpSlug: create-read-replicas-in-the-free-plan
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/create-read-replicas-in-the-free-plan/neon-read-replicas-1-2-1024x576-f7b3259c.jpg)

We keep bringing you new things, following up on the [10/10 spirit](https://neon.tech/blog/10x-projects-on-free-plan). Today’s news: **read replicas are now available in the Free Plan.** This is particularly great if you’ve been curious to test out how awesome they are.

Why are we doing this? Read Replicas are just another way to use your [compute hours](https://neon.tech/docs/introduction/usage-metrics#compute). Our Free Plan includes 190 CU-hours, enough to run the smallest compute 24/7 if that’s what you prefer. But if you don’t need your database running all the time, you can invest your compute hours in more projects ([you now get ten](https://neon.tech/blog/10x-projects-on-free-plan)), higher capacity (via [autoscaling](https://neon.tech/docs/introduction/usage-metrics#compute)) or, now, in read replicas.

## Neon read replicas crash course

Read replicas may not sound like _the most exciting feature_: they’ve been around for a while as a table-stakes feature of managed databases, acting as tools for offloading reporting and analytics tasks from the primary database. Traditional read replicas work by asynchronously copying data from the primary database to a secondary instance using log-based replication mechanisms: changes are recorded in a Write-Ahead Log (WAL) and replayed on the replica to keep it in sync with the primary. [We discussed the state of the art of replicas in a previous blog post.](https://neon.tech/blog/the-problem-with-postgres-replicas)

But Neon takes a fundamentally different approach to read replicas, taking advantage of its unique serverless architecture. [Neon separates storage and compute while implementing a custom-built storage layer that allows multiple compute endpoints to be attached to the same storage unit.](https://neon.tech/blog/architecture-decisions-in-neon) As a result, Neon’s read replicas don’t need to copy or duplicate data—both the primary compute and the read replicas access the same data source directly from Neon’s storage layer, which persists data across all replicas.

![Image](https://cdn.neonapi.io/public/images/pages/blog/create-read-replicas-in-the-free-plan/ad4nxcglqrezpea8dy5jpbgnqcllh9wkvbdqur28vqd-djdie6pkpgvfcob7zhtdfemc1bcsvzgdwmjmnskhmuwzf6mnkn4dudhsrswyjcgevizkgwcjf89g3guxkfmyqd8kq3msa8xyoisu7cchjbn2g6i-95c36d1f.png)

This architectural difference brings three key advantages:

- **Lighter and cost-efficient**. In traditional setups, read replicas need additional storage to maintain a copy of the primary database, so they quickly get heavy and expensive. In Neon, all replicas read from a shared storage backend. You can create hundreds of them, and you only pay for storage once.
- **Worry-free management**. Neon’s read replicas scale to zero when idle. This not only saves you even more costs but also eases _maintenance pressure_. You don’t have to worry about your read replicas once they’re created. They’re virtually free if nobody’s using them.
- **Fast to deploy**. Since no data needs to _actually_ be _replicated_, read replicas in Neon are created and deleted almost instantly. If someone needs to query the database, they can immediately get their isolated connection string.

## Two use cases

### Safe, low-cost read access for teams

The most popular use case for read replicas in Neon is granting read access to your data without compromising your primary database. For example, there might be team members who need to run queries for reporting or analysis; thanks to the lightweight nature of Neon’s read replicas, you can create dedicated replicas for each person, each with their own access URL. All while ensuring that:

- **Your main compute stays safe**. You don’t have to worry about someone running an inefficient or heavy SQL query that could jeopardize the performance of your database or, worse, break something critical.
- **Costs stay low by default**. You can create many replicas without worrying about the cost. If nobody is actively querying a replica, it automatically suspends itself.

### Horizontal scaling

Another popular use case for Neon read replicas is helping teams scale compute horizontally. If you’re running a write-heavy workload in production, you could use read replicas to offload read queries, relieving pressure on the primary compute and ensuring that your application continues running with optimal performance.

But you can even do this if your primary workload isn’t that heavy. Instead of scaling your primary database by [increasing the compute autoscaling limit](https://neon.tech/docs/guides/autoscaling-guide#configure-autoscaling-defaults-for-your-project), you could create multiple read replicas and distribute your queries across them, keeping all your computes small.

## Create your first read replica

In your [Neon Free account](https://console.neon.tech/signup), navigate to the branch you’d like to add a read replica to and select `Add Read Replica`:

![Image](https://cdn.neonapi.io/public/images/pages/blog/create-read-replicas-in-the-free-plan/ad4nxfgmm-yf0qy-ktmc9l0pb5ikgfah5wbt6avmpgbwtxzegxiykwj0mmintozikdopzxqkz4btd53eddcv9wsagmhvvljybwicbbe4briel3gqwubnpauw9fv4dq77f6kjnvfduhhvljogsf-arejktb7nw-f9d6b4e0.png)

Next, configure your read replica as you would for any other compute. Remember, a read replica in Neon is simply an additional compute endpoint attached to your branch with read-only access to your database.

For example, in the screenshot below, the read replica is configured with a fixed 0.25 CPU and 2 GB RAM capacity, but you can also enable autoscaling with a higher compute max. Make sure to keep autosuspend enabled so your read replicas can scale to zero when not in use.

![Image](https://cdn.neonapi.io/public/images/pages/blog/create-read-replicas-in-the-free-plan/ad4nxfyaixmv0nyd83x4xok3ctufnyllgf3jqoiw2r5oa4ir4vyocfo4e1kr-xryhbt0khroxfwdk9rpsjggavqp6h0qyiithjuugfxxohgf-ryavkzthn8tkv3mwj-lcoam3uzwmsbtshechw8mfc3bmvzg-0ded8e30.png)

! [Image](https://cdn.neonapi.io/public/images/pages/blog/create-read-replicas-in-the-free-plan/ad4nxfd5d3mo9gighgghh3ilgpxkqwowci5irivskjlabdmd8mbr2ood3c9n1uyqptti66o5o4ennisqgspdnv9u8q6npd7dfqasizab901fhn8p-axscw9c1ty0tlpiozm5bexlzfhrhrexvskf9xpr0po-2a2d059a.png)

Once you click `Create`, your read replica will appear in the list of computes attached to your branch. If you want to connect to your branch via the read replica (or allow someone else to), you’ll find a dedicated connection string under `Connect`:

![Image](https://cdn.neonapi.io/public/images/pages/blog/create-read-replicas-in-the-free-plan/ad4nxdrf93edbz7qqxig0wacfsgetssnraojth3enn6pwf7cprsludxmrpemhij24esyluiisc2rgkfivblgwukt7npxkhcodzt-kyjeagynsdpcq8y-1ufgs6vo-cie-vrqfqtxhbnrqbpwcfbfey4qt7i-1028a941.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/create-read-replicas-in-the-free-plan/ad4nxfwszbahn-q5vsuhf7gqmui0nk0obtaemv0lmsfz1-1s0ao1uzhav01cj1nmrpz2g-idrhkc3ta4ymyuh6fy1buwtvxneeyt7v1kuotcpucjg5f8dmbwiy4cr9jw7eueg9cn7c8cbr86b90xccotyujo-20db5fcb.png)

Go ahead and replicate! If you have any questions, feel free to ask us in [Discord](https://discord.gg/92vNTzKDGp).
