---
title: Faster is what we help you ship
subtitle: This page is dedicated to teams shipping faster experiences faster on Neon.
updatedOn: '2025-02-12T00:00:00.000Z'
---

When we say "Ship faster with Postgres" — it's not just about helping you build and ship software faster. It's about helping you deliver that same feeling of **faster** to your customers.

## Open Source Faster

See for yourself how faster gets shipped with these open source examples.

- [NextFaster](https://next-faster.vercel.app/) - 400ms initial page load and 10ms nth pageloads on this full-stack Next.JS demo backed by Vercel and Neon. [Source](https://github.com/ethanniser/NextFaster) created by [@ethanniser](https://x.com/ethanniser), [RhysSullivan](https://x.com/RhysSullivan)
- [AI Chatbot](https://chat.vercel.ai) - uses Vercel's AI SDK to provide a fast SOTA chatbot UI template on Vercel and Neon. [Source](https://github.com/vercel/ai-chatbot) created by Vercel Team
- [Book inventory](https://next-books-search.vercel.app/) - full-stack Next.JS template to search/filter/paginate 600,000 books on Vercel and Neon. [Source](https://github.com/vercel-labs/book-inventory) - credit to [@leerob](https://x.com/leeerob)
- [Vector DB per Tenant](https://db-per-tenant.up.railway.app/) - Fast, secure chat-with-pdf app showing how to provision a dedicated vector database instance for each user on [Railway](https://railway.com) and Neon. [Source](https://github.com/neondatabase/db-per-tenant) created by [Mahmoud](https://x.com/thisismahmoud_)

If you have an open-source demo that illustrates the capabilities of Neon, [let us know here](#) we'd love to feature it.

## Faster in Production

Some of the incredible businesses delivering better experiences for their customers with Neon in the stack.

- **[Retool](https://retool.com)** – Manages 300K+ Postgres DBs with one engineer via Neon’s API. [Details](/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases)
- **[Replit](https://replit.com)** – SOTA Text to App Agent helping creators "build an app for that" in minutes, DB included. [Details](/blog/neon-replit-integration)
- **[White Widget](https://whitewidget.com)** – Scales up to 50M+ users in seconds with autoscaling. [Details](/blog/white-widgets-secret-to-scalable-postgres-neon)
- **[Invenco](https://invenco.net)** – Handles high-traffic e-commerce spikes without needing to thinking about databases. [Details](/blog/why-invenco-migrated-to-neon)
- **[Branch Insurance](https://ourbranch.com)** – Builds on Serverless Postgres to deliver faster experience out-of-the-box. [Details](/blog/branch-chose-neon-for-its-true-postgres-and-serverless-nature)
- **[Magic Circle](https://magiccircle.io)** – Handles 2M+ game sessions on Neon. [Details](/blog/how-magic-circle-scaled-up-to-2m-games-with-cloudfare-and-neon)
- **[Cedalio](https://cedalio.com)** – One-database-per-client model with auto-suspend. [Details](/blog/how-cedalio-uses-neon-for-an-efficient-development-workflow)
- **[BaseHub](https://basehub.com)** – Uses autoscaling to handle peak loads with zero manual tuning. [Details](/blog/meet-basehub-developer-velocity-and-efficiency-right-down-to-the-database)
- **[Create.xyz](https://create.xyz)** – Spins up Postgres backends instantly for AI-generated apps. [Details](/blog/from-idea-to-full-stack-app-in-one-conversation-with-create)
- **[OpusFlow](https://opusflow.io)** – DB-per-tenant delivers a fast, no-noisy-neighbor experience for energy customers. [Details](/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers)
- **[222](https://222.place)** – Autoscales for heavy traffic surges without manual ops. [Details](/blog/how-222-uses-neon-to-handle-their-frequent-spikes-in-demand)
- **[Recrowd](https://recrowd.com)** – Scales up for crowdfunding spikes, down when idle. [Details](/blog/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand)
- **[BeatGig](https://beatgig.com)** – Uses instant read replicas for fast analytics. [Details](/blog/neon-read-replicas-in-the-wild-how-beatgig-uses-them)
- **[ketteQ](https://ketteq.com)** – Runs hundreds of forecast simulations in parallel with instant branches. [Details](/blog/database-branching-for-postgres-with-neon)
- **[Topo.io](https://topo.io)** – AI GTM Platform outbuilds their competition with engineering grit and Neon. [Details](/blog/why-topo-io-switched-from-amazon-rds-to-neon)
- **[Supergood.ai](https://supergood.ai)** – High-throughput workload powering AI-generated API's for any site. [Details](/blog/how-supergood-unlocked-their-postgres-developer-productivity)
- **[Shepherd](https://shepherdinsurance.com)** – CI/CD test DBs spin up instantly via GitHub Actions. [Details](/blog/adopting-neon-branching-in-ci-cd-pipelines-a-practical-story-by-shepherd)

Is your company using Neon to ship faster experiences faster? [Let us know in this GitHub Discussion](https://github.com/neondatabase/neon/discussions/10827) and we'll add you to the list!

## Faster Features

Great software isn’t just functional—it’s fast. At Neon, it’s something we refine and build into our service in countless small ways. Here are some of the faster features we’re particularly proud of.

- **Faster Provisioning** - Get a ready-to-use Postgres database in less than a second. Try it right here. 👇
  <DeployPostgresButton />
- **Faster Branching** - Our custom storage engine enables data + schema clones for databases of any size in less than a second. [Try it in a web demo](https://neon-demos-branching.vercel.app/) [View Source](https://github.com/neondatabase/branching-demo)
- **Faster recovery** - The same storage engine lets you restore a 1TB DB in seconds [Demo video](https://www.youtube.com/watch?v=ZnxLCOkb_R0)
- **Faster autoscaling** - Our [Postgres autoscaling](/docs/guides/autoscaling-algorithm) algorithm checks memory usage 10 times/second and VM metrics every 5 seconds to provision exactly the right compute to serve your workload. [How we do it](/blog/dynamically-estimating-and-scaling-postgres-working-set-size).
- **Faster serverless connections** - We built an open-source HTTP proxy to reduce the number of roundtrips required to establish a database connection from 8 to 4. [Read how](/blog/quicker-serverless-postgres)
- **Faster cold starts** - We reduced Postgres cold start times to ~500ms. [Read How](/blog/cold-starts-just-got-hot)
- **Faster secure auth** - We reduced CPU time of authenticating connections without compromising security. [Read How](/blog/password-complexity-hash-iterations-and-entropy)
- **Faster Analytics** - The [pg_mooncake](https://pgmooncake.com/) team wrote an analytical extension for Postgres that [runs on Neon](/docs/extensions/pg_mooncake) and got [top ten on clickbench](https://benchmark.clickhouse.com/#eyJzeXN0ZW0iOnsiQWxsb3lEQiI6dHJ1ZSwiQWxsb3lEQiAodHVuZWQpIjp0cnVlLCJBdGhlbmEgKHBhcnRpdGlvbmVkKSI6dHJ1ZSwiQXRoZW5hIChzaW5nbGUpIjp0cnVlLCJBdXJvcmEgZm9yIE15U1FMIjp0cnVlLCJBdXJvcmEgZm9yIFBvc3RncmVTUUwiOnRydWUsIkJ5Q29uaXR5Ijp0cnVlLCJCeXRlSG91c2UiOnRydWUsImNoREIgKERhdGFGcmFtZSkiOnRydWUsImNoREIgKFBhcnF1ZXQsIHBhcnRpdGlvbmVkKSI6dHJ1ZSwiY2hEQiI6dHJ1ZSwiQ2l0dXMiOnRydWUsIkNsaWNrSG91c2UgQ2xvdWQgKGF3cykiOnRydWUsIkNsaWNrSG91c2UgQ2xvdWQgKGF6dXJlKSI6dHJ1ZSwiQ2xpY2tIb3VzZSBDbG91ZCAoZ2NwKSI6dHJ1ZSwiQ2xpY2tIb3VzZSAoZGF0YSBsYWtlLCBwYXJ0aXRpb25lZCkiOnRydWUsIkNsaWNrSG91c2UgKGRhdGEgbGFrZSwgc2luZ2xlKSI6dHJ1ZSwiQ2xpY2tIb3VzZSAoUGFycXVldCwgcGFydGl0aW9uZWQpIjp0cnVlLCJDbGlja0hvdXNlIChQYXJxdWV0LCBzaW5nbGUpIjp0cnVlLCJDbGlja0hvdXNlICh3ZWIpIjp0cnVlLCJDbGlja0hvdXNlIjp0cnVlLCJDbGlja0hvdXNlICh0dW5lZCkiOnRydWUsIkNsaWNrSG91c2UgKHR1bmVkLCBtZW1vcnkpIjp0cnVlLCJDbG91ZGJlcnJ5Ijp0cnVlLCJDcmF0ZURCIjp0cnVlLCJDcnVuY2h5IEJyaWRnZSBmb3IgQW5hbHl0aWNzIChQYXJxdWV0KSI6dHJ1ZSwiRGF0YWJlbmQiOnRydWUsIkRhdGFGdXNpb24gKFBhcnF1ZXQsIHBhcnRpdGlvbmVkKSI6dHJ1ZSwiRGF0YUZ1c2lvbiAoUGFycXVldCwgc2luZ2xlKSI6ZmFsc2UsIkFwYWNoZSBEb3JpcyI6dHJ1ZSwiRHJpbGwiOnRydWUsIkRydWlkIjp0cnVlLCJEdWNrREIgKERhdGFGcmFtZSkiOnRydWUsIkR1Y2tEQiAobWVtb3J5KSI6dHJ1ZSwiRHVja0RCIChQYXJxdWV0LCBwYXJ0aXRpb25lZCkiOnRydWUsIkR1Y2tEQiI6dHJ1ZSwiRWxhc3RpY3NlYXJjaCI6dHJ1ZSwiRWxhc3RpY3NlYXJjaCAodHVuZWQpIjpmYWxzZSwiR2xhcmVEQiI6dHJ1ZSwiR3JlZW5wbHVtIjp0cnVlLCJIZWF2eUFJIjp0cnVlLCJIeWRyYSI6dHJ1ZSwiSW5mb2JyaWdodCI6dHJ1ZSwiS2luZXRpY2EiOnRydWUsIk1hcmlhREIgQ29sdW1uU3RvcmUiOnRydWUsIk1hcmlhREIiOmZhbHNlLCJNb25ldERCIjp0cnVlLCJNb25nb0RCIjp0cnVlLCJNb3RoZXJEdWNrIjp0cnVlLCJNeVNRTCAoTXlJU0FNKSI6dHJ1ZSwiTXlTUUwiOnRydWUsIk9jdG9TUUwiOnRydWUsIk9wdGVyeXgiOnRydWUsIk94bGEiOnRydWUsIlBhbmRhcyAoRGF0YUZyYW1lKSI6dHJ1ZSwiUGFyYWRlREIgKFBhcnF1ZXQsIHBhcnRpdGlvbmVkKSI6dHJ1ZSwiUGFyYWRlREIgKFBhcnF1ZXQsIHNpbmdsZSkiOnRydWUsInBnX2R1Y2tkYiAoTW90aGVyRHVjayBlbmFibGVkKSI6dHJ1ZSwicGdfZHVja2RiIjp0cnVlLCJQb3N0Z3JlU1FMIHdpdGggcGdfbW9vbmNha2UiOnRydWUsIlBpbm90Ijp0cnVlLCJQb2xhcnMgKERhdGFGcmFtZSkiOnRydWUsIlBvbGFycyAoUGFycXVldCkiOnRydWUsIlBvc3RncmVTUUwgKHR1bmVkKSI6ZmFsc2UsIlBvc3RncmVTUUwiOnRydWUsIlF1ZXN0REIiOnRydWUsIlJlZHNoaWZ0Ijp0cnVlLCJTZWxlY3REQiI6dHJ1ZSwiU2luZ2xlU3RvcmUiOnRydWUsIlNub3dmbGFrZSI6dHJ1ZSwiU3BhcmsiOnRydWUsIlNRTGl0ZSI6dHJ1ZSwiU3RhclJvY2tzIjp0cnVlLCJUYWJsZXNwYWNlIjp0cnVlLCJUZW1ibyBPTEFQIChjb2x1bW5hcikiOnRydWUsIlRpbWVzY2FsZSBDbG91ZCI6dHJ1ZSwiVGltZXNjYWxlREIgKG5vIGNvbHVtbnN0b3JlKSI6dHJ1ZSwiVGltZXNjYWxlREIiOnRydWUsIlRpbnliaXJkIChGcmVlIFRyaWFsKSI6dHJ1ZSwiVW1icmEiOnRydWV9LCJ0eXBlIjp7IkMiOnRydWUsImNvbHVtbi1vcmllbnRlZCI6dHJ1ZSwiUG9zdGdyZVNRTCBjb21wYXRpYmxlIjp0cnVlLCJtYW5hZ2VkIjp0cnVlLCJnY3AiOnRydWUsInN0YXRlbGVzcyI6dHJ1ZSwiSmF2YSI6dHJ1ZSwiQysrIjp0cnVlLCJNeVNRTCBjb21wYXRpYmxlIjp0cnVlLCJyb3ctb3JpZW50ZWQiOnRydWUsIkNsaWNrSG91c2UgZGVyaXZhdGl2ZSI6dHJ1ZSwiZW1iZWRkZWQiOnRydWUsInNlcnZlcmxlc3MiOnRydWUsImRhdGFmcmFtZSI6dHJ1ZSwiYXdzIjp0cnVlLCJhenVyZSI6dHJ1ZSwiYW5hbHl0aWNhbCI6dHJ1ZSwiUnVzdCI6dHJ1ZSwic2VhcmNoIjp0cnVlLCJkb2N1bWVudCI6dHJ1ZSwiR28iOnRydWUsInNvbWV3aGF0IFBvc3RncmVTUUwgY29tcGF0aWJsZSI6dHJ1ZSwiRGF0YUZyYW1lIjp0cnVlLCJwYXJxdWV0Ijp0cnVlLCJ0aW1lLXNlcmllcyI6dHJ1ZX0sIm1hY2hpbmUiOnsiMTYgdkNQVSAxMjhHQiI6ZmFsc2UsIjggdkNQVSA2NEdCIjpmYWxzZSwic2VydmVybGVzcyI6ZmFsc2UsIjE2YWN1IjpmYWxzZSwiYzZhLjR4bGFyZ2UsIDUwMGdiIGdwMiI6dHJ1ZSwiTCI6ZmFsc2UsIk0iOmZhbHNlLCJTIjpmYWxzZSwiWFMiOmZhbHNlLCJjNmEubWV0YWwsIDUwMGdiIGdwMiI6ZmFsc2UsIjE5MkdCIjpmYWxzZSwiMjRHQiI6ZmFsc2UsIjM2MEdCIjpmYWxzZSwiNDhHQiI6ZmFsc2UsIjcyMEdCIjpmYWxzZSwiOTZHQiI6ZmFsc2UsImRldiI6ZmFsc2UsIjcwOEdCIjpmYWxzZSwiYzVuLjR4bGFyZ2UsIDUwMGdiIGdwMiI6ZmFsc2UsIkFuYWx5dGljcy0yNTZHQiAoNjQgdkNvcmVzLCAyNTYgR0IpIjpmYWxzZSwiYzUuNHhsYXJnZSwgNTAwZ2IgZ3AyIjpmYWxzZSwiYzZhLjR4bGFyZ2UsIDE1MDBnYiBncDIiOmZhbHNlLCJjbG91ZCI6ZmFsc2UsImRjMi44eGxhcmdlIjpmYWxzZSwicmEzLjE2eGxhcmdlIjpmYWxzZSwicmEzLjR4bGFyZ2UiOmZhbHNlLCJyYTMueGxwbHVzIjpmYWxzZSwiUzIiOmZhbHNlLCJTMjQiOmZhbHNlLCIyWEwiOmZhbHNlLCIzWEwiOmZhbHNlLCI0WEwiOmZhbHNlLCJYTCI6ZmFsc2UsIkwxIC0gMTZDUFUgMzJHQiI6ZmFsc2UsImM2YS40eGxhcmdlLCA1MDBnYiBncDMiOmZhbHNlLCIxNiB2Q1BVIDY0R0IiOmZhbHNlLCI0IHZDUFUgMTZHQiI6ZmFsc2UsIjggdkNQVSAzMkdCIjpmYWxzZX0sImNsdXN0ZXJfc2l6ZSI6eyIxIjp0cnVlLCIyIjp0cnVlLCI0Ijp0cnVlLCI4Ijp0cnVlLCIxNiI6dHJ1ZSwiMzIiOnRydWUsIjY0Ijp0cnVlLCIxMjgiOnRydWUsInNlcnZlcmxlc3MiOnRydWUsInVuZGVmaW5lZCI6dHJ1ZX0sIm1ldHJpYyI6ImhvdCIsInF1ZXJpZXMiOlt0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlXX0=). [Read how](https://www.mooncake.dev/blog/clickbench-v0.1)

You can read about the [architectural decisions for Neon](/blog/architecture-decisions-in-neon) and even see [all of our engineering RFCs](https://github.com/neondatabase/neon/tree/main/docs/rfcs), too. If you're interested [we're hiring](/careers).

## Try it yourself

Don't take our word for it. The best way to understand the performance of a service is to try it yourself. We've made Neon as easy as possible to try with a generous free plan with no credit card required.

<CTA title="Try Postgres on Neon" description="Neon is Serverless Postgres built for the cloud. Sign up for a free account to get started." buttonText="Sign Up" buttonUrl="https://console.neon.tech/signup" />

### Check Open Source Benchmarks

Test **faster** yourself with these open-source third-party benchmarks, in addition to [Neon's open source latency benchmark](/demos/regional-latency) application:

- **[Vercel-to-DB Latency Benchmarks](https://db-latency.vercel.app/)** - Open source latency benchmarks written by Vercel
- **[Postgres Library Benchmarks for Node.js](https://github.com/porsager/postgres-benchmarks#results)** - _(not Neon-specific)_ compare the different Postgres drivers.

If you have an open-source benchmark that includes Neon [let us know here](#) we'd love to feature it on this page. See also our guide on [obtaining meaningful latency data](/docs/guides/benchmarking-latency) in serverless database environments.

## How to ship faster

Shipping faster UX is a full-stack job. For databases, your real-world speed depends primarily on three things:

1. **Connection Approach:** Long-lived connections or a connection for every query?
2. **Client-Database Proximity:** How close is your application (the client) to the database?
3. **Database Processing Time:** How much time is the database spending answering each query?

You can visualize the way each factor contributes like this:

<LatencyCalculator />

**What about cold starts?** Databases on Neon can scale to zero when there are no active queries for a certain amount of time. We kept this topic separate below in [Cold Starts](#cold-starts) because _across the more than one million active databases on our platform, they occur very seldomly — there are fewer than 5 cold starts per second._ Cold starts don't factor in to your real-world experience often enough to become an important consideration. For use cases where cold starts must be avoided, you can disable scale-to-zero with a single click. This option is available starting with our [Launch plan](/pricing).

### Establishing a connection

Before you get any data from the database, you need to connect to it. This process of establishing the network connection and verifying the credentials on both sides traditionally takes several back and forth trips between application and database.

**Standard Postgres TCP connections require nine roundtrips:**
![Nine round-trips to get a result on a standard TCP connection to Postgres](/faster/postgres-tcp-roundtrips.jpg)

When you combine nine round trips with any sort of network latency you get a 9x compounding effect on latency. How often you must establish a database connection depends on how you architect your app:

#### Long-Running Connections

Containerized and serverful applications all follow a pattern of establishing one or more long-running connections when the service first starts and keeping them alive until the service is restarted. This makes the connection time a non-factor in the user-facing experience of your application.

#### Short-Lived Connections

Serverless functions may be executing independently in short-lived environments, it’s not feasible to have a long-running connection. Every independent execution of a function must establish a connection to the database.

<Admonition type="tip" title="Tips for Serverless Connections">
1. Execute functions in a region that is the same or close to your database
2. Execute [multiple queries in a single function](/docs/serverless/serverless-driver#issue-multiple-queries-with-the-transaction-function) - so you only pay the connection tax once.
3. Use an HTTP API via the [Neon Serverless Driver](/docs/serverless/serverless-driver) - To reduce the number of roundtrips required to establish the connection.
   ![Serverless driver round-trips](/faster/postgres-http-roundtrips.jpg)
   Neon's [serverless driver](/docs/serverless-driver) and proxy have been optimized to reduce the number of roundtrips to the absolute minimum. To read more about how this works, see: [Quicker serverless Postgres connections](/blog/quicker-serverless-postgres)
</Admonition>

### Putting app and database close together

Client-database proximity plays a major role in real-world database latency. Here are the different scenarios laid out from lowest to highest latency.

| Architecture                                                                                                                   | Roundtrip | Connect         | On Neon                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------ | --------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Same Machine**<br/>When you put your database and your app on the exact same machine, latency is measured in microseconds.   | >1ms      | ~1ms            | Not applicable                                                                                                                |
| **Same Region**<br/>Place the client (App) and Database in the same datacenter and region for lowest-possible latency.         | ~1ms      | ~3ms            | Same [Region](/docs/introduction/regions) for Client and DB, see [Private Link](/docs/guides/neon-private-networking) for VPC |
| **Different Region**<br/>When client and database are in different regions, your latency varies based on geographic proximity. | Varies    | 4x-8x Roundtrip | Different/varying [Region](/docs/introduction/regions) for Client and DB                                                      |

### Minimizing database time spent answering the query

As your business (and database) grows, connection and network transit latency remain static and database processing time becomes the most important factor to optimize. Here are some pointers:

1. **Use connection pooling and autoscaling** – Use the built-in connection pooler to handle many client connections efficiently, and enable Neon’s autoscaling so the database can allocate sufficient RAM/CPU on demand.
2. **Profile slow queries** – Identify which SQL statements are slow or resource-intensive by starting with the [Query performance View](/docs/introduction/monitor-query-performance) in Neon.
   ![Neon query performance tab](/docs/introduction/query_performance.png)
   _The Query performance tab shows total calls, avg time, and total time of each query._
   You can dig deeper with [pg_stat_statements](/docs/extensions/pg_stat_statements)
3. **Add indexes on high-impact columns** – Create indexes on columns that are frequently used in `WHERE` filters, `JOIN` conditions, or `ORDER BY` clauses to avoid full table scans. An index lets Postgres perform an index scan instead of a slower sequential scan, dramatically reducing query execution time.
4. **Reduce table and index bloat** – Reclaim wasted space and improve performance by eliminating bloat (accumulated dead rows) in tables and indexes. Schedule regular maintenance like `VACUUM` to remove dead tuples and use `REINDEX` on bloated indexes. You can also fine-tune autovacuum settings to keep bloat in check over time.
5. **Leverage caching for reads** – Ensure frequently accessed data is served from memory instead of disk. Neon’s architecture extends Postgres’s shared memory buffers with a local file system cache, so aim for a high cache hit ratio. You can monitor the **Local file cache hit rate** chart on the **Monitoring** page in the Neon Console to see how often data is read from cache versus storage and adjust your workload or memory allocation if needed.

**Further reading** – See [PostgreSQL query performance guide](/docs/postgresql/query-performance) for in-depth explanations and tips.

## Definitions

To move fast, we must have a shared understanding of concepts and terms. Let's define some of the most commonly misinterpreted terms around how Neon works.

### Serverless

To us, serverless means:

- Instant Provisioning
- No server management
- Autoscaling
- Usage-based pricing
- Built-in availability and fault tolerance

<span style={{'color':'red'}}>It does NOT mean:</span>

<ul style={{'color':'red'}}>
<li>Pay-per-query</li>
<li>New computes (and cold starts) for every connection/query</li>
</ul>

For a full write-up, read the full [Serverless Docs](/docs/introduction/serverless)

### Scale to zero

When a Neon compute endpoint hasn't received any connections for a specified amount of time, it can [scale to zero](/docs/introduction/scale-to-zero).
This is useful for:

- **Resource Management** - Turning off unused databases is automatic.
- **Cost-Efficiency** - Never pay for compute that's not serving queries.

But scale to zero is only useful if compute can start up quickly again when it's needed. That's why [cold start](#cold-starts) times are so important.

### Cold Starts

A cold start in Neon begins when a database project with a suspended compute endpoint receives a connection.
Neon starts the database compute, processes the query, and serves the response.
The compute stays active as long as there are active connections.

#### Applications of scale to zero

Look at the cold start times documented above and decide: _In what scenarios is the occasional 500ms of additional latency acceptable?_

The answer depends on the specifics of your project.
Here are some example scenarios where scale to zero may be useful:

- **Non-Production Databases** - Development, preview, staging, test databases.
- **Internal Apps** - If the userbase for your app is a limited number of employees, the db is likely idle more than active.
- **Database-per-user Architectures** - Instead of having a single database for all users, if you have a separate database for each user, the activity level of any one database may be low enough that scale to zero results in significant cost reduction.
- **Small Projects** - For small projects, configuring the production database to scale to zero can make it more cost-efficient without major impact to UX.

## Ready to Ship Faster?

The best way to understand the speed and flexibility of Neon is to try it yourself. With instant provisioning, branching, and autoscaling, Neon helps you build and ship faster experiences—without managing infrastructure.

Sign up for free today—no credit card required—and see how Neon can accelerate your workflow.

<CTA title="Try Postgres on Neon" description="Neon is Serverless Postgres built for the cloud. Get started in seconds with our free plan." buttonText="Sign Up" buttonUrl="https://console.neon.tech/signup" />
