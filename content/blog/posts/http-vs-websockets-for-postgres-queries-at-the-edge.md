---
title: 'HTTP vs. WebSockets: Which protocol for your Postgres queries at the Edge'
description: >-
  A Comparative Analysis of SQL-over-HTTP and WebSockets in Edge and Serverless
  Environments
excerpt: >-
  Faster is always better, especially when executing SQL queries. We recently
  introduced SQL-over-HTTP to our driver, which previously only supported
  WebSockets. Why did we do that? And which approach is faster? Our journey
  developing the WebSockets serverless driver We first devel...
date: '2023-07-11T12:54:53'
updatedOn: '2025-10-14T05:54:57'
category: engineering
categories:
  - engineering
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/http-vs-websockets-for-postgres-queries-at-the-edge/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    HTTP vs. WebSockets: Which protocol for your Postgres queries at the Edge -
    Neon
  description: >-
    A Comparative Analysis of SQL-over-HTTP and WebSockets in Edge and
    Serverless Environments
  keywords: []
  noindex: false
  ogTitle: >-
    HTTP vs. WebSockets: Which protocol for your Postgres queries at the Edge -
    Neon
  ogDescription: >-
    Faster is always better, especially when executing SQL queries. We recently
    introduced SQL-over-HTTP to our driver, which previously only supported
    WebSockets. Why did we do that? And which approach is faster? Our journey
    developing the WebSockets serverless driver We first developed the Neon
    driver to help developers query their Postgres databases closer to their
    end-users. […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/http-vs-websockets-for-postgres-queries-at-the-edge/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/http-vs-websockets-for-postgres-queries-at-the-edge/image-17-1024x576-5c11f73e.jpg)

Faster is always better, especially when executing SQL queries.

We recently introduced SQL-over-HTTP to our driver, which previously only supported WebSockets. Why did we do that? And which approach is faster?

