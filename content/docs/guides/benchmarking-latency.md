---
title: Benchmarking latency in Neon's serverless Postgres
subtitle: Techniques for obtaining meaningful latency data in serverless database environments
enableTableOfContents: true
updatedOn: '2025-05-21T00:00:00.000Z'
---

Benchmarking latency in Neon's serverless Postgres environment presents unique challenges due to compute auto-suspension, connection protocol differences, and geographic distribution. This guide provides detailed methodologies for separating cold-start costs from operational latency, selecting optimal connection types, and designing tests that accurately reflect production conditions.

## Understanding cold vs. hot queries

When benchmarking Neon databases, you'll encounter two distinct types of queries:

- **Cold queries**: Occur when a previously suspended compute resource is activated to process a request. By default, free-tier Neon databases suspend after 5 minutes of inactivity. A cold query typically adds several hundred milliseconds of latency.
  
- **Hot queries**: Execute on already-active database instances, providing a more consistent performance baseline with normal low latency.

On paid plans, you can configure or disable the auto-suspend timeout to customize your testing approach or eliminate cold starts entirely. See [Compute Lifecycle](/docs/introduction/compute-lifecycle) and [Auto-suspend Configuration](/docs/introduction/auto-suspend) for more details.

## Benchmarking Methodology

For accurate benchmarking, always measure cold and hot queries separately:

1. **Cold query testing**: 
   - Ensure your database is in a suspended state (idle for at least five minutes on free tier)
   - Make a request to trigger compute activation
   - Measure this connection time, which will include the startup overhead

2. **Hot query testing**:
   - After triggering compute activation with a cold query
   - Make subsequent requests within the five-minute window
   - Measure these connection times, which reflect normal operation

This methodology isolates the cold start overhead from normal operating performance, giving you a clearer picture of both typical performance versus worst-case latency.

## Testing environment considerations

Before running benchmarks, determine exactly what kind of latency you want to measure:

- **Server-to-database latency**: If you're testing how quickly your application server can communicate with Neon, make your requests from the same location as your server. This is typically the most relevant metric for API performance.

- **Client-to-database latency**: If you're testing direct client connections (rare in production), benchmark from client locations.

Once you've determined what you're measuring:

- **Match your test environment to production**: Run your tests from the same region (or as close as possible) to your production environment. If your Neon database is in `us-east-1`, execute your benchmarks from a server in the same AWS region.

- **Avoid localhost testing**: Testing from your local workstation doesn't reflect real-world conditions where the database is typically queried from your deployed server, not the client.

- **Geographic proximity**: Client-database proximity is the primary factor in connection latency. Testing from the same region will yield the most accurate results.

Avoid testing over an arbitrarily long distance that doesn't represent your production setup, as this introduces network overhead your users wouldn't experience. For more on geographic factors affecting latency, see [Connection Latency and Timeouts](/docs/connect/connection-latency).

## Connection types and their impact

Neon supports two connection protocols with distinctly different performance profiles. Understanding these differences is crucial for accurate benchmarking. For a comprehensive comparison, see [Choosing Connection Types](/docs/connect/choose-connection):

### HTTP connections
- **Performance profile**: Optimized for single-shot queries with minimal connection overhead
- **Use cases**: Ideal for serverless functions that execute a single query per invocation
- **Limitations**: Doesn't support sessions, interactive transactions, NOTIFY, or COPY protocol
- **When to benchmark**: Use for measuring performance of stateless, individual query operations
- **Optimization technique**: Connection caching can further reduce latency for HTTP connections

### WebSocket connections
- **Performance profile**: Higher initial connection overhead but significantly faster for subsequent queries
- **Use cases**: Optimal for applications that execute multiple queries over a maintained connection
- **Features**: Supports full PostgreSQL functionality including sessions, transactions, and all Postgres protocols
- **When to benchmark**: Measure both connection establishment time AND subsequent query execution separately
- **Initialization**: Requires multiple round-trips between client and server to establish

For implementation details on both connection methods, refer to the [Serverless Driver Documentation](/docs/serverless/serverless-driver).

**Benchmarking considerations**: When comparing HTTP vs WebSocket connections, you'll typically observe a bi-modal distribution in query latencies. HTTP connections generally show more consistent performance for individual queries, while WebSocket connections show higher initial latency followed by very low latency for subsequent operations. The runtime environment (Edge vs traditional Serverless) can also impact connection performance characteristics.

**Testing approach**: For WebSockets, establish the connection first, then measure query execution time separately. This reflects real-world usage where connections are reused rather than created for each query. For HTTP, measure individual query execution time including any per-query connection overhead.

## Real-world usage pattern simulation

To get meaningful results, design your benchmarks to simulate how your application actually interacts with Neon:

- **Use persistent connections**: For web servers or long-running applications, initialize the database connection before measuring query timings, then run a series of queries on this persistent connection. Consider [Connection Pooling](/docs/connect/connection-pooling) for optimal performance.

- **Avoid one-query-per-process testing**: Be cautious with simplistic tests that connect, query, and disconnect. While useful for understanding cold starts, they don't reflect a long-running application's performance.

- **Match your application pattern**: If your app keeps connections alive, focus on post-connection query latency; if your app is serverless and frequently creates new connections, measure both scenarios but analyze them separately.

For examples of different connection patterns and their implementation, see [Connection Examples](/docs/connect/connection-examples).

## Neon latency benchmarks dashboard

For additional insight, Neon provides a [Latency Benchmarks Dashboard](https://latency-benchmarks-dashboard.vercel.app) that visualizes:

- Connection times
- Query latencies 
- Cold start impacts
- Regions

If you encounter unexpected results during your benchmarking, consult the [Connection Troubleshooting](/docs/connect/connection-troubleshooting) documentation to identify potential issues.

## Conclusion

Benchmarking Neon requires understanding the unique characteristics of serverless Postgres. By separating cold and hot query measurements, testing from appropriate locations, and selecting the right connection methods, you'll get a more accurate picture of the performance your applications will experience in production.

For further information on connection latency, see the [Neon Documentation](/docs/connect/connection-latency).