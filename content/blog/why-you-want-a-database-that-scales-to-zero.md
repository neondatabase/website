---
title: Why You Want a Database That Scales to Zero
description: 'Ignore the haters, scale-to-zero DBs are better for everyone.'
excerpt: >-
  Scale to zero is the Neon feature where you can say: “When my database is idle
  for X seconds, shut it off so I’m not paying for it, but wake it up when I
  need it again.” This is possible because Neon separates compute and storage:
  we shut off compute, storage stays safe and sound...
date: '2024-04-05T15:02:47'
updatedOn: '2024-04-05T17:04:13'
category: community
categories:
  - community
authors:
  - bryan-clark
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-you-want-a-database-that-scales-to-zero/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Why You Want a Database That Scales to Zero - Neon
  description: 'Ignore the haters, scale-to-zero DBs are better for everyone.'
  keywords: []
  noindex: false
  ogTitle: Why You Want a Database That Scales to Zero - Neon
  ogDescription: >-
    Scale to zero is the Neon feature where you can say: “When my database is
    idle for X seconds, shut it off so I’m not paying for it, but wake it up
    when I need it again.” This is possible because Neon separates compute and
    storage: we shut off compute, storage stays safe and sound […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-you-want-a-database-that-scales-to-zero/social.jpg
source:
  wpId: 5465
  wpSlug: why-you-want-a-database-that-scales-to-zero
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/why-you-want-a-database-that-scales-to-zero/neon-scales-to-zero-1-1024x576-d60f6983.jpg)

**Scale to zero is the Neon feature where you can say: “When my database is idle for X seconds, shut it off so I’m not paying for it, but wake it up when I need it again.” This is possible because Neon separates compute and storage: we shut off compute, storage stays safe and sound in S3. Recently, we’ve heard people say “_Prod DB’s never idle, so scale to zero isn’t for real work._” That’s just silly, let’s talk about why.**..

Need to test some code? Spin up a database. Need to prototype a new feature quickly? Spin up a database. Need to run some data analysis on a subset of your data? Spin up a database. Need an isolated environment for experimenting with schema changes? Spin up a database. Need to do some load testing to see how your application performs? Spin up a database.

Developers need a lot of databases.

But most of these needs are ephemeral. Beyond your production database and maybe a core analytics warehouse, almost every other DB a developer uses every day has low throughput and is temporary. Yet, you have to spin up an entire instance and remember to turn it off when you’re done. This costs money.