![Image](https://cdn.neonapi.io/public/images/pages/blog/http-vs-websockets-for-postgres-queries-at-the-edge/image-23-41d18bd3.png)

## Our journey developing the WebSockets serverless driver

We first developed the Neon driver to help developers query their Postgres databases closer to their end-users. The basic premise is simple: Our driver connects from the Edge Function to our proxy over a WebSocket, telling the proxy which database host and port it wants to reach.

![Image](https://cdn.neonapi.io/public/images/pages/blog/http-vs-websockets-for-postgres-queries-at-the-edge/our-journey-developing-the-websockets-serverless-driver-1024x538-c07a24c6.png)

The key advantage of this approach is you get a real, ordinary Postgres connection via a familiar, ordinary Postgres driver.

However, the main challenge with WebSockets is minimizing network round-trips since state persistence is typically lacking between requests in Edge environments. After several significant optimizations to the WebSockets driver, we successfully [reduced the number of round-trips from nine to four](https://neon.tech/blog/quicker-serverless-postgres).

We ran some tests with the WebSockets driver from Edge Functions, and the query latency distribution shows there are two distinct query groups:

- Connection + first query group (on the right)
- Second query on-wards (on the left)

![Image](https://cdn.neonapi.io/public/images/pages/blog/http-vs-websockets-for-postgres-queries-at-the-edge/image-24-7895f8b9.png)

We experimented with 1, 2, 5, and 10 iterations. Iterations represent the number of queries executed in each Edge Function, and the result from the chart is clear: latencies for second queries and above with WebSockets are fast (~5ms), but single-shot queries … not so much (~37ms).

## Experimenting with HTTP

We experimented with different protocols and compared our WebSocket driver latencies to those of SQL-over-HTTP via fetch. Why HTTP, you ask? The short answer is: to reduce latencies.

The advantage WebSocket has over SQL-over-HTTP drivers is Postgres compatibility. HTTP does not support sessions, interactive transactions, or Postgres features such as `NOTIFY` and the `COPY` protocol, but it works well for simple, one-shot queries.

But in a race, what matters is how quickly you get to the finish line rather than the type of tires your ride has.

So we put HTTP and WebSocket drivers to the test and ran experiments on Vercel Edge and Serverless environments in the Washington (iad1) region and a Neon database in N. Virginia region (us-east-1). We ran the experiment in Serverless environments to use the results as our baseline.

Serverless and Edge functions are serverless computing models, but they operate at different points in the network. Serverless functions, like AWS Lambda or Vercel Serverless Functions, run in the cloud and abstract away the server infrastructure. On the other hand, Edge functions are a type of serverless function that runs at the edge of the network as close to the end user as possible.

## HTTP vs. WebSockets performance

The chart below represents the latency distribution for the HTTP driver. This test consisted of running Edge Functions executing 1,2, 5, and 10 queries (iterations) to the database each, similar to the experiment described above for WebSocket latencies.

![Image](https://cdn.neonapi.io/public/images/pages/blog/http-vs-websockets-for-postgres-queries-at-the-edge/image-26-e0fba7a1.png)

The first thing that caught our attention is that the distribution for SQL-over-HTTP queries is bi-modal.

We can see _two peaks_ in the one-iteration query distribution line in blue. This shows that certain queries are ~5ms faster than others. We can observe this behavior in Edge Runtimes and not in Serverless (see chart below), which leads us to conclude that Edge Runtime’s scheduler prioritizes cached HTTP connections.

![Image](https://cdn.neonapi.io/public/images/pages/blog/http-vs-websockets-for-postgres-queries-at-the-edge/image-27-1bfbd34c.png)

While SQL-over-HTTP outperforms WebSockets in one-iteration Edge Functions, queries over WebSockets are _much_ faster once the connection is established with the database.

![Image](https://cdn.neonapi.io/public/images/pages/blog/http-vs-websockets-for-postgres-queries-at-the-edge/image-25-9bc871eb.png)

There you have it!

The WebSocket driver beats SQL-over-HTTP … but only after the connection is established and the protocol upgraded.

However, the HTTP driver outperforms the WebSockets one for single-shot queries.

Can we somehow have the best of both worlds? To get to sub-10ms queries using HTTP, we added support for connection caching to our proxy.

## Connection cache for SQL-over-HTTP queries

Neon is serverless Postgres and decouples compute and storage. When getting a request, Neon’s proxy looks for the right compute node to execute the query.

In this case, connection caching helps the proxy find the right compute node almost 10ms faster.

The chart below shows query latency distribution before and after using connection caching.

![Image](https://cdn.neonapi.io/public/images/pages/blog/http-vs-websockets-for-postgres-queries-at-the-edge/image-28-f693c5b9.png)

Connection caching is experimental and opt-in only. You can try it by setting fetchConnectionCache to true in the neonConfig object.

```javascript
import { neon, neonConfig } from '@neondatabase/serverless';

export const config = { runtime: 'edge' };

neonConfig.fetchConnectionCache = true; 

export default async (req: Request) => {
  const id = 12;
  const sql = neon(process.env.DATABASE_URL!);
  const oneAtom = await sql("SELECT * FROM atoms WHERE id=$1"), [id]);
  return new Response(JSON.stringify({ oneAtom }));
}
```

## Conclusion

So, which one is the fastest? SQL-over-HTTP or the WebSockets driver?

As often, the answer is … it depends!

With `@neondatabase/serverless` driver, you get both in a single package to accommodate your use case. Do you run single-shot queries? In this case, you might want to consider using HTTP.

Do you execute multiple queries in a single connection? Then WebSockets can bring latencies down to 4ms once the connection is established.

Another interesting finding, however, is that the runtime matters as much as the protocol.

The Edge network is far larger than the Serverless one, making it geographically closer to the end user. However, with connection cache, HTTP queries executed in Serverless environments show _even_ lower latencies than the ones executed in Edge runtimes.

![Image](https://cdn.neonapi.io/public/images/pages/blog/http-vs-websockets-for-postgres-queries-at-the-edge/image-30-1b0575cc.png)

Therefore, developers who strive for lower latency queries using serverless runtimes should consider the following:

- **Query type**: Do you execute single-shot queries? Or run multiple queries for each function?
- **Regions**: Where are your users located? Are they in one region or scattered across multiple geographies? Where is your database located?
- **API**: Do you use Node.js specific functions?

We invite you to [try Neon](https://console.neon.tech/) and explore the driver’s benefits to your applications. We welcome your feedback and insights as we evolve our product to serve your needs better.
