---
title: Building patterns unlocked by scale to zero
description: When idle databases stop wasting compute
excerpt: >-
  Most hosted Postgres pricing works like this: you pick an instance size, the
  vendor assumes the instance will run for about 730 hours a month, and you pay
  for those hours. Lakebase Postgres addresses that waste with autoscaling and
  scale to zero.
date: '2026-09-01T12:00:00'
updatedOn: '2026-08-30T13:09:00'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: Building patterns unlocked by scale to zero - Neon
  description: When idle databases stop wasting compute
  keywords: []
  noindex: false
  ogTitle: Building patterns unlocked by scale to zero - Neon
  ogDescription: When idle databases stop wasting compute
  image: null
---

Most hosted Postgres pricing works like this:

- You pick an instance size
- The vendor assumes the instance will run for about 730 hours a month
- You pay for those hours

That model creates two kinds of compute waste. First, you're provisioning for peak demand, leaving capacity unused the rest of the time; second, the instance keeps "running" even when the database is not busy. That waste is harder to defend now. Compute is scarce and [getting more expensive](https://www.semafor.com/article/08/23/2026/nvidia-says-its-raising-some-prices-15) - leaving it allocated on databases nobody is querying is a blunt way to spend it.

Lakebase Postgres (the Neon database) addresses each compute waste problem separately. [Autoscaling](https://neon.com/docs/introduction/autoscaling) solves the first kind of waste by adjusting compute to the current load in real time; the second kind of waste is solved by [scale to zero](https://neon.com/docs/introduction/scale-to-zero), which suspends compute after a few minutes of inactivity, then restarts it automatically.

The effect this last piece can have, scale to zero, is easy to dismiss if you only picture one busy production database. Your might first think, "my DB is active 24/7 and I wouldn't want it to suspend anyway" - but  if you think twice, surely your deployment includes at least some databases that are idle most of the time (development, staging).

Perhaps more interestingly, some modern building patterns ask for *thousands* of sporadically-used databases.  Keeping all of them running would make the architecture too expensive and too cumbersome to operate. Scale to zero changes that.

## When Postgres scales to zero

### You don’t ration dev databases anymore

In a traditional workflow, only because databases used to be such a lagging piece of the infra, developers were used to deciding whether something is worth deploying a new instance. Any wondering disappears if your database can behave like an on-demand development resource, just like you open a PR or deploy a preview - or more realistically, your agent goes those now.

This is possible with Neon due to branches that scale to zero. Your CI can create a Neon for each test run, every PR can get a preview environment with its own data, every developer on a team can work against a separate branch, your agent can deploy branches when iterating on ideas… The list goes on and on. This is only viable because the compute suspends when the work stops, making these sort of ephemeral branches extremely affordable.

<blockquote>
<p>“Our users were asking for preview environments that already had their data in place. Neon's branching was exactly what we needed: it lets us copy databases very quickly so teams can validate changes end to end immediately”</p>
<cite><a href="https://www.linkedin.com/in/marcuskohlberg/">Marcus Kohlberg</a>, Founder at <a href="https://encore.dev/">Encore</a></cite>
</blockquote>

### Running free plans gets cheap

Scale to zero also completely changes the free tier economics. If you're running a platform that gives every free user a database, a thousand signups now means ten thousand databases. With an always-on model, every signup adds another running instance to your infrastructure bill. With scale to zero, inactive databases stop consuming compute. You still pay for their storage, but the majority of these low-activity databases will have very little to no data on them. Your compute bill follows active use instead of total signups.

This is why [many platforms](https://neon.com/platforms) use Neon's API under the hood to provision databases to their end users, but  our own Neon's Free plan is one proof point for this model. We're including [100 projects](https://neon.com/docs/introduction/plans#projects) on it, each with 100 CU-hours of compute per month and 0.5 GB of storage - and yet our free plan is very affordable to run (we're far from having to subsidize it in any meaningful way). The reason behind this goes beyond scale to zero (our infra is efficient in multiple different ways), but scale to zero is the essential piece - a 100 projects do not mean 100 constantly running computes.

<blockquote>
<p>“Because Neon is usage-based and can scale down databases when they aren't being used, we're able to deploy thousands of new databases per day without costs getting out of hand”</p>
<cite><a href="https://www.linkedin.com/in/dominicwhyte/">Dominic Whyte</a>, Co-founder at <a href="https://www.zite.com/">Zite</a></cite>
</blockquote>

### Coding agents provision backends by the thousands

Coding agents ship infrastructure at a different rate. A Replit-style agent may create a database for every app it builds, and many branches for development and checkpoints along the way. An always-on database per generated app makes that workflow truly wasteful. Scale to zero makes it the default:

- Create a backend for the app
- Branch it before a risky change
- Restore or discard the branch if the change fails
- Leave inactive database compute suspended without deleting the app's state

<blockquote>
<p>“Soon, agents will do most of the coding, and perhaps 1000x more database instances will be needed. Neon's platform and pricing strategy feel aligned with that future”</p>
<cite>Nilesh Trivedi, co-founder and CTO at QwikBuild</cite>
</blockquote>

<Admonition type="note" title="The agent does not need to stop at Postgres">
Neon is a now complete set of cloud backend primitives built around the database (Lakebase Postgres): a single [`neon.ts`](https://neon.com/docs/get-started/backend-overview) file can also declare Managed Better Auth, Object Storage, Functions, and AI Gateway, all with scale to zero built in.
</Admonition>

### Deploying hosted databases is as routine as creating a repo

Who keeps count on how many repositories they have? That ubiquity is a consequence of GitHub's tech and pricing.  A repo costs nothing while nobody touches it, so nobody ever made you justify one. A Postgres instance could feel exactly the same. This is what we're aiming for at Neon. That's why the Free plan carries 100 projects instead of two, and why [we've kept raising the limit](https://neon.com/blog/why-so-many-projects-in-the-neon-free-plan).

<blockquote>
<p>“I'm always surprised by how easy it is to just create a ton of databases”</p>
<cite>Iman Radjavi, Co-founder at Specific (<a href="https://neon.com/blog/how-specific-provisions-thousands-of-databases-for-coding-agents-using-neon">case study</a>)</cite>
</blockquote>

<blockquote>
<p>“Once we automated the setup, Neon just became part of how we ship”</p>
<cite>Gabriel Tumlos, Founder of Daisy</cite>
</blockquote>

### Vector search stops requiring an always-on database

For years, search mostly meant a search bar: a human typing a query, with load you could forecast and QPS you could plan around. That's changing. Search is increasingly a tool exposed in an agent harness, one way to connect data to agents. Teams index more data than they used to, and those indexes may sit idle between agent calls.

The default Postgres setup for vector search is `pgvector` with an HNSW index, and this is designed for a traditional server - it's a long-lived process that keeps the whole graph pinned in RAM between queries. Every search walks that graph through many small random reads. [Lakebase Search](https://neon.com/docs/ai/lakebase-search) lets you invert the design and take advantage of scale to zero even when running semantic search.

[Read this blog post](https://neon.com/blog/lakebase-search-on-neon) for the full picture on how this works - but the TL;DR is that Lakebase search keeps their indexes durable on object storage instead of in compute memory, and the index keeps existing when the compute shuts down. The compute on top is a cache that rebuilds from object storage on demand, so a search database can suspend and wake without re-indexing anything.

<blockquote>
<p>“Using Lakebase Search, we clocked around 18.6ms warm, versus around 19.5 seconds on our old cold-start GIN approach. That's a 1,000x improvement”</p>
<cite>Srijit Ghosh, Co-founder and CTO at CommSync</cite>
</blockquote>

### Realtime becomes an option for every database (coming soon)

Sync and scale to zero have always been hard to combine. A Postgres sync engine typically follows the logical replication stream, which holds a replication connection open and keeps compute active. [Electric joined the Neon team at Databricks](https://neon.com/blog/electric-joins-neon), and we're building sync on Neon in a way that doesn't hold the logical replication connection open and so doesn't prevent scale to zero. More soon.

## Scale to zero is not for prod, but there's still waste there. That's why autoscaling exists

The patterns above rely on databases that spend meaningful time doing nothing. A production branch serving requests 24/7 has the opposite shape. Its compute is always active, but its demand changes throughout the day.

For that workload, turn scale to zero off. The waste comes from something else: provisioning for the peak. Neon also solves for that - [autoscaling](https://neon.com/docs/introduction/autoscaling) adjusts compute between a minimum and maximum you set, based on live load, without restarts. You size the range for the workload instead of keeping peak capacity allocated all day. Compute usage then follows the average resources consumed over the hours the database is running.

<Admonition type="note" title="Get the deep dive">
[This blog post](https://neon.com/blog/autoscaling-lakebase-postgres) walks you through how our autoscaling works in detail.
</Admonition>

## Stop wasting compute. Let it scale to zero

Scale to zero looks like a minor feature if you just picture a busy production branch. It's everywhere else that it shines - development, staging - plus the architectures that deploy databases en masse, which are only getting more tempting in the era of agents.

Compute is becoming an increasingly sought-after resource. Scale to zero simply makes sense - if a database isn't doing work, its compute shouldn't be sitting there.

[Try it on the Neon Free plan](https://console.neon.tech/signup), or ask your coding agent to add it to the next app it builds.