At Neon, we think this straightforwardly sucks. That’s why a core feature of every single Neon instance is “[scale to zero](https://neon.tech/docs/introduction/auto-suspend).” If you aren’t using your db, we’ll store the data and put the compute to sleep. You’ll incur zero compute costs during this time.

Given this obvious benefit, why do scale-to-zero databases get such a bad wrap? It’s because people don’t understand German escalators.

## “Production databases never idle”

Every Neon project defaults to suspending compute after a certain period of inactivity. For users on the Free Tier, that time window is 5 minutes; for everyone else, it is configurable (even disable-able!) to meet your needs. When the database is queried again, it wakes up in ~500ms.

Seems like a great idea (spoiler: it is).

Then why do some dismiss the idea? The argument against scale to zero goes like this:

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><em>“In production, there is no such thing as an idle database. It is always under load. Thus, databases that scale to zero aren’t built for production.”</em></p>
<cite>Haters</cite>
</blockquote>

**No.**

Let’s illustrate this fallacy with escalators. The escalators in German subway systems have an “Auto Start Stop” feature. There is a sensor at the entrance to the escalator. If nobody triggers the sensor for some amount of time, the motors shut off. When someone triggers the sensor, the motors turn on.

<figure>
<video controls width="1280" height="720">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/why-you-want-a-database-that-scales-to-zero/smart-german-escalators-deac5eea.mp4" />
</video>
<figcaption>Video Credit: https://www.youtube.com/watch?v=WzapwtWtypg</figcaption>
</figure>

If no one is using the escalator, it consumes zero power. But as long as people are using it, it functions exactly like any other. German subway escalators scale to zero.

Escalators that shut off when nobody uses them aren’t worse during rush hour. The same applies to databases. When a scale-to-zero database serves a high-throughput production workload, scale-to-zero doesn’t slow it down. It acts as exactly any other database.

How does this work? When you spin up a Neon database, the compute and the storage are decoupled–your Postgres servers executing queries are _physically separate_ from the data storage. Each Postgres instance is a MicroVM inside a larger bare metal node. Suspending the compute is as easy as deallocating vCPU and RAM to the MicroVM.

If you use a Neon database for a high-traffic production instance, this suspension never happens. The CPU/RAM is always available, and, in fact, you can use this architecture to easily [autoscale](https://neon.tech/docs/introduction/autoscaling) your database.

## The Core Value of Scale to Zero

With that fallacy debunked, let’s examine why almost every development team could benefit from scale-to-zero databases.

With scale to zero, developers can freely create as many databases as they need without worrying about runaway costs. This means you can experiment, iterate, and test applications more efficiently. You can spin up databases for different environments, features, or experiments for these small workloads, knowing that inactive instances won’t drain the budget. Some examples might be:

- **Non-Production Databases** – Development, preview, staging, test, scratch, etc… Developers need the flexibility to build without worrying about the cost implications of running multiple database instances. Scale to zero provides this flexibility by ensuring that development databases only consume resources when actively used.<br />
- **Internal Apps** – Internal tools you’ve created for super-specific team needs to have a limited number of users compared to customer-facing applications. These apps have obvious periods of inactivity outside of working hours or during holidays. With scale to zero, the databases supporting these internal apps can automatically suspend when idle, reducing costs without impacting performance during peak usage.<br />
- **Small Projects** – For small projects, configuring the production database to scale to zero can make it more cost-efficient without major impact to UX.

If you’re running this work on a database without scale to zero, costs mount. Before you know it, you’re managing dozens of databases, each with its own “always-on” cost. That extra $20/month is now hundreds of dollars per month for, in many cases, literally nothing. Scale-to-zero databases solve this problem by aligning costs with actual usage across your entire database fleet.

It also removes another headache–database management. A lot of developers right now are probably thinking, ” Yeah, but I can just provision/deprovision these myself.” Maybe, but that is also a cost overhead. You shouldn’t spend your time as a DBA; you should spend it as a developer focused on building.

Ask yourself this: Do any of my databases have any idle periods? If the answer is yes, you should use scale to zero.

## The Escalators Not Taken

There is another way to think about this. You may be cost-conscious and are concerned about spinning up databases everywhere. What are you missing out on?

There are at least two categories where we see teams utilizing databases more when they use scale to zero.

Firstly, **automation**. What if you could create a specific test instance of your production database for every PR? Then, you could run comprehensive tests against a realistic dataset without impacting the production environment. This would enable more thorough testing, catching potential issues early in development. You could even automate the creation and teardown of these test instances as part of your CI/CD pipeline, ensuring that every change is thoroughly validated before deployment. With scale to zero, the cost of running these test instances would be minimal, as they would only consume resources during active testing.

Second, **multi-tenancy**. What if you could give every customer their own database? Then, you could offer higher data isolation and security, as each customer’s data would be physically separated from others. You can also tailor the performance, storage, and backup policies to meet their specific needs by providing dedicated databases for each customer. This level of customization can be a significant differentiator in the market, helping you attract and retain customers who value data privacy and control. With scale to zero, the cost of managing a large number of customer-specific databases becomes feasible, as idle instances would not consume resources.

In both scenarios, scale-to-zero databases enable new options and architectures that were previously cost-prohibitive or operationally complex.

## Scale to zero has no downsides

Say you choose to move to scale to zero today. What happens?

For your production database, nothing. It will continue to work just as expected. If you get tons of activity, the database will never idle and function just like any other. If you don’t have quite the traffic to keep it live all the time, you can choose between (1) disabling scale to zero and keeping it on all the time, or (2) letting the database autosuspend when idle, trading the occasional ~500ms latency for a lower database bill.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/why-you-want-a-database-that-scales-to-zero/g46popecsnmrtnnw69klqkdyomwtvpltcpesggxnhzafpqpvq5nlj1vexiwudh5luqhq28a-9l6mbuojqccwirtblovldwcalim5l4s716kdftf9tilfkvqf-ynxicg7ktqq2cct7tviyn0vpaveue-8ccba868.png" alt="Image" />
<figcaption>Uncheck this box to run 24×7</figcaption>
</figure>

But for all your other databases? You’ll see drastically reduced costs for any with low usage. This also means you can reframe your entire database strategy and create databases for different use cases that might have been cost-prohibitive before.

<br />At Neon, having scale-to-zero databases also allows _us_ to reduce costs–that’s why we can continue to offer our great Free Tier where others falter.

<EmbedTweet url="https://twitter.com/nikitabase/status/1758639571414446415?ref_src=twsrc%5Etfw" text="The economics of running database as a service and offering a free tier are brutal. Each database instance burns at least a VM or a set of VMs (for distributed or HA flavors) 👇 — Nikita Shamgunov (@nikitabase) February 16, 2024" />

Scale-to-zero keeps costs low across the board.

Free yourself from the overhead of manually turning on and off databases. Start with the [Neon free tier](https://console.neon.tech/signup), bring your team and [ship a SaaS app](https://neon.tech/blog/why-topo-io-switched-from-amazon-rds-to-neon), or go full send and [manage a fleet of 300,000 databases](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases). Rest assured scale to zero is helping you move faster without anyone wasting money on idle databases.
