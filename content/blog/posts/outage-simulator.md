---
title: Accidents Happen. What If Your Postgres Database Could Recover Instantly?
description: Try our Outage Simulator and see Neon's Instant Restore in action
excerpt: >-
  We all have experienced what happens when a production database goes down—it’s
  not fun. No matter the cause, the result is always the same—high stress,
  downtime, and a rush to restore everything as quickly as possible. How long
  would it take to get your Postgres database back onl...
date: '2025-03-10T19:42:16'
updatedOn: '2025-03-11T15:53:42'
category: workflows
categories:
  - workflows
authors:
  - carlota-soto
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/outage-simulator/cover.jpg'
  alt: null
isFeatured: true
seo:
  title: >-
    Accidents Happen. What If Your Postgres Database Could Recover Instantly? -
    Neon
  description: >-
    Try our Outage Simulator to experience Neon’s Instant Restore. Delete every
    table for a real web app, then instantly bring it back.
  keywords: []
  noindex: false
  ogTitle: >-
    Accidents Happen. What If Your Postgres Database Could Recover Instantly? -
    Neon
  ogDescription: >-
    Try our Outage Simulator to experience Neon’s Instant Restore. Delete every
    table for a real web app, then instantly bring it back.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/outage-simulator/cover.jpg'
---

<img
  src="https://cdn.neonapi.io/public/images/pages/blog/outage-simulator/neon-point-in-time-1024x576-580e8b95.jpg"
  alt="Post image"
  width="1024"
  height="576"
/>

We all have experienced what happens when a production database goes down—it’s not fun. [No matter the cause](https://neon.tech/blog/recover-production-database), the result is always the same—high stress, downtime, and a rush to restore everything as quickly as possible.

How long would it take to get your Postgres database back online? For most, the answer hours, certainly if your DB has a certain size (TBs).

What if restoring your database was instant? That’s exactly what we’re about to show you. In this post, we’re going to **simulate a database disaster** and bring it back to life instantly using Neon’s Instant Restore. Instead of just telling you about it, we built a hands-on [Outage Simulator](https://neon-demos-outage.vercel.app/) so you can see it in action:

[https://fyi.neon.tech/recovery](https://fyi.neon.tech/recovery)

## Try it Yourself: The Outage Simulator

For this interactive demo,

1. We built a simple web app, a [social media feed](https://twitter-clone-outage-demo.vercel.app/). It loads posts from a real Postgres database running on [Neon](https://neon.tech/home).
2. Then, we simulate a database failure. The app crashes, everything breaks.
3. To fix it, we trigger an [instant restore](https://neon.tech/docs/guides/branch-restore) in Neon.
4. The app then comes back online—fast.

Watch it happen or [run it yourself](https://neon-demos-outage.vercel.app/):

<video autoPlay muted loop width="1720" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/outage-simulator/outage-simulator-ed042a94.mp4" />
</video>

## How is This Possible?

What’s actually happening under the hood?

Traditional Postgres restores involve restoring from snapshots or backups and replaying WAL, a process that takes time, [especially for large datasets](https://neon.tech/blog/recover-large-postgres-databases). Neon is able to take a completely different approach to recovery, leveraging its [copy-on-write branching](https://neon.tech/blog/get-page-at-lsn) to make restores near-instant.

In the [Outage Simulator](https://neon-demos-outage.vercel.app/), this is what we’re doing:

1. We loaded 1 TB (1254 GB to be exact) into a main branch in a Neon project.
2. Instead of having everyone connect to a shared database, each user session gets a dedicated Neon branch.
3. When the app fails, we don’t reload a backup. Instead, Neon [creates a new branch from the exact point in time before the failure](https://neon.tech/docs/guides/branch-restore) and seamlessly redirects the app to this restored branch. This happens in less than a second.

Thanks to Neon’s architecture, branches don’t copy data; they reference shared storage and only record changes. That’s what makes recovery so fast, even for multi-terabyte databases. **If this demo was 100 TB, recovery would be just as quick.**

## A New Standard for Database Recovery

Accidents are inevitable. The real question isn’t if they’ll happen, but how quickly you can recover.

Database recovery mechanisms in services like Amazon RDS are slow and complex to maintain, especially at scale. More often than not, restoring takes hours, and every second of downtime means lost revenue, frustrated users, and operational headaches.

Neon changes this. With Instant Restore, you can rewind your database immediately and keep your applications running. Create a Neon account and [try this in our Free Plan.](https://console.neon.tech/signup)
