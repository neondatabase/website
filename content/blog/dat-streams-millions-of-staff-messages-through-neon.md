---
title: DAT Streams Millions of Staff Messages Through Neon
description: 'They power mission-critical field operations for 16,000+ staff'
excerpt: >-
  “Our system can’t afford any downtime. We manage field staff operations for
  thousands of workers through WhatsApp, and if a message fails to write, it’s
  lost. We’re leveraging all of Neon’s multi-region flexibility, autoscaling,
  and read replicas to optimize reliability at scale”...
date: '2025-09-29T15:55:24'
updatedOn: '2025-09-29T15:56:05'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/dat-streams-millions-of-staff-messages-through-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: DAT Streams Millions of Staff Messages Through Neon - Neon
  description: >-
    Learn how DAT powers mission-critical field operations for +16k workers
    taking advantage of Neon's branching, autoscaling, and replicas.
  keywords: []
  noindex: false
  ogTitle: DAT Streams Millions of Staff Messages Through Neon - Neon
  ogDescription: >-
    Learn how DAT powers mission-critical field operations for +16k workers
    taking advantage of Neon's branching, autoscaling, and replicas.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/dat-streams-millions-of-staff-messages-through-neon/social.jpg
source:
  wpId: 10992
  wpSlug: dat-streams-millions-of-staff-messages-through-neon
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/dat-streams-millions-of-staff-messages-through-neon/neon-dat-systems-1024x576-4a4ad5e3.jpg)

> **“Our system can’t afford any downtime. We manage field staff operations for thousands of workers through WhatsApp, and if a message fails to write, it’s lost. We’re leveraging all of Neon’s multi-region flexibility, autoscaling, and read replicas to optimize reliability at scale”** (Ahsan Nabi Dar, CTO and co-founder of DAT)

DAT is a Pakistan-based startup who 2 years ago set out to solve a uniquely local problem: how to effectively manage and monitor field staff operations at scale. Today, the company powers mission-critical operations for the Lahore Waste Management Company (LWMC), Pakistan’s largest public sector employer with more than 16,000 staff across multiple districts.

Their flagship product integrates directly with WhatsApp, Telegram, and WeChat to manage field staff operations for thousands of workers. Staff in the field send updates through messaging apps (text, photos, videos, location pins, and voice notes), while managers monitor everything in real time through dashboards built on [Retool](https://retool.com/).

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/dat-streams-millions-of-staff-messages-through-neon/image-9-1024x547-e62d781e.png" alt="Image" />
<figcaption>One of the dashboards built by DAT, used to track staff activity in real-time. Frontend powered by Retool</figcaption>
</figure>

## A Write-Heavy, Real-Time Data Pipeline

> **“Every message in our pipeline triggers four or five jobs, all written into the database. We’re processing around 10 million transactions a month”** (Ahsan Nabi Dar, CTO and co-founder of DAT)

DAT’s workload is a combination of continuous ingestion, multiple writes per event, background jobs, and complete audit trails. Here’s how their pipeline looks like:

- Messages flow in from WhatsApp Business (their primary channel) as well as Telegram and WeChat. These include text, location pins, photos, videos, and voice notes.
- Each incoming message results in at least three separate writes:
  - The message itself
  - Background jobs queued for processing (four to five per message)
  - Audit log entries recording every change to the application
- Every message is written into Postgres on Neon, and then triggers 4–5 background jobs for tasks such as image resizing, anomaly detection, or geolocation validation. All jobs are persisted in the DB using [Oban](https://github.com/oban-bg/oban), Elixir’s job queue.
- Every change in the application is also logged with a complete record, to provide accountability and traceability for public sector clients. These logs are written into Postgres.
- To keep the database lean, audit logs are regularly streamed out of Postgres and moved to blob storage.

## Why DAT Runs Postgres on Neon

From the very beginning, DAT built on [Neon](https://neon.com/), starting on Neon’s Free Plan to start their PoC and growing quickly from there. This choice was deliberate: having worked with large cloud providers in the past, they knew the pain of committing to fixed instances, dealing with region lock-in, and leaking money on idle resources.

They’ve built a system that takes advantage of Neon’s serverless features to service their workload with top efficiency:

### Read replicas to optimize performance

> **“Since our workload is write-heavy, we use Neon’s primary instance for nonstop ingestion, and then spin up read replicas for dashboards and analytics”** (Ahsan Nabi Dar, CTO and co-founder of DAT)

DAT’s database layer is constantly hammered with writes from thousands of messages, background jobs, and audit logs, so they split reads and writes taking advantage of the flexibility of Neon’s [read replicas](https://neon.com/docs/introduction/read-replicas). This allows them to ensure ingestion never slows down while supervisors and managers still get real-time reporting.

Read replicas in Neon [are architected differently from traditional Postgres replicas](https://neon.com/blog/the-problem-with-postgres-replicas): instead of being tied to a fixed VM, each replica is a serverless compute node that connects to the same durable storage layer. Replicas can be created instantly, scale independently from the primary, and scale down to zero when idle.

### Autoscaling to cover for peak events without hussle

> **“During the Eid cleanup, we have thousands of workers sending nonstop updates for three straight days. Neon just scales with the load – sometimes the write side, sometimes the read side – and we don’t have to touch a thing”** (Ahsan Nabi Dar, CTO and co-founder of DAT)

Every application faces moments of extreme load when traffic suddenly surges – sometimes planned, sometimes unexpected. Instead of manually resizing databases or committing to oversized instances in advance, Neon’s [autoscaling](https://neon.com/docs/introduction/autoscaling) is an efficient, hands-off solution for handling these bursts automatically. Compute scales up when traffic spikes and quickly goes back down when things slow down, giving companies like DAT a worry-free solution for managing mission-critical peaks.

### Scale-to-zero to keep consumption efficient

> **“When workers go on break, traffic completely stops for a while. Our Neon databases scale down to zero so we’re not paying for idle compute. The same goes for our dev and test environments”** (Ahsan Nabi Dar, CTO and co-founder of DAT)

Unlike traditional cloud databases, Neon automatically scale down during quiet periods – even all the way down to zero to save you any compute costs. This behavior also extends to development and test environments, which in Neon you create via [branches](https://neon.com/docs/introduction/branching).

### Branching for realistic development and testing environments

> **“Anytime we need to test a new feature or extension, we branch off from production, run our checks, and reconnect when we’re ready. It’s simple, safe, and saves us huge amounts of time”** (Ahsan Nabi Dar, CTO and co-founder of DAT)

In other managed Postgres, creating a realistic development environment involves duplicating an instance, copying data, paying for the extra capacity 24/7, and constantly work to keep things updated with production. This is a slow and costly process.

Neon takes a different approach with [branching](https://neon.com/docs/introduction/branching). Branches on Neon are instant, copy-on-write clones of a production database: they include the full schema and data, only consume storage as changes are made, and are able to scale to zero.

Implementing [branching workflows](https://neon.com/branching) lets teams like DAT ship faster while keeping costs under control. They use branches every time they need to test a new extension, feature, or schema change. As soon as testing is complete, the branch is deleted. This is all done via API and all the operations are near-instant.

## Using Retool for Client Dashboards

> **“Retool lets us move really fast: we can duplicate an app for a new client, tweak it, and deploy instantly. All the authentication, maps, tables, and forms are already there”** (Ahsan Nabi Dar, CTO and co-founder of DAT)

While Neon powers the database layer, Retool is the presentation layer that DAT uses to serve its clients. Every organization they work with gets a personalized dashboard built in Retool. These dashboards provide supervisors and managers with real-time visibility into staff operations, e.g.

- Maps to track worker locations
- Tables and filters for reviewing large volumes of field data.
- Forms for editing staff records, team structures, or assignments
- Authentication and SSO out of the box for secure access

By building on Retool, DAT Systems avoids the work of maintaining and hosting a custom frontend. Instead of reinventing all the components above, Retool handles it – giving them a speed that lets them serve multiple clients at once without adding extra headcount.

<Admonition type="info" title="Retool and Neon">
Retool has been a trusted Neon partner for years. Not only both products work great together; [Retool itself also uses Neon as the backend for some of their offerings.](https://neon.com/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases)
</Admonition>

## Wrap-Up

From a three-person startup to powering mission-critical operations for 16k+ field workers, DAT Systems has grown a resilient system on Neon. [You can get started the same way they did: on Neon’s Free Plan.](https://console.neon.tech/signup) Spin up a Postgres database in seconds, experiment with branching and scale-to-zero, and see how much time (and money) you save.

---

_Thank you so much to Ahsan and DAT for building on Neon and for sharing their story. If you’d also like to be featured,_ [tell us on Discord.](https://discord.gg/92vNTzKDGp)
